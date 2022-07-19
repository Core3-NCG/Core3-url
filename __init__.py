from flask import Flask , redirect, request, session
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
    return (msg,contents[1])

@app.route("/short/<shortUrl>/")
def redirectToLongUrl(shortUrl):
    str long_url = get_longurl(shortUrl)
    # Call to get the long url from the db
    if (len(long_url)==0):
        return redirect("/notfound/error/")
    else : 
        return redirect(url)

if __name__ == "__main__":
    app.run(debug = True)