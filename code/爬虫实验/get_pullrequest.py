
import requests
from bs4 import BeautifulSoup
from analyze_pullrequest import combined_operations

def get_open_pullrequest(rawurl:str):
    # url = "https://github.com/Bitergia/prosoul/issues"
    pullrequestlist=[]
    url = ""
    if rawurl[-1] == '/':
        url = rawurl + "pulls"
    else:
        url = rawurl +"/pulls"
    indexstart = url.find('com')
    indexend = url.find('pull')
    checkstr = url[indexstart+4:indexend]+"pull"
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
        # print(item)
        link = "http://github.com"+str(item['href'])
        # print(link)
        if link.find(checkstr)==18 and link.count('/')==6:
            # print(link)
            pinned = str(item['class'])
            if pinned.find('color')>=0 or pinned.find('Link')>=0:
                continue
            if link in pullrequestlist:
                continue
            else:
                pullrequestlist.append(link)
                combined_operations(link)

                
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
                if pinned.find('color')>=0 or pinned.find('Link')>=0:
                    continue
                if link in pullrequestlist:
                    continue
                else:
                    pullrequestlist.append(link)
                    combined_operations(link)
                    

    # print(pullrequestlist)      
    print(len(pullrequestlist)) 


def get_closed_pullrequest(rawurl:str):
    pullrequestlist=[]
    url = ""
    if rawurl[-1] == '/':
        url = rawurl + "pulls?q=is%3Aissue+is%3Aclosed"
    else:
        url = rawurl +"/pulls?q=is%3Aissue+is%3Aclosed"
    indexstart = url.find('com')
    indexend = url.find('pull')
    checkstr = url[indexstart+4:indexend]+"pull"
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
            if pinned.find("color")>=0 or pinned.find('Link')>=0:
                continue
            if link in pullrequestlist:
                continue
            else:
                pullrequestlist.append(link)
                combined_operations(link)
                

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
                if pinned.find("color")>=0 or pinned.find('Link')>=0:
                    continue
                if link in pullrequestlist:
                    continue
                else:
                    pullrequestlist.append(link)
                    combined_operations(link)
                    

    # print(pullrequestlist)    
    print(len(pullrequestlist))


if __name__ == "__main__":
    url = input()
    get_open_pullrequest(url)
    get_closed_pullrequest(url)
