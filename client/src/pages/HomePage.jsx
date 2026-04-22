import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="homepage-hero" aria-labelledby="home-heading">
      <Container className="homepage-container">
        <div className="homepage-content">
          <p className="homepage-eyebrow">Your side hustle command center</p>
          <h1 id="home-heading" className="homepage-title">
            💼 GigTrack
          </h1>
          <p className="homepage-description">
            Log every gig, rate your clients, and hit your monthly income goals
            — all in one place built for the gig economy.
          </p>
          <div className="homepage-actions">
            <Button
              variant="primary"
              size="lg"
              className="homepage-btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started — it&apos;s free
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              className="homepage-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
          <ul className="homepage-features" aria-label="Key features">
            <li>📋 Track gigs with client ratings</li>
            <li>📊 Visual earnings dashboard</li>
            <li>🎯 Monthly income goals &amp; streaks</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
