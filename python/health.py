import urllib.request
import json
def check(url):
    try:
        with urllib.request.urlopen(url,timeout=5) as response:
            data=json.loads(response.read())
            return response.status==200 and bool(data.get("ok"))
    except Exception as error:
        print("health error:",error)
        return False
def main():
    url="http://localhost:8080/api/health"
    print("OK" if check(url) else "FAILED")
if __name__=="__main__":
    main()
