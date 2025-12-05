import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Matches from "../components/Matches/Matches";
import SelectView from "../components/SelectView/SelectView";
import Standings from "../components/Standings/Standings";

type ViewType = "Matches" | "Standings";

export default function Home() {
  const [selectedView, setSelectedView] = useState<ViewType>("Standings");

  return (
    <>
      <Head>
        <title>BouMob</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="the-father">
        <div className="header-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            <Header />
            <SelectView
              selectedView={selectedView}
              setSelectedView={setSelectedView}
            />
          </div>
        </div>
        <div className="content-container">
          <div
            className={`view-content ${
              selectedView === "Matches" ? "active" : "hidden"
            }`}
          >
            <Matches isActive={selectedView === "Matches"} />
          </div>
          <div
            className={`view-content ${
              selectedView === "Standings" ? "active" : "hidden"
            }`}
          >
            <Standings />
          </div>
        </div>
      </div>
    </>
  );
}
