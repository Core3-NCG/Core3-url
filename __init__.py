from flask import Flask , redirect, request, session
from random import randint

from sqlalchemy import true

app = Flask(__name__)
app.secret_key = "core3"

@app.route("/shortenUrl/url=<longUrl>")
@app.route("/shortenUrl/url=<longUrl>&time=<time>")
def createShortenedUrl(longUrl,time=False):
    status = False
    shortenedUrl = ""
    while(not status):
        randKey = randint(100000000,99999999999)
        uniqueEncoding = "encodedValue" # Call to Base62 encoding function
        user = None
        if("user" in session):
            user = session["user"]
        shortenedUrl = "http://127.0.0.1:5000/"+uniqueEncoding

        # Call to add url to the db
        #status = db_add(shortenedUrl,user,longUrl,time,0)
        status = true
    
    return shortenedUrl

@app.route("/short/<shortUrl>/")
def redirectToLongUrl(shortUrl):
    key = shortURLToNum(shortUrl)
    key = str(key)
    # Call to get the long url from the db
    data = read_from_json()
    if key in data.keys():
        url = data[key]["url"]
        return redirect(url)
    else : 
        return redirect("/notfound/error/")
        


if __name__ == "__main__":
    app.run(debug = True)