import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Stethoscope, MessageSquare, Activity, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-darkbg-200 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Banner (Emergency alert) */}
      <div className="bg-red-500 text-white text-xs md:text-sm font-semibold py-2 px-4 flex items-center justify-center gap-2 relative z-10 shadow-md">
        <ShieldAlert className="w-4 h-4 animate-bounce" />
        <span>Medical Emergency? Please call 911 or visit your nearest emergency room immediately.</span>
        <Link to="/login" className="underline hover:text-red-100 font-bold ml-2">Emergency Contacts →</Link>
      </div>

      {/* Header / Navbar */}
      <header className="py-5 px-6 md:px-12 flex items-center justify-between bg-white/70 dark:bg-darkbg-100/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl text-emerald-600 dark:text-emerald-400 tracking-tight font-sans">MediAssist AI</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 text-sm flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-colors">
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 py-16 md:py-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Soft floating background blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-clinical-500/10 blur-3xl -z-10 animate-pulse-slow"></div>

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Stethoscope className="w-4 h-4" /> Next-Gen Medical Assistant
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 to-clinical-600 dark:from-emerald-400 dark:to-clinical-400 bg-clip-text text-transparent">
            Your Intelligent Virtual <br />Healthcare Companion
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Symptom screening, AI-powered lab report analysis, appointment booking, medicine searching, and vitals tracking. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 text-md transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold px-8 py-4 rounded-2xl shadow-sm text-md transition-all hover:scale-102"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/60 dark:bg-darkbg-100/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-left shadow-glass hover:shadow-lg transition-all duration-300">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 w-fit mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl mb-3">AI Medical Chatbot</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Ask medical questions, explore conditions, understand medical terms, and receive general self-care recommendations instantly.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-darkbg-100/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-left shadow-glass hover:shadow-lg transition-all duration-300">
            <div className="bg-clinical-500/10 p-3 rounded-2xl text-clinical-600 dark:text-clinical-400 w-fit mb-6">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl mb-3">Lab Report Analyzer</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Upload diagnostic lab report PDFs. Our analyzer extracts text, translates medical jargon, highlights abnormal values, and formats summaries.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-darkbg-100/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-left shadow-glass hover:shadow-lg transition-all duration-300">
            <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500 w-fit mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl mb-3">Vitals Health Tracker</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Log daily weights, blood sugar levels, blood pressure, and heart rate. Visualize historical trends via clean responsive dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Verification section */}
      <section className="bg-white/40 dark:bg-darkbg-100/40 border-t border-slate-200/50 dark:border-slate-800/50 py-16 px-6 md:px-12 flex flex-col items-center">
        <div className="max-w-4xl text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-extrabold">Why Choose MediAssist AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-semibold">100% Secure JWT Session Controls</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-semibold">Advanced LLM Symptoms Checkers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-semibold">Searchable Diseases & Drugs Database</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-semibold">Appointment Booking Scheduler</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-100 text-center text-xs text-slate-400 space-y-3">
        <p className="max-w-2xl mx-auto font-medium">
          MediAssist AI is for educational and simulations purposes only. It does not provide medical diagnoses or replace licensed healthcare professionals. In case of emergency, call 911 immediately.
        </p>
        <p>© 2026 MediAssist AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
