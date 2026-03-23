import React, { useState, useEffect } from "react";
import axios from "axios";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";

/* ── Probability bar using shadcn Progress primitives ─────── */
const PROB_COLORS = {
  home: "bg-gradient-to-r from-[#00ff88] to-[#00d4ff]",
  draw: "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]",
  away: "bg-gradient-to-r from-[#f87171] to-[#ef4444]",
};

const ProbBar = ({ label, value, type }) => (
  <div className="flex items-center gap-4 mb-4">
    <span className="w-20 text-right text-sm font-semibold text-white/60 capitalize shrink-0">
      {label}
    </span>
    <ProgressPrimitive.Root value={value} max={100} className="flex-1">
      <ProgressPrimitive.Track className="relative flex h-3 w-full items-center overflow-hidden rounded-full bg-white/[0.08] border border-white/[0.08]">
        <ProgressPrimitive.Indicator
          className={`h-full rounded-full transition-all duration-700 ${PROB_COLORS[type]}`}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
    <span className="w-10 text-sm font-black text-white/70 tabular-nums shrink-0">
      {value}%
    </span>
  </div>
);

/* ── Stat row ─────────────────────────────────────────────── */
const StatRow = ({ label, home, away }) => (
  <div className="flex items-center gap-3 py-2 border-b border-white/[0.06] last:border-0">
    <span className="flex-1 text-right font-black text-white text-sm">{home}</span>
    <span className="text-[11px] text-white/30 uppercase tracking-wide w-32 text-center shrink-0">{label}</span>
    <span className="flex-1 font-black text-white text-sm">{away}</span>
  </div>
);

