import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  Database,
  Pill,
  FileText,
  Activity,
  Calendar,
  HeartPulse,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chatbot', href: '/chat', icon: MessageSquare },
    { name: 'Symptom Checker', href: '/symptoms', icon: Stethoscope },
    { name: 'Disease Database', href: '/diseases', icon: Database },
    { name: 'Medicine Search', href: '/medicines', icon: Pill },
    { name: 'Report Analyzer', href: '/analyzer', icon: FileText },
    { name: 'Health Tracker', href: '/tracker', icon: Activity },
    { name: 'Book Appointment', href: '/booking', icon: Calendar },
    { name: 'Emergency', href: '/emergency', icon: HeartPulse },
    { name: 'User Profile', href: '/profile', icon: User },
  ];

  // If user is admin, append Admin Panel
  if (user && user.role === 'admin') {
    navigation.push({ name: 'Admin Dashboard', href: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 dark:bg-darkbg-200 dark:text-slate-100 overflow-hidden">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white/70 dark:bg-darkbg-100/70 border-r border-slate-200 dark:border-slate-800 backdrop-blur-xl flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400 tracking-tight font-sans">MediAssist AI</h1>
            <p className="text-[10px] text-slate-400 font-medium">Virtual Health Companion</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER SIDEBAR --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-50 h-full">
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">MediAssist AI</h1>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN APP PANEL --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-darkbg-100/50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase hidden sm:block">
              {navigation.find((item) => isActive(item.href))?.name || 'MediAssist AI'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Profile badge header */}
            {user && (
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-clinical-500/10 text-clinical-600 dark:text-clinical-400 flex items-center justify-center font-bold text-xs border border-clinical-500/20 group-hover:scale-105 transition-transform">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold group-hover:text-emerald-500 transition-colors hidden md:inline">
                  {user.full_name}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
