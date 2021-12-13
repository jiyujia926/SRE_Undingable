import requests
def tryvisit(url:str):
    # url = "https://github.com/jiyujia926/NFTauction"
    strhtml = requests.get(url)
    return strhtml.status_code
