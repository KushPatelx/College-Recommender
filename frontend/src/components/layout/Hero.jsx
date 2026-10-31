import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  MapPin,
  Target,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BrainCircuit,
    title: "ML-powered insights",
    description:
      "Explore admission estimates based on your academic profile.",
  },
  {
    icon: Target,
    title: "Preference-based matching",
    description:
      "Find colleges that align with your budget, city and preferred domain.",
  },
  {
    icon: BarChart3,
    title: "Smarter shortlisting",
    description:
      "Compare recommendations and make more informed decisions.",
  },
];

export default function Hero() {
  const scrollToExplore = () => {
    document.getElementById("explore")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <section className="pw-hero">
        <div className="pw-hero-decoration pw-decoration-one" />
        <div className="pw-hero-decoration pw-decoration-two" />

        <div className="page-container pw-hero-layout">
          <div className="pw-hero-copy">
            <div className="pw-hero-kicker">
              <span className="pw-live-indicator" />
              DATA-DRIVEN COLLEGE DISCOVERY
              <Sparkles size={14} />
            </div>

            <h1>
              Your next chapter
              <br />
              starts with <span>the right fit.</span>
            </h1>

            <p className="pw-hero-description">
              A smarter way to discover engineering colleges.
              Combine ML-powered admission estimates with your
              preferences for fees, location and specialization.
            </p>

            <div className="pw-hero-actions">
              <Link className="pw-primary-button" to="/recommender">
                Find my colleges
                <ArrowRight size={18} />
              </Link>

              <button
                type="button"
                className="pw-text-button"
                onClick={scrollToExplore}
              >
                Discover how it works
                <ArrowDown size={16} />
              </button>
            </div>

            <div className="pw-hero-trust">
              <div className="pw-trust-icon">
                <CheckCircle2 size={18} />
              </div>
              <p>
                <strong>Probability + preference.</strong>
                <span>
                  Built to make your college shortlist more intentional.
                </span>
              </p>
            </div>
          </div>

          {/* Dashboard illustration */}
          <div className="pw-hero-visual">
            <div className="pw-visual-orbit pw-orbit-one" />
            <div className="pw-visual-orbit pw-orbit-two" />

            <div className="pw-floating-card pw-floating-top">
              <span className="pw-floating-icon">
                <BrainCircuit size={18} />
              </span>
              <span>
                <strong>ML-powered</strong>
                <small>Admission estimates</small>
              </span>
              <span className="pw-floating-dot" />
            </div>

            <div className="pw-dashboard-card">
              <div className="pw-dashboard-header">
                <div>
                  <span className="pw-overline">PATHWISE INSIGHTS</span>
                  <h3>Your fit overview</h3>
                </div>
                <span className="pw-live-badge">DEMO</span>
              </div>

              <div className="pw-dashboard-score">
                <div>
                  <span className="pw-muted-label">Illustrative profile match</span>
                  <strong className="pw-score-number">
                    92<span>%</span>
                  </strong>
                  <span className="pw-score-caption">
                    Your sample dashboard
                  </span>
                </div>

                <div className="pw-score-circle">
                  <div className="pw-score-circle-inner">
                    <span>92</span>
                    <small>MATCH</small>
                  </div>
                </div>
              </div>

              <div className="pw-score-track">
                <span />
              </div>

              <div className="pw-dashboard-divider" />

              <div className="pw-dashboard-item">
                <span className="pw-dashboard-item-icon">
                  <Target size={19} />
                </span>
                <span className="pw-dashboard-item-copy">
                  <strong>Best-fit shortlist</strong>
                  <small>Ranked around your priorities</small>
                </span>
                <ArrowUpRight size={17} />
              </div>

              <div className="pw-dashboard-item">
                <span className="pw-dashboard-item-icon pw-icon-lime">
                  <BarChart3 size={19} />
                </span>
                <span className="pw-dashboard-item-copy">
                  <strong>Admission insights</strong>
                  <small>Probability, not promises</small>
                </span>
                <ArrowUpRight size={17} />
              </div>

              <div className="pw-dashboard-item">
                <span className="pw-dashboard-item-icon pw-icon-sand">
                  <Wallet size={19} />
                </span>
                <span className="pw-dashboard-item-copy">
                  <strong>Budget-aware results</strong>
                  <small>Consider your fee preferences</small>
                </span>
                <ArrowUpRight size={17} />
              </div>

              <div className="pw-dashboard-footer">
                <span>
                  <span className="pw-footer-status" />
                  HYBRID ENGINE
                </span>
                <strong>
                  60% ML <i>+</i> 40% FIT
                </strong>
              </div>
            </div>

            <div className="pw-floating-card pw-floating-bottom">
              <span className="pw-floating-icon pw-icon-location">
                <MapPin size={18} />
              </span>
              <span>
                <strong>Preference-aware</strong>
                <small>Budget · City · Domain</small>
              </span>
            </div>

            <span className="pw-hero-star pw-star-one">✳</span>
            <span className="pw-hero-star pw-star-two">✦</span>
          </div>
        </div>

        <div className="pw-hero-bottom">
          <div className="page-container pw-hero-bottom-inner">
            <span>LESS GUESSWORK. MORE DIRECTION.</span>
            <button type="button" onClick={scrollToExplore}>
              SCROLL TO EXPLORE
              <ArrowDown size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature / How it works section */}
      <section className="pw-explore-section" id="explore">
        <div className="page-container">
          <div className="pw-section-heading">
            <span className="pw-section-kicker">
              THE PATHWISE ADVANTAGE
            </span>

            <h2>
              More clarity.
              <br />
              <span>Better college decisions.</span>
            </h2>

            <p>
              College selection is more than just a score.
              Pathwise brings academic performance and personal
              preferences into one recommendation experience.
            </p>
          </div>

          <div className="pw-feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article className="pw-feature-card" key={feature.title}>
                  <div className="pw-feature-number">
                    0{index + 1}
                  </div>

                  <span className="pw-feature-icon">
                    <Icon size={23} />
                  </span>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <span className="pw-feature-line" />
                </article>
              );
            })}
          </div>

          <div className="pw-explore-cta">
            <div>
              <span>READY TO EXPLORE?</span>
              <h3>Your college shortlist starts here.</h3>
              <p>
                Add your academic details and discover your recommendations.
              </p>
            </div>

            <Link to="/recommender" className="pw-primary-button">
              Get started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}