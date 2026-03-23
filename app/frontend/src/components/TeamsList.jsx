import React, { useState, useEffect } from "react";
import axios from "axios";
import logos from "../assets/wac1.png";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";

const leagueNameMap = {
  "English Premier League": "English Premier League",
  "La Liga": "Spanish La Liga",
  Bundesliga: "German Bundesliga",
  "Serie A": "Italian Serie A",
  "Ligue 1": "French Ligue 1",
  "Botola Pro": "Moroccan Championship",
};

const getMockTeamsForLeague = (leagueName) => {
  const mockTeamsMap = {
    "English Premier League": [
      { team: { id: "133604", name: "Arsenal",          logo: "https://www.thesportsdb.com/images/media/team/badge/xtwxyt1421431860.png" } },
      { team: { id: "133602", name: "Chelsea",          logo: "https://www.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png" } },
      { team: { id: "133601", name: "Liverpool",        logo: "https://www.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png" } },
      { team: { id: "133610", name: "Manchester City",  logo: "https://www.thesportsdb.com/images/media/team/badge/qttvpr1448813355.png" } },
      { team: { id: "133612", name: "Manchester United",logo: "https://www.thesportsdb.com/images/media/team/badge/trwqyw1448813215.png" } },
    ],
    "La Liga": [
      { team: { id: "133738", name: "Barcelona",      logo: "https://www.thesportsdb.com/images/media/team/badge/xxvryt1448813219.png" } },
      { team: { id: "133739", name: "Real Madrid",    logo: "https://www.thesportsdb.com/images/media/team/badge/qzqkst1448813215.png" } },
      { team: { id: "133740", name: "Atletico Madrid",logo: "https://www.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png" } },
      { team: { id: "133741", name: "Sevilla",        logo: "https://www.thesportsdb.com/images/media/team/badge/rrrrtt1448813215.png" } },
      { team: { id: "133742", name: "Valencia",       logo: "https://www.thesportsdb.com/images/media/team/badge/tyttyy1448813215.png" } },
    ],
    Bundesliga: [
      { team: { id: "133674", name: "Bayern Munich",     logo: "https://www.thesportsdb.com/images/media/team/badge/xxvryt1448813219.png" } },
      { team: { id: "133675", name: "Borussia Dortmund", logo: "https://www.thesportsdb.com/images/media/team/badge/qzqkst1448813215.png" } },
    ],
    "Serie A": [
      { team: { id: "133602", name: "Juventus", logo: "https://www.thesportsdb.com/images/media/team/badge/xxvryt1448813219.png" } },
      { team: { id: "133603", name: "AC Milan",  logo: "https://www.thesportsdb.com/images/media/team/badge/qzqkst1448813215.png" } },
    ],
    "Ligue 1": [
      { team: { id: "133613", name: "PSG",       logo: "https://www.thesportsdb.com/images/media/team/badge/xxvryt1448813219.png" } },
      { team: { id: "133614", name: "Marseille", logo: "https://www.thesportsdb.com/images/media/team/badge/qzqkst1448813215.png" } },
    ],
    "Moroccan League": [
      { team: { id: "136157", name: "Wydad Casablanca", logo: "https://www.thesportsdb.com/images/media/team/badge/wydad.png" } },
      { team: { id: "136158", name: "Raja Casablanca",  logo: "https://www.thesportsdb.com/images/media/team/badge/raja.png"  } },
      { team: { id: "136159", name: "AS FAR",           logo: "https://www.thesportsdb.com/images/media/team/badge/far.png"   } },
    ],
  };
  return mockTeamsMap[leagueName] ?? [
    { team: { id: "1", name: "Team 1", logo: "https://via.placeholder.com/150" } },
    { team: { id: "2", name: "Team 2", logo: "https://via.placeholder.com/150" } },
  ];
};

/* ── Skeleton card ────────────────────────────────────────── */
const SkeletonTeamCard = () => (
  <Card className="bg-white/[0.03] border border-white/[0.07] animate-pulse">
    <CardContent className="flex flex-col items-center py-8 gap-4">
      <div className="w-[80px] h-[80px] rounded-full bg-white/10" />
      <div className="h-3.5 w-28 rounded-md bg-white/10" />
    </CardContent>
  </Card>
);

/* ── Matchup banner ───────────────────────────────────────── */
const TeamSlot = ({ team, role, colorClass }) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <Badge
      className={`text-[10px] font-black uppercase tracking-wider border-none ${colorClass}`}
    >
      {role}
    </Badge>
    {team ? (
      <>
        <img
          src={team.logo || "https://via.placeholder.com/150"}
          alt={team.name}
          className="w-14 h-14 object-contain"
          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
        />
        <p className="text-white font-semibold text-sm text-center leading-tight">{team.name}</p>
      </>
    ) : (
      <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center">
        <span className="text-white/25 text-lg font-bold">?</span>
      </div>
    )}
  </div>
);

