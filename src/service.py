from random import randint
from tkinter import E
import encode as en
import db_url as db
from datetime import datetime

def buildShortURL(longUrl,time,user):
    uniqueEncoding=""
    while(True):
        randKey = randint(100000000,99999999999)
        uniqueEncoding = en.numToShortURL(randKey)
        
        if not db.check_if_user_exists(user):
            return "User does not exist",400

        # Call to add url to the db
        try:
            if time!=None:
                dt_object = datetime.strptime(time, '%Y-%m-%d')
                db.add_url(uniqueEncoding,longUrl,user,True,dt_object)
            else:
                db.add_url(uniqueEncoding,longUrl,user,False,0)

        except Exception as  error:
            if( "Duplicate entry" in str(error)):
                continue
            return None,500

        return uniqueEncoding,200


def getLongUrl(key):
    longUrl = db.get_longurl(key)
    return longUrl


def getUrlList(user):
    urlList = db.urls_for_user(user)
    modified_list=[]
    for url in urlList:
        l=[url[0],url[2]]
        l[0]="http://127.0.0.1:5000/"+url[0]
        modified_list.append(l)
    
    return modified_list

def registerUser(username,password):
    try:
        db.register_user(username,password)
        return ("Registered User "+username,200)
    except Exception as error:
        if("Duplicate entry" in str(error)):
            return ("User already exists",409)
        else:
            return ("Something went wrong, try again later",500)

def loginUser(username,password):
    try:
        userPresent = db.login_verification(username,password)
        if(userPresent):
            return ("Login Successful",200)
        else:
            return ("Wrong credentials, login failed",401)
    except Exception as error:
        return ("Something went wrong, try again later",500)
    