from bs4 import BeautifulSoup
import requests

def checkUrl(url):
    try:
        strhtml = requests.get(url=url)
        print('爬取成功')
        return [True, strhtml.text]
    except:
        print('爬取失败')
        return [False, ""]


def parseHtml(doc):
    soup = BeautifulSoup(doc, 'lxml')
    desc = soup.find(name='p', attrs={"class": "f4 my-3"})
    if (desc):
        description = desc.get_text()
        print(description)
    else:
        print("亲亲，该仓库暂时没有项目简介噢~")

def main():
    # test repo: https://github.com/Wuxinberry/Java-Projects
    # get user input
    url = input("Please enter a github repo address: ")
    # check validation
    valid = checkUrl(url)
    if (valid[0] == False):
        return "亲亲，这边找不到您输入的仓库地址呢~"
    # parse url ans store result
    parseHtml(valid[1])

if __name__ == "__main__":
    main()
