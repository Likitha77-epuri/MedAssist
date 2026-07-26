import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CalendarDays,
  FileCheck,
  X,
  Stethoscope,
  BookOpen
} from 'lucide-react';

const AppointmentBooking = () => {
  const { showToast } = useToast();

  const specialties = [
    { name: 'Cardiology', doctors: ['Dr. Sarah Jenkins', 'Dr. Marcus Vance'] },
    { name: 'Pediatrics', doctors: ['Dr. Emily Watson', 'Dr. Linda Ross'] },
    { name: 'Endocrinology', doctors: ['Dr. Robert Chen', 'Dr. Alicia Diaz'] },
    { name: 'Neurology', doctors: ['Dr. Alan Turing', 'Dr. Samantha Cole'] },
    { name: 'Dermatology', doctors: ['Dr. Jane Foster', 'Dr. David Bruce'] },
    { name: 'General Practice', doctors: ['Dr. Gregory House', 'Dr. John Watson'] }
  ];

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM'
  ];

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Sync available doctors when specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      const match = specialties.find((s) => s.name === selectedSpecialty);
      setAvailableDoctors(match ? match.doctors : []);
      setSelectedDoctor('');
    } else {
      setAvailableDoctors([]);
      setSelectedDoctor('');
    }
  }, [selectedSpecialty]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch registered appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) {
      showToast('Please select all booking parameters first', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      await api.post('/appointment', {
        specialty: selectedSpecialty,
        doctor_name: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
      });
      showToast('Appointment booked successfully! Waiting for admin review.', 'success');
      // Reset form
      setSelectedSpecialty('');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Booking conflict! This slot is already taken.';
      showToast(msg, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointment/${id}/cancel`);
      showToast('Appointment cancelled successfully', 'success');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showToast('Failed to cancel appointment', 'error');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'confirmed') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'cancelled') return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <GlassCard className="bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border-l-4 border-l-pink-500 p-8">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-pink-600 dark:text-pink-400" /> Appointment Booking Center
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">
          Schedule virtual consult sessions or in-person check-ups with medical specialists (Cardiology, Pediatrics, Endocrinology, etc.). Real-time slot availability prevents conflict bookings.
        </p>
      </GlassCard>

      {/* Grid: Form and Appointments list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Booking Form Card */}
        <GlassCard className="md:col-span-1 h-fit flex flex-col gap-5">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-pink-500" /> Book a New Slot
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Configure your target doctor and timings below.</p>
          </div>

          <form onSubmit={handleBook} className="space-y-4">
            
            {/* Specialty */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialty Department</label>
              <select
                required
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500 text-slate-800 dark:text-slate-100 font-semibold"
              >
                <option value="">Select Specialty</option>
                {specialties.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Physician</label>
              <select
                required
                disabled={!selectedSpecialty}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500 text-slate-800 dark:text-slate-100 font-semibold disabled:opacity-50"
              >
                <option value="">Select Doctor</option>
                {availableDoctors.map((doc) => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Consult</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500 text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Time Slot</label>
              <select
                required
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500 text-slate-800 dark:text-slate-100 font-semibold"
              >
                <option value="">Select Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitLoading || !selectedTime}
              className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              Book Selected Slot
            </button>
          </form>
        </GlassCard>

        {/* Appointments Queue Panel */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-pink-500 animate-float" /> Upcoming Registered Consultations
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {appointments.map((appt) => (
                <GlassCard key={appt.id} className="flex flex-col justify-between border hover:border-slate-300 transition-colors p-6 relative gap-4">
                  
                  {/* Status Badge */}
                  <span className={`absolute top-5 right-5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${getStatusBadge(appt.status)}`}>
                    {appt.status}
                  </span>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{appt.doctor_name}</h4>
                    <p className="text-xs text-pink-500 dark:text-pink-400 font-bold">{appt.specialty}</p>
                    
                    <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {appt.time}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {appt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="w-full mt-2 py-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel Booking
                    </button>
                  )}
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="p-12 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto animate-float" />
              <div className="max-w-sm space-y-1">
                <h4 className="font-extrabold text-slate-600 dark:text-slate-300 text-sm">No Active Registrations</h4>
                <p className="text-xs">Schedule your first appointment on the side card to consult a professional specialist.</p>
              </div>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default AppointmentBooking;
