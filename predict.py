from pandas_datareader import data
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
import datetime
from datetime import date
import calendar 


today = date.today()
today = today.strftime("%Y-%m-%d")

today2 = date.today()
five_days_ago = today2 - datetime.timedelta(days=7)
five_days_ago = five_days_ago.strftime("%Y-%m-%d")
def stock_prediction(stock_name):
        try:
            quote = data.DataReader(stock_name,
                               start='2014-1-1', 
                               end=today,
                               data_source='yahoo')['Adj Close']
            quote = pd.DataFrame(quote)
            days = 5
            quote["Prediction"] = quote["Adj Close"].shift(-days)
            X = np.array(quote.drop(["Prediction"], 1))
            X = X[:-days]
            y = np.array(quote["Prediction"])
            y = y[:-days]
            X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.2)
            svr = SVR(kernel = "rbf", C = 1e4, gamma = 0.1)
            svr.fit(X_train, y_train)
            print(f"Current R score: {svr.score(X_test, y_test)}")
            predicts = np.array(quote.drop(["Prediction"],1))[-days:]
            prediction = svr.predict(predicts)

            last_date = quote.iloc[-1].name
            last_unix = last_date
            next_unix = last_unix + datetime.timedelta(days=1)
    
            for i in prediction:
                if next_unix.weekday() == 6:
                    next_unix += datetime.timedelta(days=2)
                elif next_unix.weekday() == 7:
                    next_unix += datetime.timedelta(days=1)
                next_date = next_unix
                next_unix += datetime.timedelta(days=1)
                quote.loc[next_date] = [np.nan for _ in range(len(quote.columns)-1)]+[i]

            prices = pd.concat([quote['Adj Close'].tail(60), quote['Prediction'].tail(days)], axis=1)
            prices = prices.reset_index()
            prices = prices.to_json(orient='records')

            return prices
    
        except:
            print("Stock doesn't exist, please enter a different stock")

def previous_stock_prediction(stock_name):
        try:
            quote = data.DataReader(stock_name,
                               start='2014-1-1', 
                               end=five_days_ago,
                               data_source='yahoo')['Adj Close']
            
            quote = pd.DataFrame(quote)
            days = 5
            quote["Prediction"] = quote["Adj Close"].shift(-days)
            X = np.array(quote.drop(["Prediction"], 1))
            X = X[:-days]
            y = np.array(quote["Prediction"])
            y = y[:-days]
            X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.2)
            svr = SVR(kernel = "rbf", C = 1e4, gamma = 0.1)
            svr.fit(X_train, y_train)
            print(f"Previous R score: {svr.score(X_test, y_test)}")
            predicts = np.array(quote.drop(["Prediction"],1))[-days:]
            prediction = svr.predict(predicts)

            last_date = quote.iloc[-1].name
            last_unix = last_date
            next_unix = last_unix + datetime.timedelta(days=1)

            for i in prediction:
                if next_unix.weekday() == 6:
                    next_unix += datetime.timedelta(days=2)
                elif next_unix.weekday() == 7:
                    next_unix += datetime.timedelta(days=1)
                next_date = next_unix
                next_unix += datetime.timedelta(days=1)
                
                quote.loc[next_date] = [np.nan for _ in range(len(quote.columns)-1)]+[i]

            prices = pd.concat([quote['Adj Close'].tail(60), quote['Prediction'].tail(days)], axis=1)
            prices = prices.reset_index()
            prices = prices.to_json(orient='records')

            return prices
    
        except:
            print("Stock doesn't exist, please enter a different stock")