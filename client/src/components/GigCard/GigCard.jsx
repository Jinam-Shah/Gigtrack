import { Badge, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./GigCard.css";

const TYPE_COLORS = {
  tutoring: "primary",
  delivery: "warning",
  design: "info",
  retail: "success",
  other: "secondary",
};

const STATUS_COLORS = {
  completed: "success",
  "in-progress": "warning",
  unpaid: "danger",
};

export default function GigCard({ gig, onEdit, onDelete }) {
  const date = new Date(gig.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const earnings = gig.earnings.toFixed(2);

  return (
    <article className="gigcard" aria-label={`${gig.title} — ${gig.clientName}`}>
      {/* Colored top accent bar by gig type */}
      <div className={`gigcard-accent gigcard-accent--${gig.gigType}`} aria-hidden="true" />

      <div className="gigcard-body">
        {/* Top row: title + earnings */}
        <div className="gigcard-header">
          <h2 className="gigcard-title">{gig.title}</h2>
          <span
            className="gigcard-earnings"
            aria-label={`Earnings: $${earnings}`}
          >
            ${earnings}
          </span>
        </div>

        {/* Client */}
        <span className="gigcard-client">{gig.clientName}</span>

        {/* Badges row */}
        <div className="gigcard-meta">
          <Badge bg={TYPE_COLORS[gig.gigType] || "secondary"}>
            {gig.gigType}
          </Badge>
          <Badge bg={STATUS_COLORS[gig.status] || "secondary"}>
            {gig.status}
          </Badge>
        </div>

        {/* Date + rating */}
        <div className="gigcard-sub">
          <time className="gigcard-date" dateTime={gig.date}>
            {date}
          </time>
          {gig.clientRating && (
            <span
              className="gigcard-rating"
              role="img"
              aria-label={`Client rating: ${gig.clientRating} out of 5 stars`}
            >
              {"⭐".repeat(gig.clientRating)}
            </span>
          )}
        </div>

        {/* Note */}
        {gig.clientNote && (
          <p className="gigcard-note">{gig.clientNote}</p>
        )}

        {/* Actions pinned to bottom */}
        <div className="gigcard-actions">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(gig)}
            aria-label={`Edit gig: ${gig.title}`}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(gig._id)}
            aria-label={`Delete gig: ${gig.title}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

GigCard.propTypes = {
  gig: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    gigType: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    earnings: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    clientRating: PropTypes.number,
    clientNote: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
