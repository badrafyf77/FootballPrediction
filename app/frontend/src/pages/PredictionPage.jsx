import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PredictionResult from "@/components/PredictionResult";
import BuildVersion from "@/components/BuildVersion";

const PredictionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { league, homeTeam, awayTeam } = state ?? {};

  useEffect(() => {
    if (!league || !homeTeam || !awayTeam)
      navigate("/leagues", { replace: true });
  }, [league, homeTeam, awayTeam, navigate]);

  if (!league || !homeTeam || !awayTeam) return null;

  return (
    <div>
      <PredictionResult
        league={league}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        onBack={() => navigate("/teams", { state: { league } })}
      />
      <BuildVersion />
    </div>
  );
};

export default PredictionPage;
