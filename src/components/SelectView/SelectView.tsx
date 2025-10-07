import { useEffect } from "react";
import "./SelectView.css";

type ViewType = "Matches" | "Standings";

interface SelectViewProps {
  selectedView: ViewType;
  setSelectedView: (view: ViewType) => void;
}

function SelectView({ selectedView, setSelectedView }: SelectViewProps) {
  useEffect(() => {
    const handleSwipeStart = (e: TouchEvent) => {
      const startX = e.changedTouches[0].clientX;

      const handleSwipeEnd = (endEvent: TouchEvent) => {
        const endX = endEvent.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX > 50) {
          setSelectedView("Matches"); // Swipe right
        } else if (diffX < -50) {
          setSelectedView("Standings"); // Swipe left
        }

        document.removeEventListener("touchend", handleSwipeEnd);
      };

      document.addEventListener("touchend", handleSwipeEnd);
    };

    document.addEventListener("touchstart", handleSwipeStart);
    return () => document.removeEventListener("touchstart", handleSwipeStart);
  }, [setSelectedView]);

  return (
    <div className="select-view">
      <div
        className={`tab ${selectedView === "Standings" ? "active" : ""}`}
        onClick={() => setSelectedView("Standings")}
      >
        Tabell
      </div>
      <div
        className={`tab ${selectedView === "Matches" ? "active" : ""}`}
        onClick={() => setSelectedView("Matches")}
      >
        Kamper
      </div>
    </div>
  );
}

export default SelectView;
