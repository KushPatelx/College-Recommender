import {
  GraduationCap,
  UserRound,
  SlidersHorizontal,
  Layers3,
  Sparkles,
  LoaderCircle,
  IndianRupee,
  MapPin,
  BookOpen,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

import FormField from "./FormField";

const inputClass = "pw-field-control";

export default function ProfileForm({
  formData,
  onChange,
  onSubmit,
  loading,
  formatINR,
}) {
  const percentile = Math.min(
    100,
    Math.max(0, Number(formData.percentile) || 0)
  );

  return (
    <section className="pw-profile-panel">

      {/* FORM HEADER */}
      <div className="pw-profile-header">
        <div className="pw-profile-header-icon">
          <GraduationCap size={24} />
        </div>

        <div className="pw-profile-header-copy">
          <span>STUDENT INFORMATION</span>
          <h3>Student profile</h3>
          <p>Your academics and preferences help us find the right fit.</p>
        </div>

        <div className="pw-step-indicator">
          <strong>01</strong>
          <span>/ 02</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="pw-profile-form">

        {/* SECTION 1 */}
        <section className="pw-profile-section">

          <div className="pw-form-section-heading">
            <div className="pw-form-section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <span>SECTION 01</span>
              <h4>Academic snapshot</h4>
              <p>Enter your academic performance details.</p>
            </div>
          </div>

          <div className="pw-field-grid">

            <FormField label="SSC marks (%)">
              <input
                className={inputClass}
                type="number"
                name="ssc_marks"
                step="0.1"
                min="35"
                max="100"
                placeholder="e.g. 88.5"
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
                placeholder="e.g. 82"
                value={formData.hsc_marks}
                onChange={onChange}
                required
              />
            </FormField>

          </div>

          <FormField label="MHT-CET percentile">
            <div className="pw-percentile-box">
              <div className="pw-percentile-input">
                <ChartNoAxesColumnIncreasing size={18} />

                <input
                  className={inputClass}
                  type="number"
                  name="percentile"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Enter percentile"
                  value={formData.percentile}
                  onChange={onChange}
                  required
                />

                <span>%ile</span>
              </div>

              <div className="pw-percentile-track">
                <span style={{ width: `${percentile}%` }} />
              </div>

              <div className="pw-percentile-caption">
                <span>0</span>
                <strong>{percentile}% percentile</strong>
                <span>100</span>
              </div>
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

        <div className="pw-form-divider" />

        {/* SECTION 2 */}
        <section className="pw-profile-section">

          <div className="pw-form-section-heading">
            <div className="pw-form-section-icon">
              <SlidersHorizontal size={19} />
            </div>

            <div>
              <span>SECTION 02</span>
              <h4>Your college preferences</h4>
              <p>Set priorities for your college recommendations.</p>
            </div>
          </div>

          {/* BUDGET */}
          <FormField label="Preferred annual fee budget">
            <div className="pw-budget-display">
              <div className="pw-budget-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>YOUR ANNUAL BUDGET</span>
                <strong>{formatINR(formData.pref_budget)}</strong>
              </div>
            </div>

            <input
              className="pw-budget-range"
              type="range"
              name="pref_budget"
              min="15000"
              max="250000"
              step="5000"
              value={formData.pref_budget}
              onChange={onChange}
            />

            <div className="pw-range-labels">
              <span>₹15,000</span>
              <span>₹1,25,000</span>
              <span>₹2,50,000</span>
            </div>
          </FormField>

          {/* LOCATION */}
          <FormField label="Preferred location">
            <div className="pw-select-with-icon">
              <MapPin size={17} />

              <select
                className={inputClass}
                name="pref_city_tier"
                value={formData.pref_city_tier}
                onChange={onChange}
              >
                <option value="Tier 1">
                  Tier 1 — Mumbai / Pune metro
                </option>

                <option value="Tier 2">
                  Tier 2 — Regional urban hubs
                </option>
              </select>
            </div>
          </FormField>

          {/* DOMAIN */}
          <FormField label="Domain of interest">
            <div className="pw-select-with-icon">
              <BookOpen size={17} />

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
            </div>
          </FormField>

        </section>

        {/* SUBMIT */}
        <div className="pw-submit-area">

          <button
            className="pw-generate-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle size={19} className="pw-spin" />
                Running recommendation model...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Generate top 10 recommendations
                <span className="pw-submit-arrow">↗</span>
              </>
            )}
          </button>

          <div className="pw-form-bottom-note">
            <Layers3 size={15} />
            <p>
              Your profile is analysed against the available college dataset
              to generate relevant recommendations.
            </p>
          </div>

        </div>

      </form>
    </section>
  );
}