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