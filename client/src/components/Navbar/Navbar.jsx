import { useNavigate, useLocation } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    onLogout();
    navigate("/login");
  }

  return (
    <>
      {/* Skip to main content — visible on focus for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <BSNavbar className="gigtrack-navbar" expand="md" as="nav" aria-label="Main navigation">
        <Container>
          {/* Brand as a button — fully keyboard accessible */}
          <button
            className="gigtrack-brand navbar-brand"
            onClick={() => navigate("/")}
            aria-label="GigTrack home"
          >
            💼 GigTrack
          </button>

          <BSNavbar.Toggle
            aria-controls="main-nav"
            aria-label="Toggle navigation menu"
          />
          <BSNavbar.Collapse id="main-nav">
            <Nav className="me-auto" as="ul">
              {user && (
                <>
                  <li className="nav-item">
                    <Nav.Link
                      as="button"
                      className="nav-link"
                      onClick={() => navigate("/gigs")}
                      aria-current={
                        location.pathname === "/gigs" ? "page" : undefined
                      }
                    >
                      My Gigs
                    </Nav.Link>
                  </li>
                  <li className="nav-item">
                    <Nav.Link
                      as="button"
                      className="nav-link"
                      onClick={() => navigate("/dashboard")}
                      aria-current={
                        location.pathname === "/dashboard" ? "page" : undefined
                      }
                    >
                      Dashboard
                    </Nav.Link>
                  </li>
                  <li className="nav-item">
                    <Nav.Link
                      as="button"
                      className="nav-link"
                      onClick={() => navigate("/goals")}
                      aria-current={
                        location.pathname === "/goals" ? "page" : undefined
                      }
                    >
                      Goals
                    </Nav.Link>
                  </li>
                </>
              )}
            </Nav>

            <Nav as="ul">
              {user ? (
                <li className="nav-item">
                  <div className="gigtrack-user-area">
                    <span className="gigtrack-username" aria-label={`Logged in as ${user.name}`}>
                      Hi, {user.name}
                    </span>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </li>
              ) : (
                <li className="nav-item">
                  <div className="gigtrack-user-area">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </Button>
                  </div>
                </li>
              )}
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
};
