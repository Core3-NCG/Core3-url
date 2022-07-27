# Core3-url

## Steps to setup the environment:-
```
sh setup.sh
sudo source venv/bin/activate
pip3 install -r requirements.txt
brew install redis
redis-server
```

### Fill in the MySQL Database credentials in the "src/constants.py" file


## Run the application:-
```
python3 src/app.py
```

## Run the tests:-
```
cd test
coverage run test_api.py
coverage run -a test_encode.py
coverage run -a test_service.py
coverage report
```