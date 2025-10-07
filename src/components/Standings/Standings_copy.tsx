import "./Standings.css";
import { getTeamLogo } from "../../utils/utils";
import { fakeStandingsData } from "../../utils/fake_standings_utils";
import type { Standing } from "../../types/Standing";

function Standings() {
  const data: Partial<Standing>[] = fakeStandingsData;

  return (
    <div>
      <div className="standings-wrapper">
        <div className="standings-grid">
          <span className="standings_header_text">#</span>
          <span className="standings_header_text">Lag</span>
          <span className="standings_header_text">SP</span>
          <span className="standings_header_text">V</span>
          <span className="standings_header_text">U</span>
          <span className="standings_header_text">T</span>
          <span className="standings_header_text">+/-</span>
          <span className="standings_header_text">MF</span>
          <span className="standings_header_text">P</span>
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
              className={`standings-grid standings-row ${highlight}`}>
              <p>{team.position}</p>
              <span className="team">
                <img
                  src={getTeamLogo(team.orgId as number)}
                  alt={team.orgName}
                  style={{ width: "1.5rem", marginRight: "0.5rem" }}
                />
                <p
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  {team.orgName}
                </p>
              </span>
              <p>{team.matches}</p>
              <p>{team.victories}</p>
              <p>{team.draws}</p>
              <p>{team.losses}</p>
              <span>{team.totalGoalsFormatted}</span>
              <p>
                {(team.goalDifference ?? 0) > 0
                  ? `+${team.goalDifference ?? 0}`
                  : team.goalDifference ?? 0}
              </p>
              <p className="points">{team.totalPoints}</p>
            </div>
          );
        })}
      </div>
      <div className="legend_container">
        <div className="legend_section">
          <div
            className="legend_color"
            style={{ backgroundColor: "#5dbc6f" }}
          />{" "}
          Opprykk
        </div>
        <div className="legend_section">
          <div
            className="legend_color"
            style={{ backgroundColor: "#db3b3b" }}
          />{" "}
          Nedrykk
        </div>
      </div>
    </div>
  );
}

export default Standings;
