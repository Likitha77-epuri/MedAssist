import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  Search,
  Database,
  Info,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

const DiseaseSearch = () => {
  const { showToast } = useToast();
  
  const [query, setQuery] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Load initial popular diseases list
  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await api.get(`/diseases?query=${searchQuery}`);
      setDiseases(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not query disease records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleViewDetails = async (id) => {
    setModalLoading(true);
    try {
      const res = await api.get(`/disease/${id}`);
      setSelectedDisease(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch details for this condition', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <GlassCard className="bg-gradient-to-r from-clinical-500/10 to-teal-500/10 border-l-4 border-l-clinical-500 p-8">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-clinical-600 dark:text-clinical-400" /> Medical Disease Directory
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Search our directory of illnesses and health conditions. Learn about potential causes, symptom breakdowns, preventative health, medical treatments, and lifestyle adjustments.
        </p>
      </GlassCard>

      {/* Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by disease name (e.g. Flu, Diabetes, Cold)..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium shadow-glass"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-colors text-sm flex items-center gap-2"
        >
          Search
        </button>
      </form>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : diseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diseases.map((d) => (
            <GlassCard
              key={d.id}
              onClick={() => handleViewDetails(d.id)}
              className="border hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{d.name}</h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed line-clamp-3">
                  {d.description}
                </p>
              </div>

              {/* Tags panel */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                {d.symptoms.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-bold">
                    {s}
                  </span>
                ))}
                {d.symptoms.length > 3 && (
                  <span className="text-[10px] text-slate-400 font-bold ml-1">
                    +{d.symptoms.length - 3} more
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-float" />
          <p className="text-sm font-semibold text-slate-500">No diseases found matching your search</p>
          <p className="text-xs mt-1">Try another keyword, or check database seeding scripts.</p>
        </GlassCard>
      )}

      {/* --- DISEASE DETAILS MODAL --- */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-5 right-5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Title */}
            <div className="space-y-2 pr-8">
              <h3 className="font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">{selectedDisease.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
                {selectedDisease.description}
              </p>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Causes</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.causes.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Symptoms</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.symptoms.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Factors</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.risk_factors.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prevention Protocols</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.prevention.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treatments</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.treatment.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifestyle Tips</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedDisease.lifestyle_tips.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>

            </div>

            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-2.5 text-[10px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse mt-0.5" />
              <span>DISCLAIMER: This directory information is for educational purposes only. Do not use for diagnostic decisions. Please speak to your primary medical physician for personal treatment protocols.</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseSearch;
