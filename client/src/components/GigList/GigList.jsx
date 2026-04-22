import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import GigCard from "../GigCard/GigCard.jsx";
import GigForm from "../GigForm/GigForm.jsx";
import PropTypes from "prop-types";
import "./GigList.css";

export default function GigList({ userId }) {
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingGig, setEditingGig] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    type: "",
    client: "",
    startDate: "",
    endDate: "",
  });

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.client) params.append("client", filters.client);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await fetch(`/api/gigs?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load gigs");
      } else {
        setGigs(data);
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this gig?")) return;
    try {
      const res = await fetch(`/api/gigs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchGigs();
    } catch (err) {
      setError("Failed to delete gig.");
    }
  }

  function handleEdit(gig) {
    setEditingGig(gig);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingGig(null);
    fetchGigs();
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Container className="giglist-container">
      {/* Page header */}
      <div className="giglist-header">
        <h1 className="giglist-heading">My Gigs</h1>
        <div className="giglist-header-actions">
          {/* View toggle */}
          <div
            className="giglist-view-toggle"
            role="group"
            aria-label="View mode"
          >
            <button
              className={`giglist-view-btn ${viewMode === "grid" ? "giglist-view-btn--active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`giglist-view-btn ${viewMode === "list" ? "giglist-view-btn--active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setEditingGig(null);
              setShowForm(!showForm);
            }}
            aria-expanded={showForm}
            aria-controls="gig-form-region"
          >
            {showForm ? "Cancel" : "+ Log a Gig"}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div id="gig-form-region">
          <GigForm onSuccess={handleFormSuccess} existingGig={editingGig} />
        </div>
      )}

      {/* Filters */}
      <fieldset className="giglist-filters">
        <legend className="giglist-filters-legend">Filter Gigs</legend>
        <Row className="g-2">
          <Col md={3} sm={6}>
            <Form.Label htmlFor="filter-type" className="visually-hidden">
              Gig type
            </Form.Label>
            <Form.Select
              id="filter-type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="tutoring">Tutoring</option>
              <option value="delivery">Delivery</option>
              <option value="design">Design</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </Form.Select>
          </Col>
          <Col md={3} sm={6}>
            <Form.Label htmlFor="filter-client" className="visually-hidden">
              Client name
            </Form.Label>
            <Form.Control
              id="filter-client"
              type="text"
              name="client"
              placeholder="Filter by client"
              value={filters.client}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} sm={6}>
            <Form.Label htmlFor="filter-start" className="visually-hidden">
              Start date
            </Form.Label>
            <Form.Control
              id="filter-start"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} sm={6}>
            <Form.Label htmlFor="filter-end" className="visually-hidden">
              End date
            </Form.Label>
            <Form.Control
              id="filter-end"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2} sm={12}>
            <Button
              variant="outline-secondary"
              onClick={fetchGigs}
              className="w-100"
            >
              Apply
            </Button>
          </Col>
        </Row>
      </fieldset>

      {/* Results count */}
      {!loading && gigs.length > 0 && (
        <p className="giglist-count" aria-live="polite">
          {gigs.length} gig{gigs.length !== 1 ? "s" : ""} found
        </p>
      )}

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {/* Gigs */}
      <section aria-live="polite" aria-label="Gigs list">
        {loading && <p className="giglist-loading">Loading gigs...</p>}

        {!loading && gigs.length === 0 && (
          <p className="giglist-empty">No gigs found. Log your first gig!</p>
        )}

        {!loading && gigs.length > 0 && (
          <div
            className={
              viewMode === "grid" ? "giglist-grid" : "giglist-list"
            }
          >
            {gigs.map((gig) => (
              <GigCard
                key={gig._id}
                gig={gig}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

GigList.propTypes = {
  userId: PropTypes.string.isRequired,
};
