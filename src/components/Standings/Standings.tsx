import { useEffect, useState } from "react";
import type { Standing } from "../../types/Standing";
import "./Standings.css";
import { getTeamLogo } from "../../utils/utils";

function Standings() {
  const ENDPOINT_URL = "/api/tournament-standings?tournamentId=436311";
  const [data, setData] = useState<Standing[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(ENDPOINT_URL).then((res) => res.json());
        setData(response);
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
        <span style={{ fontWeight: "bold" }}>#</span>
        <span style={{ fontWeight: "bold" }}>Lag</span>
        <span style={{ fontWeight: "bold" }}>SP</span>
        <span style={{ fontWeight: "bold" }}>V</span>
        <span style={{ fontWeight: "bold" }}>U</span>
        <span style={{ fontWeight: "bold" }}>T</span>
        <span style={{ fontWeight: "bold", textAlign: "center" }}>+/-</span>
        <span style={{ fontWeight: "bold" }}>MF</span>
        <span style={{ fontWeight: "bold" }}>P</span>
      </div>
      {data.map((team) => {
        const highlight =
          team.position === 1
            ? "top"
            : team.position === 9
            ? "bottom"
            : "middle";
        return (
          <div
            key={team.position}
            className={`standings-grid standings-row ${highlight}`}
          >
            <p>{team.position}</p>
            <span className="team">
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
            </span>
            <p>{team.matches}</p>
            <p>{team.victories}</p>
            <p>{team.draws}</p>
            <p>{team.losses}</p>
            <span>{team.totalGoalsFormatted}</span>
            <p>
              {team.goalDifference > 0
                ? `+${team.goalDifference}`
                : team.goalDifference}
            </p>
            <p className="points">{team.totalPoints}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Standings;
