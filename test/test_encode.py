import unittest
import sys
sys.path.insert(1,'../src')
import encode

class testEncoding(unittest.TestCase):
    def test_numTobase62(self):
        result = encode.numToShortURL(125)
        self.assertEqual(result,'cb')

if __name__ == '__main__':
    unittest.main()