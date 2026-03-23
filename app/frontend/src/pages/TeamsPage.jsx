import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TeamsList from "@/components/TeamsList";
import BuildVersion from "@/components/BuildVersion";

const TeamsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const league = state?.league;

  useEffect(() => {
    if (!league) navigate("/leagues", { replace: true });
  }, [league, navigate]);

  if (!league) return null;

  return (
    <div>
      <TeamsList
        league={league}
        onSelectTeams={(homeTeam, awayTeam) =>
          navigate("/prediction", { state: { league, homeTeam, awayTeam } })
        }
        onBack={() => navigate("/leagues")}
      />
      <BuildVersion />
    </div>
  );
};

export default TeamsPage;
