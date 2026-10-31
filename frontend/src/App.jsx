import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { API_BASE_URL, INITIAL_FORM_DATA } from "./data/config";
import { requestRecommendations } from "./services/recommendations";
import { logoutUser } from "./services/auth"; // Imported logout API

import LandingPage from "./pages/LandingPage";
import RecommenderPage from "./pages/RecommenderPage";
import ResultsPage from "./pages/ResultsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import useScrollReveal from "./hooks/useScrollReveal";
import "./styles/global.css";

function RequireAuth({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuth") === "true"
  );
  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuth", "true");
    navigate("/recommender");
  };

  const handleLogout = async () => {
  localStorage.removeItem("isAuth");
  setIsAuthenticated(false);
  setResults(null);
  setError(null);

  try {
    await logoutUser();
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    navigate("/login", { replace: true });
  }
};

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "number" || type === "range" ? parseFloat(value) || 0 : value,
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
      const data = await requestRecommendations(API_BASE_URL, formData);
      setResults(data);
      navigate("/results");
      return true;
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("403") || err.message.includes("Access Denied")) {
        await handleLogout();
        setError("Session expired or token blocked. Please login again.");
      } else {
        setError(err.message || "Could not connect to API.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  useScrollReveal();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/recommender" replace /> : <SignupPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/recommender" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
      
      <Route 
        path="/recommender" 
        element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <RecommenderPage 
              formData={formData} 
              onChange={handleChange} 
              onSubmit={(e) => { e.preventDefault(); triggerRecommendation(); }} 
              onPresetSelect={applyPreset} 
              loading={loading} 
              onLogout={handleLogout} 
            />
          </RequireAuth>
        } 
      />
      
      <Route 
        path="/results" 
        element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <ResultsPage formData={formData} results={results} loading={loading} error={error} />
          </RequireAuth>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}