from flask import Flask, render_template, request
from texter import sendMessage
import urllib

app = Flask(__name__)
app.static_folder = 'static'

@app.route("/text")
def text():
    to = request.args.get("to")
    body = urllib.unquote(request.args.get("body")).decode("utf8")
    image = request.args.get("image")

    print image
    if image == "None":
        sendMessage(to, body, None)
    else:
        sendMessage(to, body, image)

    return "200 OK"

@app.route("/index.html")
@app.route("/index")
@app.route("/")
def main():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
