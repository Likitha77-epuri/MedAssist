import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  Calendar,
  Database,
  Pill,
  Trash2,
  Check,
  X,
  Plus,
  Edit2,
  Save,
  MessageSquare,
  Activity,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  
  const [loading, setLoading] = useState(false);

  // CRUD Forms States
  const [editingDiseaseId, setEditingDiseaseId] = useState(null);
  const [diseaseForm, setDiseaseForm] = useState({
    name: '',
    description: '',
    causes: '',
    symptoms: '',
    risk_factors: '',
    prevention: '',
    treatment: '',
    lifestyle_tips: ''
  });

  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    uses: '',
    dosage: '',
    side_effects: '',
    precautions: '',
    interactions: '',
    storage: ''
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not load administrative stats', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch registered patient list', 'error');
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch master appointments', 'error');
    }
  };

  const fetchDiseasesAndMedicines = async () => {
    try {
      const [disRes, medRes] = await Promise.all([
        api.get('/diseases?query='),
        api.get('/medicines?query=')
      ]);
      setDiseases(disRes.data);
      setMedicines(medRes.data);
    } catch (err) {
      console.error(err);
      showToast('Could not sync disease/medicine data lists', 'error');
    }
  };

  const syncData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchAppointments(),
      fetchDiseasesAndMedicines()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    syncData();
  }, []);

  // --- User deletion ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All corresponding health records will be orphan.')) return;
    try {
      await api.delete(`/admin/user/${id}`);
      showToast('User account deleted successfully', 'success');
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast('Could not complete user deletion', 'error');
    }
  };

  // --- Appointment Status confirm/cancel ---
  const handleUpdateApptStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointment/${id}/status`, { status });
      showToast(`Appointment status updated to ${status}`, 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  // --- Disease CRUD Handlers ---
  const splitTags = (str) => {
    if (!str) return [];
    return str.split(',').map((x) => x.trim()).filter((x) => x.length > 0);
  };

  const handleDiseaseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: diseaseForm.name,
      description: diseaseForm.description,
      causes: splitTags(diseaseForm.causes),
      symptoms: splitTags(diseaseForm.symptoms),
      risk_factors: splitTags(diseaseForm.risk_factors),
      prevention: splitTags(diseaseForm.prevention),
      treatment: splitTags(diseaseForm.treatment),
      lifestyle_tips: splitTags(diseaseForm.lifestyle_tips)
    };

    try {
      if (editingDiseaseId) {
        await api.put(`/admin/disease/${editingDiseaseId}`, payload);
        showToast('Disease record updated', 'success');
      } else {
        await api.post('/admin/diseases', payload);
        showToast('New disease record created', 'success');
      }
      setEditingDiseaseId(null);
      setDiseaseForm({
        name: '',
        description: '',
        causes: '',
        symptoms: '',
        risk_factors: '',
        prevention: '',
        treatment: '',
        lifestyle_tips: ''
      });
      fetchDiseasesAndMedicines();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast('Failed to process disease record', 'error');
    }
  };

  const handleEditDisease = (dis) => {
    setEditingDiseaseId(dis.id);
    setDiseaseForm({
      name: dis.name,
      description: dis.description,
      causes: dis.causes.join(', '),
      symptoms: dis.symptoms.join(', '),
      risk_factors: dis.risk_factors.join(', '),
      prevention: dis.prevention.join(', '),
      treatment: dis.treatment.join(', '),
      lifestyle_tips: dis.lifestyle_tips.join(', ')
    });
  };

  const handleDeleteDisease = async (id) => {
    if (!window.confirm('Delete this disease profile?')) return;
    try {
      await api.delete(`/admin/disease/${id}`);
      showToast('Disease profile deleted', 'success');
      fetchDiseasesAndMedicines();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete disease', 'error');
    }
  };

  // --- Medicine CRUD Handlers ---
  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: medicineForm.name,
      uses: splitTags(medicineForm.uses),
      dosage: medicineForm.dosage,
      side_effects: splitTags(medicineForm.side_effects),
      precautions: splitTags(medicineForm.precautions),
      interactions: splitTags(medicineForm.interactions),
      storage: medicineForm.storage
    };

    try {
      if (editingMedicineId) {
        await api.put(`/admin/medicine/${editingMedicineId}`, payload);
        showToast('Medicine record updated', 'success');
      } else {
        await api.post('/admin/medicines', payload);
        showToast('New medicine record created', 'success');
      }
      setEditingMedicineId(null);
      setMedicineForm({
        name: '',
        uses: '',
        dosage: '',
        side_effects: '',
        precautions: '',
        interactions: '',
        storage: ''
      });
      fetchDiseasesAndMedicines();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast('Failed to process medicine details', 'error');
    }
  };

  const handleEditMedicine = (med) => {
    setEditingMedicineId(med.id);
    setMedicineForm({
      name: med.name,
      uses: med.uses.join(', '),
      dosage: med.dosage,
      side_effects: med.side_effects.join(', '),
      precautions: med.precautions.join(', '),
      interactions: med.interactions.join(', '),
      storage: med.storage
    });
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Delete this medicine entry?')) return;
    try {
      await api.delete(`/admin/medicine/${id}`);
      showToast('Medicine profile deleted', 'success');
      fetchDiseasesAndMedicines();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete medicine', 'error');
    }
  };

  const getApptStatusColor = (status) => {
    if (status === 'confirmed') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'cancelled') return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Intro Header */}
      <GlassCard className="bg-gradient-to-r from-red-500/10 to-clinical-500/10 border-l-4 border-l-red-500 p-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" /> MediAssist Administrator Panel
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
            Monitor client metrics, execute role cleanups, confirm patient appointments queue, and edit catalog assets.
          </p>
        </div>
        <button
          onClick={syncData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl shadow-md transition-colors"
        >
          Refresh Console
        </button>
      </GlassCard>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'stats'
              ? 'border-b-red-500 text-red-500'
              : 'border-b-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview Stats
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'users'
              ? 'border-b-red-500 text-red-500'
              : 'border-b-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('appts')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'appts'
              ? 'border-b-red-500 text-red-500'
              : 'border-b-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Appointment Bookings
        </button>
        <button
          onClick={() => setActiveTab('diseases')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'diseases'
              ? 'border-b-red-500 text-red-500'
              : 'border-b-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Diseases Catalog
        </button>
        <button
          onClick={() => setActiveTab('medicines')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'medicines'
              ? 'border-b-red-500 text-red-500'
              : 'border-b-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Medicines Catalog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* TAB: STATS OVERVIEW */}
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <GlassCard className="flex items-center gap-4">
                <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Patients</p>
                  <p className="text-2xl font-extrabold">{stats.total_users}</p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booked Consults</p>
                  <p className="text-2xl font-extrabold">{stats.total_appointments}</p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Health Vitals logs</p>
                  <p className="text-2xl font-extrabold">{stats.total_health_records}</p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4">
                <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chat Threads (Msgs)</p>
                  <p className="text-2xl font-extrabold">
                    {stats.total_chatbot_sessions}{' '}
                    <span className="text-xs font-semibold text-slate-400">({stats.total_chatbot_messages})</span>
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4">
                <div className="bg-teal-500/10 p-3 rounded-2xl text-teal-600 dark:text-teal-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Diseases catalog</p>
                  <p className="text-2xl font-extrabold">{stats.total_diseases}</p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4">
                <div className="bg-pink-500/10 p-3 rounded-2xl text-pink-500">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Medicines catalog</p>
                  <p className="text-2xl font-extrabold">{stats.total_medicines}</p>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <GlassCard className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Registered Accounts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-slate-100 dark:bg-slate-850 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Email</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Account Type</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                        <td className="p-4 font-bold">{u.email}</td>
                        <td className="p-4">{u.full_name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] uppercase tracking-wider ${
                            u.role === 'admin' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-slate-500 bg-slate-500/10 border-slate-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* TAB: APPOINTMENT CONSOLE */}
          {activeTab === 'appts' && (
            <GlassCard className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Appointment Bookings Queue</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-slate-100 dark:bg-slate-850 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Patient Name / Email</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Specialty</th>
                      <th className="p-4">Date/Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                        <td className="p-4">
                          <p className="font-bold">{appt.user_name}</p>
                          <p className="text-[10px] text-slate-400">{appt.user_email}</p>
                        </td>
                        <td className="p-4">{appt.doctor_name}</td>
                        <td className="p-4">{appt.specialty}</td>
                        <td className="p-4">
                          <p>{appt.date}</p>
                          <p className="text-[10px] text-slate-400">{appt.time}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] uppercase tracking-wider ${getApptStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {appt.status === 'pending' && (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleUpdateApptStatus(appt.id, 'confirmed')}
                                className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')}
                                className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* TAB: DISEASES CATALOG */}
          {activeTab === 'diseases' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Form Section */}
              <GlassCard className="lg:col-span-1 h-fit flex flex-col gap-4">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    {editingDiseaseId ? <Edit2 className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4 text-red-500" />}
                    {editingDiseaseId ? 'Edit Disease Profile' : 'Add Disease Profile'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Configure clinical descriptions and index arrays.</p>
                </div>

                <form onSubmit={handleDiseaseSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disease Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Influenza (Flu)"
                      value={diseaseForm.name}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Medical summary explanation..."
                      value={diseaseForm.description}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100 font-semibold"
                    />
                  </div>

                  {/* Sub arrays - comma separated */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Causes (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Rhinovirus, Weakened immune system"
                      value={diseaseForm.causes}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, causes: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Symptoms (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Fever, Cough, Runny nose"
                      value={diseaseForm.symptoms}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, symptoms: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Factors (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Age, Smoker"
                      value={diseaseForm.risk_factors}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, risk_factors: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prevention (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Vaccination, Washing hands"
                      value={diseaseForm.prevention}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, prevention: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatment (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Rest, Hydration, Antibiotics"
                      value={diseaseForm.treatment}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, treatment: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lifestyle Tips (comma separated)</label>
                    <input
                      type="text"
                      placeholder="BRAT diet, Inhalation"
                      value={diseaseForm.lifestyle_tips}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, lifestyle_tips: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    {editingDiseaseId ? 'Save Profile' : 'Create Profile'}
                  </button>
                  {editingDiseaseId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDiseaseId(null);
                        setDiseaseForm({ name: '', description: '', causes: '', symptoms: '', risk_factors: '', prevention: '', treatment: '', lifestyle_tips: '' });
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold mt-1"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </GlassCard>

              {/* List Section */}
              <GlassCard className="lg:col-span-2 p-0 overflow-hidden border border-slate-200 dark:border-slate-800 h-fit">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Master Diseases Profiles</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-slate-100 dark:bg-slate-850 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Disease Name</th>
                        <th className="p-4">Summary</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {diseases.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{d.name}</td>
                          <td className="p-4 truncate max-w-xs">{d.description}</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditDisease(d)}
                                className="p-1.5 border border-slate-200 dark:border-slate-800 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDisease(d.id)}
                                className="p-1.5 border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

            </div>
          )}

          {/* TAB: MEDICINES CATALOG */}
          {activeTab === 'medicines' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Form Section */}
              <GlassCard className="lg:col-span-1 h-fit flex flex-col gap-4">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    {editingMedicineId ? <Edit2 className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4 text-red-500" />}
                    {editingMedicineId ? 'Edit Medicine Profile' : 'Add Medicine Profile'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Configure drug directives and contraindications.</p>
                </div>

                <form onSubmit={handleMedicineSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medicine Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paracetamol"
                      value={medicineForm.name}
                      onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Uses (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Fever reducer, Pain relief"
                      value={medicineForm.uses}
                      onChange={(e) => setMedicineForm({ ...medicineForm, uses: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dosage Instructions</label>
                    <input
                      type="text"
                      placeholder="325mg to 650mg every 4-6 hours"
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Side Effects (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Nausea, Liver strain"
                      value={medicineForm.side_effects}
                      onChange={(e) => setMedicineForm({ ...medicineForm, side_effects: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precautions (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Avoid alcohol, Take with food"
                      value={medicineForm.precautions}
                      onChange={(e) => setMedicineForm({ ...medicineForm, precautions: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interactions (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Warfarin, Aspirin"
                      value={medicineForm.interactions}
                      onChange={(e) => setMedicineForm({ ...medicineForm, interactions: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Storage Guidelines</label>
                    <input
                      type="text"
                      placeholder="Store at room temp away from light"
                      value={medicineForm.storage}
                      onChange={(e) => setMedicineForm({ ...medicineForm, storage: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-red-500 text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    {editingMedicineId ? 'Save Profile' : 'Create Profile'}
                  </button>
                  {editingMedicineId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMedicineId(null);
                        setMedicineForm({ name: '', uses: '', dosage: '', side_effects: '', precautions: '', interactions: '', storage: '' });
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold mt-1"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </GlassCard>

              {/* List Section */}
              <GlassCard className="lg:col-span-2 p-0 overflow-hidden border border-slate-200 dark:border-slate-800 h-fit">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Master Medicines Profiles</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Medicine Name</th>
                        <th className="p-4">Usage Directive</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {medicines.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-850/20">
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{m.name}</td>
                          <td className="p-4 truncate max-w-xs">{m.uses.join(', ')}</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditMedicine(m)}
                                className="p-1.5 border border-slate-200 dark:border-slate-800 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedicine(m.id)}
                                className="p-1.5 border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
