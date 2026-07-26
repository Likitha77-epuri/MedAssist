import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  Search,
  Pill,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  X,
  FileCheck
} from 'lucide-react';

const MedicineSearch = () => {
  const { showToast } = useToast();
  
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load initial popular medicines
  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await api.get(`/medicines?query=${searchQuery}`);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not query medicine database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await api.get(`/medicine/${id}`);
      setSelectedMedicine(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve drug details', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-clinical-500/10 border-l-4 border-l-emerald-500 p-8">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Pill className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Pharmacopeia & Medicine Search
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Search our catalog of medications. Discover indications (uses), standard dosage guidelines, side effects profiles, necessary clinical precautions, and vital drug interactions.
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
            placeholder="Search by drug name (e.g. Paracetamol, Ibuprofen, Metformin)..."
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

      {/* Medicine Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicines.map((m) => (
            <GlassCard
              key={m.id}
              onClick={() => handleViewDetails(m.id)}
              className="border hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{m.name}</h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.uses.slice(0, 2).map((use) => (
                    <span key={use} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {use}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed line-clamp-2">
                  Dosage Summary: {m.dosage}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-float" />
          <p className="text-sm font-semibold text-slate-500">No medications found matching your search</p>
          <p className="text-xs mt-1">Try another keyword, or verify backend db seeding.</p>
        </GlassCard>
      )}

      {/* --- MEDICINE DETAILS MODAL --- */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-5 right-5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Title */}
            <div className="space-y-2 pr-8">
              <h3 className="font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Pill className="w-7 h-7" /> {selectedMedicine.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedMedicine.uses.map((use) => (
                  <span key={use} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Common Dosage Guidance</h4>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedMedicine.dosage}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Advice</h4>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedMedicine.storage}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-rose-500">Common Side Effects</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedMedicine.side_effects.map((se) => <li key={se}>{se}</li>)}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-amber-500">Precautions</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedMedicine.precautions.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>

              <div className="space-y-1 md:col-span-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-red-500">Critical Drug Interactions</h4>
                <ul className="list-disc list-inside text-xs font-medium space-y-1 text-slate-700 dark:text-slate-300">
                  {selectedMedicine.interactions.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>

            </div>

            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-2.5 text-[10px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse mt-0.5" />
              <span>DISCLAIMER: This drug database details are for educational purposes. Consult a licensed pharmacist or physician before starting any self-medication schedule. Do not alter physician prescription guidelines.</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
