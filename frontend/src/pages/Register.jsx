import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartPulse, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showToast('All fields are required', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    
    setLoading(true);
    try {
      await register(email, password, fullName);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Email might already be in use.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
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
          <h2 className="font-extrabold text-2xl tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-xs mt-1">Start tracking your health & consult our medical AI chatbot</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
