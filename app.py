from flask import Flask, render_template, jsonify, redirect
import pymongo
import Prices_stocks
import yahoo_prices
# create instance of Flask app

app = Flask(__name__, template_folder='static/html',static_url_path='/static')
conn = 'mongodb://localhost:27017' 

client = pymongo.MongoClient(conn)
db = client.stockMarket_db
# #  create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/stocks")
def stocks():
    stocks = [data for data in db.corona.find()]
    return render_template("stocks.html", stocks = stocks[0])

@app.route("/1970")
def recession2():
    return render_template("1970s.html")

@app.route("/gr")
def gr():
    return render_template("GreatRecession.html")

@app.route("/AXP")
def axp():
    return render_template("AXP.html")

@app.route("/DLTR")
def dltr():
    return render_template("DLTR.html")

@app.route("/dotcom")
def dotcom():
    return render_template("dotcom.html")

@app.route("/unemployment")
def index():
    return render_template("unemployment.html")

@app.route("/data")
def data():
    return render_template("data.html")

@app.route("/newData")
def newData():
    yahoo_prices.stock_table()
    return redirect("/data", code=302)

@app.route("/scrape")
def scrape():
    yahoo_prices.stock_table()
    Prices_stocks.mergeData()
    return redirect("/stocks", code=302)

@app.route("/newNews")
def new():
    corona = db.corona
    newNews = Prices_stocks.scrape_news()
    corona.update({}, newNews, upsert=True)
    return redirect("/stocks", code=302)

if __name__ == "__main__":
    app.run(debug=True)