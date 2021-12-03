import requests
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
def open_issue_time(url:str):
    # url = "https://github.com/Bitergia/prosoul/issues/214"
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find('relative-time')
    # print(data['datetime'])
    rawtime = data['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    print(local_date_str)
def closed_issue_time(url:str):
    # url = "https://github.com/Bitergia/prosoul/issues/208"
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    rawtime = data[-1]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    print(local_date_str)
    
if __name__ == "__main__":
    url = input()
    open_issue_time(url)
    closed_issue_time(url)
