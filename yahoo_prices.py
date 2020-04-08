from pandas_datareader import data as web
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
from datetime import timedelta
from splinter import Browser
from bs4 import BeautifulSoup as bs
import requests
import pymongo
from flask import Flask, render_template, jsonify, redirect

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
    return df.to_json("static/data/highs_lows.json", orient='records')

