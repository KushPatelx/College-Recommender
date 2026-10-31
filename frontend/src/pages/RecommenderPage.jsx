import {
  ArrowLeft,
  ArrowDown,
  Activity,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

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
    <div className="pw-app-shell">
      <header className="pw-work-header">
        <div className="pw-work-header-inner">
          <a className="pw-brand" href="/" aria-label="Pathwise home">
            <span className="pw-brand-icon">
              <GraduationCap size={22} />
            </span>

            <span className="pw-brand-copy">
              <strong>pathwise<span>.</span></strong>
              <small>YOUR ADMISSION COMPASS</small>
            </span>
          </a>

          <a href="/" className="pw-back-link">
            <ArrowLeft size={16} />
            Back to home
          </a>
        </div>
      </header>

      <main className="pw-work-main">
        <div className="pw-work-container">

          <div className="pw-work-welcome">
            <div>
              <span className="pw-eyebrow">
                <Activity size={15} />
                ADMISSION PLANNER
              </span>

              <h1>
                Your future starts <span>with a choice.</span>
              </h1>

              <p>
                Share your academic profile and preferences to discover
                engineering colleges that match your goals.
              </p>
            </div>

            <div className="pw-secure-note">
              <ShieldCheck size={17} />
              <span>Personalised profile analysis</span>
            </div>
          </div>

          <PresetBar
            presets={DEMO_PRESETS}
            onSelect={onPresetSelect}
          />

          <div className="pw-form-intro">
            <div>
              <span className="pw-section-label">BUILD YOUR PROFILE</span>
              <h2>Tell us about yourself.</h2>
              <p>
                Complete both sections to generate your college shortlist.
              </p>
            </div>

            <a href="#student-profile" className="pw-text-link">
              Go to profile <ArrowDown size={15} />
            </a>
          </div>

          <div id="student-profile">
            <ProfileForm
              formData={formData}
              onChange={onChange}
              onSubmit={onSubmit}
              loading={loading}
              formatINR={formatINR}
            />
          </div>

        </div>
      </main>

      <footer className="pw-work-footer">
        <div className="pw-work-footer-inner">
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