import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  Activity,
  Plus,
  Trash2,
  TrendingUp,
  Heart,
  Droplet,
  User,
  Scale,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthTracker = () => {
  const { showToast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form States
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Selected Active Chart Tab
  const [activeChartTab, setActiveChartTab] = useState('bp');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health-records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not load health metrics log', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !height || !bpSystolic || !bpDiastolic || !bloodSugar || !heartRate) {
      showToast('Please fill out all vitals details', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      await api.post('/health-record', {
        weight: parseFloat(weight),
        height: parseFloat(height),
        bp_systolic: parseInt(bpSystolic),
        bp_diastolic: parseInt(bpDiastolic),
        blood_sugar: parseInt(bloodSugar),
        heart_rate: parseInt(heartRate),
        date: date || null
      });
      showToast('Health vitals logged successfully!', 'success');
      // Reset form
      setWeight('');
      setHeight('');
      setBpSystolic('');
      setBpDiastolic('');
      setBloodSugar('');
      setHeartRate('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchRecords();
    } catch (err) {
      console.error(err);
      showToast('Failed to save health record details.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vital log?')) return;
    try {
      await api.delete(`/health-record/${id}`);
      showToast('Log record deleted successfully', 'success');
      fetchRecords();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete log entry', 'error');
    }
  };

  // Prepare chart datasets based on selected active tab
  const getChartData = () => {
    const dates = records.map((r) => r.date);
    
    const isDark = document.documentElement.classList.contains('dark');
    const labelColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    if (activeChartTab === 'bp') {
      return {
        labels: dates,
        datasets: [
          {
            label: 'Systolic BP (mmHg)',
            data: records.map((r) => r.bp_systolic),
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            tension: 0.3,
            pointBackgroundColor: '#f43f5e',
            fill: true
          },
          {
            label: 'Diastolic BP (mmHg)',
            data: records.map((r) => r.bp_diastolic),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            tension: 0.3,
            pointBackgroundColor: '#0ea5e9',
            fill: true
          }
        ]
      };
    }

    if (activeChartTab === 'sugar') {
      return {
        labels: dates,
        datasets: [
          {
            label: 'Blood Sugar (mg/dL)',
            data: records.map((r) => r.blood_sugar),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            pointBackgroundColor: '#10b981',
            fill: true
          }
        ]
      };
    }

    if (activeChartTab === 'heart') {
      return {
        labels: dates,
        datasets: [
          {
            label: 'Heart Rate (BPM)',
            data: records.map((r) => r.heart_rate),
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            tension: 0.3,
            pointBackgroundColor: '#ec4899',
            fill: true
          }
        ]
      };
    }

    // BMI tab
    return {
      labels: dates,
      datasets: [
        {
          label: 'Body Mass Index (BMI)',
          data: records.map((r) => r.bmi),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
          pointBackgroundColor: '#f59e0b',
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
          font: { weight: 'bold', size: 11 }
        }
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
        titleFont: { weight: 'bold' }
      }
    },
    scales: {
      x: {
        grid: { color: document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9' },
        ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b', font: { weight: 'bold', size: 10 } }
      },
      y: {
        grid: { color: document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9' },
        ticks: { color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b', font: { weight: 'bold', size: 10 } }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Welcome Intro */}
      <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-clinical-500/10 border-l-4 border-l-emerald-500 p-8">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Patient Health Vitals Tracker
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Log vital parameters (Blood Pressure, Blood Glucose, Weight, Height, Pulse) to trace historical graphs. The clinical dashboards automatically plot BMI indexes and flag potential diagnostic values.
        </p>
      </GlassCard>

      {/* Grid: Form and Vitals Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Log Vitals form card */}
        <GlassCard className="lg:col-span-1 h-fit flex flex-col gap-5">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" /> Record Vitals Log
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Submit current diagnostics telemetry to local database.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 72.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>

              {/* Height */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Height (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Systolic */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BP Systolic (mmHg)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 120"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>

              {/* Diastolic */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 80"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Blood Sugar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 95"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>

              {/* Heart Rate */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate (BPM)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              Submit Diagnostics Log
            </button>
          </form>
        </GlassCard>

        {/* Visual Charts and Log Data lists */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Trends Dashboard */}
          <GlassCard className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Historical Trend Charts
              </h3>
              
              {/* Tab Toggles */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setActiveChartTab('bp')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeChartTab === 'bp'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  BP
                </button>
                <button
                  onClick={() => setActiveChartTab('sugar')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeChartTab === 'sugar'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sugar
                </button>
                <button
                  onClick={() => setActiveChartTab('heart')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeChartTab === 'heart'
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pulse
                </button>
                <button
                  onClick={() => setActiveChartTab('bmi')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeChartTab === 'bmi'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  BMI
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 relative">
              {records.length > 0 ? (
                <Line data={getChartData()} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-xs font-semibold">Insufficient log inputs to construct curves.</p>
                </div>
              )}
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Logs History Table */}
      <GlassCard className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Telemetry History Logs</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-100 dark:bg-slate-850 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Height</th>
                  <th className="p-4">Blood Pressure</th>
                  <th className="p-4">Glucose</th>
                  <th className="p-4">Pulse</th>
                  <th className="p-4">BMI</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {rec.date}
                    </td>
                    <td className="p-4">{rec.weight} <span className="text-[10px] text-slate-400">kg</span></td>
                    <td className="p-4">{rec.height} <span className="text-[10px] text-slate-400">cm</span></td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-rose-500">
                        {rec.bp_systolic}/{rec.bp_diastolic}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-500">
                        {rec.blood_sugar} <span className="text-[9px] font-semibold text-slate-400">mg/dL</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-pink-500">
                        {rec.heart_rate} <span className="text-[9px] font-semibold text-slate-400">BPM</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-500">{rec.bmi}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 font-semibold italic text-xs">
            No vitals history logged.
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default HealthTracker;
