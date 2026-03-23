import { useNavigate } from "react-router-dom";
import { Target, Zap, Trophy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuildVersion from "@/components/BuildVersion";

const STATS = [
  { number: "6", label: "Leagues" },
  { number: "100+", label: "Teams" },
  { number: "<1s", label: "Prediction Time" },
];

const FEATURES = [
  { icon: Target, label: "65% Accuracy" },
  { icon: Zap, label: "Real-Time Data" },
  { icon: Trophy, label: "Top Leagues" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(60px, -40px) scale(1.1); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, 50px) scale(1.15); }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, 30px) scale(1.05); }
          66%       { transform: translate(-30px, -20px) scale(0.95); }
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0e27]">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)",
              animation: "orb-1 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)",
              animation: "orb-2 15s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-[40%] left-[45%] w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
              animation: "orb-3 18s ease-in-out infinite",
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), " +
                "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 py-20">
          <div
            className="max-w-4xl w-full mx-auto"
            style={{ animation: "float-up 0.8s ease-out both" }}
          >
            {/* AI tag */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.35)] text-[#00ff88] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full">
                ⚡ AI-Powered Football Intelligence
              </Badge>
            </div>

            {/* Title — fixed, no rotation */}
            <h1 className="text-[2.4rem] sm:text-[3.5rem] md:text-[5rem] font-black leading-[1.05] tracking-[-2px] md:tracking-[-4px] mb-6">
              <span className="text-white">Predict the Game.</span>
              <br />
              <span className="bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#a855f7] bg-clip-text text-transparent">
                Before It&apos;s Played.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/55 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Advanced machine learning models analyze real match data to
              deliver accurate score predictions, win probabilities, and goal
              forecasts.
            </p>

            {/* CTA */}
            <Button
              onClick={() => navigate("/leagues")}
              className="rounded-full px-10 md:px-16 h-auto py-4 md:py-5 text-base md:text-lg font-black uppercase tracking-[3px] bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-[#0a0e27] border-none shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_60px_rgba(0,255,136,0.6)] transition-all duration-300"
            >
              Start Predicting
            </Button>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-sm text-white/75 font-medium backdrop-blur-sm hover:border-[rgba(0,255,136,0.5)] hover:bg-[rgba(0,255,136,0.05)] hover:text-white transition-all duration-300"
                >
                  <Icon
                    size={15}
                    className="text-[#00ff88]"
                    strokeWidth={2.5}
                  />
                  {label}
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="flex flex-col sm:flex-row justify-center mt-16 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              {STATS.map(({ number, label }, i) => (
                <div
                  key={label}
                  className={`flex-1 py-6 px-8 bg-white/[0.03] text-center ${
                    i < STATS.length - 1
                      ? "border-b sm:border-b-0 sm:border-r border-white/10"
                      : ""
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                    {number}
                  </div>
                  <div className="text-white/35 text-[11px] font-semibold uppercase tracking-widest mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8 animate-bounce">
          <ChevronDown size={20} className="text-white/25" />
        </div>
        <BuildVersion />
      </div>
    </>
  );
};

export default LandingPage;
