from flask import Flask , redirect, request, session, jsonify, Response
import service as service
from sqlalchemy import true
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = "core3"
CORS(app)

"""
API format:
http://127.0.0.1:5000/shortenUrl?user=<username>&url=<url_to_shorten>
"""
@app.route("/shortenUrl")
def createShortenedUrl():
    user=request.args.get("user")
    longUrl=request.args.get("url")
    time = request.args.get("time")
    if user == None:
        return ("user parameter required",400)
    contents = service.buildShortURL(longUrl,time,user)

    msg = "http://127.0.0.1:5000/"+contents[0] if contents[1]==200 else contents[0]

    return msg


"""
API format:
http://127.0.0.1:5000/<encoded_value>
"""
@app.route("/<shortUrl>")
def redirectToLongUrl(shortUrl):
    long_url = service.getLongUrl(shortUrl)

    if (len(long_url)==0):
        return ("Page Not Found",404)
    else : 
        return redirect(long_url)


"""
API format:
http://127.0.0.1:5000/myUrls/user=<username>
"""
@app.route("/myUrls")
def getUrlList():
    user=request.args.get("user")
    if user == None:
        return ("user parameter required",400)
    urlList= service.getUrlList(user)
    
    if(urlList):
        return jsonify(urlList)
    
    return "No Urls found"


"""
API format:
http://127.0.0.1:5000/register
arguments : userName,password
accepts : application/json
returns : text
"""
@app.route("/register",methods = ['POST'])
def registerUser():
    data =request.get_json()
    username = data["userName"]
    password = data["password"]
    msg = service.registerUser(username,password)
    return msg

"""
API format:
http://127.0.0.1:5000/login
arguments : userName,password
accepts : application/json
returns : text
"""
@app.route("/login",methods=['POST'])
def loginUser():
    data =request.get_json()
    username = data["userName"]
    password = data["password"]
    msg = service.loginUser(username,password)
    return msg



if __name__ == "__main__":
    app.run(debug = True)