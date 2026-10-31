import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

import { Link } from "react-router-dom";
import { formatINR } from "../utils/format";
import { getProbabilityTheme } from "../utils/probability";

import ProfileSummary from "../components/results/ProfileSummary";
import ResultsPanel from "../components/results/ResultsPanel";
import useScrollReveal from "../hooks/useScrollReveal";

export default function ResultsPage({
  formData,
  results,
  loading,
  error,
}) {
  useScrollReveal();

  return (
    <div className="pw-results-shell">

      <header className="pw-results-header">
        <div className="pw-results-header-inner">

          <Link to="/" className="pw-brand">
            <span className="pw-brand-icon">
              <GraduationCap size={22} />
            </span>

            <span className="pw-brand-copy">
              <strong>pathwise<span>.</span></strong>
              <small>YOUR ADMISSION COMPASS</small>
            </span>
          </Link>

          <Link to="/recommender" className="pw-edit-profile">
            <ArrowLeft size={16} />
            Edit my profile
          </Link>

        </div>
      </header>

      <main className="pw-results-main">
        <div className="pw-results-container">

          <div className="pw-results-welcome">
            <div>
              <span className="pw-eyebrow">
                <LayoutDashboard size={15} />
                YOUR ADMISSION DASHBOARD
              </span>

              <h1>
                Your next move <span>starts here.</span>
              </h1>

              <p>
                Explore your personalised engineering college shortlist,
                ranked using your academic profile and preferences.
              </p>
            </div>

            <div className="pw-results-status">
              <span className="pw-status-dot" />
              Recommendation workspace
            </div>
          </div>

          <ProfileSummary
            formData={formData}
            results={results}
          />

          <div className="pw-results-section-heading">
            <div>
              <span className="pw-section-label">
                <Sparkles size={14} />
                YOUR PERSONALISED SHORTLIST
              </span>

              <h2>College recommendations</h2>

              <p>
                Compare your best-fit colleges and explore the details
                behind each recommendation.
              </p>
            </div>

            <Link to="/recommender" className="pw-secondary-link">
              Update preferences
            </Link>
          </div>

          <ResultsPanel
            results={results}
            loading={loading}
            error={error}
            formatINR={formatINR}
            getProbabilityTheme={getProbabilityTheme}
          />

        </div>
      </main>

      <footer className="pw-results-footer">
        <div className="pw-results-footer-inner">
          <span>
            <GraduationCap size={17} />
            PATHWISE
          </span>

          <p>Smarter choices. Better possibilities.</p>
        </div>
      </footer>

    </div>
  );
}