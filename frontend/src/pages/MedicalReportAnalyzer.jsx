import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  FileText,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  HeartPulse,
  Info,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';

const MedicalReportAnalyzer = () => {
  const { showToast } = useToast();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        showToast('Only PDF files are supported', 'warning');
        return;
      }
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setAnalysis(null);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a report PDF file first', 'warning');
      return;
    }
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
      showToast('Report analyzed successfully!', 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to extract or analyze report. Ensure it contains text.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'High') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (status === 'Low') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Intro */}
      <GlassCard className="bg-gradient-to-r from-indigo-500/10 to-clinical-500/10 border-l-4 border-l-indigo-500 p-8">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> AI Medical Report Analyzer
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Upload your medical lab report PDF (e.g., Blood Counts, Lipid Panels, Glucose profiles). The AI extracts the text contents, translates complex lab indexes into plain English, flags out-of-range metrics, and outlines helpful clinical explanations.
        </p>
      </GlassCard>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Upload Card */}
        <GlassCard className="md:col-span-1 h-fit flex flex-col gap-6">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Upload PDF Report</h3>
            <p className="text-[10px] text-slate-400 mt-1">Select a digital lab PDF to run calculations.</p>
          </div>

          <div className="space-y-4">
            {!file ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 cursor-pointer bg-slate-50/50 dark:bg-slate-800/10 transition-colors">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3 animate-float" />
                <span className="text-xs font-bold text-slate-500">Choose PDF Document</span>
                <span className="text-[10px] text-slate-400 mt-1">Max 5MB</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              Analyze Document
            </button>
          </div>
        </GlassCard>

        {/* Results Screen */}
        <div className="md:col-span-2 space-y-6">
          {loading && (
            <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-sm font-bold">Extracting PDF Clinical Values...</p>
                <p className="text-xs text-slate-400 mt-1">Calling AI report model to compile indices tables.</p>
              </div>
            </GlassCard>
          )}

          {analysis && (
            <div className="space-y-6">
              
              <GlassCard className="space-y-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Report Summary</h3>
                <h4 className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">{analysis.summary}</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">{analysis.recommendations}</p>
              </GlassCard>

              {analysis.abnormal_values && analysis.abnormal_values.length > 0 && (
                <GlassCard className="border border-red-500/20 bg-red-500/5 flex flex-col gap-3">
                  <h4 className="font-extrabold text-xs text-red-500 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" /> Out-of-Range Flags Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.abnormal_values.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 shadow-sm"
                      >
                        {v.status === 'High' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {v.parameter}: {v.value} ({v.status})
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Extracted Lab Parameters</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-slate-100 dark:bg-slate-850 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Parameter</th>
                        <th className="p-4">Observed Value</th>
                        <th className="p-4">Reference Range</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {analysis.findings.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{f.parameter}</td>
                          <td className="p-4 font-extrabold">{f.value}</td>
                          <td className="p-4 text-slate-400">{f.reference_range}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] uppercase tracking-wider ${getStatusColor(f.status)}`}>
                              {f.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-medium leading-relaxed max-w-xs">{f.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              {analysis.medical_terms && analysis.medical_terms.length > 0 && (
                <GlassCard className="space-y-4">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Info className="w-4 h-4 text-indigo-500" /> Medical Jargon Translated
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.medical_terms.map((t, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-1">
                        <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{t.term}</p>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{t.explanation}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              <div className="bg-slate-500/5 p-4 rounded-2xl text-[10px] text-slate-400 font-semibold leading-relaxed">
                {analysis.disclaimer}
              </div>

            </div>
          )}

          {!loading && !analysis && (
            <GlassCard className="p-12 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto animate-float" />
              <div className="max-w-sm space-y-1">
                <h4 className="font-extrabold text-slate-600 dark:text-slate-300 text-sm">No Active Document Analysis</h4>
                <p className="text-xs">Drag and drop or browse your lab test report PDF in the upload section to run the parsing tool.</p>
              </div>
            </GlassCard>
          )}

        </div>

      </div>

    </div>
  );
};

export default MedicalReportAnalyzer;
