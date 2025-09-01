from flask import Flask, render_template, request, redirect, session, url_for
import usermanagement as dbHandler

app = Flask(__name__)
app.secret_key = "stinky"

@app.route('/signup', methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        dbHandler.insertUser(username, password, wallet=1000)
        return redirect(url_for("login"))
    return render_template("signup.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = dbHandler.retrieveUser(username, password)
        if user:
            session["user"] = user
            return redirect(url_for("roulette"))
        else:
            return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/", methods=["GET"])
def home():
    return redirect(url_for("login"))

@app.route("/roulette")
def roulette():
    if "user" not in session:
        return redirect(url_for("login"))
    user = session["user"]
    return render_template("roulette.html", user=user)

if __name__ == "__main__":
    app.run(debug=True)