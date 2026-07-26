import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import { User, Mail, Calendar, Heart, ShieldAlert, Plus, X, Phone, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [newChronic, setNewChronic] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync with auth user on mount or change
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAge(user.age || '');
      setGender(user.gender || '');
      setBloodGroup(user.blood_group || '');
      setEmergencyContact(user.emergency_contact || '');
      setAllergies(user.allergies || []);
      setChronicDiseases(user.chronic_diseases || []);
    }
  }, [user]);

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    if (allergies.includes(newAllergy.trim())) {
      showToast('Allergy already added', 'warning');
      return;
    }
    setAllergies([...allergies, newAllergy.trim()]);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (item) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const handleAddChronic = (e) => {
    e.preventDefault();
    if (!newChronic.trim()) return;
    if (chronicDiseases.includes(newChronic.trim())) {
      showToast('Chronic disease already added', 'warning');
      return;
    }
    setChronicDiseases([...chronicDiseases, newChronic.trim()]);
    setNewChronic('');
  };

  const handleRemoveChronic = (item) => {
    setChronicDiseases(chronicDiseases.filter((c) => c !== item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        blood_group: bloodGroup || null,
        emergency_contact: emergencyContact || null,
        allergies,
        chronic_diseases: chronicDiseases,
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to update profile details.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Intro Header */}
      <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-clinical-500/10 p-8 border-l-4 border-l-emerald-500">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Patient Medical Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Manage your personal identifiers, blood group typing, emergency contacts, drug allergies, and active clinical logs. This data helps the AI personalize consultation warnings and provides crucial telemetry during emergency triggers.
        </p>
      </GlassCard>

      {/* Main profile layouts */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Info and Demographics */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="space-y-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Demographic Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    max="125"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age in years"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="">Select Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Emergency phone number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </GlassCard>
        </div>

        {/* Clinical Tags: Allergies & Chronic Diseases */}
        <div className="md:col-span-1 space-y-6">
          {/* Allergies Card */}
          <GlassCard className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Drug & Food Allergies
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Specify substances that cause clinical hypersensitivity.</p>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[4rem] p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="p-0.5 hover:bg-rose-500/20 rounded-md text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 font-medium italic">No active allergies declared.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 font-medium"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

          {/* Chronic Illnesses Card */}
          <GlassCard className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-500 animate-pulse" /> Chronic Conditions
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Specify chronic ailments under medical tracking.</p>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[4rem] p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              {chronicDiseases.length > 0 ? (
                chronicDiseases.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => handleRemoveChronic(condition)}
                      className="p-0.5 hover:bg-emerald-500/20 rounded-md text-emerald-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 font-medium italic">No chronic ailments declared.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChronic}
                onChange={(e) => setNewChronic(e.target.value)}
                placeholder="e.g. Asthma, Hypertension"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 font-medium"
              />
              <button
                type="button"
                onClick={handleAddChronic}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
