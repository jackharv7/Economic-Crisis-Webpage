from pandas_datareader import data as web
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
from datetime import timedelta
from splinter import Browser
from bs4 import BeautifulSoup as bs
import requests
from pymongo import MongoClient
from flask import Flask, render_template, jsonify, redirect

conn = 'mongodb://localhost:27017' 

client = MongoClient(conn)
db = client['COVID-19']
unempColl = db.unemployment
stockColl = db.stocks
newsColl = db.news
tableColl = db.stockTable

def unemployment_inflation_gdp_df():

    url = "https://www.thebalance.com/unemployment-rate-by-year-3305506"

    data = pd.read_html(url)

    data = pd.DataFrame(data[0])
    data = data.fillna(value = '0')
    data = data.rename(columns={"Unemployment Rate (as of Dec.)": "Unemployment_Rate", "GDP Growth": "GDP_Growth", "Inflation (Dec. YOY)": "Inflation", "What Happened": "Occurance"})
    data["Unemployment Rate"] = data["Unemployment_Rate"].apply(lambda x: x.replace('%', ''))
    data["GDP Growth"] = data["GDP_Growth"].apply(lambda x: x.replace('%', ''))
    data["Inflation"] = data["Inflation"].apply(lambda x: x.replace('%', ''))
    data = data[['Year', "Unemployment Rate", "GDP Growth", "Inflation"]]
    data = data.append({'Year': 2020, 'Unemployment Rate': '15', 'GDP Growth': '-24', 'Inflation': '0.9'}, ignore_index=True)
    data['Center'] = '0'
    docs = data.to_dict(orient='records')
    if (unempColl.estimated_document_count() == 0):
        return unempColl.insert_many(docs)
    else:
        return docs


def prices(ticker, startDate, name):

    mydata = web.DataReader(ticker,
                        start = startDate,
                        data_source='yahoo')['Adj Close']
    normalize = (mydata / mydata.iloc[0] * 100)
    data = pd.DataFrame(mydata)
    data = data.merge(normalize, on='Date')
    data = data.rename(columns={'Adj Close_x': f'{name} Price', 'Adj Close_y': f'{name} Percent'})
    data = data.reset_index()
    return data

def mergeData():
    stocks = [
        {'Ticker':'^IXIC', 'Name':'Nasdaq'},
        {'Ticker':'ZM','Name': 'Zoom'},
        {'Ticker':'CSCO', 'Name':'Cisco'},
        {'Ticker':'AMZN', 'Name':'Amazon'},
        {'Ticker':'BA', 'Name':'Boeing'},
        {'Ticker':'LMT', 'Name':'Lockheed'},
        {'Ticker':'JPM', 'Name':'JPM'},
        {'Ticker':'GS', 'Name':'GS'},
        {'Ticker':'RCL', 'Name':'RoyalCruise'},
        {'Ticker':'MAR', 'Name':'Marriott'},
        {'Ticker':'AMC', 'Name':'AMC'},
        {'Ticker':'JNJ', 'Name':'JNJ'},
        {'Ticker':'RHHBY', 'Name':'Roche'},
        {'Ticker':'CVX', 'Name':'Chevron'},
        {'Ticker':'XOM', 'Name':'Exxon'},
        {'Ticker':'FORD', 'Name':'FORD'},
        {'Ticker':'GM', 'Name':'GM'},
        {'Ticker':'TSLA', 'Name':'Tesla'},
        {'Ticker':'GILD', 'Name':'GILD'},
        {'Ticker':'MRNA', 'Name':'Moderna'},
        {'Ticker':'INO', 'Name':'Inovio'},
        {'Ticker':'NKE', 'Name':'Nike'},
        {'Ticker':'ADDYY', 'Name':'Adidas'},
        {'Ticker':'GPS', 'Name':'Gap'},
        {'Ticker':'M', 'Name':'Macy'}
    ]
    data = prices('^GSPC', '01/30/2020', 'GSPC')
    for x in stocks:
        data = data.merge(prices(x['Ticker'], '01/31/2020', x['Name']), on='Date')

    data['Center'] = '100'
    stocks = data.to_dict(orient='records')
    if (stockColl.estimated_document_count() == 0):
        return stockColl.insert_many(stocks)
    else:
        return stocks

