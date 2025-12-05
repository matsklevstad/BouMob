import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Match } from "../../types/Match";
import { getTeamLogo } from "../../utils/utils";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "@/components/Matches/Matches.css";

interface Props {
  isActive: boolean;
}

function Matches(props: Props) {
  const ENDPOINT_URL = "/api/tournament-matches?tournamentId=436311";
  const upcomingRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnFirstActivation = useRef(false);

  const {
    data: matchesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: async (): Promise<{ matches: Match[] }> => {
      const response = await fetch(ENDPOINT_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }
      return response.json();
    },
  });

  const data = matchesData?.matches || [];

  useEffect(() => {
    // Only scroll the first time the component becomes active and has data
    if (
      props.isActive &&
      !hasScrolledOnFirstActivation.current &&
      data.length > 0 &&
      upcomingRef.current &&
      scrollContainerRef.current
    ) {
      const timeoutId = setTimeout(() => {
        if (upcomingRef.current && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const target = upcomingRef.current;

          container.scrollTo({
            top: target.offsetTop - container.offsetTop,
          });

          hasScrolledOnFirstActivation.current = true;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [props.isActive, data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="matches-wrapper">Error loading matches</div>;
  }

  function groupMatchesByDate(matches: Match[]) {
    const sortedMatches = [...matches].sort(
      (a, b) =>
        new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime(),
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
    ([, matches]) => matches.some((match) => !match.matchResult),
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
            <p className="match-date">
              {date ===
              new Date().toLocaleDateString("nb-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
                ? "I dag"
                : date ===
                    new Date(Date.now() - 86400000).toLocaleDateString(
                      "nb-NO",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      },
                    )
                  ? "I går  "
                  : date}
            </p>
            {matches.map((match) => (
              <div key={match.matchId} className="match-row">
                <span className="home-team">
                  <p>{match.hometeamOrgName}</p>
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
                <span className="away-team">
                  <img
                    src={getTeamLogo(match.awayteamId)}
                    className="team-logo"
                  />
                  <p>{match.awayteamOrgName}</p>
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
