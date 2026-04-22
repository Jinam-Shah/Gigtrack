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
      <Card
        className="register-card"
        as="section"
        aria-labelledby="register-heading"
      >
        <Card.Body>
          <h1 id="register-heading" className="register-title">
            Create Account
          </h1>

          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reg-name">Name</Form.Label>
              <Form.Control
                id="reg-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reg-email">Email</Form.Label>
              <Form.Control
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reg-password">Password</Form.Label>
              <Form.Control
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password"
                autoComplete="new-password"
                required
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
