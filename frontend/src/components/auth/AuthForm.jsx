import React, { useState } from 'react';
import { loginUser, registerUser } from '../../services/auth';

const AuthForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', percentile: '', budget: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await loginUser(formData.email, formData.password);
        if (res.success) {
          onLoginSuccess();
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await registerUser(formData);
        if (res.success) {
          alert('Account created! Please log in.');
          setIsLogin(true);
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Student Login' : 'Create Account'}
      </h2>
      
      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" name="email" placeholder="Email" required
          className="border p-2 rounded" value={formData.email} onChange={handleChange} />
        
        <input type="password" name="password" placeholder="Password" required
          className="border p-2 rounded" value={formData.password} onChange={handleChange} />
        
        {!isLogin && (
          <>
            <input type="number" name="percentile" placeholder="MHT-CET / JEE Percentile" required
              className="border p-2 rounded" value={formData.percentile} onChange={handleChange} step="0.01" />
            <input type="number" name="budget" placeholder="Budget (Per Year)" required
              className="border p-2 rounded" value={formData.budget} onChange={handleChange} />
          </>
        )}
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-4 text-sm text-center text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 font-semibold hover:underline">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;