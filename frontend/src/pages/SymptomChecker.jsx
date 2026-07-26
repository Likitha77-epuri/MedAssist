import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  HeartPulse,
  Plus,
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const SymptomChecker = () => {
  const { showToast } = useToast();
  
  const symptomsList = [
    'Fever',
    'Headache',
    'Cough',
    'Chest Pain',
    'Fatigue',
    'Vomiting',
    'Sore Throat',
    'Shortness of Breath',
    'Nausea',
    'Abdominal Pain'
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      showToast('Please select at least one symptom to analyze', 'warning');
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/symptoms', { symptoms: selectedSymptoms });
      setResult(res.data);
      showToast('Symptom analysis completed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not analyze symptoms. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper for color coding the risk level
  const getRiskStyles = (level) => {
    if (level === 'High') {
      return {
        bg: 'bg-red-500/10 border-red-500/20 dark:bg-red-950/20 dark:border-red-900/50',
        text: 'text-red-600 dark:text-red-400',
        badge: 'bg-red-500 text-white shadow-md shadow-red-500/20'
      };
    }
    if (level === 'Medium') {
      return {
        bg: 'bg-orange-500/10 border-orange-500/20 dark:bg-orange-950/20 dark:border-orange-900/50',
        text: 'text-orange-600 dark:text-orange-400',
        badge: 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
      };
    }
    return {
      bg: 'bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-900/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Intro Header */}
      <GlassCard className="bg-gradient-to-r from-clinical-500/10 to-emerald-500/10 p-8 border-l-4 border-l-clinical-500">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-clinical-600 dark:text-clinical-400" /> AI-Powered Symptom Screener
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Select your symptoms from the list below. The AI Medical Assistant will evaluate possible conditions, outline risk levels, and guide you on self-care or seeking emergency medical help.
        </p>
      </GlassCard>

      {/* Main interface layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Symptoms Selection Card */}
        <GlassCard className="md:col-span-1 flex flex-col gap-6 h-fit">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Select Symptoms</h3>
            <p className="text-[10px] text-slate-400 mt-1">Tap to select all symptoms that match your condition.</p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2">
            {symptomsList.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                    selected
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'
                  }`}
                >
                  <span>{symptom}</span>
                  {selected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 py-3 text-xs font-bold bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </GlassCard>

        {/* Results / Help display */}
        <div className="md:col-span-2 space-y-6">
          {loading && (
            <GlassCard className="p-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-sm font-bold">Analyzing Vitals & Symptom Weights...</p>
                <p className="text-xs text-slate-400 mt-1">Estimating condition coefficients in our medical expert model.</p>
              </div>
            </GlassCard>
          )}

          {result && (
            <GlassCard className={`border divide-y divide-slate-100 dark:divide-slate-850 p-0 overflow-hidden shadow-md ${getRiskStyles(result.risk_level).bg}`}>
              
              {/* Header: Risk badge */}
              <div className="p-6 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-lg">Evaluation Outcome</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Based on {selectedSymptoms.join(', ')}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase ${getRiskStyles(result.risk_level).badge}`}>
                  {result.risk_level} RISK
                </span>
              </div>

              {/* Possible Conditions */}
              <div className="p-6 space-y-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Possible Conditions</h5>
                <div className="flex flex-wrap gap-2">
                  {result.possible_conditions.map((c) => (
                    <span
                      key={c}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* General self care */}
              <div className="p-6 space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Self-Care Advice</h5>
                <p className="text-sm font-medium leading-relaxed">{result.general_advice}</p>
              </div>

              {/* When to see doctor */}
              <div className="p-6 space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-bounce" /> Clinical Action Instructions
                </h5>
                <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-200">{result.when_to_see_doctor}</p>
              </div>

              {/* Disclaimer */}
              <div className="p-5 bg-slate-500/5 text-[10px] text-slate-400 font-semibold leading-relaxed">
                {result.disclaimer}
              </div>

            </GlassCard>
          )}

          {!loading && !result && (
            <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-4 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
              <Stethoscope className="w-12 h-12 text-slate-300 animate-float" />
              <div className="max-w-sm space-y-1">
                <h4 className="font-extrabold text-slate-600 dark:text-slate-300 text-sm">No Active Report</h4>
                <p className="text-xs">Select your symptoms on the side card and click "Analyze" to run the expert diagnostic simulation.</p>
              </div>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default SymptomChecker;
