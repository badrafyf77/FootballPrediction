import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";

const leaguesData = [
  {
    name: "English Premier League",
    key: "epl",
    logo: "https://media.api-sports.io/football/leagues/39.png",
    id: "4328",
  },
  {
    name: "La Liga",
    key: "liga",
    logo: "https://media.api-sports.io/football/leagues/140.png",
    id: "4335",
  },
  {
    name: "Bundesliga",
    key: "bundesliga",
    logo: "https://media.api-sports.io/football/leagues/78.png",
    id: "4331",
  },
  {
    name: "Serie A",
    key: "serie",
    logo: "https://media.api-sports.io/football/leagues/135.png",
    id: "4332",
  },
  {
    name: "Ligue 1",
    key: "ligue",
    logo: "https://media.api-sports.io/football/leagues/61.png",
    id: "4334",
  },
  {
    name: "Botola Pro",
    key: "inwi",
    logo: "https://r2.thesportsdb.com/images/media/league/badge/bhuork1638558615.png",
    id: "4520",
  },
];

const LeaguesList = ({ onSelectLeague, onBack }) => {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">

        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Leagues" },
          ]}
        />

        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full px-5 py-2 bg-white/5 border border-white/10 text-white/70 hover:bg-[rgba(0,255,136,0.1)] hover:border-[#00ff88] hover:text-white hover:-translate-x-0.5 transition-all duration-200 text-sm"
          >
            ← Back
          </Button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              Select a League
            </h2>
            <p className="text-white/35 text-sm mt-1">Choose the competition you want to predict</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {leaguesData.map((league) => (
            <Card
              key={league.id}
              onClick={() => onSelectLeague(league)}
              className="relative cursor-pointer overflow-hidden bg-white/[0.03] border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,255,136,0.2)] hover:border-[rgba(0,255,136,0.5)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,136,0.07)] to-[rgba(0,212,255,0.07)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              <CardContent className="relative z-10 flex items-center gap-5 p-5">
                <img
                  src={league.logo}
                  alt={league.name}
                  className="w-[60px] h-[60px] object-contain drop-shadow-[0_2px_10px_rgba(0,255,136,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_4px_20px_rgba(0,255,136,0.4)] shrink-0"
                />
                <h3 className="text-white/80 font-semibold text-base transition-colors duration-200 group-hover:text-white">
                  {league.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LeaguesList;
