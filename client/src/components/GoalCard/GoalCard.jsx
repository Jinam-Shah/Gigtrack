import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import PayoutList from "../PayoutList/PayoutList.jsx";
import StreakBadge from "../StreakBadge/StreakBadge.jsx";
import PropTypes from "prop-types";
import "./GoalCard.css";

const HEALTH_COLORS = {
  "on track": "success",
  "at risk": "warning",
  missed: "danger",
};

export default function GoalCard({ goal, onEdit, onDelete, onRefresh }) {
  const [showPayouts, setShowPayouts] = useState(false);

  const received = goal.payouts
    .filter((p) => p.status === "received")
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = goal.payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const percent = Math.min(
    Math.round((received / goal.targetAmount) * 100),
    100
  );

  const payoutsId = `payouts-${goal._id}`;
  const healthClass = goal.health.replace(" ", "-");

  return (
    <article
      className={`goalcard goalcard--${healthClass}`}
      aria-label={`Goal: ${goal.label}`}
    >
      {/* Health-colored accent bar */}
      <div
        className={`goalcard-accent goalcard-accent--${healthClass}`}
        aria-hidden="true"
      />

      <div className="goalcard-body">
        {/* Header */}
        <div className="goalcard-header">
          <div className="goalcard-header-left">
            <h2 className="goalcard-label">{goal.label}</h2>
            <time className="goalcard-month">{goal.month}</time>
          </div>
          <div className="goalcard-header-right">
            <Badge bg={HEALTH_COLORS[goal.health] || "secondary"}>
              {goal.health}
            </Badge>
            {goal.streak > 0 && <StreakBadge streak={goal.streak} />}
          </div>
        </div>

        {/* Progress */}
        <div className="goalcard-progress-section">
          <div
            className="goalcard-progress-track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Goal progress: ${percent}% of $${goal.targetAmount.toFixed(2)} target reached`}
          >
            <div
              className={`goalcard-progress-fill goalcard-progress-fill--${healthClass}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="goalcard-percent">{percent}%</span>
        </div>

        {/* Amounts */}
        <div className="goalcard-amounts">
          <span className="goalcard-received">
            ${received.toFixed(2)}
            <span className="goalcard-amounts-sublabel"> received</span>
          </span>
          <span className="goalcard-target">
            of ${goal.targetAmount.toFixed(2)}
          </span>
          {pending > 0 && (
            <span className="goalcard-pending">
              +${pending.toFixed(2)} pending
            </span>
          )}
        </div>

        {/* Payout count chip */}
        <div className="goalcard-payout-count">
          <span>{goal.payouts.length} payout{goal.payouts.length !== 1 ? "s" : ""} logged</span>
        </div>

        {/* Actions */}
        <div className="goalcard-actions">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowPayouts(!showPayouts)}
            aria-expanded={showPayouts}
            aria-controls={payoutsId}
          >
            {showPayouts ? "Hide Payouts" : "Payouts"}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(goal)}
            aria-label={`Edit goal: ${goal.label}`}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(goal._id)}
            aria-label={`Delete goal: ${goal.label}`}
          >
            Delete
          </Button>
        </div>

        {/* Payouts panel — expands inside the card */}
        <div id={payoutsId}>
          {showPayouts && (
            <PayoutList
              goalId={goal._id}
              payouts={goal.payouts}
              onRefresh={onRefresh}
            />
          )}
        </div>
      </div>
    </article>
  );
}

GoalCard.propTypes = {
  goal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    targetAmount: PropTypes.number.isRequired,
    month: PropTypes.string.isRequired,
    payouts: PropTypes.arrayOf(PropTypes.object).isRequired,
    health: PropTypes.string.isRequired,
    streak: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
