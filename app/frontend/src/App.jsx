import LeaguesList from '/component/LeaguesList';
import TeamsList from '/component/TeamsList';
import PredictionResult from '/component/PredictionResult';
import './common.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Zap, Trophy } from "lucide-react";

const LandingPage = ({ onStart }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  const texts = [
    "AI-Powered Football Predictions",
    "Accurate Match Forecasting",
    "Data-Driven Insights",
    "Your Winning Strategy Starts Here"
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setFade(true);
      }, 1000);
    }, 3000);

    return () => clearInterval(textInterval);
  }, [texts.length]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="football-image-container">
          <img 
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Football stadium" 
            className="football-image"
          />
          <div className="image-overlay"></div>
        </div>
        
        <div className="landing-text">
          <h1 className={`main-title ${fade ? 'fade-in' : 'fade-out'}`}>
            {texts[currentTextIndex]}
          </h1>
          <p className="subtitle">
            Harness the power of advanced artificial intelligence to predict football match outcomes with unprecedented accuracy. Get real-time analysis, probability insights, and winning strategies.
          </p>
          
          {/* Feature Highlights */}
          <div className="feature-highlights">
            <div className="feature-item">
              <Target className="feature-icon" size={24} strokeWidth={2.5} />
              <span className="feature-text">95% Accuracy</span>
            </div>
            <div className="feature-item">
              <Zap className="feature-icon" size={24} strokeWidth={2.5} />
              <span className="feature-text">Real-Time Data</span>
            </div>
            <div className="feature-item">
              <Trophy className="feature-icon" size={24} strokeWidth={2.5} />
              <span className="feature-text">Top Leagues</span>
            </div>
          </div>
          
          <button className="start-button" onClick={onStart}>
            Start Predicting Now
          </button>
          
          {/* Stats Preview */}
          <div className="stats-preview">
            <div className="stat-box">
              <div className="stat-number">6</div>
              <div className="stat-label">Leagues</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">100+</div>
              <div className="stat-label">Teams</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Predictions</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <svg style={{
          display: 'block',
          margin: '0 auto'
        }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      
  
    </div>
  );
};

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState('leagues');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState({ home: null, away: null });
  const [prediction, setPrediction] = useState(null);

  const handleStart = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }


  // ... rest of your existing App component code ...
  const handleSelectLeague = (league) => {
    setSelectedLeague(league);
    setView('teams');
  };

  const handleSelectTeams = (homeTeam, awayTeam) => {
    setSelectedTeams({ home: homeTeam, away: awayTeam });
    setView('prediction');
    generatePrediction(homeTeam, awayTeam);
  };

  const generatePrediction = async (homeTeam, awayTeam) => {
    // Simulate API call to get prediction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock prediction data - replace with actual API call
    const mockPrediction = {
      homeScore: Math.floor(Math.random() * 4),
      awayScore: Math.floor(Math.random() * 3),
      winner: Math.random() > 0.6 ? 'home' : (Math.random() > 0.3 ? 'away' : 'draw'),
      probability: {
        home: Math.floor(Math.random() * 40) + 30,
        draw: Math.floor(Math.random() * 30) + 10,
        away: 100 - (Math.floor(Math.random() * 40) + 30) - (Math.floor(Math.random() * 30) + 10)
      },
      expectedGoals: {
        home: (Math.random() * 3).toFixed(2),
        away: (Math.random() * 2).toFixed(2)
      },
      bothTeamsToScore: Math.random() > 0.5,
      overUnder: (Math.random() * 2) + 1.5
    };
    
    setPrediction(mockPrediction);
  };

  const handleBackToLeagues = () => {
    setSelectedLeague(null);
    setView('leagues');
  };

  const handleBackToTeams = () => {
    setPrediction(null);
    setView('teams');
  };

  // ... rest of your component logic ...

  return (
    <div className="app-container">
      <div className="container">
        <header className="header">
          <h1>Football Match Predictor</h1>
          <p>AI-powered match predictions for top football leagues</p>
        </header>

        {view === 'leagues' && <LeaguesList onSelectLeague={handleSelectLeague} onBack={() => setShowLanding(true)} />}
        {view === 'teams' && (
          <TeamsList 
            league={selectedLeague} 
            onSelectTeams={handleSelectTeams} 
            onBack={handleBackToLeagues}
          />
        )}
        {view === 'prediction' && (
          <PredictionResult 
            league={selectedLeague}
            homeTeam={selectedTeams.home}
            awayTeam={selectedTeams.away}
            prediction={prediction}
            onBack={handleBackToTeams}
          />
        )}
      </div>

    </div>
  );
};

export default App;
