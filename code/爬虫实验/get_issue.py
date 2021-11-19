from typing import NewType
import requests
from bs4 import BeautifulSoup

def get_open_issue(rawurl:str):
    # url = "https://github.com/Bitergia/prosoul/issues"
    # url = "https://github.com/donnemartin/system-design-primer/issues"
    issuelist=[]
    url = ""
    if rawurl[-1] == '/':
        url = rawurl + "issues"
    else:
        url = rawurl +"/issues"
    indexstart = url.find('com')
    indexend = url.find('issue')
    checkstr = url[indexstart+4:indexend]+"issues"
    print(checkstr)
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    has_next_page = 0
    next_page_url_list=[]
    next_page_url = ""
    for item in soup.find_all('a'):
        rawa = str(item)
        if rawa.find('Next')>=0:
            # print(rawa)
            if rawa not in next_page_url_list:
                next_page_url_list.append(rawa)
            has_next_page = 1
    for item in soup.find_all('span'):
        rawstr = str(item)
        if rawstr.find('next_page') >=0:
            # print(item)
            has_next_page = 0
    # print(has_next_page)           
    if has_next_page:
        # print(next_page_url_list)
        next_page_url = str(next_page_url_list[0])
        indexstart = next_page_url.find('href')
        indexend = next_page_url.find('rel')
        next_page_url = "http://github.com"+next_page_url[indexstart+6:indexend-2]
        # print(next_page_url)
        
        
    for item in soup.find_all('a'):
        link = "http://github.com"+str(item['href'])
        if link.find(checkstr)==18 and link.count('/')==6:
            # print(link)
            pinned = str(item['class'])
            if pinned.find('Link')>=0:
                continue
            if link in issuelist:
                continue
            else:
                issuelist.append(link)
                
    while (has_next_page):
        strhtml = requests.get(next_page_url)
        soup = BeautifulSoup(strhtml.text,'lxml')
        has_next_page = 0
        next_page_url_list=[]
        next_page_url=""
        for item in soup.find_all('a'):
            rawa = str(item)
            if rawa.find('Next')>=0:
                # print(rawa)
                if rawa not in next_page_url_list:
                    next_page_url_list.append(rawa)
                has_next_page = 1
        for item in soup.find_all('span'):
            rawstr = str(item)
            if rawstr.find('next_page') >=0:
            # print(item)
                has_next_page = 0
        # print(has_next_page)
        if has_next_page:
            # print(next_page_url_list)
            next_page_url = str(next_page_url_list[0])
            indexstart = next_page_url.find('href')
            indexend = next_page_url.find('rel')
            next_page_url = "http://github.com"+next_page_url[indexstart+6:indexend-2]
            # print(next_page_url)
        for item in soup.find_all('a'):
            link = "http://github.com"+str(item['href'])
            if link.find(checkstr)==18 and link.count('/')==6:
                # print(link)
                pinned = str(item['class'])
                if pinned.find('Link')>=0:
                    continue
                if link in issuelist:
                    continue
                else:
                    issuelist.append(link)
    print(issuelist)      
    print(len(issuelist)) 


def get_closed_issue(rawurl:str):
    issuelist=[]
    url = ""
    if rawurl[-1] == '/':
        url = rawurl + "issues?q=is%3Aissue+is%3Aclosed"
    else:
        url = rawurl +"/issues?q=is%3Aissue+is%3Aclosed"
    indexstart = url.find('com')
    indexend = url.find('issue')
    checkstr = url[indexstart+4:indexend]+"issues"
    print(checkstr)
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    has_next_page = 0
    next_page_url_list=[]
    next_page_url = ""
    for item in soup.find_all('a'):
        rawa = str(item)
        if rawa.find('Next')>=0:
            # print(rawa)
            if rawa not in next_page_url_list:
                next_page_url_list.append(rawa)
            has_next_page = 1
    for item in soup.find_all('span'):
        rawstr = str(item)
        if rawstr.find('next_page') >=0:
            # print(item)
            has_next_page = 0
    # print(has_next_page)           
    if has_next_page:
        # print(next_page_url_list)
        next_page_url = str(next_page_url_list[0])
        indexstart = next_page_url.find('href')
        indexend = next_page_url.find('rel')
        next_page_url = "http://github.com"+next_page_url[indexstart+6:indexend-2]
        # print(next_page_url)
        
        
    for item in soup.find_all('a'):
        link = "http://github.com"+str(item['href'])
        if link.find(checkstr)==18 and link.count('/')==6:
            # print(link)
            pinned = str(item['class'])
            if pinned.find("Link")>=0:
                continue
            if link in issuelist:
                continue
            else:
                issuelist.append(link)
                
    while (has_next_page):
        strhtml = requests.get(next_page_url)
        soup = BeautifulSoup(strhtml.text,'lxml')
        has_next_page = 0
        next_page_url_list=[]
        next_page_url=""
        for item in soup.find_all('a'):
            rawa = str(item)
            if rawa.find('Next')>=0:
                # print(rawa)
                if rawa not in next_page_url_list:
                    next_page_url_list.append(rawa)
                has_next_page = 1
        for item in soup.find_all('span'):
            rawstr = str(item)
            if rawstr.find('next_page') >=0:
            # print(item)
                has_next_page = 0
        # print(has_next_page)
        if has_next_page:
            # print(next_page_url_list)
            next_page_url = str(next_page_url_list[0])
            indexstart = next_page_url.find('href')
            indexend = next_page_url.find('rel')
            next_page_url = "http://github.com"+next_page_url[indexstart+6:indexend-2]
            # print(next_page_url)
        for item in soup.find_all('a'):
            link = "http://github.com"+str(item['href'])
            if link.find(checkstr)==18 and link.count('/')==6:
                # print(link)
                pinned = str(item['class'])
                if pinned.find("Link")>=0:
                    continue
                if link in issuelist:
                    continue
                else:
                    issuelist.append(link)
    print(issuelist)    
    print(len(issuelist))


if __name__ == "__main__":
    url = input()
    get_open_issue(url)
    get_closed_issue(url)
