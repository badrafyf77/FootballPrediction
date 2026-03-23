import { useNavigate } from "react-router-dom";
import LeaguesList from "@/components/LeaguesList";
import BuildVersion from "@/components/BuildVersion";

const LeaguesPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <LeaguesList
        onSelectLeague={(league) => navigate("/teams", { state: { league } })}
        onBack={() => navigate("/")}
      />
      <BuildVersion />
    </div>
  );
};

export default LeaguesPage;
