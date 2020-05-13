# Stock Market Crashes Today and Throughout History

A screen recording of the application https://gfycat.com/ifr/ScarceImmediateGartersnake 

The purpose of this webpage is to give the user background information of previous recessions that occured throughout history along with the companies that excelled and those that did not. The webpage provides visualizations as to the prices of the S&P 500 and Nasdaq during the recessions, along with the stock prices for those companies that we focused on. 

The webpage also provides the user with historical data on the Unemployment Rate, GDP Growth and Inflation Rate per year to provide the user with statistics during the recessions that are covered. The final visualization is meant to keep the user up to date with stock prices and activity in the market today.

The scale of the visualization updates depending on the company the user chooses and allows the user to choose a specific industry along with competitors in the industry. The visualization provides the user with the most up to date prices scraped from Yahoo Finance and updates when new prices are identified. Below this visualization links to New York Times are provided based on the comapnies that are included in the graphic. 

The user can view the 52 week Highs and Lows that are calculated based on data from exactly 365 days before the current date along with the current price for user's to compare. Lastly, these prices are first normalized from January 31 to allow the user to observe the percent change in price due to the coronavirus along with a popup that will provide the user with the actual closing price on each day since January 31st. 

![](static/images/Screen%20Shot%202020-04-08%20at%203.05.19%20PM.png)
![](static/images/Screen%20Shot%202020-04-08%20at%203.06.08%20PM.png)

Along with the graphics provided the webpage also includes a Prediction page in which a Machine Learning Algorithm is introduced to provide user's with stock predictions 5 days into the future. The algorithm used is the Support Vector Regression Model which is trained on historical prices from the last 6 years to identify patterns and trends in the price of the individual stock selected. Included in this page is a forecast of the last five days and the next five days for user's to develop an understanding of how accurate the model is. 

Previously, our group explored various Machine Learning Algortihms including Linear Regression Models, Neural Network (Long Short-Term Memory Model), and Support Vector Regression models to determine which model we should depend on. Through this evaluation my group members and I determined that the Support Vector Regression Model is the most reliable due to the fact that the model determines the predictions based on the most up to date prices extracted from Yahoo Finance.

These predictions are developed in Python after the user inputs a Stock Ticker that they would like to predict. The Flask app then uses the input provided by the user to run through the SVR function that returns a dataframe with both actual prices and predictions for the next five days from the current date. Then in JavaScript this data is identified using the AJAX function then develops a graph using Plotly.

![](static/images/predict1.png)
![](static/images/predict2.png)
