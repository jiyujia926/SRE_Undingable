
import requests
from bs4 import BeautifulSoup
from .analyze_pullrequest import combined_operations,open_operations
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
				'Accept-Language': 'zh-CN,zh;q=0.9'}
# headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
# 				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
# 				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
# 				'Accept-Encoding': 'gzip, deflate',
# 				'Cookie': 'BAIDUID=1A6EF88EE4929836C761FB37A1303522:FG=1; BIDUPSID=1A6EF88EE4929836C761FB37A1303522; PSTM=1603199415; H_PS_PSSID=32755_1459_32877_7567_31253_32706_32231_7517_32117_32845_32761_26350; BD_UPN=13314752; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; delPer=0; BD_CK_SAM=1; PSINO=5; H_PS_645EC=e4bcE4275G3zWcvH2pxYG6R32rBxb5yuey8xcioaej8V7IaJRfEq4xp4iCo; COOKIE_SESSION=45294_0_2_5_0_2_0_1_0_2_3_0_0_0_0_0_0_0_1603244844%7C5%230_0_1603244844%7C1; BA_HECTOR=2gal2h2ga58025f1vs1fov5vf0k'}
def get_open_pullrequest(rawurl:str):
    # url = "https://github.com/Bitergia/prosoul/issues"
    pullrequestlist=[]
    oprbag=[]
    url = ""
    if rawurl[-1] == '/':
        url = rawurl + "pulls"
    else:
        url = rawurl +"/pulls"
    indexstart = url.find('com')
    indexend = url.find('pull')
    checkstr = url[indexstart+4:indexend]+"pull"
    print(checkstr)
    strhtml = requests.get(url,headers=headers)
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
            if link.find('#partial')>=0:
                continue
            else:
                pullrequestlist.append(link)
                # print(link)
                oprbag.append(open_operations(link))

                
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
                if link.find('#partial')>=0:
                    continue
                else:
                    pullrequestlist.append(link)
                    # print(link)
                    oprbag.append(open_operations(link))
                    

    # print(pullrequestlist)
    
    print(len(oprbag)) 
    # print(oprbag)
    return oprbag


def get_closed_pullrequest(rawurl:str):
    pullrequestlist=[]
    url = ""
    cprbag=[]
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
            if link.find('#partial')>=0:
                continue
            else:
                pullrequestlist.append(link)
                # print(link)
                cprbag.append(combined_operations(link))
                

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
                if link.find('#partial')>=0:
                    continue
                else:
                    pullrequestlist.append(link)
                    # print(link)
                    cprbag.append(combined_operations(link))
                    

    # print(pullrequestlist)    
    print(len(cprbag))
    return cprbag

if __name__ == "__main__":
    url = input()
    # get_open_pullrequest(url)
    # print(get_open_pullrequest(url))
    get_closed_pullrequest(url)
