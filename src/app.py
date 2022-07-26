from asyncio.log import logger
from flask import Flask , redirect, request, jsonify
import service as service
import constants
import logging
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

#logging.basicConfig(filename='record.log', level=logging.DEBUG,format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
app = Flask(__name__)
app.secret_key = "core3"
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "ShortURL App"
    }
)

app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

"""
Create a short URL given a long URL
@param user: get : the requesters userName
@param url: get : the long url to be shortened
@param expiryDate: get : the date at which the url expires
@return: 200: a shortened URL as a flask/response object
@raise 400: Bad request
@raise 500: Internal Server Error
 """
@app.route("/shortenUrl")
def createShortenedUrl():
    user = request.args.get("user")
    longUrl = request.args.get("url")
    expiryDate = request.args.get("expiryDate")
    if user == None:
        return ("user parameter required",constants.BAD_REQUEST)
    response = service.buildShortURL(longUrl,expiryDate,user)
    return response


"""
Redirect to original URL
@param shortUrl: get : the unique encoding for the original URL
@return: 302: redirection to the original URL
@raise 404: Page Not Found Error
@raise 500: Internal Server Error
 """
@app.route("/<shortUrl>")
def redirectToLongUrl(shortUrl):
    long_url = service.getLongUrl(shortUrl)
    if (isinstance(long_url,str)):
        return redirect(long_url)
    return long_url


"""
Get a dictionary of all the URLs of the user
@param user: get : the requesters userName
@return: 200: a dictionary of URLs as a flask/response object
@raise 400: Bad request
@raise 500: Internal Server Error
 """
@app.route("/myUrls")
def getUrlList():
    user = request.args.get("user")
    if user == None:
        return ("user parameter required",constants.BAD_REQUEST)
    urlList = service.getUrlList(user)
    if(isinstance(urlList,dict)):
        return jsonify(urlList)
    return urlList


"""
Register the user
@param userName: post : the requesters userName
@param password: post : the password enterd
@return: 200: a 'Registered User <userName>' string message as a flask/response object
@raise 409: Conflict Error
@raise 500: Internal Server Error
 """
@app.route("/register",methods = ['POST'])
def registerUser():
    data = request.get_json()
    userName = data["userName"]
    password = data["password"]
    response = service.registerUser(userName,password)
    return response

"""
Log the user in
@param userName: post : the requesters userName
@param password: post : the password enterd
@return: 200: a 'Login Successful' string message as a flask/response object
@raise 401: Authetication Error
@raise 500: Internal Server Error
 """
@app.route("/login",methods=['POST'])
def loginUser():
    data = request.get_json()
    userName = data["userName"]
    password = data["password"]
    response = service.loginUser(userName,password)
    return response



if __name__ == "__main__":
    app.run(host="localhost",debug = True)