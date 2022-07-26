import unittest
from unittest import mock
import sys
sys.path.insert(1,'../src')
from app import app
import service
import json
import constants
import db_url as db

class testShortenUrl(unittest.TestCase):

    @mock.patch('service.buildShortURL', return_value= ('http://127.0.0.1:5000/AsvVCh',200))
    #check for response code 200
    def test_shortenUrl1(self, mock_check_output):
        print("Started test test_shortenUrl1")
        tester = app.test_client(self)
        response = tester.get("/shortenUrl?user=Om&url=https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)
        assert b"http://127.0.0.1:5000/AsvVCh" in response.data
        print("Successfully Passed Test")

        
    @mock.patch('service.buildShortURL', return_value= ('',400))
    # check for response code 400 when no user
    def test_shortenUrl3(self, mock_check_output):
        print("Started test test_shortenUrl3")
        tester = app.test_client(self)
        response = tester.get("/shortenUrl?url=https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success")
        statuscode = response.status_code
        self.assertEqual(statuscode, 400)
        print("Successfully Passed Test")

class testRedirectUrl(unittest.TestCase):

    @mock.patch('service.getLongUrl', return_value= ("https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success"))
    # check forlong url retrieved
    def test_redirectUrl1(self, mock_check_output):
        print("Started test test_redirectUrl1")
        tester = app.test_client(self)
        response = tester.get("/AsvVCh")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, "https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success")
        print("Successfully Passed Test")

    @mock.patch('service.getLongUrl', return_value= ("Page Not Found",404))
    # check for response code 404 when Long URL not foung to redirect to
    def test_redirectUrl2(self, mock_check_output):
        print("Started test test_redirectUrl2")
        tester = app.test_client(self)
        response = tester.get("/jgnYRv")
        self.assertEqual(response.status_code, 404)
        assert b'Page Not Found' in response.data
        print("Successfully Passed Test")

class testMyUrls(unittest.TestCase):

    @mock.patch('service.getUrlList', return_value= [])
    # check for response code 400 when user parameter missing
    def test_myUrls1(self, mock_check_output):
        print("Started test test_myUrls1")
        tester = app.test_client(self)
        response = tester.get("/myUrls")
        self.assertEqual(response.status_code, 400)
        assert b"user parameter required" in response.data
        print("Successfully Passed Test")

    @mock.patch('service.getUrlList', return_value= {"shortenedUrlKey": {"daysLeft": 3,"originalUrl": "longUrlValue"}})
    # check for retrieved list of Urls
    def test_myUrls2(self, mock_check_output):
        print("Started test test_myUrls3")
        tester = app.test_client(self)
        response = tester.get("/myUrls?user=absethi")
        assert b'{"shortenedUrlKey":{"daysLeft":3,"originalUrl":"longUrlValue"}}\n' in response.data
        print("Successfully Passed Test")

    @mock.patch('service.getUrlList', return_value= ("Something went wrong, try again later",500))
    # check for Internal Server Error text when Database is not connected
    def test_myUrls3(self, mock_check_output):
        print("Started test test_myUrls4")
        tester = app.test_client(self)
        response = tester.get("/myUrls?user=absethi")
        assert b'Something went wrong, try again later' in response.data
        print("Successfully Passed Test")

class testRegister(unittest.TestCase):

    @mock.patch('service.registerUser', return_value= ("Registered User Name",200))
    # check for response code 200 on successful registration
    def test_registerUser1(self, mock_check_output):
        print("Started test test_registerUser1")
        tester = app.test_client(self)
        response = tester.post("/register", data=json.dumps(dict(userName="data1", password="test@123")), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        assert b'Registered User Name' in response.data
        print("Successfully Passed Test")

    @mock.patch('service.registerUser', return_value= ("User already exists",409))
    # check for response code 409 when User already exists
    def test_registerUser3(self, mock_check_output):
        print("Started test test_registerUser3")
        tester = app.test_client(self)
        response = tester.post("/register", data=json.dumps(dict(userName="data1", password="test@123")), content_type='application/json')
        self.assertEqual(response.status_code, 409)
        assert b'User already exists' in response.data
        print("Successfully Passed Test")

    @mock.patch('service.registerUser', return_value= ("Something went wrong, try again later",500))
    # check for response code 500 due to some error
    def test_registerUser5(self, mock_check_output):
        print("Started test test_registerUser5")
        tester = app.test_client(self)
        response = tester.post("/register", data=json.dumps(dict(userName="data1", password="test@123")), content_type='application/json')
        self.assertEqual(response.status_code,500)
        assert b'Something went wrong, try again later' in response.data
        print("Successfully Passed Test")

    @mock.patch('db_url.register_user', return_value= (constants.OK))
    def test_register(self, mock_check_output):
        print("Started test test_registerUser6")
        self.assertEqual((service.registerUser("aditi","dora")),("Registered User "+"aditi",constants.OK))

    @mock.patch('db_url.register_user', return_value= (constants.DUPLICATE_ERROR))    
    def test_register1(self, mock_check_output):
        print("Started test test_registerUser7")
        self.assertEqual((service.registerUser("aditi","dora")),("User already exists",constants.DUPLICATE_ERROR))

class testLogin(unittest.TestCase):

    @mock.patch('service.loginUser', return_value= ("Login Successful",200))
    # check for response code 200 on successful login
    def test_login1(self, mock_check_output):
        print("Started test test_login1")
        tester = app.test_client(self)
        response = tester.post("/login", data=json.dumps(dict(userName="data1", password="test@123")), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        assert b'Login Successful' in response.data
        print("Successfully Passed Test")

    @mock.patch('service.loginUser', return_value= ("Wrong credentials, login failed",401))
    # check for response code 401 when login fails
    def test_login3(self, mock_check_output):
        print("Started test test_login3")
        tester = app.test_client(self)
        response = tester.post("/login", data=json.dumps(dict(userName="data2", password="test@1234")), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        assert b'Wrong credentials, login failed' in response.data
        print("Successfully Passed Test")
    
    @mock.patch('service.loginUser', return_value= ("Something went wrong, try again later",500))
    # check for response code 500 due to some error
    def test_login5(self, mock_check_output):
        print("Started test test_login5")
        tester = app.test_client(self)
        response = tester.post("/login", data=json.dumps(dict(userName="data2", password="test@1243")), content_type='application/json')
        self.assertEqual(response.status_code,500)
        assert b'Something went wrong, try again later' in response.data
        print("Successfully Passed Test")

if __name__ == '__main__':
    unittest.main()