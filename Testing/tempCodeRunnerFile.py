import PIL as Image
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options


websiteurl = "http://localhost:3000"
signinID = "test-sign-in"
emailinput = "prathamesh.rjpawar@gmail.com"
passwordinput = "pratham1109"
test_login = "test-login"

productID = "6369eb9ceb83562a689f28a5"


def testing_links():
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(options=options)
    driver.get('http://localhost:3000/')
    links = driver.find_elements(By.CSS_SELECTOR, 'a')

    print("Testing links...")
    start = time.time()

    working_links = 0
    bad_links = 0
    bad_links_list = []
    for link in links:
        r = requests.head(link.get_attribute('href'))
        if r.status_code != 400:
            working_links += 1
        else:
            bad_links += 1
            bad_links_list.append((link.get_attribute('href'),
                                   r.status_code))
    context = {"working_links": working_links,
               "bad_links_list": bad_links_list, "bad_links": bad_links,
               "links_len": len(links), "time_links": round((time.time() - start), 3)}
    print(context)
    return context


def testing_imgs():
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(options=options)
    driver.get('http://localhost:3000/')
    links = driver.find_elements(By.CSS_SELECTOR, 'img')

    print("Testing Images...")
    start = time.time()

    working_links = 0
    bad_links = 0
    bad_links_list = []
    for link in links:
        r = requests.head(link.get_attribute('src'))
        if r.status_code != 400:
            working_links += 1
        else:
            bad_links += 1
            bad_links_list.append((link.get_attribute('href'),
                                   r.status_code))
    context = {"working_images": working_links,
               "bad_images_list": bad_links_list, "bad_images": bad_links,
               "links_len": len(links), "time_images": round((time.time() - start), 3)}
    print(context)
    print(" \n\n\n_______ Test Success ________\n\n\n")
    return context


testing_links()
testing_imgs()
