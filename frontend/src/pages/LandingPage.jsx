import {
  GraduationCap,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import SiteHeader from "../components/layout/SiteHeader";
import Hero from "../components/layout/Hero";

export default function LandingPage() {
  return (
    <div className="app-shell pw-landing">
      <SiteHeader />

      <main>
        <Hero />
      </main>

      <footer className="site-footer pw-footer">
        <div className="page-container pw-footer-main">
          <div className="pw-footer-brand">
            <span className="pw-footer-logo">
              <GraduationCap size={21} />
            </span>

            <div>
              <strong>pathwise<span>.</span></strong>
              <small>ENGINEERING, REIMAGINED</small>
            </div>
          </div>

          <div className="pw-footer-message">
            <ShieldCheck size={16} />
            <span>Decision support, powered by data.</span>
          </div>

          <a
            href="#top"
            className="pw-footer-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="page-container pw-footer-bottom">
          <span>
            © {new Date().getFullYear()} Pathwise. All rights reserved.
          </span>
          <span>Made for smarter college discovery.</span>
        </div>
      </footer>
    </div>
  );
}