import requests
from bs4 import BeautifulSoup

def get_issue():
    url = "https://github.com/Bitergia/prosoul/issues"
    issuelist=[]
    indexstart = url.find('com')
    checkstr = "/"+url[indexstart+4:]+"/"
    print(checkstr)
    strhtml = requests.get(url)
    soup = BeautifulSoup(strhtml.text,'lxml')
    for item in soup.find_all('a'):
        link = str(item['href'])
        if link.find(checkstr)==0 and link.count('/')==4:
            # print(link)
            if link in issuelist:
                continue
            else:
                issuelist.append(link)
    print(issuelist)      
    print(len(issuelist))  
if __name__ == "__main__":
    # url = input()
    get_issue()
