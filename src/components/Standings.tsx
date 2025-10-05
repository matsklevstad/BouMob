import { useEffect, useState } from "react";
import type { Standing } from "../types/Standing";

function Standings() {
  const BASE_URL = "/api/tournament-standings?tournamentId=436311";
  const [data, setData] = useState<Standing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(BASE_URL).then((res) => res.json());
      console.log(response);
      setData(response);
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#191919",
        borderRadius: "8px",
        padding: "1rem",
        margin: "1rem",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", gap: "1rem", fontWeight: "bold" }}>
          <p>#</p>
          <p>Lag</p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", fontWeight: "bold" }}>
          <p>SP</p>
          <p>V</p>
          <p>U</p>
          <p>T</p>
          <p>+/-</p>
          <p>MF</p>
          <p>P</p>
        </div>
      </div>
      {data.map((team) => (
        <div
          key={team.position}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid black",
            borderLeft: team.position === 1 ? "3px solid #5DBC6F" : team.position === 9 ? "3px solid #EC564F" : "none",
            marginLeft: team.position === 1 || team.position === 9 ? "-10px" : undefined,
            paddingLeft: team.position === 1 || team.position === 9 ? "10px" : undefined,
          }}
        >
            <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
            >
            <p style={{fontWeight: "bold"}}>{team.position}</p>

            <p>{team.orgName}</p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <p>{team.matches}</p>
            <p>{team.victories}</p>
            <p>{team.draws}</p>
            <p>{team.losses}</p>
            <p>{team.totalGoalsFormatted}</p>
            <p>{team.goalDifference}</p>
            <p>{team.totalPoints}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Standings;
