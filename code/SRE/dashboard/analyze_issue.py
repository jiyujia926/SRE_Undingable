from bs4.element import SoupStrainer
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
    # print(local_date_str)
    return local_date_str[:10]
def closed_issue_time(url:str):
    # url = "https://github.com/Bitergia/prosoul/issues/208"
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    rawtime = data[-1]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    # print(local_date_str)
    return local_date_str[:10]
def get_participators(url:str):
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    # print(soup)
    participatorlist = []
    for item in soup.find_all('a'):
        # print(item)
        itemstr = str(item)
        # print(itemstr)
        if itemstr.find('participant-avatar')>=0:
            # print(item['href'][1:])
            participatorlist.append(item['href'][1:])
    # print(participatorlist)
    return participatorlist
if __name__ == "__main__":
    url = input()
    # open_issue_time(url)
    # closed_issue_time(url)
    get_participators(url)
