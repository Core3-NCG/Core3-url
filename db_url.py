import mysql.connector
from mysql.connector import errorcode
import datetime
import redis
from sqlalchemy import DateTime


#use to make connection
def make_conn():
    mydb=mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="root@123"
    )
    DB_NAME='Tiny_URL'
    return mydb,DB_NAME

#used to connect to redis cache
def connect_redis():
    return redis.Redis(host="127.0.0.1",port=6379,db=0)

# used to create the database
def create_database(cursor,DB_NAME):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
        print("hello")
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))
        exit(1)
        
# select the database
def databaseUsed(my_cursor,DB_NAME):
    try:
        my_cursor.execute("USE {}".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Database {} does not exists.".format(DB_NAME))
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            create_database(my_cursor,DB_NAME)
            print("Database {} created successfully.".format(DB_NAME))
            my_cursor.execute("USE {}".format(DB_NAME))
        else:
            print(err)
            exit(1)

# used to create tables in database
def createTable():
    createConn=make_conn()
    mydb=createConn[0]
    DB_NAME=createConn[1]
    my_cursor=mydb.cursor()
    databaseUsed(my_cursor,DB_NAME)

    TABLES = {}
    TABLES['Users']=("create table `Users` (`user_name` varchar(255) NOT NULL,"
        "`user_pass` varchar(255) NOT NULL,"
        "PRIMARY KEY (`user_name`))ENGINE=INNODB")

    TABLES['URLS']=("create table `URLS` ( `shortened_url` varchar(255) NOT NULL,"
        "`actual_url` varchar(255) NOT NULL,"
        "`user_name` varchar(255),"
        "`expiration_time` Date NOT NULL,"
        "PRIMARY KEY (`shortened_url`),"
        "FOREIGN KEY (`user_name`) REFERENCES Users(`user_name`) ON UPDATE CASCADE ON DELETE CASCADE)ENGINE=INNODB")

    for table_name in TABLES:
        table_description = TABLES[table_name]
        try:
            print("Creating table {}: ".format(table_name), end='')
            my_cursor.execute(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")
    my_cursor.close()
    mydb.close()

#create all the table
createTable()

# register the user and store username and pass in DB
def register_user(userName,userPass):
    try:
        createConn=make_conn()
        mydb=createConn[0]
        DB_NAME=createConn[1]
        my_cursor=mydb.cursor()
        databaseUsed(my_cursor,DB_NAME)
        my_cursor.execute("INSERT INTO Users  (`user_name`,`user_pass`) values (%s,%s)",(userName,userPass))
        mydb.commit()
        my_cursor.close()
        mydb.close()
        return True
    except:
        print("multiple user with same username doesnot exist")
        return False

# Add the shortened URl, long_url, username if provided,expiration flag, and expiration time based on flag in the DB 
def add_url(short_url,long_url,userName,expirationTime):
    try:
        createConn=make_conn()
        mydb=createConn[0]
        DB_NAME=createConn[1]
        my_cursor=mydb.cursor()
        databaseUsed(my_cursor,DB_NAME)
        my_cursor.execute("INSERT INTO URLS (`shortened_url`,`actual_url`,`user_name`,`expiration_time`) values (%s,%s,%s,%s)",
        (short_url,long_url,userName,expirationTime))
        mydb.commit()
        my_cursor.close()
        mydb.close()
    except:
        print("Same url should not exist")

# Used to verify the user and return True/False 
def login_verification(userName,userPass):
    redis2=connect_redis()
    if redis2.get(userName):
            print("return from cache")
            return True
    else:
        createConn=make_conn()
        mydb=createConn[0]
        DB_NAME=createConn[1]
        my_cursor=mydb.cursor()
        databaseUsed(my_cursor,DB_NAME)
        my_cursor = mydb.cursor(buffered=True)
        my_cursor.execute("select user_pass from Users where user_name like %s",[userName])
        verified=""
        for (a) in my_cursor:
            verified=a[0]
        mydb.commit()
        my_cursor.close()
        mydb.close()
        if verified and verified==userPass:
            redis2.set(name=userName,value=userPass,ex=3)
            return True
        else:
            return False

# fetch and return the long_url for short_url given as parameter
def get_longurl(short_url):
    redis1=connect_redis()
    try:
        if redis1.get(short_url):
            print("return from cache")
            return redis1.get(short_url).decode()
        else:
            createConn=make_conn()
            mydb=createConn[0]
            DB_NAME=createConn[1]
            my_cursor=mydb.cursor()
            databaseUsed(my_cursor,DB_NAME)
            my_cursor = mydb.cursor(buffered=True)
            my_cursor.execute("select * from URLS where shortened_url like %s",[short_url])
            long_url=""
            current_date=datetime.date.today()
            for a in my_cursor:
                print(a[3].day-current_date.day)
                if a[3]<current_date:
                    my_cursor.execute("delete from URLS where shortened_url like %s",[a[1]])
                    print("expired date deleted")
                    continue
                long_url=a[1]
            mydb.commit()
            my_cursor.close()
            mydb.close()
            redis1.set(name=short_url,value=long_url,ex=3)
            return long_url
    except:
        print("URL doesn't exist")
        return ""

# return the list of all URLS for a user
def urls_for_user(user_name):
    createConn=make_conn()
    mydb=createConn[0]
    DB_NAME=createConn[1]
    my_cursor=mydb.cursor()
    databaseUsed(my_cursor,DB_NAME)
    my_cursor = mydb.cursor(buffered=True)
    my_cursor.execute("select * from URLS where user_name like %s",[user_name])
    all_url_list=[]
    current_date=datetime.date.today()
    for a in my_cursor:
        current_url_list=[]
        if a[3]<current_date:
            my_cursor.execute("delete from URLS where shortened_url like %s",[a[0]])
            print("expired date deleted")
            continue
        current_url_list.append(a[1])
        current_url_list.append(a[3].day-current_date.day)
        all_url_list.append(current_url_list)
    mydb.commit()
    my_cursor.close()
    mydb.close()
    return all_url_list


# name="Anuj"
# passwd="Anujk"
# register_user(name,passwd)
# hire_start = datetime.date(2022,7,29)
# # hire_start=0
# add_url("abv","www.anuj999khare@gmail.com","Anuj",hire_start)
# print(login_verification(name,passwd))
# print(get_longurl("abcdfg"))
# print(urls_for_user("Anuj"))