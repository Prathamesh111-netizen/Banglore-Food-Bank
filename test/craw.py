from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup

HEADERS = ({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) \AppleWebKit/537.36 (KHTML, like Gecko) \
Chrome/90.0.4430.212 Safari/537.36',
            'Accept-Language': 'en-US, en;q=0.5'})


def getdata(url):
    r = requests.get(url, headers=HEADERS)
    return r.text


def html_code(url):
    htmldata = getdata(url)
    soup = BeautifulSoup(htmldata, 'html.parser')
    return (soup)


def cus_data(soup):
    data_str = ""
    cus_list = []

    for item in soup.find_all("li", class_="src_lst-li"):
        data_str = data_str + item.get_text()
        cus_list.append(data_str)
        data_str = ""
    return cus_list


def get_database():

    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb+srv://Prathamesh:pratham1109@cluster0.kgmherw.mongodb.net/?retryWrites=true&w=majority"

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)

    return client['test']


if __name__ == "__main__":
    url = "https://www.ndtv.com/topic/food-donation"
    print("url = ", url)
    soup = html_code(url)
    print("html processed")
    cus_res = cus_data(soup)
    print("formatted html code")
    dbname = get_database()
    craw = dbname["craw"]

    print("storing data items into mongoDB database")

    for x in cus_res:
        all = x.split("|")
        obj = {
            "title": ' '.join(all[0].split()),
            "news": ' '.join(all[len(all) - 1].split())
        }
        print()
        for y in obj:
            print(y, ':', obj[y])
        print()
        craw.insert_one(obj)
