import { GraduationCap, Menu, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="site-header">
      <div className="page-container nav-inner">
        <Link className="brand" to="/" aria-label="Pathwise home">
          <span className="brand-icon">
            <GraduationCap size={21} strokeWidth={2.2} />
          </span>

          <span className="brand-copy">
            <strong>
              pathwise<span>.</span>
            </strong>
            <small>ENGINEERING, REIMAGINED</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/">How it works</Link>
          <Link to="/recommender">Find colleges</Link>
          <Link to="/results">Recommendations</Link>
        </nav>

        <Link className="nav-cta" to="/recommender">
          Build my shortlist <Sparkles size={15} />
        </Link>

        <Link
          className="mobile-menu"
          to="/recommender"
          aria-label="Go to recommender"
        >
          <Menu size={22} />
        </Link>
      </div>
    </header>
  );
}
