import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import GoalCard from "../GoalCard/GoalCard.jsx";
import GoalForm from "../GoalForm/GoalForm.jsx";
import PropTypes from "prop-types";
import "./GoalList.css";

function computeStreak(goals) {
  const now = new Date();
  let streak = 0;
  let checking = new Date(now.getFullYear(), now.getMonth(), 1);

  while (true) {
    const monthStr = checking.toISOString().slice(0, 7);
    const goal = goals.find((g) => g.month === monthStr);
    if (!goal) break;

    const received = goal.payouts
      .filter((p) => p.status === "received")
      .reduce((sum, p) => sum + p.amount, 0);

    if (received >= goal.targetAmount) {
      streak++;
      checking = new Date(checking.getFullYear(), checking.getMonth() - 1, 1);
    } else {
      break;
    }
  }

  return streak;
}

export default function GoalList({ userId }) {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({ month: "", health: "" });

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append("month", filters.month);
      if (filters.health) params.append("health", filters.health);

      const res = await fetch(`/api/goals?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load goals");
      } else {
        const streak = computeStreak(data);
        const goalsWithStreak = data.map((g, i) => ({
          ...g,
          streak: i === 0 ? streak : 0,
        }));
        setGoals(goalsWithStreak);
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this goal?")) return;
    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchGoals();
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Container className="goallist-container">
      {/* Page header */}
      <div className="goallist-header">
        <h1 className="goallist-heading">My Goals</h1>
        <div className="goallist-header-actions">
          {/* View toggle */}
          <div
            className="goallist-view-toggle"
            role="group"
            aria-label="View mode"
          >
            <button
              className={`goallist-view-btn ${viewMode === "grid" ? "goallist-view-btn--active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`goallist-view-btn ${viewMode === "list" ? "goallist-view-btn--active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>

          <Button
            variant="success"
            onClick={() => {
              setEditingGoal(null);
              setShowForm(!showForm);
            }}
            aria-expanded={showForm}
            aria-controls="goal-form-region"
          >
            {showForm ? "Cancel" : "+ New Goal"}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div id="goal-form-region">
          <GoalForm onSuccess={handleFormSuccess} existingGoal={editingGoal} />
        </div>
      )}

      {/* Filters */}
      <fieldset className="goallist-filters">
        <legend className="goallist-filters-legend">Filter Goals</legend>
        <Row className="g-2">
          <Col md={4} sm={6}>
            <Form.Label htmlFor="goal-filter-month" className="visually-hidden">
              Month
            </Form.Label>
            <Form.Control
              id="goal-filter-month"
              type="month"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={4} sm={6}>
            <Form.Label
              htmlFor="goal-filter-health"
              className="visually-hidden"
            >
              Health status
            </Form.Label>
            <Form.Select
              id="goal-filter-health"
              name="health"
              value={filters.health}
              onChange={handleFilterChange}
            >
              <option value="">All Health Statuses</option>
              <option value="on track">On Track</option>
              <option value="at risk">At Risk</option>
              <option value="missed">Missed</option>
            </Form.Select>
          </Col>
          <Col md={4} sm={12}>
            <Button
              variant="outline-secondary"
              onClick={fetchGoals}
              className="w-100"
            >
              Apply
            </Button>
          </Col>
        </Row>
      </fieldset>

      {/* Results count */}
      {!loading && goals.length > 0 && (
        <p className="goallist-count" aria-live="polite">
          {goals.length} goal{goals.length !== 1 ? "s" : ""} found
        </p>
      )}

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {/* Goals */}
      <section aria-live="polite" aria-label="Goals list">
        {loading && <p className="goallist-loading">Loading goals...</p>}

        {!loading && goals.length === 0 && (
          <p className="goallist-empty">
            No goals found. Create your first goal!
          </p>
        )}

        {!loading && goals.length > 0 && (
          <div
            className={
              viewMode === "grid" ? "goallist-grid" : "goallist-list"
            }
          >
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={fetchGoals}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

GoalList.propTypes = {
  userId: PropTypes.string,
};

GoalList.defaultProps = {
  userId: null,
};
