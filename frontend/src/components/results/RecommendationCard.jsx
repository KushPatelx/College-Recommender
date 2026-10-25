import {
  Award,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  TrendingUp,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

function Metric({ icon: Icon, label, children, className = "" }) {
  return (
    <div className={`metric ${className}`}>
      <span className="metric-label">
        <Icon size={14} />
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
  return (
    <article className="recommendation-card reveal-item">
      <div className="card-topline">
        <span className="rank-label">
          RANK <b>{String(item.rank).padStart(2, "0")}</b>
        </span>
        <div className="college-tags">
          <span>{item.college_tier}</span>
          <span>{item.institute_type}</span>
        </div>
        <span className="card-open">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="college-title-row">
        <div className="college-monogram">
          <Cpu size={20} />
        </div>
        <div className="college-title">
          <h3>{item.college_name}</h3>
          <p>
            {item.branch_name} <span>· {item.course_domain}</span>
          </p>
        </div>
        <div className="hybrid-score">
          <span>HYBRID SCORE</span>
          <strong>
            {item.final_rank_score}
            <small>%</small>
          </strong>
          <small>profile match</small>
        </div>
      </div>
      <div className="metrics-grid">
        <Metric icon={IndianRupee} label="Category-specific annual fee">
          {formatINR(item.expected_fees)}
        </Metric>
        <Metric icon={MapPin} label="Location">
          {item.city_name}
          <small className="metric-sub">{item.city_tier}</small>
        </Metric>
        <Metric icon={TrendingUp} label="Avg / max package">
          ₹{item.avg_package_lpa}L{" "}
          <small className="package-max">/ ₹{item.highest_package_lpa}L</small>
        </Metric>
        <Metric icon={Award} label="Preference fit">
          {item.preference_score}%
        </Metric>
      </div>
      <div className="probability-block">
        <div className="probability-heading">
          <span>
            <ProbabilityIcon size={15} /> ML admission probability{" "}
            <b className={theme.className}>{theme.label}</b>
          </span>
          <strong>{item.admission_probability}%</strong>
        </div>
        <div className="probability-track">
          <span
            className={theme.className}
            style={{
              width: `${Math.min(100, Math.max(5, item.admission_probability))}%`,
            }}
          />
        </div>
      </div>
      <div className="recruiters-row">
        <BriefcaseBusiness size={14} />
        <span>
          <b>Recruiters</b> · {item.top_recruiters || "Not specified"}
        </span>
      </div>
    </article>
  );
}
