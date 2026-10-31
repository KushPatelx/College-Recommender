import {
  Award,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  Building2,
} from "lucide-react";

function Metric({ icon: Icon, label, children, className = "" }) {
  return (
    <div className={`pw-college-metric ${className}`}>
      <span className="pw-metric-label">
        <Icon size={15} />
        {label}
      </span>

      <strong>{children}</strong>
    </div>
  );
}

export default function RecommendationCard({
  item,
  formatINR,
  getProbabilityTheme,
}) {
  const theme = getProbabilityTheme(item.admission_probability);
  const ProbabilityIcon = theme.icon;

  const probabilityWidth = Math.min(
    100,
    Math.max(5, Number(item.admission_probability) || 0)
  );

  return (
    <article className="pw-college-card">

      {/* TOP LINE */}
      <div className="pw-college-card-top">

        <div className="pw-rank-badge">
          <span>RANK</span>
          <strong>{String(item.rank).padStart(2, "0")}</strong>
        </div>

        <div className="pw-college-tags">
          <span>{item.college_tier}</span>
          <span>{item.institute_type}</span>
        </div>

        <div className="pw-college-card-mark">
          <ArrowUpRight size={17} />
        </div>

      </div>

      {/* COLLEGE NAME */}
      <div className="pw-college-title-row">

        <div className="pw-college-monogram">
          <Building2 size={23} />
        </div>

        <div className="pw-college-title">
          <h3>{item.college_name}</h3>

          <p>
            {item.branch_name}
            <span> · {item.course_domain}</span>
          </p>
        </div>

        <div className="pw-hybrid-score">
          <span>HYBRID SCORE</span>

          <strong>
            {item.final_rank_score}
            <small>%</small>
          </strong>

          <small>profile match</small>
        </div>

      </div>

      {/* METRICS */}
      <div className="pw-college-metrics-grid">

        <Metric icon={IndianRupee} label="Annual fee">
          {formatINR(item.expected_fees)}
        </Metric>

        <Metric icon={MapPin} label="Location">
          {item.city_name}
          <small className="pw-metric-sub">
            {item.city_tier}
          </small>
        </Metric>

        <Metric icon={TrendingUp} label="Placement package">
          ₹{item.avg_package_lpa}L
          <small className="pw-package-max">
            / ₹{item.highest_package_lpa}L
          </small>
        </Metric>

        <Metric icon={Award} label="Preference fit">
          {item.preference_score}%
        </Metric>

      </div>

      {/* PROBABILITY */}
      <div className="pw-probability-section">

        <div className="pw-probability-heading">
          <div>
            <span className="pw-probability-label">
              <ProbabilityIcon size={16} />
              ML admission probability
            </span>

            <span className={`pw-probability-status ${theme.className}`}>
              {theme.label}
            </span>
          </div>

          <strong>{item.admission_probability}%</strong>
        </div>

        <div className="pw-probability-track">
          <span
            className={theme.className}
            style={{ width: `${probabilityWidth}%` }}
          />
        </div>

      </div>

      {/* RECRUITERS */}
      <div className="pw-recruiters-row">
        <div className="pw-recruiters-icon">
          <BriefcaseBusiness size={16} />
        </div>

        <span>
          <strong>Top recruiters</strong>
          <span className="pw-recruiters-separator">·</span>
          {item.top_recruiters || "Not specified"}
        </span>
      </div>

    </article>
  );
} 