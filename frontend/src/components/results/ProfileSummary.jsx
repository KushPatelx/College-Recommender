import {
  Activity,
  CheckCircle2,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

export default function ProfileSummary({ formData, results }) {
  return (
    <section className="pw-summary-card">

      <div className="pw-summary-top">
        <div className="pw-summary-heading">
          <div className="pw-summary-icon">
            <Activity size={19} />
          </div>

          <div>
            <span>YOUR CURRENT PROFILE</span>
            <h3>Academic overview</h3>
          </div>
        </div>

        {results && (
          <div className="pw-summary-verified">
            <CheckCircle2 size={15} />
            Profile evaluated
          </div>
        )}
      </div>

      <div className="pw-summary-metrics">

        <div className="pw-summary-metric">
          <span>SSC MARKS</span>
          <strong>{formData.ssc_marks}%</strong>
          <small>Secondary school</small>
        </div>

        <div className="pw-summary-metric">
          <span>HSC MARKS</span>
          <strong>{formData.hsc_marks}%</strong>
          <small>Higher secondary</small>
        </div>

        <div className="pw-summary-metric pw-summary-highlight">
          <span>
            <ChartNoAxesColumnIncreasing size={13} />
            CET PERCENTILE
          </span>

          <strong>{formData.percentile}%ile</strong>
          <small>{formData.category} category</small>
        </div>

        <div className="pw-summary-metric">
          <span>
            <GraduationCap size={13} />
            PREFERRED DOMAIN
          </span>

          <strong className="pw-summary-domain">
            {formData.pref_domain}
          </strong>

          <small>{formData.pref_city_tier}</small>
        </div>

      </div>

      {results && (
        <div className="pw-summary-evaluation">
          <div>
            <CheckCircle2 size={16} />
            <span>
              <strong>{results.total_evaluated}</strong>
              colleges evaluated
            </span>
          </div>

          <div>
            <CheckCircle2 size={16} />
            <span>
              <strong>{results.qualified_branches}</strong>
              qualified branches
            </span>
          </div>
        </div>
      )}

    </section>
  );
}