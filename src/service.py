from asyncio import constants
from random import randint
import encode as en
import constants
import db_url as db
from datetime import datetime
import bcrypt

"""
Function to build the short URL
by looping to generate 
a unique key to avoid collisions
"""
def buildShortURL(longUrl,time,user):
    uniqueEncoding = ""
    while(True):
        randKey = randint(100000000,99999999999)
        uniqueEncoding = en.numToShortURL(randKey)
        
        # To check if user exists
        status =  db.check_if_user_exists(user)

        if( status == constants.BAD_REQUEST):
            return ("User does not exist",constants.BAD_REQUEST)
        elif( status == constants.INTERNAL_SERVER_ERROR):
            return ("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR)
            
        if time != None and time!= "": 
            dt_object = datetime.strptime(time, '%m/%d/%Y')
            status = db.add_url(uniqueEncoding,longUrl,user,True,dt_object.date())
        else:
            status = db.add_url(uniqueEncoding,longUrl,user,False,0)
        
        if(status == constants.DUPLICATE_ERROR):
            continue
        elif(status == constants.INTERNAL_SERVER_ERROR):
            return ("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR)

        url = "http://"+constants.SERVER_URL+"/"+uniqueEncoding
        return (url,constants.OK)

"""
Function to get the 
original url to redirect to
"""
def getLongUrl(key):
    longUrl,status = db.get_longurl(key)
    if(longUrl):
        return longUrl
    if(status == constants.INTERNAL_SERVER_ERROR):
        return ("Something went wrong, try again later ",constants.INTERNAL_SERVER_ERROR)
    return ("Page Not Found",constants.NOT_FOUND)

"""
Function to get the 
list of all the URLs
for a particular user
"""
def getUrlList(user):
    urlList,status = db.urls_for_user(user)
    if(status == constants.INTERNAL_SERVER_ERROR):
        return ("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR)
    modified_list = []
    for url in urlList:
        short_and_original_urls = [url[0],url[2]]
        short_and_original_urls[0] = "http://"+constants.SERVER_URL+"/"+url[0]
        modified_list.append(short_and_original_urls)
    
    return modified_list


def registerUser(username,password):
    salt =  bcrypt.gensalt()
    password  = bcrypt.hashpw(password.encode("utf-8"),salt)
    status = db.register_user(username,password)
    switcher = {
    200: ("Registered User "+username,constants.OK),
    409: ("User already exists",constants.DUPLICATE_ERROR),
    500: ("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR),
    }
    return switcher.get(status)

def loginUser(username,password):
    userPresent = db.login_verification(username,password)
    switcher = {
    200: ("Login Successful",constants.OK),
    401: ("Wrong credentials, login failed",constants.AUTHENTICATION_ERROR),
    500: ("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR),
    }
    return switcher.get(userPresent)
    