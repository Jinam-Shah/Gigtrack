import { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./RegisterForm.css";

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="register-container">
      <Card className="register-card">
        <Card.Body>
          <h2 className="register-title">Create Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-name">Name</Form.Label>
              <Form.Control
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-email">Email</Form.Label>
              <Form.Control
                id="register-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="register-password">Password</Form.Label>
              <Form.Control
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password"
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

RegisterForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
