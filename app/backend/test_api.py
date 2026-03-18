from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_predict():
    response = client.post("/api/predict", json={
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
    })
    assert response.status_code == 200