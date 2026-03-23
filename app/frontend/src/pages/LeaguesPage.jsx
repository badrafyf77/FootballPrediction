import { useNavigate } from "react-router-dom";
import LeaguesList from "@/components/LeaguesList";

const LeaguesPage = () => {
  const navigate = useNavigate();

  return (
    <LeaguesList
      onSelectLeague={(league) => navigate("/teams", { state: { league } })}
      onBack={() => navigate("/")}
    />
  );
};

export default LeaguesPage;
