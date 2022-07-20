from flask import Flask , redirect, request, session, jsonify, Response
import service as service
from sqlalchemy import true


app = Flask(__name__)
app.secret_key = "core3"

@app.route("/shortenUrl")
def createShortenedUrl():
    if "user" not in session:
        user=request.args.get("user")
    else:
        user=session["user"]
    longUrl=request.args.get("url")
    time = request.args.get("time")
    if user == None:
        return ("user parameter required",400)
    contents = service.buildShortURL(longUrl,time,user)

    msg = "http://127.0.0.1:5000/"+contents[0] if contents[1]==200 else contents[0]

    resp = Response(msg)
    resp.content_type="text"
    resp.status=contents[1]
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route("/<shortUrl>")
def redirectToLongUrl(shortUrl):
    long_url = service.getLongUrl(shortUrl)

    if (len(long_url)==0):
        return ("Page Not Found",404)
    else : 
        return redirect(long_url)


@app.route("/myUrls")
def getUrlList():
    if "user" not in session:
        user=request.args.get("user")
    else:
        user=session["user"]
    
    urlList= service.getUrlList(user)
    
    if(urlList):
        return jsonify(urlList)
    
    return "No Urls found"


@app.route("/register",methods = ['POST'])
def registerUser():
    username = request.form["username"]
    password = request.form["password"]
    msg = service.registerUser(username,password)
    return msg

@app.route("/login",methods=['POST'])
def loginUser():
    username = request.form["username"]
    password = request.form["password"]
    msg = service.loginUser(username,password)
    return msg



if __name__ == "__main__":
    app.run(debug = True)