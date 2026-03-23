import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LeaguesPage from "./pages/LeaguesPage";
import TeamsPage from "./pages/TeamsPage";
import PredictionPage from "./pages/PredictionPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/leagues" element={<LeaguesPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/prediction" element={<PredictionPage />} />
    </Routes>
  );
};

export default App;
