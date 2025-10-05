import { useEffect, useState } from "react";
import type { Match } from "../types/Match";

function Matches() {
  const BASE_URL = "/api/tournament-matches?tournamentId=436311";
  const [data, setData] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(BASE_URL).then((res) => res.json());
      console.log(response);
      setData(response.matches);
    };
    fetchData();
  }, []);

  function groupMatchesByDate(matches: Match[]) {
    // Sort matches by date first
    const sortedMatches = [...matches].sort((a, b) => {
      return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
    });

    // Then group them
    const grouped: Record<string, Match[]> = {};

    sortedMatches.forEach((match) => {
      const date = new Date(match.matchDate).toLocaleDateString("nb-NO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(match);
    });

    return grouped;
  }

  const groupedMatches = groupMatchesByDate(data);

  return (
    <div
      style={{
        padding: "1rem",
        margin: "1rem",

        borderRadius: "8px",
      }}
    >
      {Object.entries(groupedMatches).map(([date, matches]) => (
        <div
          key={date}
          style={{
            marginBottom: "1.5rem",
            backgroundColor: "#191919",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              borderBottom: "1px solid #080808ff",
              paddingBottom: "0.5rem",
            }}
          >
            {date}
          </h3>
          {matches.map((match) => (
            <div
              key={match.matchId}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr", // home - score - away
                textAlign: "center",
              }}
            >
              <p>{match.hometeam.split("-")[0]}</p>
              <p style={{ fontWeight: "bold" }}>
                {match.matchResult
                  ? `${match.matchResult.homeGoals} - ${match.matchResult.awayGoals}`
                  : match.matchStartTime.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}
              </p>
              <p>{match.awayteam.split("-")[0]}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Matches;