/* ── Main component ───────────────────────────────────────── */
const TeamsList = ({ league, onSelectTeams, onBack }) => {
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        const leagueName = leagueNameMap[league.name];
        if (!leagueName) throw new Error("League not supported");

        const response = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(leagueName)}`
        );
        if (!response.data?.teams) throw new Error("No teams data received");

        const formattedTeams = response.data.teams.map((team) => ({
          team: {
            id:          team.idTeam,
            name:        team.strTeam,
            logo:        team.strTeam === "Wydad Casablanca" ? logos : team.strBadge,
            stadium:     team.strStadium,
            country:     team.strCountry,
            description: team.strDescriptionEN,
            founded:     team.intFormedYear,
            jersey:      team.strEquipment,
          },
        }));
        setTeams(formattedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Could not load teams from API — showing fallback data.");
        setTeams(getMockTeamsForLeague(league.name));
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [league]);

  const handleTeamSelect = (team) => {
    if (!homeTeam)                              setHomeTeam(team);
    else if (!awayTeam && team.id !== homeTeam.id) setAwayTeam(team);
    else if (team.id === homeTeam.id)           setHomeTeam(null);
    else if (awayTeam && team.id === awayTeam.id) setAwayTeam(null);
  };

  const isSelected = (team) =>
    (homeTeam && team.id === homeTeam.id) ||
    (awayTeam && team.id === awayTeam.id);

  const handleSubmit = () => {
    if (homeTeam && awayTeam) onSelectTeams(homeTeam, awayTeam);
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">

        <Breadcrumb
          items={[
            { label: "Home",    href: "/"       },
            { label: "Leagues", href: "/leagues" },
            { label: league.name },
          ]}
        />

        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full px-5 py-2 bg-white/5 border border-white/10 text-white/70 hover:bg-[rgba(0,255,136,0.1)] hover:border-[#00ff88] hover:text-white hover:-translate-x-0.5 transition-all duration-200 text-sm shrink-0"
          >
            ← Back
          </Button>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              {league.name}
            </h2>
            <p className="text-white/35 text-sm mt-0.5">Select home team first, then away team</p>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <p className="text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </p>
        )}

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonTeamCard key={i} />)
            : teams.map(({ team }) => (
                <Card
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className={[
                    "relative cursor-pointer overflow-hidden backdrop-blur-md transition-all duration-300 group",
                    isSelected(team)
                      ? team.id === homeTeam?.id
                        ? "border-2 border-[#00ff88] bg-[rgba(0,255,136,0.08)] shadow-[0_6px_25px_rgba(0,255,136,0.3)]"
                        : "border-2 border-[#f59e0b] bg-[rgba(245,158,11,0.08)] shadow-[0_6px_25px_rgba(245,158,11,0.3)]"
                      : "border border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,255,136,0.15)] hover:border-[rgba(0,255,136,0.35)]",
                  ].join(" ")}
                >
                  <CardContent className="relative z-10 flex flex-col items-center py-6 px-3">
                    {/* Home / Away badge */}
                    {isSelected(team) && (
                      <Badge
                        className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider border-none ${
                          team.id === homeTeam?.id
                            ? "bg-gradient-to-br from-[#00ff88] to-[#00d4ff] text-[#0a0e27]"
                            : "bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white"
                        }`}
                      >
                        {team.id === homeTeam?.id ? "Home" : "Away"}
                      </Badge>
                    )}
                    <img
                      src={team.logo || "https://via.placeholder.com/150"}
                      alt={team.name}
                      className={[
                        "w-[70px] h-[70px] object-contain mb-3 transition-all duration-300",
                        isSelected(team)
                          ? "drop-shadow-[0_4px_20px_rgba(0,255,136,0.5)] scale-105"
                          : "drop-shadow-[0_2px_8px_rgba(0,255,136,0.15)] group-hover:scale-110",
                      ].join(" ")}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                    />
                    <h3 className="text-white/75 font-semibold text-xs text-center leading-tight transition-colors duration-200 group-hover:text-white">
                      {team.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Matchup banner — always visible */}
        <div className="mt-10 max-w-lg mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold text-center mb-5">
            Match Preview
          </p>
          <div className="flex items-center gap-4">
            <TeamSlot
              team={homeTeam}
              role="Home"
              colorClass="bg-gradient-to-br from-[#00ff88] to-[#00d4ff] text-[#0a0e27]"
            />
            <div className="text-xl font-black bg-gradient-to-br from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent shrink-0">
              VS
            </div>
            <TeamSlot
              team={awayTeam}
              role="Away"
              colorClass="bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!homeTeam || !awayTeam}
            className="w-full mt-6 rounded-full py-4 h-auto font-black uppercase tracking-widest text-sm bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0e27] border-none shadow-[0_6px_25px_rgba(0,255,136,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(0,255,136,0.5)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
          >
            {homeTeam && awayTeam ? "Predict Match →" : "Select both teams to predict"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default TeamsList;
