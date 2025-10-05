import { useEffect, useState } from "react";
import type { Standing } from "../../types/Standing"
import "./Standings.css";

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
    return () => { active = false; };
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
        <span>+/-</span>
        <span>MF</span>
        <span>P</span>
      </div>
      {data.map(team => {
        const highlight =
          team.position === 1 ? "top" :
          team.position === 9 ? "bottom" : "";
        return (
          <div
            key={team.position}
            className={`standings-grid standings-row ${highlight}`}
          >
            <span>{team.position}</span>
            <span className="team">{team.orgName}</span>
            <span>{team.matches}</span>
            <span>{team.victories}</span>
            <span>{team.draws}</span>
            <span>{team.losses}</span>
            <span>{team.totalGoalsFormatted}</span>
            <span>{team.goalDifference}</span>
            <span className="points">{team.totalPoints}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Standings;