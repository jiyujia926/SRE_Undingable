from bs4.element import SoupStrainer
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
				'Accept-Language': 'zh-CN,zh;q=0.9'}
# headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
# 				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
# 				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
# 				'Accept-Encoding': 'gzip, deflate',
# 				'Cookie': 'BAIDUID=1A6EF88EE4929836C761FB37A1303522:FG=1; BIDUPSID=1A6EF88EE4929836C761FB37A1303522; PSTM=1603199415; H_PS_PSSID=32755_1459_32877_7567_31253_32706_32231_7517_32117_32845_32761_26350; BD_UPN=13314752; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; delPer=0; BD_CK_SAM=1; PSINO=5; H_PS_645EC=e4bcE4275G3zWcvH2pxYG6R32rBxb5yuey8xcioaej8V7IaJRfEq4xp4iCo; COOKIE_SESSION=45294_0_2_5_0_2_0_1_0_2_3_0_0_0_0_0_0_0_1603244844%7C5%230_0_1603244844%7C1; BA_HECTOR=2gal2h2ga58025f1vs1fov5vf0k'}
def open_issue_time(url:str):
    # url = "https://github.com/Bitergia/prosoul/issues/214"
    strhtml = requests.get(url,headers=headers)
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
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.find_all('relative-time')
    rawtime = data[-1]['datetime']
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    # print(local_date_str)
    return local_date_str[:10]
def get_participators(url:str):
    strhtml = requests.get(url,headers=headers)
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
