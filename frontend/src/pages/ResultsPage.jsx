import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { formatINR } from "../utils/format";
import { getProbabilityTheme } from "../utils/probability";
import ProfileSummary from "../components/results/ProfileSummary";
import ResultsPanel from "../components/results/ResultsPanel";
import useScrollReveal from "../hooks/useScrollReveal";

export default function ResultsPage({ formData, results, loading, error }) {
  useScrollReveal();
  return (
    <div className="app-shell">
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

          <Link className="nav-cta" to="/recommender">
            <ArrowLeft size={15} />
            Edit my profile
          </Link>
        </div>
      </header>

      <main>
        <section className="workspace section-reveal">
          <div className="page-container">
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">YOUR ADMISSION WORKSPACE</span>
                <h2>
                  Your next move <span>starts here.</span>
                </h2>
                <p>
                  Review your profile and explore colleges ranked by the hybrid
                  recommendation engine.
                </p>
              </div>
            </div>

            <div className="dashboard-grid">
              <section className="results-column">
                <ProfileSummary formData={formData} results={results} />

                <ResultsPanel
                  results={results}
                  loading={loading}
                  error={error}
                  formatINR={formatINR}
                  getProbabilityTheme={getProbabilityTheme}
                />

                <Link className="text-link" to="/recommender">
                  <ArrowLeft size={15} />
                  Back to student profile
                </Link>
              </section>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-inner">
          <span className="footer-mark">
            <GraduationCap size={17} />
            HYBRID ENGINEERING COLLEGE RECOMMENDER
          </span>
          <span>Decision support, powered by data.</span>
        </div>
      </footer>
    </div>
  );
}
