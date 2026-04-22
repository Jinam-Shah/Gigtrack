import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Form, Button, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import "./EarningsDashboard.css";

const GIG_TYPES = ["tutoring", "delivery", "design", "retail", "other"];
const STATUSES = ["completed", "in-progress", "unpaid"];

const TYPE_COLORS = {
  tutoring: "#667eea",
  delivery: "#f7971e",
  design: "#2ecc71",
  retail: "#e74c3c",
  other: "#a29bfe",
};

export default function EarningsDashboard({ userId }) {
  const [allGigs, setAllGigs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Filters
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

  // Derive available years from data
  const availableYears = [...new Set(
    allGigs.map((g) => new Date(g.date).getFullYear())
  )].sort((a, b) => b - a);

  // Apply filters
  const filtered = allGigs.filter((g) => {
    if (yearFilter && new Date(g.date).getFullYear() !== parseInt(yearFilter)) return false;
    if (typeFilter && g.gigType !== typeFilter) return false;
    if (statusFilter && g.status !== statusFilter) return false;
    return true;
  });

  // Aggregations
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

  let months = Object.entries(monthlyMap).sort((a, b) => a[0].localeCompare(b[0]));
  if (topN !== "all") {
    months = [...months].sort((a, b) => b[1] - a[1]).slice(0, parseInt(topN));
    months.sort((a, b) => a[0].localeCompare(b[0]));
  }

  const types = Object.entries(byTypeMap).sort((a, b) => b[1] - a[1]);
  const statuses = Object.entries(byStatusMap).sort((a, b) => b[1] - a[1]);

  const maxMonthVal = Math.max(...months.map((m) => m[1]), 1);
  const maxTypeVal = Math.max(...types.map((t) => t[1]), 1);
  const maxStatusVal = Math.max(...statuses.map((s) => s[1]), 1);

  const activeFilterCount = [yearFilter, typeFilter, statusFilter].filter(Boolean).length;

  function clearFilters() {
    setYearFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setTopN("all");
  }

  if (loading) return <p className="dashboard-loading">Loading dashboard...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="dashboard-container">
      <div className="dashboard-topbar">
        <h2 className="dashboard-heading">Earnings Dashboard</h2>
        {activeFilterCount > 0 && (
          <button className="dashboard-clear-btn" onClick={clearFilters}>
            Clear filters
            <Badge bg="secondary" className="ms-2">{activeFilterCount}</Badge>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="dashboard-filter-bar">
        <div className="dashboard-filter-group">
          <label className="dashboard-filter-label">Year</label>
          <Form.Select
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
          <label className="dashboard-filter-label">Gig Type</label>
          <Form.Select
            size="sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="">All Types</option>
            {GIG_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </Form.Select>
        </div>

        <div className="dashboard-filter-group">
          <label className="dashboard-filter-label">Status</label>
          <Form.Select
            size="sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dashboard-filter-select"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Form.Select>
        </div>

        <div className="dashboard-filter-group">
          <label className="dashboard-filter-label">Show Months</label>
          <Form.Select
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
      </div>

      {/* Summary Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="dashboard-total-card">
            <Card.Body>
              <p className="dashboard-total-label">Total Earnings</p>
              <h3 className="dashboard-total-amount">${totalEarnings.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <p className="dashboard-stat-label">Total Gigs</p>
              <h3 className="dashboard-stat-amount">{totalGigs}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stat-card dashboard-stat-card--accent">
            <Card.Body>
              <p className="dashboard-stat-label">Avg per Gig</p>
              <h3 className="dashboard-stat-amount">${avgEarnings.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <div className="dashboard-empty">
          <p>No gigs match the selected filters.</p>
          <button className="dashboard-clear-btn" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <Row className="g-3">
          {/* Monthly Totals */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5 className="dashboard-card-title">
                  Monthly Totals
                  {topN !== "all" && (
                    <span className="dashboard-card-subtitle"> · Top {topN} by earnings</span>
                  )}
                </h5>
                {months.length === 0 && <p className="dashboard-no-data">No data.</p>}
                {months.map(([month, total]) => (
                  <div key={month} className="dashboard-bar-row">
                    <span className="dashboard-bar-label">{month}</span>
                    <div className="dashboard-bar-track">
                      <div
                        className="dashboard-bar-fill"
                        style={{ width: `${(total / maxMonthVal) * 100}%` }}
                      />
                    </div>
                    <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Earnings by Gig Type */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5 className="dashboard-card-title">Earnings by Gig Type</h5>
                {types.length === 0 && <p className="dashboard-no-data">No data.</p>}
                {types.map(([type, total]) => (
                  <div key={type} className="dashboard-bar-row">
                    <span className="dashboard-bar-label">{type}</span>
                    <div className="dashboard-bar-track">
                      <div
                        className="dashboard-bar-fill"
                        style={{
                          width: `${(total / maxTypeVal) * 100}%`,
                          background: `linear-gradient(90deg, ${TYPE_COLORS[type] || "#667eea"}, ${TYPE_COLORS[type] || "#764ba2"}cc)`,
                        }}
                      />
                    </div>
                    <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Earnings by Status */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5 className="dashboard-card-title">Earnings by Status</h5>
                {statuses.length === 0 && <p className="dashboard-no-data">No data.</p>}
                {statuses.map(([status, total]) => {
                  const statusColor =
                    status === "completed" ? "#2ecc71" :
                    status === "in-progress" ? "#f7971e" : "#e74c3c";
                  return (
                    <div key={status} className="dashboard-bar-row">
                      <span className="dashboard-bar-label">{status}</span>
                      <div className="dashboard-bar-track">
                        <div
                          className="dashboard-bar-fill"
                          style={{
                            width: `${(total / maxStatusVal) * 100}%`,
                            background: `linear-gradient(90deg, ${statusColor}, ${statusColor}99)`,
                          }}
                        />
                      </div>
                      <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>

          {/* Top Clients */}
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5 className="dashboard-card-title">Top Clients by Earnings</h5>
                {(() => {
                  const clientMap = {};
                  filtered.forEach((g) => {
                    clientMap[g.clientName] = (clientMap[g.clientName] || 0) + g.earnings;
                  });
                  const clients = Object.entries(clientMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  const maxClient = Math.max(...clients.map((c) => c[1]), 1);
                  return clients.length === 0 ? (
                    <p className="dashboard-no-data">No data.</p>
                  ) : clients.map(([name, total]) => (
                    <div key={name} className="dashboard-bar-row">
                      <span className="dashboard-bar-label dashboard-bar-label--client">{name}</span>
                      <div className="dashboard-bar-track">
                        <div
                          className="dashboard-bar-fill dashboard-bar-fill--client"
                          style={{ width: `${(total / maxClient) * 100}%` }}
                        />
                      </div>
                      <span className="dashboard-bar-value">${total.toFixed(0)}</span>
                    </div>
                  ));
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