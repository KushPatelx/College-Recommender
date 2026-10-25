import { GraduationCap } from "lucide-react";
import SiteHeader from "../components/layout/SiteHeader";
import Hero from "../components/layout/Hero";

export default function LandingPage() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main>
        <Hero />
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