def scrape_news():
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}

    browser = Browser("chrome", **executable_path, headless=True)
    
    url = "https://www.nytimes.com"
    browser.visit(url + '/search?query=zoom')
    html = browser.html
    soup = bs(html, 'html.parser')

    zoom = soup.find('ol').find("a")
    zoom_link = url + zoom['href']
    zoom_news = zoom.find('h4').get_text()

    browser.visit(url + '/search?query=inovio')
    html = browser.html
    soup = bs(html, 'html.parser')
    ino = soup.find('ol').find("a")
    ino_link = url + ino['href']
    ino_news = soup.find('h4').get_text()    

    browser.visit(url + '/search?query=boeing')
    html = browser.html
    soup = bs(html, 'html.parser')
    boeing = soup.find('li').find("a")
    boeing_link = boeing['href']
    boeing_news = soup.find('h4').get_text()

    browser.visit(url + '/search?query=jnj')
    html = browser.html
    soup = bs(html, 'html.parser')
    jnj = soup.find('li').find("a")
    jnj_link = jnj['href']
    jnj_news = soup.find('h4').get_text()

    browser.visit(url + '/search?query=royal+cruise')
    html = browser.html
    soup = bs(html, 'html.parser')
    rcruise = soup.find('ol').find("a")
    rcruise_link = url + rcruise['href']
    rcruise_news = rcruise.find('h4').get_text()

    browser.visit(url + '/search?query=moderna')
    html = browser.html
    soup = bs(html, 'html.parser')
    moderna = soup.find('ol').find("a")
    moderna_link = url + moderna['href']
    moderna_news = moderna.find('h4').get_text()

    browser.visit(url + '/search?query=ford')
    html = browser.html
    soup = bs(html, 'html.parser')
    ford = soup.find('li').find("a")
    ford_link = ford['href']
    ford_news = soup.find('h4').get_text()

    browser.visit(url + '/search?query=tesla')
    html = browser.html
    soup = bs(html, 'html.parser')
    tesla = soup.find('li').find("a")
    tesla_link = tesla['href']
    tesla_news = soup.find('h4').get_text()

    browser.visit(url + '/search?query=gap')
    html = browser.html
    soup = bs(html, 'html.parser')
    gap = soup.find('li').find("a")
    gap_link = gap['href']
    gap_news = soup.find('h4').get_text()

    news = {
        'zoom_news': zoom_news,
        'zoom_link': zoom_link,
        'boeing_news': boeing_news,
        'boeing_link': boeing_link,
        'jnj_news': jnj_news,
        'jnj_link': jnj_link,
        'rcruise_news': rcruise_news,
        'rcruiselink': rcruise_link,
        'moderna_news': moderna_news,
        'moderna_link': moderna_link,
        'ford_news': ford_news,
        'ford_link': ford_link,
        'tesla_news': tesla_news,
        'tesla_link': tesla_link,
        'gap_news': gap_news,
        'gap_link': gap_link,
        'ino_news': ino_news,
        'ino_link': ino_link
    }
    if (newsColl.estimated_document_count() == 0):
        return newsColl.insert_one(news)
    else:
        return news

#identify 52 week max for each stock
def max_price(ticker):
    start = datetime.now() - timedelta(days=365)
    mydata = web.DataReader(ticker, start=start, data_source='yahoo')['High']
    return mydata.max()

#identify 52 week min for each stock
def min_price(ticker):
    start = datetime.now() - timedelta(days=365)
    mydata = web.DataReader(ticker, start=start, data_source='yahoo')['Low']
    return mydata.min()

#identify the last price of each stock
def last_price(ticker):
    start = datetime.now() - timedelta(days=365)
    mydata = web.DataReader(ticker,start=start, data_source='yahoo')['Adj Close'][-1]
    return mydata

#run functions on each ticker
def high_low(ticker):
    min_max = {
        'Ticker': ticker,
        '52 Week Min': min_price(ticker),
        '52 Week Max': max_price(ticker),
        'Last Price': last_price(ticker)
    }
    return min_max

#create table of all information
def stock_table():
    stocks = ['^GSPC', '^IXIC', 'ZM', 'CSCO', 'AMZN', 'BA', 'LMT', 'JPM', 'GS', 'RCL', 'MAR', 'AMC', 'JNJ', 'MRNA', 'RHHBY', 'GILD','INO',
'CVX', 'XOM', 'FORD', 'GM', 'TSLA', 'ADDYY', 'NKE', 'GPS', 'M']
    data = [high_low(x) for x in stocks]
    df = pd.DataFrame(data)
    data = df.to_dict(orient='records')
    if (tableColl.estimated_document_count() == 0):
        return tableColl.insert_many(data)
    else:
        return data
