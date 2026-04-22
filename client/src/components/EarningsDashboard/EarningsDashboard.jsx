import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./EarningsDashboard.css";

const GIG_TYPES = ["tutoring", "delivery", "design", "retail", "other"];
const STATUSES = ["completed", "in-progress", "unpaid"];

// Actual hex values — CSS variables cannot be used inside JS string interpolation
const TYPE_COLORS = {
  tutoring: { from: "#5c6bc0", to: "#3949ab" },
  delivery: { from: "#fb8c00", to: "#e65100" },
  design:   { from: "#00bfa5", to: "#00897b" },
  retail:   { from: "#e53935", to: "#c62828" },
  other:    { from: "#8e24aa", to: "#6a1b9a" },
};

const STATUS_COLORS = {
  completed:     { from: "#43a047", to: "#2e7d32" },
  "in-progress": { from: "#fb8c00", to: "#e65100" },
  unpaid:        { from: "#e53935", to: "#c62828" },
};

const CLIENT_COLOR = { from: "#00bfa5", to: "#00897b" };
const MONTH_COLOR  = { from: "#5c6bc0", to: "#3949ab" };

function barGradient(color) {
  return `linear-gradient(90deg, ${color.from}, ${color.to})`;
}

export default function EarningsDashboard({ userId }) {
  const [allGigs, setAllGigs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [topN, setTopN] = useState("all");

  useEffect(() => {
    async function fetchAllGigs() {
      try {
        const res = await fetch("/api/gigs", { credentials: "include" });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Failed to load dashboard");
        } else {
          setAllGigs(json);
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllGigs();
  }, [userId]);

  const availableYears = [
    ...new Set(allGigs.map((g) => new Date(g.date).getFullYear())),
  ].sort((a, b) => b - a);

  const filtered = allGigs.filter((g) => {
    if (yearFilter && new Date(g.date).getFullYear() !== parseInt(yearFilter))
      return false;
    if (typeFilter && g.gigType !== typeFilter) return false;
    if (statusFilter && g.status !== statusFilter) return false;
    return true;
  });

  const totalEarnings = filtered.reduce((sum, g) => sum + g.earnings, 0);
  const totalGigs = filtered.length;
  const avgEarnings = totalGigs > 0 ? totalEarnings / totalGigs : 0;

  const monthlyMap = {};
  const byTypeMap = {};
  const byStatusMap = {};

  filtered.forEach((g) => {
    const month = new Date(g.date).toISOString().slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + g.earnings;
    byTypeMap[g.gigType] = (byTypeMap[g.gigType] || 0) + g.earnings;
    byStatusMap[g.status] = (byStatusMap[g.status] || 0) + g.earnings;
  });

  let months = Object.entries(monthlyMap).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  if (topN !== "all") {
    months = [...months]
      .sort((a, b) => b[1] - a[1])
      .slice(0, parseInt(topN))
      .sort((a, b) => a[0].localeCompare(b[0]));
  }

  const types   = Object.entries(byTypeMap).sort((a, b) => b[1] - a[1]);
  const statuses = Object.entries(byStatusMap).sort((a, b) => b[1] - a[1]);

  const maxMonthVal  = Math.max(...months.map((m) => m[1]), 1);
  const maxTypeVal   = Math.max(...types.map((t) => t[1]), 1);
  const maxStatusVal = Math.max(...statuses.map((s) => s[1]), 1);

  const activeFilterCount = [yearFilter, typeFilter, statusFilter].filter(
    Boolean
  ).length;

  function clearFilters() {
    setYearFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setTopN("all");
  }

  if (loading)
    return (
      <p className="dashboard-loading" role="status">
        Loading dashboard...
      </p>
    );
  if (error)
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    );

  return (
    <Container className="dashboard-container">
      {/* Page heading */}
      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Earnings Dashboard</h1>
        {activeFilterCount > 0 && (
          <button
            className="dashboard-clear-btn"
            onClick={clearFilters}
            aria-label={`Clear ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}`}
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <fieldset className="dashboard-filter-bar">
        <legend className="visually-hidden">Dashboard filters</legend>

        <div className="dashboard-filter-group">
          <label htmlFor="dash-year" className="dashboard-filter-label">
            Year
          </label>
          <Form.Select
            id="dash-year"
            size="sm"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Form.Select>
        </div>

        <div className="dashboard-filter-group">
          <label htmlFor="dash-type" className="dashboard-filter-label">
            Gig Type
          </label>
          <Form.Select
            id="dash-type"
            size="sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="">All Types</option>
            {GIG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="dashboard-filter-group">
          <label htmlFor="dash-status" className="dashboard-filter-label">
            Status
          </label>
          <Form.Select
            id="dash-status"
            size="sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="dashboard-filter-group">
          <label htmlFor="dash-topn" className="dashboard-filter-label">
            Show Months
          </label>
          <Form.Select
            id="dash-topn"
            size="sm"
            value={topN}
            onChange={(e) => setTopN(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="all">All Months</option>
            <option value="3">Top 3</option>
            <option value="6">Top 6</option>
          </Form.Select>
        </div>
      </fieldset>

      {/* Hero total earnings — full width */}
      <Row className="mb-3">
        <Col>
          <Card className="dashboard-total-card">
            <Card.Body className="dashboard-total-body">
              <div>
                <p className="dashboard-total-label">Total Earnings</p>
                <p className="dashboard-total-amount" aria-live="polite">
                  ${totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="dashboard-total-stats">
                <div className="dashboard-total-stat">
                  <span className="dashboard-total-stat-value">{totalGigs}</span>
                  <span className="dashboard-total-stat-label">gigs logged</span>
                </div>
                <div className="dashboard-total-stat-divider" aria-hidden="true" />
                <div className="dashboard-total-stat">
                  <span className="dashboard-total-stat-value">
                    ${avgEarnings.toFixed(0)}
                  </span>
                  <span className="dashboard-total-stat-label">avg per gig</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      {filtered.length === 0 ? (
        <div className="dashboard-empty" role="status">
          <p>No gigs match the selected filters.</p>
          <button className="dashboard-clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <Row className="g-3">

          {/* Monthly Totals */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h2 className="dashboard-card-title">
                  Monthly Totals
                  {topN !== "all" && (
                    <span className="dashboard-card-subtitle">
                      {" "}· Top {topN} by earnings
                    </span>
                  )}
                </h2>
                <div
                  role="img"
                  aria-label={`Monthly earnings. ${months.map(([m, v]) => `${m}: $${v.toFixed(0)}`).join(", ")}`}
                >
                  {months.length === 0 && <p className="dashboard-no-data">No data.</p>}
                  {months.map(([month, total]) => (
                    <div key={month} className="dashboard-bar-row">
                      <span className="dashboard-bar-label">{month}</span>
                      <div className="dashboard-bar-track">
                        <div
                          className="dashboard-bar-fill"
                          style={{
                            width: `${(total / maxMonthVal) * 100}%`,
                            background: barGradient(MONTH_COLOR),
                          }}
                        />
                      </div>
                      <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Earnings by Gig Type */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h2 className="dashboard-card-title">Earnings by Gig Type</h2>
                <div
                  role="img"
                  aria-label={`Earnings by gig type. ${types.map(([t, v]) => `${t}: $${v.toFixed(0)}`).join(", ")}`}
                >
                  {types.length === 0 && <p className="dashboard-no-data">No data.</p>}
                  {types.map(([type, total]) => {
                    const color = TYPE_COLORS[type] || MONTH_COLOR;
                    return (
                      <div key={type} className="dashboard-bar-row">
                        <span className="dashboard-bar-label">{type}</span>
                        <div className="dashboard-bar-track">
                          <div
                            className="dashboard-bar-fill"
                            style={{
                              width: `${(total / maxTypeVal) * 100}%`,
                              background: barGradient(color),
                            }}
                          />
                        </div>
                        <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Earnings by Status */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h2 className="dashboard-card-title">Earnings by Status</h2>
                <div
                  role="img"
                  aria-label={`Earnings by status. ${statuses.map(([s, v]) => `${s}: $${v.toFixed(0)}`).join(", ")}`}
                >
                  {statuses.length === 0 && <p className="dashboard-no-data">No data.</p>}
                  {statuses.map(([status, total]) => {
                    const color = STATUS_COLORS[status] || MONTH_COLOR;
                    return (
                      <div key={status} className="dashboard-bar-row">
                        <span className="dashboard-bar-label">{status}</span>
                        <div className="dashboard-bar-track">
                          <div
                            className="dashboard-bar-fill"
                            style={{
                              width: `${(total / maxStatusVal) * 100}%`,
                              background: barGradient(color),
                            }}
                          />
                        </div>
                        <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Top Clients */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h2 className="dashboard-card-title">Top Clients by Earnings</h2>
                {(() => {
                  const clientMap = {};
                  filtered.forEach((g) => {
                    clientMap[g.clientName] =
                      (clientMap[g.clientName] || 0) + g.earnings;
                  });
                  const clients = Object.entries(clientMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  const maxClient = Math.max(...clients.map((c) => c[1]), 1);

                  if (clients.length === 0)
                    return <p className="dashboard-no-data">No data.</p>;

                  return (
                    <div
                      role="img"
                      aria-label={`Top clients. ${clients.map(([n, v]) => `${n}: $${v.toFixed(0)}`).join(", ")}`}
                    >
                      {clients.map(([name, total]) => (
                        <div key={name} className="dashboard-bar-row">
                          <span className="dashboard-bar-label dashboard-bar-label--client">
                            {name}
                          </span>
                          <div className="dashboard-bar-track">
                            <div
                              className="dashboard-bar-fill"
                              style={{
                                width: `${(total / maxClient) * 100}%`,
                                background: barGradient(CLIENT_COLOR),
                              }}
                            />
                          </div>
                          <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card.Body>
            </Card>
          </Col>

        </Row>
      )}
    </Container>
  );
}

EarningsDashboard.propTypes = {
  userId: PropTypes.string.isRequired,
};