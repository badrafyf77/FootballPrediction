from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import pandas as pd
import numpy as np
import joblib
import requests
import io
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Football Prediction API", description="API for predicting football match outcomes")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now to debug
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# -----------------------------
# Pydantic Models
# -----------------------------
class MatchData(BaseModel):
    homeGD: float
    homeWins: int
    homePlayed: int
    homeRank: int
    lastHome5GamesScore: float
    strHomeTeam: str
    awayGD: float
    awayWins: int
    awayPlayed: int
    awayRank: int
    lastAway5GamesScore: float
    strAwayTeam: str

class PredictionRequest(BaseModel):
    match_data: MatchData

class ProbabilityResponse(BaseModel):
    home: float
    away: float
    draw: float

class ExpectedGoalsResponse(BaseModel):
    home: float
    away: float

class CombinedPredictionResponse(BaseModel):
    score: str
    winner: str
    probability: ProbabilityResponse
    expected_goals: ExpectedGoalsResponse
    both_teams_to_score: bool
    over_under: float

class PredictionResponse(BaseModel):
    combined_prediction: CombinedPredictionResponse

# -----------------------------
# Helper: Load model from GitHub
# -----------------------------
def load_model_from_github(filename):
    base_url = "https://github.com/AymanChabbaki/football-models/raw/refs/heads/main/"
    url = f"{base_url}{filename}"
    response = requests.get(url)
    response.raise_for_status()
    return joblib.load(io.BytesIO(response.content))

