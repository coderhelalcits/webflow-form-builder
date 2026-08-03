import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import api from '../services/api';
import { Zap, ShieldCheck } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isSignup ? '/auth/register' : '/auth/login';
      const payload = isSignup ? { name, email, password } : { email, password };

      const res = await api.post(endpoint, payload);

      if (res.token) {
        localStorage.setItem('flowform_token', res.token);
        localStorage.setItem('flowform_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-600/30 mb-3">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">FlowForm</h1>
          <p className="text-xs text-slate-400 mt-1">Webflow Form Builder & Submission SaaS</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full mt-2" loading={loading}>
            {isSignup ? 'Create Account' : 'Sign In to Dashboard'}
          </Button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
