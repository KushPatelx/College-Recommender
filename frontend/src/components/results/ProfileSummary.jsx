import { Activity, CheckCircle2 } from "lucide-react";

export default function ProfileSummary({ formData, results }) {
  return (
    <div className="profile-summary reveal-item">
      <div className="summary-icon"><Activity size={17} /></div>
      <div className="summary-copy"><span>ACTIVE PROFILE</span><div className="summary-pills"><span>SSC <b>{formData.ssc_marks}%</b></span><span>HSC <b>{formData.hsc_marks}%</b></span><span className="summary-highlight">CET <b>{formData.percentile}%ile</b> · {formData.category}</span></div></div>
      {results && <div className="summary-evaluation"><CheckCircle2 size={15} /><span><b>{results.total_evaluated}</b> evaluated <i>·</i> <b>{results.qualified_branches}</b> qualified</span></div>}
    </div>
  );
}
