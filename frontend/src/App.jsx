import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react"; // Import icons for Login UI

import { API_BASE_URL, INITIAL_FORM_DATA } from "./data/config";
import { requestRecommendations } from "./services/recommendations";

import LandingPage from "./pages/LandingPage";
import RecommenderPage from "./pages/RecommenderPage";
import ResultsPage from "./pages/ResultsPage";

import useScrollReveal from "./hooks/useScrollReveal";
import "./styles/global.css";

// FIX: Keep RequireAuth outside App so its component identity
// remains stable across App re-renders.
function RequireAuth({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();

  // --- AUTH STATE ---
  const [token, setToken] = useState(localStorage.getItem("dwm_token") || null);

  const [loginForm, setLoginForm] = useState({
    email: "abhay@student.com",
    password: "password123",
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Existing Dashboard State
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- LOGIN HANDLER ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("dwm_token", data.token);
        navigate("/recommender");
      } else {
        setAuthError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setAuthError(
        "Failed to connect to API Gateway. Ensure Node server is on port 5000.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("dwm_token");
    setResults(null);
    navigate("/login");
  };

  // Existing Handlers
  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "number" || type === "range" ? parseFloat(value) || 0 : value,
    }));
  };

  const applyPreset = (preset) => {
    const { label, emoji, ...profileData } = preset;
    setFormData(profileData);
    setError(null);
  };

  const triggerRecommendation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Existing backend request: unchanged
      const data = await requestRecommendations(API_BASE_URL, formData, token);

      setResults(data);
      navigate("/results");
      return true;
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403")) {
        handleLogout();
        setError("Session expired or Unauthorized. Please login again.");
      } else {
        setError(err.message || "Could not connect to Node API Gateway.");
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await triggerRecommendation();
  };

  useScrollReveal();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* LOGIN ROUTE */}
      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/recommender" replace />
          ) : (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="bg-indigo-900 p-6 text-center">
                  <h2 className="text-xl font-bold text-white">
                    DWM Cloud Auth
                  </h2>
                  <p className="text-indigo-200 text-sm mt-1">
                    Sign in to access ML Engine
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
                  {authError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200 text-center font-medium">
                      {authError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />

                      <input
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />

                      <input
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex justify-center items-center cursor-pointer"
                  >
                    {authLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Secure Login"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )
        }
      />

      {/* PROTECTED RECOMMENDER ROUTE */}
      <Route
        path="/recommender"
        element={
          <RequireAuth token={token}>
            <RecommenderPage
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onPresetSelect={applyPreset}
              loading={loading}
              onLogout={handleLogout}
            />
          </RequireAuth>
        }
      />

      {/* PROTECTED RESULTS ROUTE */}
      <Route
        path="/results"
        element={
          <RequireAuth token={token}>
            <ResultsPage
              formData={formData}
              results={results}
              loading={loading}
              error={error}
            />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
