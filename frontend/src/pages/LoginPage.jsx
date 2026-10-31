import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Lock,
  Mail,
  Loader2,
  KeyRound,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { loginUser } from "../services/auth";

export default function LoginPage({ onLoginSuccess }) {
  const location = useLocation();

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
      const data = await loginUser(
        formData.email,
        formData.password
      );

      if (data.success) {
        onLoginSuccess();
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
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
            YOUR FUTURE STARTS HERE
          </span>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p>
            Your college journey deserves a smarter direction.
            Sign in to continue exploring engineering colleges
            that match your goals.
          </p>

          <div className="auth-feature">
            <span className="auth-feature-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <strong>Secure access</strong>
              <small>Your account and profile stay protected.</small>
            </div>
          </div>

          <div className="auth-feature">
            <span className="auth-feature-icon">
              <KeyRound size={21} />
            </span>
            <div>
              <strong>Personalized recommendations</strong>
              <small>Continue from where your journey paused.</small>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-icon">
              <KeyRound size={23} />
            </span>

            <div>
              <h2>Sign in to Pathwise</h2>
              <p>Enter your credentials to access your account.</p>
            </div>
          </div>

          {location.state?.message && (
            <div className="auth-success-message">
              <ShieldCheck size={17} />
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="auth-error-message" role="alert">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>

              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>

              <div className="auth-input-wrap">
                <Lock size={18} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO PATHWISE?</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup"> Create account</Link>
          </p>

          <p className="auth-terms">
            By continuing, you agree to use Pathwise responsibly
            for your college discovery journey.
          </p>
        </section>
      </div>

      <footer className="auth-footer">
        © {new Date().getFullYear()} Pathwise. Built for better decisions.
      </footer>
    </main>
  );
}