/* ── Loading skeleton ─────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 mt-10">
    <div className="h-32 bg-white/5 rounded-2xl" />
    <div className="h-24 bg-white/5 rounded-2xl" />
    <div className="h-40 bg-white/5 rounded-2xl" />
  </div>
);

/* ── Main component ───────────────────────────────────────── */
const PredictionResult = ({ league, homeTeam, awayTeam, onBack }) => {
  const [prediction, setPrediction]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get standings to determine current round
        const standingsResponse = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${league.id}&s=2024-2025`
        );
        if (!standingsResponse.data?.table) throw new Error("Could not fetch standings data");

        const currentRound = Math.max(
          ...standingsResponse.data.table
            .slice(0, 10)
            .map((team) => parseInt(team.intPlayed || 0))
        );
        if (currentRound === 0) throw new Error("Could not determine current round");

        // 2. Fetch last 5 rounds
        const allMatches = [];
        for (let round = currentRound; round > currentRound - 5; round--) {
          if (round < 1) break;
          try {
            const res = await axios.get(
              `https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=${league.id}&r=${round}&s=2024-2025`
            );
            if (res.data?.events) allMatches.push(...res.data.events);
          } catch (err) {
            console.error(`Error fetching round ${round}:`, err);
          }
        }

        // 3. Calculate goals scored in last 5 rounds
        const calculateGoals = (teamName) =>
          allMatches.reduce((total, match) => {
            if (match.strHomeTeam === teamName) return total + (parseInt(match.intHomeScore) || 0);
            if (match.strAwayTeam === teamName) return total + (parseInt(match.intAwayScore) || 0);
            return total;
          }, 0);

        const homeLast5Goals = calculateGoals(homeTeam.name);
        const awayLast5Goals = calculateGoals(awayTeam.name);

        // 4. Get team stats from standings
        const homeStats = standingsResponse.data.table.find((t) => t.strTeam === homeTeam.name) || {};
        const awayStats = standingsResponse.data.table.find((t) => t.strTeam === awayTeam.name) || {};

        const matchData = {
          strHomeTeam:       homeTeam.name,
          strAwayTeam:       awayTeam.name,
          lastHome5GamesScore: homeLast5Goals,
          lastAway5GamesScore: awayLast5Goals,
          homeGoalsFor:      parseInt(homeStats.intGoalsFor      || 0),
          homeGoalsAgainst:  parseInt(homeStats.intGoalsAgainst  || 0),
          homeGD:            parseInt(homeStats.intGoalDifference || 0),
          homeWins:          parseInt(homeStats.intWin            || 0),
          homePlayed:        parseInt(homeStats.intPlayed         || 1),
          homeRank:          parseInt(homeStats.intRank           || 0),
          awayGoalsFor:      parseInt(awayStats.intGoalsFor      || 0),
          awayGoalsAgainst:  parseInt(awayStats.intGoalsAgainst  || 0),
          awayGD:            parseInt(awayStats.intGoalDifference || 0),
          awayWins:          parseInt(awayStats.intWin            || 0),
          awayPlayed:        parseInt(awayStats.intPlayed         || 1),
          awayRank:          parseInt(awayStats.intRank           || 0),
        };

        const predictionResponse = await axios.post("/api/predict", {
          league: league.key,
          match_data: matchData,
        });

        setPrediction({ ...predictionResponse.data, _homeStats: homeStats, _awayStats: awayStats });
      } catch (err) {
        console.error("Prediction error:", err);
        setError(err.message || "Failed to generate prediction");
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [league, homeTeam, awayTeam]);

  const fmt = (v, d = 2) => (v ? parseFloat(v).toFixed(d) : "0.00");

  const cp = prediction?.combined_prediction;

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-4 md:p-10">
      <div className="max-w-3xl mx-auto">

        <Breadcrumb
          items={[
            { label: "Home",    href: "/"       },
            { label: "Leagues", href: "/leagues" },
            { label: league.name, href: "/teams" },
            { label: "Prediction" },
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
              Match Prediction
            </h2>
            <p className="text-white/35 text-sm mt-0.5">{league?.name}</p>
          </div>
        </div>

        {serverStatus && (
          <Badge className="mb-6 bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88] rounded-full">
            Backend: {serverStatus.status} · v{serverStatus.version || "1.0"}
          </Badge>
        )}

        {/* Teams matchup header */}
        <div className="flex items-center justify-between gap-4 mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col items-center gap-2 flex-1">
            <Badge className="bg-gradient-to-br from-[#00ff88] to-[#00d4ff] text-[#0a0e27] text-[10px] font-black uppercase tracking-wider border-none">
              Home
            </Badge>
            <img
              src={homeTeam?.logo || "https://via.placeholder.com/150"}
              alt={homeTeam?.name}
              className="w-16 h-16 object-contain"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
            <p className="text-white font-bold text-sm text-center">{homeTeam?.name}</p>
          </div>

          <div className="text-2xl font-black bg-gradient-to-br from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent shrink-0">
            VS
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <Badge className="bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white text-[10px] font-black uppercase tracking-wider border-none">
              Away
            </Badge>
            <img
              src={awayTeam?.logo || "https://via.placeholder.com/150"}
              alt={awayTeam?.name}
              className="w-16 h-16 object-contain"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
            <p className="text-white font-bold text-sm text-center">{awayTeam?.name}</p>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-sm font-medium">
            {error} — Could not reach the backend.
          </div>
        )}

        {/* Prediction results */}
        {!loading && cp && (
          <div className="space-y-4">

            {/* Score */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#a855f7]" />
              <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">
                Predicted Score
              </p>
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                {cp.score}
              </div>
            </div>

            {/* Winner */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold shrink-0">
                Predicted Winner
              </p>
              <div className="flex items-center gap-3 ml-auto">
                {cp.winner === "draw" ? (
                  <Badge className="bg-[rgba(251,191,36,0.15)] border border-[rgba(251,191,36,0.3)] text-[#fbbf24] font-bold text-sm px-4 py-1">
                    Draw
                  </Badge>
                ) : (
                  <>
                    <img
                      src={cp.winner === "home" ? homeTeam?.logo : awayTeam?.logo}
                      alt="winner"
                      className="w-10 h-10 object-contain"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                    />
                    <span className="text-white font-bold text-base">
                      {cp.winner === "home" ? homeTeam?.name : awayTeam?.name}
                    </span>
                    <Badge className="bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88] font-bold">
                      Wins
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Win probability */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-5">
                Win Probability
              </p>
              <ProbBar label={homeTeam?.name || "Home"} value={cp.probability.home} type="home" />
              <ProbBar label="Draw"                      value={cp.probability.draw} type="draw" />
              <ProbBar label={awayTeam?.name || "Away"}  value={cp.probability.away} type="away" />
            </div>

            {/* Stats comparison */}
            {prediction._homeStats?.intRank && prediction._awayStats?.intRank && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-1">
                  Season Stats Comparison
                </p>
                <div className="flex text-[10px] text-white/25 uppercase tracking-widest mb-3 mt-2">
                  <span className="flex-1 text-right pr-3">{homeTeam?.name}</span>
                  <span className="w-32 text-center shrink-0"></span>
                  <span className="flex-1 pl-0">{awayTeam?.name}</span>
                </div>
                <StatRow label="League Rank"    home={`#${prediction._homeStats.intRank}`}          away={`#${prediction._awayStats.intRank}`} />
                <StatRow label="Wins"           home={prediction._homeStats.intWin}                  away={prediction._awayStats.intWin} />
                <StatRow label="Goals For"      home={prediction._homeStats.intGoalsFor}             away={prediction._awayStats.intGoalsFor} />
                <StatRow label="Goals Against"  home={prediction._homeStats.intGoalsAgainst}         away={prediction._awayStats.intGoalsAgainst} />
                <StatRow label="Goal Diff"      home={prediction._homeStats.intGoalDifference}       away={prediction._awayStats.intGoalDifference} />
              </div>
            )}

            {/* Goal details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "xG Home",           value: fmt(cp.expected_goals.home), highlight: true  },
                { label: "xG Away",           value: fmt(cp.expected_goals.away), highlight: true  },
                { label: "Both Teams Score",  value: cp.both_teams_to_score ? "Yes" : "No",        positive: cp.both_teams_to_score },
                { label: "Over / Under 2.5",  value: cp.over_under > 2.5 ? `Over ${fmt(cp.over_under, 1)}` : `Under ${fmt(cp.over_under, 1)}`, positive: cp.over_under > 2.5 },
              ].map(({ label, value, highlight, positive }) => (
                <div
                  key={label}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col gap-1 hover:border-[rgba(0,255,136,0.25)] transition-colors duration-200"
                >
                  <span className="text-white/35 text-[11px] uppercase tracking-wide font-semibold">{label}</span>
                  <span
                    className={`font-black text-lg ${
                      highlight
                        ? "text-[#00ff88]"
                        : positive
                        ? "text-[#00ff88]"
                        : "text-red-400"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Predict another match */}
            <Button
              onClick={() => window.location.href = "/leagues"}
              className="w-full mt-2 rounded-full py-4 h-auto font-bold uppercase tracking-widest text-sm bg-white/5 border border-white/10 text-white/60 hover:bg-[rgba(0,255,136,0.08)] hover:border-[rgba(0,255,136,0.35)] hover:text-white transition-all duration-200"
            >
              ↩ Predict Another Match
            </Button>

          </div>
        )}

        {/* No data fallback */}
        {!loading && !error && !cp && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-sm font-medium mt-6">
            No prediction data returned from backend.
          </div>
        )}

      </div>
    </div>
  );
};

export default PredictionResult;
