import PropTypes from "prop-types";
import "./StreakBadge.css";

export default function StreakBadge({ streak }) {
  if (streak === 0) return null;

  return (
    <div
      className="streakbadge"
      role="status"
      aria-label={`Goal streak: ${streak} month${streak !== 1 ? "s" : ""} in a row`}
    >
      <span className="streakbadge-fire" aria-hidden="true">🔥</span>
      <span className="streakbadge-count" aria-hidden="true">{streak}</span>
      <span className="streakbadge-label" aria-hidden="true">
        month{streak !== 1 ? "s" : ""} in a row
      </span>
    </div>
  );
}

StreakBadge.propTypes = {
  streak: PropTypes.number.isRequired,
};
