from flask import Flask, render_template, request
app = Flask(__name__)
app.static_folder = 'static'

@app.route("/index.html")
@app.route("/index")
@app.route("/")
def main():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
