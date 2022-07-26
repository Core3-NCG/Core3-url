import unittest
from unittest import mock
import sys
sys.path.insert(1,'../src')
import service
import db_url as db
import constants
import json


class testBuildShortUrl(unittest.TestCase):
    @mock.patch('db_url.check_if_user_exists', return_value= (constants.BAD_REQUEST))
    def test_BuildShortUrl(self, mock_test_output):
        print("Started test test_BuildShortUrl check_user_exists1")
        self.assertEqual(service.buildShortURL("https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success","02132004","user1"),
        ("User does not exist",constants.BAD_REQUEST));


class testGetLongUrl(unittest.TestCase):  
    @mock.patch('db_url.get_longurl', return_value= ("/shortenUrl?user=Om&url=https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success", constants.OK))
    def test_getLongUrl(self, mock_test_output):
        print("Started test test_getLongUrl")
        self.assertEqual(service.getLongUrl('http://127.0.0.1:5000/AsvVCh'), "/shortenUrl?user=Om&url=https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success")
    
    @mock.patch('db_url.get_longurl', return_value= ("", constants.INTERNAL_SERVER_ERROR))
    def test_getLongUrl1(self, mock_test_output):
            print("Started test test_getLongUrl1")
            self.assertEqual(service.getLongUrl('http://127.0.0.1:5000/AsvVCZ'), ("Something went wrong, try again later ",constants.INTERNAL_SERVER_ERROR))

class testGetUrl(unittest.TestCase):

    @mock.patch('db_url.check_if_user_exists', return_value= (constants.BAD_REQUEST))
    def test_getUrlList(self, mock_test_output):
        print("Started test test_getUrlList check_user_exists1")
        self.assertEqual(service.getUrlList("user1"), ("User does not exist",constants.BAD_REQUEST))

    @mock.patch('db_url.check_if_user_exists', return_value= (constants.INTERNAL_SERVER_ERROR))
    def test_getUrlList1(self, mock_test_output):
        print("Started test test_getUrlList check_user_exists2")
        self.assertEqual(service.getUrlList("user2"),("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR)) 


class testRegister(unittest.TestCase):


    # @mock.patch('db.check_if_user_exists', return_value= (constants.OK)
    # def test_shortenUrlService1(self):
    #     print("Started test test_shortenUrl4")
    #     tester = app.test_client(self)
    #     response = tester.get("/shortenUrl?user=nouser&url=https://vmware.zoom.us/j/98419544431?pwd=WXdTNkdLZDNXZ0IrUjZNNDNVRTFxdz09#success")
    #     statuscode = response.status_code
    #     self.assertEqual(statuscode, 400)
    #     #assert b"http://127.0.0.1:5000/AsvVCh" in response.data
    #     print("Successfully Passed Test")


    @mock.patch('db_url.register_user', return_value= (constants.OK))
    def test_register(self, mock_check_output):
        print("Started test test_registerUser")
        self.assertEqual((service.registerUser("aditi","dora")),("Registered User "+"aditi",constants.OK))

    @mock.patch('db_url.register_user', return_value= (constants.DUPLICATE_ERROR))    
    def test_register1(self, mock_check_output):
        print("Started test test_registerUser1")
        self.assertEqual((service.registerUser("aditi","dora")),("User already exists",constants.DUPLICATE_ERROR))

    @mock.patch('db_url.register_user', return_value= (constants.INTERNAL_SERVER_ERROR))    
    def test_register2(self, mock_check_output):
        print("Started test test_registerUser2")
        self.assertEqual((service.registerUser("dora","aditi")),("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR))    


class testLogin(unittest.TestCase): 

    @mock.patch('db_url.login_verification', return_value= (constants.OK))
    def test_login1(self, mock_check_output):
        print("Started test test_loginUser1")
        self.assertEqual((service.loginUser("aditi","dora")),("Login Successful",constants.OK))

    @mock.patch('db_url.login_verification', return_value= (constants.AUTHENTICATION_ERROR))
    def test_login2(self, mock_check_output):
        print("Started test test_loginUser2")
        self.assertEqual((service.loginUser("testUser","test123")),("Wrong credentials, login failed",constants.AUTHENTICATION_ERROR)) 

    @mock.patch('db_url.login_verification', return_value= (constants.INTERNAL_SERVER_ERROR))
    def test_login3(self, mock_check_output):
        print("Started test test_loginUser3")
        self.assertEqual((service.loginUser("testUser1","test124")),("Something went wrong, try again later",constants.INTERNAL_SERVER_ERROR))




if __name__ == '__main__':
    unittest.main()      