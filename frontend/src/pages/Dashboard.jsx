import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  MessageSquare,
  Stethoscope,
  FileText,
  Calendar,
  Activity,
  Heart,
  Droplet,
  User,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [chatSessions, setChatSessions] = useState([]);
  const [latestRecord, setLatestRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatRes, recordRes, apptRes] = await Promise.all([
          api.get('/chat/sessions'),
          api.get('/health-records'),
          api.get('/appointments')
        ]);
        
        // Save top 3 sessions
        setChatSessions(chatRes.data.slice(0, 3));
        
        // Save latest record
        if (recordRes.data.length > 0) {
          setLatestRecord(recordRes.data[recordRes.data.length - 1]);
        }
        
        // Filter pending or upcoming appointments
        const activeAppts = apptRes.data.filter(a => a.status !== 'cancelled').slice(0, 2);
        setAppointments(activeAppts);
      } catch (err) {
        console.error("Dashboard data load error:", err);
        showToast("Could not load dashboard metrics", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const quickActions = [
    { name: 'Ask Medical AI', href: '/chat', desc: 'Consult chatbot on symptoms & health conditions', icon: MessageSquare, color: 'text-clinical-500 bg-clinical-50 dark:bg-clinical-950/20 border-clinical-100 dark:border-clinical-900' },
    { name: 'Symptom Checker', href: '/symptoms', desc: 'Analyze specific clinical symptoms & risk levels', icon: Stethoscope, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900' },
    { name: 'Analyze Report', href: '/analyzer', desc: 'Upload lab report PDF for summary explanations', icon: FileText, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900' },
    { name: 'Book Doctor', href: '/booking', desc: 'Schedule appointments with localized specialists', icon: Calendar, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine BMI status string & color
  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-yellow-500' };
    if (bmi < 25) return { text: 'Healthy Weight', color: 'text-emerald-500' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-orange-500' };
    return { text: 'Obese', color: 'text-red-500' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Card banner */}
      <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-clinical-500/10 border-l-4 border-l-emerald-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {user?.full_name || 'Patient'}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Welcome to your MediAssist AI workspace. Monitor logs and explore AI insights.
          </p>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Integrity Checked System</span>
        </div>
      </GlassCard>

      {/* Grid: Health Summary (Vitals) */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" /> Current Health Vitals (Latest Log)
        </h3>
        
        {latestRecord ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="flex items-center gap-4">
              <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-500">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Heart Rate</p>
                <p className="text-xl font-extrabold">{latestRecord.heart_rate} <span className="text-xs font-semibold text-slate-400">BPM</span></p>
                <p className="text-[10px] text-slate-400 mt-0.5">Norm: 60 - 100</p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4">
              <div className="bg-clinical-500/10 p-3 rounded-2xl text-clinical-600 dark:text-clinical-400">
                <Activity className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Blood Pressure</p>
                <p className="text-xl font-extrabold">{latestRecord.bp_systolic}/{latestRecord.bp_diastolic} <span className="text-xs font-semibold text-slate-400">mmHg</span></p>
                <p className="text-[10px] text-slate-400 mt-0.5">Norm: 120/80</p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4">
              <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                <Droplet className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Blood Sugar</p>
                <p className="text-xl font-extrabold">{latestRecord.blood_sugar} <span className="text-xs font-semibold text-slate-400">mg/dL</span></p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fasting Norm: 70 - 99</p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Body Mass Index</p>
                <p className="text-xl font-extrabold">{latestRecord.bmi} <span className="text-xs font-semibold text-slate-400">BMI</span></p>
                <p className={`text-[10px] font-bold mt-0.5 ${getBmiStatus(latestRecord.bmi).color}`}>
                  {getBmiStatus(latestRecord.bmi).text}
                </p>
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-slate-400" />
            <div className="max-w-md">
              <p className="text-sm font-semibold text-slate-500">No vitals logged yet</p>
              <p className="text-xs text-slate-400 mt-1">Start recording your height, weight, BP, and blood glucose in our tracker to monitor health stats.</p>
            </div>
            <Link to="/tracker" className="mt-2 text-xs font-extrabold bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-emerald-600 transition-colors">
              Log Vitals Now
            </Link>
          </GlassCard>
        )}
      </div>

      {/* Quick Actions GRID */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold tracking-tight">Quick Action Hub</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((act) => (
            <GlassCard
              key={act.name}
              onClick={() => navigate(act.href)}
              className="flex flex-col gap-4 border hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02] transition-all"
            >
              <div className={`p-3 rounded-2xl w-fit ${act.color.split(' ').slice(0,2).join(' ')} border ${act.color.split(' ').slice(2).join(' ')}`}>
                <act.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{act.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Grid: Split Screen for Recent Chats and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Recent AI Chats */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" /> Recent AI Consultations
          </h3>
          
          <GlassCard className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4 p-0 overflow-hidden">
            {chatSessions.length > 0 ? (
              <div className="flex flex-col">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate('/chat', { state: { resumeSessionId: session.id } })}
                    className="p-5 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 cursor-pointer flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate">{session.title}</h4>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {session.last_message || 'Consultation details...'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                ))}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
                  <Link to="/chat" className="text-xs font-bold text-emerald-500 hover:underline">
                    Start a New Chatbot Consultation →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <MessageSquare className="w-6 h-6 text-slate-400" />
                <p className="text-xs text-slate-400 font-medium">No recent AI chatbot sessions.</p>
                <Link to="/chat" className="text-xs font-bold text-emerald-500 hover:underline mt-1">
                  Ask your first health question now
                </Link>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Appointments Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" /> Booked Appointments
          </h3>
          
          <GlassCard className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4 p-0 overflow-hidden">
            {appointments.length > 0 ? (
              <div className="flex flex-col">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm">{appt.doctor_name}</h4>
                      <p className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold mt-0.5">{appt.specialty}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Date: {appt.date} | Time: {appt.time}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      appt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
                  <Link to="/booking" className="text-xs font-bold text-emerald-500 hover:underline">
                    Book a Doctor Appointment →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-slate-400" />
                <p className="text-xs text-slate-400 font-medium">No upcoming appointments scheduled.</p>
                <Link to="/booking" className="text-xs font-bold text-emerald-500 hover:underline mt-1">
                  Schedule an appointment now
                </Link>
              </div>
            )}
          </GlassCard>
        </div>

      </div>
      
    </div>
  );
};

export default Dashboard;
