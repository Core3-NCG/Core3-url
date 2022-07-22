"""
Constants used in 
the project
"""


from http.client import INTERNAL_SERVER_ERROR, NOT_FOUND


SERVER_URL = "127.0.0.1:5000"

CACHE_EXPIRY = 3600

#STATUS CODES
OK = 200
INTERNAL_SERVER_ERROR = 500
NOT_FOUND = 404
AUTHENTICATION_ERROR = 401
DUPLICATE_ERROR = 409
BAD_REQUEST = 400

# DATABASE CONFIG
HOST="localhost"
USER="root"
PASSWORD="password"
AUTH_PLUGIN='mysql_native_password'
DB_NAME='Tiny_URL'