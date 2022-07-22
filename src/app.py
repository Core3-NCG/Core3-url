from asyncio.log import logger
from flask import Flask , redirect, request, jsonify
import service as service
import constants
import logging
from flask_cors import CORS

#logging.basicConfig(filename='record.log', level=logging.DEBUG,format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
app = Flask(__name__)
app.secret_key = "core3"
CORS(app)

"""
API format:
http://127.0.0.1:5000/shortenUrl?user=<username>&url=<url_to_shorten>
or
http://127.0.0.1:5000/shortenUrl?user=<username>&url=<url_to_shorten>&time=<expiry_date>
"""
@app.route("/shortenUrl")
def createShortenedUrl():
    user = request.args.get("user")
    longUrl = request.args.get("url")
    time = request.args.get("time")
    if user == None:
        return ("user parameter required",constants.BAD_REQUEST)
    response = service.buildShortURL(longUrl,time,user)
    return response


"""
API format:
http://127.0.0.1:5000/<encoded_value>
"""
@app.route("/<shortUrl>")
def redirectToLongUrl(shortUrl):
    long_url = service.getLongUrl(shortUrl)
    if (isinstance(long_url,str)):
        return redirect(long_url)
    return long_url


"""
API format:
http://127.0.0.1:5000/myUrls?user=<username>
"""
@app.route("/myUrls")
def getUrlList():
    user = request.args.get("user")
    if user == None:
        return ("user parameter required",constants.BAD_REQUEST)
    urlList = service.getUrlList(user)
    if(isinstance(urlList,list)):
        return jsonify(urlList)
    return urlList


"""
API format:
http://127.0.0.1:5000/register
arguments : userName,password
accepts : application/json
returns : text
"""
@app.route("/register",methods = ['POST'])
def registerUser():
    data = request.get_json()
    username = data["userName"]
    password = data["password"]
    response = service.registerUser(username,password)
    return response

"""
API format:
http://127.0.0.1:5000/login
arguments : userName,password
accepts : application/json
returns : text
"""
@app.route("/login",methods=['POST'])
def loginUser():
    data = request.get_json()
    username = data["userName"]
    password = data["password"]
    response = service.loginUser(username,password)
    return response



if __name__ == "__main__":
    app.run(debug = True)