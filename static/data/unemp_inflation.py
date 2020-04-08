from bs4 import BeautifulSoup
import requests
import json
import pandas as pd
import matplotlib as plt

def unemployment_inflation_gdp_df():
    url = "https://www.thebalance.com/unemployment-rate-by-year-3305506"

    data = pd.read_html(url)

    data = pd.DataFrame(data[0])
    data = data.fillna(value = '0')
    data = data.rename(columns={"Unemployment Rate (as of Dec.)": "Unemployment_Rate", "GDP Growth": "GDP_Growth", "Inflation (Dec. YOY)": "Inflation", "What Happened": "Occurance"})
    data["Unemployment_Rate"] = data["Unemployment_Rate"].apply(lambda x: x.replace('%', ''))
    data["GDP_Growth"] = data["GDP_Growth"].apply(lambda x: x.replace('%', ''))
    data["Inflation"] = data["Inflation"].apply(lambda x: x.replace('%', ''))
    data = data[['Year', "Unemployment_Rate", "GDP_Growth", "Inflation"]]
    data = data.append({'Year': 2020, 'Unemployment_Rate': '15', 'GDP_Growth': '-24', 'Inflation': '0.9'}, ignore_index=True)
    data['Center'] = '0'
    return data.to_json("/Users/jackharvey/Documents/panic_at_the_desktop_project_2-masterstatic/data/Unemployment_Inflation.json", orient='records')