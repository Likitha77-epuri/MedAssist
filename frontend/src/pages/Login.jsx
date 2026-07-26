import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartPulse, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import api, { getApiError } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(getApiError(err, 'Invalid email or password'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotPassword) {
       showToast('Please provide both your registered email and new password', 'warning');
       return;
    }
    if (forgotPassword.length < 6) {
       showToast('Password must be at least 6 characters long', 'warning');
       return;
    }
    setForgotLoading(true);
    try {
      await api.post('/forgot-password', { email: forgotEmail, new_password: forgotPassword });
      showToast('Password updated successfully! Please log in now.', 'success');
      setForgotOpen(false);
      setForgotEmail('');
      setForgotPassword('');
    } catch (err) {
      showToast(getApiError(err, 'Failed to update password. Ensure email is registered.'), 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-darkbg-200 flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Floating background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-clinical-500/5 blur-3xl"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-darkbg-100/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-glass dark:shadow-glass-dark relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20 mb-3 animate-float">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="font-extrabold text-2xl tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-1">Sign in to manage your health logs and consult AI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs font-bold text-emerald-500 hover:underline hover:text-emerald-600 outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? 'Logging you in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-500 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Reset Password
            </h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Enter your email and configure your new password. This simulator resets it directly in the db.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={forgotPassword}
                  onChange={(e) => setForgotPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  {forgotLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
