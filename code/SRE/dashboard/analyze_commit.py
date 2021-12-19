from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
from datetime import timedelta
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
				'Accept-Encoding': 'gzip, deflate',
				'Cookie': 'BAIDUID=1A6EF88EE4929836C761FB37A1303522:FG=1; BIDUPSID=1A6EF88EE4929836C761FB37A1303522; PSTM=1603199415; H_PS_PSSID=32755_1459_32877_7567_31253_32706_32231_7517_32117_32845_32761_26350; BD_UPN=13314752; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; delPer=0; BD_CK_SAM=1; PSINO=5; H_PS_645EC=e4bcE4275G3zWcvH2pxYG6R32rBxb5yuey8xcioaej8V7IaJRfEq4xp4iCo; COOKIE_SESSION=45294_0_2_5_0_2_0_1_0_2_3_0_0_0_0_0_0_0_1603244844%7C5%230_0_1603244844%7C1; BA_HECTOR=2gal2h2ga58025f1vs1fov5vf0k'}
def commit_data(url:str):
    # url = "https://github.com/jiyujia926/NFTauction/commit/02dfc9ddd0fc4fac62bf23eb774970700ef9ca9e"
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    data = soup.select('#repo-content-pjax-container > div.commit.full-commit.mt-0.px-2.pt-2 > div.commit-meta.p-2.d-flex.flex-wrap > div.flex-self-start.no-wrap.mr-md-4.mr-0')
    # print(data[0])
    bag={}
    bigstr = str(data[0])
    startindex = bigstr.find("View all commits by")
    endindex = bigstr.find("committed")
    commitor = bigstr[startindex:endindex-3]
    endindex = commitor.find('">')
    commitor = commitor[20:endindex]
    # print(commitor)
    bag['commitor']=commitor
    startindex = bigstr.find("datetime")
    endindex = bigstr.find("/relative-time")
    rawtime = bigstr[startindex:endindex]
    endindex = rawtime.find(">")
    rawtime = rawtime[10:endindex-1]
    # print(rawtime)
    utc_date = datetime.strptime(rawtime,"%Y-%m-%dT%H:%M:%SZ")
    local_date = utc_date + timedelta(hours=8)
    local_date_str = datetime.strftime(local_date,'%Y-%m-%d %H:%M:%S')
    # print(local_date_str)
    bag['commit_time']=local_date_str[:10]
    data = soup.select('#toc > div.toc-diff-stats > button')
    if data:
        rawchanged = str(data[0])
        startindex = rawchanged.find('>')
        endindex = rawchanged.find('changed')
        changed = rawchanged[startindex+10:endindex-1]
        # print(changed+" changed file")
        bag['changed_file']=changed
    else:
        data = soup.select('#toc > div.toc-diff-stats > strong:nth-child(2)')
        # print(data)
        if data:
            rawchanged = str(data[0])
            startindex = rawchanged.find('>')
            endindex = rawchanged.find('changed')
            changed = rawchanged[startindex+1:endindex-1]
            # print(changed+" changed file")
            bag['changed_file']=changed.replace(',','')
        else:
            bag['changed_file']='0'
    data = soup.select('#toc > div.toc-diff-stats > strong:nth-child(3)')
    if data[0]:
        rawaddition = str(data[0])
        startindex = rawaddition.find('>')
        endindex = rawaddition.find('addition')
        additions = rawaddition[startindex+1:endindex-1]
        # print(additions.replace(',',"")+" additions")
        bag['additions']=additions.replace(',',"")
    data = soup.select('#toc > div.toc-diff-stats > strong:nth-child(4)')
    if data[0]:
        rawdeletion = str(data[0])
        startindex = rawdeletion.find('>')
        endindex = rawdeletion.find('deletion')
        deletions = rawdeletion[startindex+1:endindex-1]
        # print(deletions+" deletion")
        bag['deletions']=deletions.replace(',',"")
    # print(newtime)
    # print(commitor)
    # print(bag)
    return bag
    # commit_user = ""
    # for item in soup.find_all('a'):
    #     # if item['href']:
    #     # link =  str(item['href'])s
    #     # title = str(item['title'])
    #     # if link.find("/jiyujia926/NFTauction/commits")==0 and title.find("View all commits by")==0 :
    #     print(item)
if __name__ == "__main__":
    url = input()
    commit_data(url)
