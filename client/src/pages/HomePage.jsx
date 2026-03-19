import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to GigTrack</h1>
      <p className="lead">Track your side hustles and earnings in one place.</p>
      <div className="d-flex gap-3 justify-content-center mt-4">
        <Button variant="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="outline-primary" onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>
    </Container>
  );
}