# -----------------------------
# Preprocessing helper
# -----------------------------
def create_preprocessor(categorical_features, numerical_features):
    numeric_transformer = Pipeline([
        ('scaler', StandardScaler())
    ])
    categorical_transformer = Pipeline([
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    return ColumnTransformer([
        ('num', numeric_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# -----------------------------
# Load all league models in memory
# -----------------------------
LEAGUE_MODELS = {
    'epl': {
        'winner': {
            'filename': 'epl_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'epl_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },'inwi': {
        'winner': {
            'filename': 'inwi_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'inwi_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },'ligue': {
        'winner': {
            'filename': 'ligue_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'ligue_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },'liga': {
        'winner': {
            'filename': 'liga_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'liga_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },'serie': {
        'winner': {
            'filename': 'serie_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'serie_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },'bundesliga': {
        'winner': {
            'filename': 'bundesliga_winner.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'predictedIntHomeScore', 'predictedResult',
                'awayGD', 'awayWinRate', 'awayClassement', 'predictedIntAwayScore'
            ]
        },
        'goals': {
            'filename': 'bundesliga_goals.pkl',
            'categorical_features': ['strHomeTeam', 'strAwayTeam'],
            'numerical_features': [
                'homeGD', 'homeWinRate', 'homeClassement', 'lastHome5GamesScore',
                'awayGD', 'awayWinRate', 'awayClassement', 'lastAway5GamesScore'
            ]
        }
    },
   
}

# Load models into memory
for league, models in LEAGUE_MODELS.items():
    for model_type, config in models.items():
        config['model'] = load_model_from_github(config['filename'])
        config['preprocessor'] = create_preprocessor(
            config['categorical_features'],
            config['numerical_features']
        )

# -----------------------------
# FastAPI Routes
# -----------------------------
@app.get("/")
async def root():
    return {"message": "Football Prediction API is running!", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is working"}

@app.options("/api/predict")
async def predict_options():
    return {"message": "OK"}

@app.get("/api/predict")
async def predict_get():
    return {
        "error": "Method not allowed", 
        "message": "This endpoint only accepts POST requests. Please send match data in the request body.",
        "expected_format": {
            "match_data": {
                "homeGD": "float",
                "homeWins": "int",
                "homePlayed": "int",
                "homeRank": "int",
                "lastHome5GamesScore": "float",
                "strHomeTeam": "string",
                "awayGD": "float",
                "awayWins": "int",
                "awayPlayed": "int",
                "awayRank": "int",
                "lastAway5GamesScore": "float",
                "strAwayTeam": "string"
            }
        }
    }

@app.options("/")
async def root_options():
    return {"message": "OK"}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        match_data = request.match_data

        # Build DataFrame
        features = {
            'homeGD': [match_data.homeGD],
            'homeWinRate': [match_data.homeWins / match_data.homePlayed],
            'homeClassement': [match_data.homeRank],
            'lastHome5GamesScore': [match_data.lastHome5GamesScore],
            'strHomeTeam': [match_data.strHomeTeam],
            'awayGD': [match_data.awayGD],
            'awayWinRate': [match_data.awayWins / match_data.awayPlayed],
            'awayClassement': [match_data.awayRank],
            'lastAway5GamesScore': [match_data.lastAway5GamesScore],
            'strAwayTeam': [match_data.strAwayTeam]
        }
        match_df = pd.DataFrame(features)

        # Regression (goals)
        X_home = match_df[['homeGD','homeWinRate','homeClassement','lastHome5GamesScore','strHomeTeam']]
        X_away = match_df[['awayGD','awayWinRate','awayClassement','lastAway5GamesScore','strAwayTeam']]
        X_full = X_home.join(X_away)
        regression_pred = LEAGUE_MODELS['epl']['goals']['model'].predict(X_full)
        match_df['predictedIntHomeScore'] = regression_pred[:,0]
        match_df['predictedIntAwayScore'] = regression_pred[:,1]

        # Predicted result
        match_df['predictedResult'] = match_df.apply(
            lambda row: 2 if row['predictedIntHomeScore']>row['predictedIntAwayScore'] 
                        else 0 if row['predictedIntHomeScore']<row['predictedIntAwayScore'] 
                        else 1,
            axis=1
        )

        # Classification
        X_class = match_df[['homeGD','homeWinRate','homeClassement','predictedIntHomeScore','predictedResult',
                            'awayGD','awayWinRate','awayClassement','predictedIntAwayScore']]

        total_goals = match_df['predictedIntHomeScore'].values[0] + match_df['predictedIntAwayScore'].values[0]
        home_proba = (match_df['predictedIntHomeScore'].values[0]/total_goals*100) if total_goals>0 else 33.3
        away_proba = (match_df['predictedIntAwayScore'].values[0]/total_goals*100) if total_goals>0 else 33.3

        winner_pred = LEAGUE_MODELS['epl']['winner']['model'].predict(X_class)[0]
        home_goals = float(match_df['predictedIntHomeScore'].values[0])
        away_goals = float(match_df['predictedIntAwayScore'].values[0])
        winner = ['away','draw','home'][winner_pred]

        # Probabilities with classifier
        if hasattr(LEAGUE_MODELS['epl']['winner']['model'],'predict_proba'):
            class_probs = LEAGUE_MODELS['epl']['winner']['model'].predict_proba(X_class)[0]
            away_proba_class, draw_proba, home_proba_class = [p*100 for p in class_probs]
            home_proba = round(home_proba*0.3 + home_proba_class*0.7,1)
            away_proba = round(away_proba*0.3 + away_proba_class*0.7,1)
            draw_proba = round(draw_proba,1)
        else:
            draw_proba = 100 - home_proba - away_proba
            if draw_proba<0:
                total = home_proba + away_proba
                home_proba = round(home_proba/total*100,1)
                away_proba = round(away_proba/total*100,1)
                draw_proba = 0

        # Final rounding
        total = home_proba + away_proba + draw_proba
        if total!=100:
            diff = 100 - total
            if home_proba>=away_proba and home_proba>=draw_proba:
                home_proba += diff
            elif away_proba>=home_proba and away_proba>=draw_proba:
                away_proba += diff
            else:
                draw_proba += diff

        return PredictionResponse(
            combined_prediction=CombinedPredictionResponse(
                score=f"{home_goals:.1f}-{away_goals:.1f}",
                winner=winner,
                probability=ProbabilityResponse(
                    home=home_proba,
                    away=away_proba,
                    draw=draw_proba
                ),
                expected_goals=ExpectedGoalsResponse(
                    home=home_goals,
                    away=away_goals
                ),
                both_teams_to_score=bool(home_goals>=1 and away_goals>=1),
                over_under=round(home_goals + away_goals,1)
            )
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
