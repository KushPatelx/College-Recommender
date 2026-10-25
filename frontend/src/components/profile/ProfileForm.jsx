import {
  Layers3,
  UserRound,
  SlidersHorizontal,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import FormField from "./FormField";

const inputClass = "field-control";

export default function ProfileForm({
  formData,
  onChange,
  onSubmit,
  loading,
  formatINR,
}) {
  return (
    <aside className="profile-panel reveal-item">
      <div className="panel-header">
        <div className="panel-heading-icon">
          <SlidersHorizontal size={20} />
        </div>

        <div>
          <span className="panel-kicker">PERSONALISE YOUR SEARCH</span>
          <h3>Student profile</h3>
        </div>

        <span className="panel-step">
          01 <span>/ 02</span>
        </span>
      </div>

      <form onSubmit={onSubmit} className="profile-form">
        <div className="profile-sections">
          {/* SECTION 01: ACADEMICS */}
          <section className="profile-section academic-section">
            <div className="form-section-title">
              <span className="section-number">01</span>
              <div>
                <strong>Academic snapshot</strong>
                <small>Your current academic profile</small>
              </div>
              <UserRound size={19} />
            </div>

            <div className="field-grid">
              <FormField label="SSC marks (%)">
                <input
                  className={inputClass}
                  type="number"
                  name="ssc_marks"
                  step="0.1"
                  min="35"
                  max="100"
                  value={formData.ssc_marks}
                  onChange={onChange}
                  required
                />
              </FormField>

              <FormField label="HSC marks (%)">
                <input
                  className={inputClass}
                  type="number"
                  name="hsc_marks"
                  step="0.1"
                  min="35"
                  max="100"
                  value={formData.hsc_marks}
                  onChange={onChange}
                  required
                />
              </FormField>
            </div>

            <FormField label="MHT-CET percentile">
              <div className="percentile-control">
                <input
                  className={inputClass}
                  type="number"
                  name="percentile"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.percentile}
                  onChange={onChange}
                  required
                />
                <span>{formData.percentile}%ile</span>
              </div>

              <div className="range-track">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(formData.percentile) || 0),
                    )}%`,
                  }}
                />
              </div>
            </FormField>

            <FormField label="Social category">
              <select
                className={inputClass}
                name="category"
                value={formData.category}
                onChange={onChange}
              >
                <option value="OPEN">OPEN (General State Merit)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="VJ/NT">
                  VJ/NT (Vimukta Jati / Nomadic Tribes)
                </option>
              </select>
            </FormField>
          </section>

          {/* SECTION 02: PREFERENCES */}
          <section className="profile-section preferences-section">
            <div className="form-section-title">
              <span className="section-number">02</span>
              <div>
                <strong>What matters to you</strong>
                <small>Shape the shortlist around your priorities</small>
              </div>
              <Layers3 size={19} />
            </div>

            <FormField label="Preferred annual fee budget">
              <div className="budget-value">
                {formatINR(formData.pref_budget)}
              </div>

              <input
                className="budget-range"
                type="range"
                name="pref_budget"
                min="15000"
                max="250000"
                step="5000"
                value={formData.pref_budget}
                onChange={onChange}
              />

              <div className="range-labels">
                <span>₹15k</span>
                <span>₹1.25L</span>
                <span>₹2.5L</span>
              </div>
            </FormField>

            <FormField label="Preferred location">
              <select
                className={inputClass}
                name="pref_city_tier"
                value={formData.pref_city_tier}
                onChange={onChange}
              >
                <option value="Tier 1">Tier 1 — Mumbai / Pune metro</option>
                <option value="Tier 2">Tier 2 — Regional urban hubs</option>
              </select>
            </FormField>

            <FormField label="Domain of interest">
              <select
                className={inputClass}
                name="pref_domain"
                value={formData.pref_domain}
                onChange={onChange}
              >
                <option value="IT/Software">
                  IT / Software (CS, IT, AI &amp; DS)
                </option>
                <option value="Circuit Branch">
                  Circuit branch (EXTC, Electrical, Instru)
                </option>
                <option value="Core Engineering">
                  Core engineering (Mechanical, Civil, Auto)
                </option>
                <option value="Other Applied Branches">
                  Other applied branches
                </option>
              </select>
            </FormField>
          </section>
        </div>

        <button
          className="button button-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={19} className="spin" />
              Running Random Forest model…
            </>
          ) : (
            <>
              <Sparkles size={19} />
              Generate top 10 recommendations
              <span className="button-arrow">↗</span>
            </>
          )}
        </button>

        <p className="form-note">
          Your profile is used to rank options against this model's available
          dataset.
        </p>
      </form>
    </aside>
  );
}
