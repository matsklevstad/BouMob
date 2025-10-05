import { useEffect, useRef, useState } from "react";
import type { Match } from "../../types/Match";
import "./Matches.css";
import { getTeamLogo } from "../../utils/utils";

function Matches() {
  const BASE_URL = "/api/tournament-matches?tournamentId=436311";
  const [data, setData] = useState<Match[]>([]);
  const upcomingRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(BASE_URL).then((res) => res.json());
      setData(response.matches);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (upcomingRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const target = upcomingRef.current;
      container.scrollTo({
        top: target.offsetTop - container.offsetTop,
      });
    }
  }, [data]);

  function groupMatchesByDate(matches: Match[]) {
    const sortedMatches = [...matches].sort(
      (a, b) =>
        new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    );

    const grouped: Record<string, Match[]> = {};
    sortedMatches.forEach((match) => {
      const date = new Date(match.matchDate).toLocaleDateString("nb-NO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(match);
    });

    return grouped;
  }

  const groupedMatches = groupMatchesByDate(data);
  const firstUpcomingDateKey = Object.entries(groupedMatches).find(
    ([_, matches]) => matches.some((match) => !match.matchResult)
  )?.[0];

  return (
    <div
      ref={scrollContainerRef}
      className="matches-wrapper"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      {Object.entries(groupedMatches).map(([date, matches]) => {
        const isFirstUpcoming = date === firstUpcomingDateKey;

        return (
          <div
            key={date}
            ref={isFirstUpcoming ? upcomingRef : null}
            className="match-group"
          >
            <p className="match-date">{date}</p>
            {matches.map((match) => (
              <div key={match.matchId} className="match-row">
                <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: 'flex-end', width: "100%" }}>
                  <p>{match.hometeam.split("-")[0]}</p>
                  <img
                    src={getTeamLogo(match.hometeamId)}
                    className="team-logo"
                  />
                </span>
                <p style={{ fontWeight: "bold" }}>
                  {match.matchResult
                    ? `${match.matchResult.homeGoals} - ${match.matchResult.awayGoals}`
                    : match.matchStartTime
                        .toString()
                        .padStart(4, "0")
                        .replace(/(\d{2})(\d{2})/, "$1:$2")}
                </p>
                <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: 'flex-start', width: "100%" }}>
                  <img
                    src={getTeamLogo(match.awayteamId)}
                    className="team-logo"
                  />
                  <p>{match.awayteam.split("-")[0]}</p>
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Matches;
