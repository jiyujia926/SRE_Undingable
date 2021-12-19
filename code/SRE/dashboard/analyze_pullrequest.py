from bs4.element import SoupStrainer
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
				'Accept-Encoding': 'gzip, deflate',
				'Cookie': 'BAIDUID=1A6EF88EE4929836C761FB37A1303522:FG=1; BIDUPSID=1A6EF88EE4929836C761FB37A1303522; PSTM=1603199415; H_PS_PSSID=32755_1459_32877_7567_31253_32706_32231_7517_32117_32845_32761_26350; BD_UPN=13314752; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; delPer=0; BD_CK_SAM=1; PSINO=5; H_PS_645EC=e4bcE4275G3zWcvH2pxYG6R32rBxb5yuey8xcioaej8V7IaJRfEq4xp4iCo; COOKIE_SESSION=45294_0_2_5_0_2_0_1_0_2_3_0_0_0_0_0_0_0_1603244844%7C5%230_0_1603244844%7C1; BA_HECTOR=2gal2h2ga58025f1vs1fov5vf0k'}
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