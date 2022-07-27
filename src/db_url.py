import mysql.connector 
from mysql.connector import errorcode
import constants
import redis
import bcrypt
import datetime

#use to make connection
def make_conn():
    mydb=mysql.connector.connect(
        host = constants.HOST,
        user = constants.USER,
        passwd = constants.PASSWORD,
        auth_plugin = constants.AUTH_PLUGIN
    )
    DB_NAME = constants.DB_NAME
    return mydb,DB_NAME


#used to connect to redis cache
def connect_redis():
    return redis.Redis(host="127.0.0.1",port=6379,db=0)

# used to create the database
def create_database(cursor,DB_NAME):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
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
            mydb.database = DB_NAME
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
    TABLES = {}
    TABLES['Users']=("create table `Users` (`user_name` varchar(255) NOT NULL,"
        "`user_pass` varchar(255) NOT NULL,"
        "PRIMARY KEY (`user_name`))ENGINE=INNODB")

    TABLES['URLS']=("create table `URLS` ( `shortened_url` varchar(255) NOT NULL,"
        "`actual_url` varchar(255) NOT NULL,"
        "`user_name` varchar(255),"
        "`expiration_time` Date,"
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

# createTable()

# register the user and store username and pass in DB
def register_user(userName,userPass):
    try:
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("INSERT INTO Users  (`user_name`,`user_pass`) values (%s,%s)",(userName,userPass))
        close_mysql_connection(my_cursor,mydb)
        return constants.OK
    except Exception as error:
        if("Duplicate entry" in str(error)):
            return constants.DUPLICATE_ERROR
        return constants.INTERNAL_SERVER_ERROR

# Add the shortened URl, long_url, username if provided,expiration flag, and expiration time based on flag in the DB 
def add_url(short_url,long_url,userName,expirationTime):
    try:
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("INSERT INTO URLS (`shortened_url`,`actual_url`,`user_name`,`expiration_time`) values (%s,%s,%s,%s)",
        (short_url,long_url,userName,expirationTime))
        close_mysql_connection(my_cursor,mydb)
        return constants.OK
    except Exception as error:
        if( "Duplicate entry" in str(error)):
            return constants.DUPLICATE_ERROR
        return constants.INTERNAL_SERVER_ERROR

# Used to verify the user and return True/False 
def login_verification(userName,userPass):
    try:
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("select user_pass from Users where user_name like %s",[userName])
        verified=""
        for (a) in my_cursor:
            verified=a[0]
        close_mysql_connection(my_cursor,mydb)
        if verified :
            if bcrypt.checkpw(userPass.encode('utf-8'),verified.encode('utf-8')):
                return constants.OK
            return constants.AUTHENTICATION_ERROR
        else:
            return constants.AUTHENTICATION_ERROR
    except Exception as error:
        return constants.INTERNAL_SERVER_ERROR

# Used to verify if the user exists 
def check_if_user_exists(userName):
    try:
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("select user_name from Users where user_name like %s",[userName])
        username=""
        for (a) in my_cursor:
            username=a[0]
        close_mysql_connection(my_cursor,mydb)
        if  username :
            return constants.OK
        else:
            return constants.BAD_REQUEST
    except Exception as error:
        return constants.INTERNAL_SERVER_ERROR


# fetch and return the long_url for short_url given as parameter
def get_longurl(short_url):
    try:
        redisDB=connect_redis()
        if redisDB.get(short_url):
            print("return from cache")
            return [redisDB.get(short_url).decode(),constants.OK]
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("select * from URLS where shortened_url like %s",[short_url])
        long_url=""
        current_date=datetime.date.today()
        for a in my_cursor:
            if a[3]!=None:
                if a[3]<current_date:
                    my_cursor.execute("delete from URLS where shortened_url like %s",[a[0]])
                    continue
            long_url=a[1]
        close_mysql_connection(my_cursor,mydb)
        redisDB.set(name=short_url,value=long_url,ex = constants.CACHE_EXPIRY)
        return [long_url,constants.OK]
    except:
        return ["",constants.INTERNAL_SERVER_ERROR]

# return the list of all URLS for a user
def urls_for_user(user_name):
    try:
        my_cursor,mydb = establish_mysql_connection()
        my_cursor.execute("select * from URLS where user_name like %s",[user_name])
        all_url_list=[]
        current_date=datetime.date.today()
        for a in my_cursor:
            current_url_list=[]
            if a[3] != None:
                if a[3]<current_date:
                    my_cursor.execute("delete from URLS where shortened_url like %s",[a[0]])
                    print("expired date deleted")
                    continue
                current_url_list.append(a[0])
                current_url_list.append(a[1])
                current_url_list.append((a[3]-current_date).days)
            else:
                current_url_list.append(a[0])
                current_url_list.append(a[1])
                current_url_list.append(None)
            all_url_list.append(current_url_list)
        close_mysql_connection(my_cursor,mydb)
        return [all_url_list,constants.OK]
    except Exception as error:
        return [[],constants.INTERNAL_SERVER_ERROR]

# Function to establish connection to mysql 
# and specifying the database
def establish_mysql_connection():
    createConn=make_conn()
    mydb=createConn[0]
    DB_NAME=createConn[1]
    my_cursor=mydb.cursor()
    databaseUsed(my_cursor,DB_NAME)
    my_cursor = mydb.cursor(buffered=True)
    return my_cursor,mydb

# Function to commit changes to the database
# and close the connection
def close_mysql_connection(my_cursor, mydb):
    mydb.commit()
    my_cursor.close()
    mydb.close()