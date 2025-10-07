import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Matches from "./components/Matches/Matches";
import SelectView from "./components/SelectView/SelectView";
import Standings from "./components/Standings/Standings";

type ViewType = "Matches" | "Standings";

function App() {
  const [selectedView, setSelectedView] = useState<ViewType>("Standings");

  return (
    <div>
      <div className="header-container">
        <Header />
        <SelectView
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      </div>
      {selectedView === "Matches" ? <Matches /> : <Standings />}
    </div>
  );
}

export default App;
