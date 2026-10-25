import {
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import RecommendationCard from "./RecommendationCard";

function EmptyState() {
  return (
    <div className="empty-state section-reveal">
      <div className="empty-icon">
        <GraduationCap size={30} />
      </div>
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h3>Your shortlist starts here.</h3>
      <p>
        Adjust your profile and preferences, or pick a demo scenario above. Your
        recommendations will appear here, ranked by model probability and
        preference fit.
      </p>
      <div className="empty-decoration">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-list" aria-label="Loading recommendations">
      {[1, 2, 3].map((item) => (
        <div className="loading-card" key={item}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

export default function ResultsPanel({
  results,
  loading,
  error,
  formatINR,
  getProbabilityTheme,
}) {
  return (
    <div className="results-panel">
      <div className="results-heading reveal-item">
        <div>
          <span className="eyebrow">
            <Sparkles size={13} /> THE HYBRID ENGINE
          </span>
          <h2>
            Your college <em>shortlist.</em>
          </h2>
          <p>Ranked options, with the signals behind each match.</p>
        </div>
        {results && (
          <span className="result-count">
            {results.recommendations.length.toString().padStart(2, "0")}{" "}
            <small>matches</small>
          </span>
        )}
      </div>
      {error && (
        <div className="error-state">
          <div className="error-icon">
            <ShieldAlert size={20} />
          </div>
          <div>
            <strong>Backend connection error</strong>
            <p>{error}</p>
            <small>
              Check that your FastAPI server is running on port 8000.
            </small>
          </div>
        </div>
      )}
      {loading && <LoadingState />}
      {!results && !loading && !error && <EmptyState />}
      {results && results.recommendations.length === 0 && !loading && (
        <div className="no-results">
          <AlertTriangle size={24} />
          <h3>No colleges crossed the 30% probability threshold.</h3>
          <p>
            Try a higher MHT-CET percentile or adjust category and domain
            preferences.
          </p>
        </div>
      )}
      {results && results.recommendations.length > 0 && !loading && (
        <div className="recommendation-list">
          {results.recommendations.map((item) => (
            <RecommendationCard
              key={item.rank}
              item={item}
              formatINR={formatINR}
              getProbabilityTheme={getProbabilityTheme}
            />
          ))}
        </div>
      )}
      {results && results.recommendations.length > 0 && !loading && (
        <div className="results-footnote">
          <span>
            <span className="footnote-dot" /> MODEL OUTPUT
          </span>
          <p>
            Admission probabilities are estimates based on the model and
            available data, not a guarantee of admission.
          </p>
          <ArrowUpRight size={15} />
        </div>
      )}
    </div>
  );
}
