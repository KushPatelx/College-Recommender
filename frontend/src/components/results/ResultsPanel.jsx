import {
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";
import RecommendationCard from "./RecommendationCard";

function EmptyState() {
  return (
    <div className="pw-empty-state">
      <div className="pw-empty-icon">
        <GraduationCap size={32} />
      </div>

      <span>YOUR NEXT CHAPTER</span>

      <h3>Your college shortlist starts here.</h3>

      <p>
        Generate recommendations using your academic profile and
        preferences. Your best-fit colleges will appear here.
      </p>

      <Link to="/recommender" className="pw-empty-button">
        Create my profile
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="pw-loading-list" aria-label="Loading recommendations">
      {[1, 2, 3].map((item) => (
        <div className="pw-loading-card" key={item}>
          <div className="pw-skeleton pw-skeleton-small" />
          <div className="pw-skeleton pw-skeleton-title" />
          <div className="pw-skeleton pw-skeleton-line" />
          <div className="pw-skeleton pw-skeleton-line short" />
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
  const recommendations = results?.recommendations || [];

  return (
    <section className="pw-results-panel">

      <div className="pw-results-panel-heading">
        <div>
          <span className="pw-engine-label">
            <Sparkles size={14} />
            POWERED BY HYBRID ENGINE
          </span>

          <h3>Your college shortlist</h3>

          <p>
            Ranked colleges with admission estimates and preference matching.
          </p>
        </div>

        {results && (
          <div className="pw-match-count">
            <strong>
              {recommendations.length.toString().padStart(2, "0")}
            </strong>
            <span>matches</span>
          </div>
        )}
      </div>

      {error && (
        <div className="pw-error-state">
          <div className="pw-error-icon">
            <ShieldAlert size={21} />
          </div>

          <div>
            <strong>Unable to generate recommendations</strong>
            <p>{error}</p>
            <small>
              Please check that your backend server is running and try again.
            </small>
          </div>
        </div>
      )}

      {loading && <LoadingState />}

      {!results && !loading && !error && <EmptyState />}

      {results && recommendations.length === 0 && !loading && (
        <div className="pw-no-results">
          <div className="pw-no-results-icon">
            <AlertTriangle size={25} />
          </div>

          <h3>No matching colleges found.</h3>

          <p>
            No colleges crossed the 30% probability threshold.
            Try adjusting your CET percentile, category or domain preferences.
          </p>

          <Link to="/recommender" className="pw-empty-button">
            <RefreshCw size={15} />
            Adjust my profile
          </Link>
        </div>
      )}

      {recommendations.length > 0 && !loading && (
        <div className="pw-recommendation-list">
          {recommendations.map((item) => (
            <RecommendationCard
              key={item.rank}
              item={item}
              formatINR={formatINR}
              getProbabilityTheme={getProbabilityTheme}
            />
          ))}
        </div>
      )}

      {recommendations.length > 0 && !loading && (
        <div className="pw-results-disclaimer">
          <div>
            <ShieldAlert size={16} />
            <strong>Important information</strong>
          </div>

          <p>
            Admission probabilities are estimates based on the model
            and available data. They do not guarantee admission.
          </p>
        </div>
      )}

    </section>
  );
}