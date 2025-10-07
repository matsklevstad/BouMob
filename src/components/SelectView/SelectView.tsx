import { useEffect } from "react";
import { track } from "@vercel/analytics";
import "./SelectView.css";

type ViewType = "Matches" | "Standings";

interface SelectViewProps {
  selectedView: ViewType;
  setSelectedView: (view: ViewType) => void;
}

function SelectView({ selectedView, setSelectedView }: SelectViewProps) {
  const handleViewChange = (view: ViewType) => {
    if (view !== selectedView) {
      setSelectedView(view);
      track("tab_view", { tab: view });
    }
  };
  useEffect(() => {
    const handleSwipeStart = (e: TouchEvent) => {
      const startX = e.changedTouches[0].clientX;

      const handleSwipeEnd = (endEvent: TouchEvent) => {
        const endX = endEvent.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX > 50) {
          handleViewChange("Standings"); // Swipe right
        } else if (diffX < -50) {
          handleViewChange("Matches"); // Swipe left
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
        onClick={() => handleViewChange("Standings")}
      >
        Tabell
      </div>
      <div
        className={`tab ${selectedView === "Matches" ? "active" : ""}`}
        onClick={() => handleViewChange("Matches")}
      >
        Kamper
      </div>
    </div>
  );
}

export default SelectView;
