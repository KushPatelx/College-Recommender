import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  UserPlus,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../services/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await registerUser(
        formData.email,
        formData.password
      );

      if (res.success) {
        navigate("/login", {
          state: {
            message: "Account created successfully! Please log in.",
          },
        });
      } else {
        setError(res.error || "Unable to create your account.");
      }
    } catch (err) {
      setError("Server error. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <Link to="/" className="auth-back-home">
        <GraduationCap size={20} />
        <span>pathwise.</span>
      </Link>

      <div className="auth-layout">
        <section className="auth-intro">
          <span className="auth-eyebrow">
            <span className="auth-eyebrow-dot" />
            START YOUR JOURNEY
          </span>

          <h1>
            Make your
            <br />
            <span>next move.</span>
          </h1>

          <p>
            Create your Pathwise account and discover engineering
            colleges through smarter, data-driven recommendations.
          </p>

          <div className="auth-feature">
            <span className="auth-feature-icon">
              <CheckCircle2 size={21} />
            </span>
            <div>
              <strong>Simple to get started</strong>
              <small>Create your account with your email address.</small>
            </div>
          </div>

          <div className="auth-feature">
            <span className="auth-feature-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <strong>Your journey, your preferences</strong>
              <small>Explore colleges based on what matters to you.</small>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-icon">
              <UserPlus size={23} />
            </span>

            <div>
              <h2>Create your account</h2>
              <p>Join Pathwise and find your college fit.</p>
            </div>
          </div>

          {error && (
            <div className="auth-error-message" role="alert">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signup-email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Create password</label>

              <div className="auth-input-wrap">
                <Lock size={18} />

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <small className="auth-field-hint">
                Use at least 6 characters.
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>ALREADY A MEMBER?</span>
          </div>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </p>

          <p className="auth-terms">
            Your college discovery journey starts with one simple step.
          </p>
        </section>
      </div>

      <footer className="auth-footer">
        © {new Date().getFullYear()} Pathwise. Built for better decisions.
      </footer>
    </main>
  );
}