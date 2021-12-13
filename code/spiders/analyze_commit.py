from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
from datetime import timedelta
def commit_data(url:str):
    # url = "https://github.com/jiyujia926/NFTauction/commit/02dfc9ddd0fc4fac62bf23eb774970700ef9ca9e"
    strhtml = requests.get(url)
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
    bag['commit_time']=local_date_str
    data = soup.select('#toc > div.toc-diff-stats > button')
    if data[0]:
        rawchanged = str(data[0])
        startindex = rawchanged.find('>')
        endindex = rawchanged.find('changed')
        changed = rawchanged[startindex+10:endindex-1]
        # print(changed+" changed file")
        bag['changed_file']=changed
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
