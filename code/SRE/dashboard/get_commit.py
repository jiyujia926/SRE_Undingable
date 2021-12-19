import requests
from bs4 import BeautifulSoup
from requests.api import head
from .analyze_commit import commit_data
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
				'Accept-Language': 'zh-CN,zh;q=0.9'}
# headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
# 				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
# 				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
# 				'Accept-Encoding': 'gzip, deflate',
# 				'Cookie': 'BAIDUID=1A6EF88EE4929836C761FB37A1303522:FG=1; BIDUPSID=1A6EF88EE4929836C761FB37A1303522; PSTM=1603199415; H_PS_PSSID=32755_1459_32877_7567_31253_32706_32231_7517_32117_32845_32761_26350; BD_UPN=13314752; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; delPer=0; BD_CK_SAM=1; PSINO=5; H_PS_645EC=e4bcE4275G3zWcvH2pxYG6R32rBxb5yuey8xcioaej8V7IaJRfEq4xp4iCo; COOKIE_SESSION=45294_0_2_5_0_2_0_1_0_2_3_0_0_0_0_0_0_0_1603244844%7C5%230_0_1603244844%7C1; BA_HECTOR=2gal2h2ga58025f1vs1fov5vf0k'}
def getcommit(rawurl:str):
    #rawurl应该为仓库的链接，例如https://github.com/RalXYZ/oh-my-tss
    url = ""
    has_next_page = 0
    next_page_url = ""
    commitlist = []
    checkstr = ""
    newurl = ""
    commitbag = []
    if rawurl[-1] == '/':
        url = rawurl + "commits/"
    else:
        url = rawurl + "/commits/"
    
    indexbegin = url.find("com")
    indexend = url.find("commits")
    checkstr = url[indexbegin+3:indexend] + "commit/"
    # print(checkstr)
    strhtml = requests.get(url,headers=headers)
    soup = BeautifulSoup(strhtml.text,'lxml')
    has_next_page_status = soup.select("#repo-content-pjax-container > div.paginate-container > div > a")
    if has_next_page_status:
        has_next_page = 1
        tempstr = str(has_next_page_status[0])
        indexbegin = tempstr.find("href")
        indexend = tempstr.find("rel")
        next_page_url = tempstr[indexbegin+6:indexend-2]
    print(next_page_url)
    # print(has_next_page)
    for item in soup.find_all('a'):
        link = str(item['href'])
        # print(link)
        if link.find(checkstr) == 0:
            newurl = "https://github.com" + link;
        if newurl in commitlist:
            continue
        else:
            # print(newurl)
            if newurl:
                commitlist.append(newurl)
                commitbag.append(commit_data(newurl))
    
    while (has_next_page):
        strhtml = requests.get(next_page_url,headers=headers)
        soup = BeautifulSoup(strhtml.text,'lxml')
        has_next_page_status = soup.select("#repo-content-pjax-container > div.paginate-container > div > a")
        if len(has_next_page_status)>1:
            has_next_page = 1
            tempstr = str(has_next_page_status[1])
            indexbegin = tempstr.find("href")
            indexend = tempstr.find("rel")
            next_page_url = tempstr[indexbegin+6:indexend-2]
            print(next_page_url)
        else:
            has_next_page = 0
        
        for item in soup.find_all('a'):
            link = str(item['href'])
            if link.find(checkstr) == 0:
                newurl = "https://github.com" + link;
            if newurl in commitlist:
                continue
            else:
                # print(newurl)
                commitlist.append(newurl)
                commitbag.append(commit_data(newurl))
    # print(commitlist[0])
    # print(commitlist)
    # print(len(commitlist))
    return commitbag
    # return commitlist
    # 这里最终会打印commit的总数，链接在commitlist这个列表里。

if __name__ == "__main__":
    url = input()
    commitbag=getcommit(url)
    print(commitbag)
