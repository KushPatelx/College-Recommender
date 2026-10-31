import { useState } from "react";
import {
  GraduationCap,
  Menu,
  Sparkles,
  X,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth";

export default function SiteHeader() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuth = localStorage.getItem("isAuth") === "true";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    // Immediately clear frontend authentication.
    localStorage.removeItem("isAuth");

    try {
      // Clean up backend session.
      await logoutUser();
    } catch (error) {
      console.error("Backend logout error:", error);
    } finally {
      setIsMenuOpen(false);

      // Full reload ensures App.jsx reads updated auth state.
      window.location.replace("/login");
    }
  };

  const handleSmoothScroll = (e) => {
    e.preventDefault();

    setIsMenuOpen(false);

    const section = document.getElementById("explore");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="site-header">
      <div className="page-container nav-inner">

        <Link
          className="brand"
          to="/"
          aria-label="Pathwise home"
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>

          <span className="brand-copy">
            <strong>
              pathwise<span>.</span>
            </strong>

            <small>ENGINEERING, REIMAGINED</small>
          </span>
        </Link>

        <nav className="desktop-nav">
          <a href="#explore" onClick={handleSmoothScroll}>
            How it works
          </a>

          <Link to="/recommender">
            Find colleges
          </Link>

          {isAuth ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        {isAuth ? (
          <Link className="nav-cta" to="/recommender">
            Go to Dashboard <Sparkles size={15} />
          </Link>
        ) : (
          <Link className="nav-cta" to="/signup">
            Get Started <Sparkles size={15} />
          </Link>
        )}

        <button
          type="button"
          className="mobile-menu"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {isMenuOpen && (
        <div className="pw-mobile-dropdown">

          <a href="#explore" onClick={handleSmoothScroll}>
            How it works
          </a>

          <Link
            to="/recommender"
            onClick={() => setIsMenuOpen(false)}
          >
            Find colleges
          </Link>

          {isAuth ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}

        </div>
      )}
    </header>
  );
}