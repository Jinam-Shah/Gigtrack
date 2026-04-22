import { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./GigForm.css";

const EMPTY_FORM = {
  title: "",
  clientName: "",
  gigType: "tutoring",
  date: "",
  hoursWorked: "",
  rate: "",
  rateType: "hourly",
  clientRating: "",
  clientNote: "",
  status: "completed",
};

export default function GigForm({ onSuccess, existingGig }) {
  const [formData, setFormData] = useState(
    existingGig
      ? {
          ...existingGig,
          date: existingGig.date?.slice(0, 10),
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = existingGig ? `/api/gigs/${existingGig._id}` : "/api/gigs";
      const method = existingGig ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          hoursWorked: parseFloat(formData.hoursWorked) || 0,
          rate: parseFloat(formData.rate),
          clientRating: formData.clientRating
            ? parseInt(formData.clientRating)
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save gig");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isFlat = formData.rateType === "flat";

  return (
    <div className="gigform-wrapper" role="region" aria-label={existingGig ? "Edit gig form" : "Log new gig form"}>
      <h2 className="gigform-title">
        {existingGig ? "Edit Gig" : "Log a New Gig"}
      </h2>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-title">Title</Form.Label>
              <Form.Control
                id="gig-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Math tutoring session"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-client">Client Name</Form.Label>
              <Form.Control
                id="gig-client"
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-type">Gig Type</Form.Label>
              <Form.Select
                id="gig-type"
                name="gigType"
                value={formData.gigType}
                onChange={handleChange}
              >
                <option value="tutoring">Tutoring</option>
                <option value="delivery">Delivery</option>
                <option value="design">Design</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-date">Date</Form.Label>
              <Form.Control
                id="gig-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-rate">Rate ($)</Form.Label>
              <Form.Control
                id="gig-rate"
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                aria-describedby="rate-hint"
                required
              />
              <Form.Text id="rate-hint" muted>
                {isFlat ? "Total flat fee" : "Amount per hour"}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-rate-type">Rate Type</Form.Label>
              <Form.Select
                id="gig-rate-type"
                name="rateType"
                value={formData.rateType}
                onChange={handleChange}
              >
                <option value="hourly">Hourly</option>
                <option value="flat">Flat</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-hours">Hours Worked</Form.Label>
              <Form.Control
                id="gig-hours"
                type="number"
                name="hoursWorked"
                value={formData.hoursWorked}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.5"
                disabled={isFlat}
                aria-disabled={isFlat}
                aria-describedby="hours-hint"
              />
              {isFlat && (
                <Form.Text id="hours-hint" muted>
                  Not used for flat rate
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-rating">Client Rating (1–5)</Form.Label>
              <Form.Select
                id="gig-rating"
                name="clientRating"
                value={formData.clientRating}
                onChange={handleChange}
              >
                <option value="">No rating</option>
                <option value="1">1 — Poor</option>
                <option value="2">2 — Fair</option>
                <option value="3">3 — Good</option>
                <option value="4">4 — Great</option>
                <option value="5">5 — Excellent</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="gig-status">Status</Form.Label>
              <Form.Select
                id="gig-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="unpaid">Unpaid</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="gig-note">Client Note</Form.Label>
          <Form.Control
            id="gig-note"
            as="textarea"
            name="clientNote"
            value={formData.clientNote}
            onChange={handleChange}
            placeholder="Any notes about this client..."
            rows={2}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : existingGig ? "Update Gig" : "Log Gig"}
        </Button>
      </Form>
    </div>
  );
}

GigForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  existingGig: PropTypes.object,
};

GigForm.defaultProps = {
  existingGig: null,
};
