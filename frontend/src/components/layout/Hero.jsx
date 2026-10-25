import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="how-it-works">
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="page-container hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="live-dot" /> DATA-DRIVEN COLLEGE DISCOVERY
          </div>
          <h1>
            Your next chapter
            <br />
            starts with <em>the right fit.</em>
          </h1>
          <p className="hero-description">
            A smarter way to explore engineering colleges. We blend ML-powered
            admission estimates with the things that matter to you: fees,
            location, and your domain.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/recommender">
              Find my colleges <ArrowRight size={17} />
            </Link>
            <Link className="hero-secondary" to="/recommender">
              Meet the hybrid engine <ArrowDownRight size={17} />
            </Link>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <span>ML</span>
              <span>AI</span>
              <span>DS</span>
            </div>
            <p>
              <strong>Probability + preference.</strong>
              <br />
              Built to make your shortlist more intentional.
            </p>
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Illustration of a college recommendation dashboard"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="visual-glow" />
          <div className="floating-tag tag-top">
            <span className="tag-icon">
              <BrainCircuit size={17} />
            </span>
            <span>
              <strong>ML-powered</strong>
              <small>Admission estimate</small>
            </span>
            <span className="tag-pulse" />
          </div>
          <div className="visual-card">
            <div className="visual-card-top">
              <span className="tiny-label">YOUR FIT OVERVIEW</span>
              <span className="status-chip">LIVE MODEL</span>
            </div>
            <div className="visual-score-row">
              <div>
                <span className="score-label">Profile match</span>
                <strong className="visual-score">
                  92<span>%</span>
                </strong>
              </div>
              <div className="score-ring">
                <span>92</span>
              </div>
            </div>
            <div className="visual-meter">
              <span style={{ width: "92%" }} />
            </div>
            <div className="visual-divider" />
            <div className="mini-result">
              <div className="mini-college-icon">
                <Target size={18} />
              </div>
              <div className="mini-college-copy">
                <strong>Best-fit shortlist</strong>
                <small>Ranked around your priorities</small>
              </div>
              <span className="mini-arrow">
                <ArrowRight size={16} />
              </span>
            </div>
            <div className="mini-result">
              <div className="mini-college-icon mint">
                <BarChart3 size={18} />
              </div>
              <div className="mini-college-copy">
                <strong>Admission insights</strong>
                <small>Probability, not promises</small>
              </div>
              <span className="mini-arrow">
                <ArrowRight size={16} />
              </span>
            </div>
            <div className="visual-card-foot">
              <span className="foot-dot" /> HYBRID ENGINE{" "}
              <span className="foot-plus">
                60% ML <b>+</b> 40% FIT
              </span>
            </div>
          </div>
          <div className="floating-tag tag-bottom">
            <span className="tag-icon mint">
              <Target size={17} />
            </span>
            <span>
              <strong>Preference-aware</strong>
              <small>Budget · City · Domain</small>
            </span>
          </div>
          <div className="visual-spark spark-one">✳</div>
          <div className="visual-spark spark-two">✦</div>
        </div>
      </div>
      <div className="hero-bottom-line">
        <div className="page-container hero-bottom-inner">
          <span>LESS GUESSWORK. MORE DIRECTION.</span>
          <span className="scroll-cue">
            SCROLL TO EXPLORE <span className="scroll-line" />
          </span>
        </div>
      </div>
    </section>
  );
}
