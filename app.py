from flask import Flask, render_template, jsonify, redirect, request
import pymongo
from datetime import datetime, timedelta, date
from splinter import Browser
from bs4 import BeautifulSoup as bs
import Prices_stocks
import predict
# create instance of Flask app

app = Flask(__name__, template_folder='static/html',static_url_path='/static')

# Prices_stocks.stock_table()
# Prices_stocks.unemployment_inflation_gdp_df()
# Prices_stocks.mergeData()
# Prices_stocks.scrape_news()

conn = 'mongodb://localhost:27017' 

client = pymongo.MongoClient(conn)
db = client['COVID-19']
unemploymentCollection = db['unemployment']
stocksCollection = db['stocks']
newsCollection = db['news']
tableCollection = db['stockTable']

# #  create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/stocks")
def stocks():
    stocks = [data for data in db.news.find()]
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

@app.route("/unemployment/data")
def getData():
    unemploymentData = [
        { key: value for key,value in data.items() if key != '_id' }
        for data in unemploymentCollection.find()
    ]
    
    return jsonify(unemploymentData)

@app.route("/data")
def data():
    return render_template("data.html")

@app.route("/data/table")
def tableData():
    tableData = [
        { key: value for key,value in data.items() if key != '_id' }
        for data in tableCollection.find()
    ]
    
    return jsonify(tableData)

@app.route("/stock/prices")
def stockData():
    stockData = [
        { key: value for key,value in data.items() if key != '_id' }
        for data in stocksCollection.find()
    ]
    
    return jsonify(stockData)

@app.route("/predictions")
def predictions():
    return render_template("predictions.html")

@app.route("/predicts")
def graphPredictions():
    ticker = request.args.get("ticker")
    predictions = predict.stock_prediction(ticker)
    return predictions

@app.route("/predicts2")
def graphPredictions2():
    ticker = request.args.get("ticker")
    predictions = predict.previous_stock_prediction(ticker)

        # executable_path = {"executable_path": "/usr/local/bin/chromedriver"}

        # browser = Browser("chrome", **executable_path, headless=True)

        # url = "https://finance.yahoo.com/quote/"
        # browser.visit(url + ticker)
        # html = browser.html
        # soup = bs(html, 'html.parser')

        # name = soup.find('div').find('h1').get_text()
        # print(name)
    return predictions

@app.route("/newData")
def newData():
    # update values if new values don't equal old values
    table = Prices_stocks.stock_table()
    tableCollection.update({}, table[0], upsert=True)
    return redirect("/data", code=302)

@app.route("/scrape")
def scrape():
    stockPrices = Prices_stocks.mergeData()[-1]

    stockToUpdate = [x for x in stocksCollection.find({'Date': {"$eq": stockPrices['Date']}})]

    #if there is no stock found then insert all stock in stockPrices
    if (not len(stockToUpdate)):
        stocksCollection.insert_one(stockPrices)
    else:
            #if there are stock prices than update price based on date
        stocksCollection.update_one({'_id': {"$eq": stockToUpdate[0]['_id']}}, {'$set': stockPrices}, upsert=True)

    return redirect("/stocks", code=302)

@app.route("/newNews")
def new():
    news = db.news
    newNews = Prices_stocks.scrape_news()
    news.update({}, newNews, upsert=True)
    return redirect("/stocks", code=302)

if __name__ == "__main__":
    app.run(debug=True)