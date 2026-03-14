import requests
import json

# Test data for the API
test_data = {
    "match_data": {
        "homeGD": 5.0,
        "homeWins": 15,
        "homePlayed": 20,
        "homeRank": 3,
        "lastHome5GamesScore": 8.5,
        "strHomeTeam": "Manchester City",
        "awayGD": 2.0,
        "awayWins": 12,
        "awayPlayed": 20,
        "awayRank": 7,
        "lastAway5GamesScore": 6.2,
        "strAwayTeam": "Arsenal"
    }
}

# Test the API locally
try:
    response = requests.post(
        "http://localhost:7860/api/predict",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ API Test Successful!")
        print(json.dumps(result, indent=2))
    else:
        print(f"❌ API Test Failed with status code: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to the API. Make sure it's running on localhost:7860")
except Exception as e:
    print(f"❌ Error: {e}")