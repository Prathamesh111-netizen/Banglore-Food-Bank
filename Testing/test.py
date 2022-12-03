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


def testing_workflow():
    # open website
    try:
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(options=options)
        driver.maximize_window()
        driver.get(websiteurl)

        # click on sign in button
        sign_in_button = driver.find_element(By.ID, signinID)
        sign_in_button.click()
        print("-Signup Page opened")

        # #fill signup form
        driver.find_element(By.ID, 'emailinput').send_keys(emailinput)
        driver.find_element(By.ID, 'passwordinput').send_keys(passwordinput)
        driver.find_element(By.ID, test_login).click()
        print("-Sign In form filled")
        time.sleep(3)

        # click on product
        driver.get(websiteurl+"/product/"+productID)
        time.sleep(3)

        driver.find_element(By.ID, "addtocarttest").click()
        time.sleep(2)
        driver.find_element(By.ID, "proceedtodonation").click()

        print("access product page")
        time.sleep(5)
        
        # make payment with razorpay
        driver.switch_to.frame(driver.find_element(
            By.CLASS_NAME, "razorpay-checkout-frame"))
        print("reached")
        driver.find_element(By.ID, "contact").send_keys("9969282159")
        driver.find_element(By.ID, "email").send_keys("you@example.com")
        time.sleep(2)
        driver.find_element(
            By.XPATH, "//*[contains(text(), 'Proceed')]").click()
        print("reached")
        print("-Card payment initiated")
        time.sleep(2)

        driver.find_element(By.XPATH, "//*[@method='card']").click()
        print("-Card payment initiated")
        time.sleep(2)
        driver.find_element(By.NAME, 'card[number]').send_keys(
            "5267 3181 8797 5449")
        driver.find_element(By.NAME, 'card[name]').send_keys(
            "Prathamesh Pawar")
        driver.find_element(By.NAME, 'card[expiry]').send_keys("03/24")
        driver.find_element(By.NAME, 'card[cvv]').send_keys("522")
        print("-Card Details Entered")
        time.sleep(1)
        driver.find_element(
            By.XPATH, "//*[contains(text(), 'Pay Now')]").click()
        # time.sleep(200)
        driver.find_element(
            By.XPATH, "//*[contains(text(), 'Skip saving card')]").click()
        print("-Payment Tested")

        time.sleep(5)
        print(" \n\n\n_______ Test Success ________\n\n\n")

    except:
        print(" \n\n\n_______ Test Failed ________\n\n\n")
        exit()

def account_actions():
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(options=options)
    # driver.maximize_window()
    driver.get(websiteurl)

    # click on sign in button
    sign_in_button = driver.find_element(By.ID, signinID)
    sign_in_button.click()
    print("-Signup Page opened")

    # #fill signup form
    driver.find_element(By.ID, 'emailinput').send_keys(emailinput)
    driver.find_element(By.ID, 'passwordinput').send_keys(passwordinput)
    driver.find_element(By.ID, test_login).click()
    time.sleep(5)
    driver.get(websiteurl+"/profile")
    time.sleep(5)
    
    driver.find_element(By.ID, "downloadasexcel").click()
    time.sleep(5)
    
    driver.get(websiteurl + "/order/6369e84179ccb7002b09c2f7")
    time.sleep(5)
    driver.find_element(By.ID, "gethonourcodecert").click()
    time.sleep(5)
    driver.find_element(By.ID, "downloadhonourcodecert").click()
    time.sleep(10)
    print(" \n\n\n_______ Test Success ________\n\n\n")

# testing_links()
# testing_imgs()
# testing_workflow()
# account_actions()
