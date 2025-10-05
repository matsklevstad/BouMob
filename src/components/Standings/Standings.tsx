import { useEffect, useState } from "react";
import type { Standing } from "../../types/Standing";
import "./Standings.css";
import { getTeamLogo } from "../../utils/utils";

function Standings() {
  const URL = "/api/tournament-standings?tournamentId=436311";
  const [data, setData] = useState<Standing[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(URL);
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="standings-wrapper">
      <div className="standings-grid">
        <span>#</span>
        <span>Lag</span>
        <span>SP</span>
        <span>V</span>
        <span>U</span>
        <span>T</span>
        <span style={{textAlign: 'center'}}>+/-</span>
        <span>MF</span>
        <span>P</span>
      </div>
      {data.map((team) => {
        const highlight =
          team.position === 1 ? "top" : team.position === 9 ? "bottom" : "";
        return (
          <div
            key={team.position}
            className={`standings-grid standings-row ${highlight}`}
          >
            <p>{team.position}</p>
            <p className="team">
              <img
                src={getTeamLogo(team.orgId)}
                alt={team.orgName}
                style={{ width: "1.5rem", marginRight: "0.5rem" }}
              />
              <p
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {team.orgName}
              </p>
            </p>
            <p>{team.matches}</p>
            <p>{team.victories}</p>
            <p>{team.draws}</p>
            <p>{team.losses}</p>
            <span>{team.totalGoalsFormatted}</span>
            <p>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</p>
            <p className="points">{team.totalPoints}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Standings;
