import { ArrowDown, Activity, GraduationCap } from "lucide-react";
import { DEMO_PRESETS } from "../data/config";
import { formatINR } from "../utils/format";
import PresetBar from "../components/profile/PresetBar";
import ProfileForm from "../components/profile/ProfileForm";
import useScrollReveal from "../hooks/useScrollReveal";

export default function RecommenderPage({
  formData,
  onChange,
  onSubmit,
  onPresetSelect,
  loading,
}) {
  useScrollReveal();
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="page-container nav-inner">
          <a className="brand" href="/" aria-label="Pathwise home">
            <span className="brand-icon">
              <GraduationCap size={21} strokeWidth={2.2} />
            </span>
            <span className="brand-copy">
              <strong>
                pathwise<span>.</span>
              </strong>
              <small>ENGINEERING, REIMAGINED</small>
            </span>
          </a>

          <a className="text-link" href="/">
            Back to home
          </a>
        </div>
      </header>

      <main>
        <section className="workspace section-reveal" id="recommender">
          <div className="page-container">
            <PresetBar presets={DEMO_PRESETS} onSelect={onPresetSelect} />

            <div className="workspace-heading">
              <div>
                <span className="eyebrow">
                  <Activity size={14} /> YOUR ADMISSION WORKSPACE
                </span>
                <h2>
                  Make your next move <span>with clarity.</span>
                </h2>
                <p>
                  Tune your profile, then let the hybrid engine find your
                  best-fit colleges.
                </p>
              </div>

              <a className="text-link" href="/results">
                Explore results <ArrowDown size={15} />
              </a>
            </div>

            <div className="dashboard-grid">
              <ProfileForm
                formData={formData}
                onChange={onChange}
                onSubmit={onSubmit}
                loading={loading}
                formatINR={formatINR}
              />
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
