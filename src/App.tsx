import "./App.css";
import Header from "./components/Header";
import Matches from "./components/Matches";
import Standings from "./components/Standings/Standings";

function App() {
  return (
    <div>
      <Header />
      <Standings />
      <Matches /> 
      <main style={{ backgroundColor: "black" }}></main>
    </div>
  );
}

export default App;
