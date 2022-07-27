def numToShortURL(id):
    map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    shortURL = ""
      
    # for each digit find the base 62
    while(id > 0):
        shortURL += map[id % 62]
        id //= 62
  
    # reversing the shortURL
    return shortURL[len(shortURL): : -1]