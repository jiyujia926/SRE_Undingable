import requests
from bs4 import BeautifulSoup
from analyze_commit import commit_data
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
    strhtml = requests.get(url)
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
        strhtml = requests.get(next_page_url)
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
    print (commitbag)
    # return commitlist
    # 这里最终会打印commit的总数，链接在commitlist这个列表里。

if __name__ == "__main__":
    url = input()
    getcommit(url)
