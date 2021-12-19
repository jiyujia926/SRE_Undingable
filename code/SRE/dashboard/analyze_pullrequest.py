from bs4.element import SoupStrainer
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
				'Accept-Language': 'zh-CN,zh;q=0.9'}
def open_pullrequest_time(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find('relative-time')
    # print(data['datetime'])
    rawtime = data['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    return local_date_str[:10]

def merged_pullrequest_closed_time(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    for item in data:
        if str(item['class']).find('no-wrap')>=0:
            rawtime=item['datetime']
            break
    # rawtime = data[-1]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    return local_date_str[:10]
def merged_pullrequest_open_time(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    # for item in data:
    #     if str(item['class']).find('no-wrap')>=0:
    #         rawtime=item['datetime']
    rawtime = data[2]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    return local_date_str[:10]
def closed_pullrequest_open_time(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find('relative-time')
    # print(data['datetime'])
    rawtime = data['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    return local_date_str[:10]
def closed_pullrequest_closed_time(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    # print(data['datetime'])
    rawtime = data[-1]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    return local_date_str[:10]
def pullrequest_status(url:str):
    status=""
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('svg')
    # print(data)
    for item in data:
        if str(item['class']).find('closed')>=0:
            status="closed"
        if str(item['class']).find('merge')>=0:
            status="merged"
    # print(status)
    return status


def get_participators(url:str):
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    # print(soup)
    participator = []
    for item in soup.find_all('a'):
        # print(item)
        itemstr = str(item)
        # print(itemstr)
        if itemstr.find('participant-avatar')>=0:
            participator.append(item['href'][1:])
    return participator
def combined_operations(url:str):
    if pullrequest_status(url) == "merged":
        prbag={'status':'merged','opentime':merged_pullrequest_open_time(url),'mergetime':merged_pullrequest_closed_time(url),'participator':get_participators(url)}
    elif pullrequest_status(url) == "closed":
        prbag={'status':'closed','opentime':closed_pullrequest_open_time(url),'closetime':closed_pullrequest_closed_time(url),'participator':get_participators(url)}        
    return prbag
def open_operations(url:str):
    prbag={'status':'open','opentime':open_pullrequest_time(url),'participator':get_participators(url)}
    return prbag

if __name__ == "__main__":
    url = input()
    # open_pullrequest_time(url)
    # get_participators(url)
    # open_pullrequest_time(url)
    # merged_pullrequest_open_time(url)
    # closed_pullrequest_open_time(url)
    # closed_pullrequest_close_time(url)
    # closed_pullrequest_status(url)
    # print(combined_operations(url))
    # print(merged_pullrequest_open_time(url))
    # print(merged_pullrequest_closed_time(url))
    # print(open_operations(url))
    # print(pullrequest_status(url))