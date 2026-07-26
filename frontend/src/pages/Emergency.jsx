import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import {
  HeartPulse,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Play,
  Square,
  ShieldAlert
} from 'lucide-react';

const Emergency = () => {
  const [dispatchActive, setDispatchActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [currentStatus, setCurrentStatus] = useState('Standby');
  const [statusLog, setStatusLog] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedManual, setExpandedManual] = useState(null);

  // Ambulance dispatcher log status simulator
  useEffect(() => {
    let interval = null;
    if (dispatchActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setDispatchActive(false);
      setCurrentStatus('Ambulance Arrived');
      addLog('Ambulance unit arrived at coordinates.');
    }
    return () => clearInterval(interval);
  }, [dispatchActive, timeLeft]);

  // Handle updates to logs based on time remaining
  useEffect(() => {
    if (!dispatchActive) return;

    if (timeLeft === 300) {
      setCurrentStatus('Transmitting GPS...');
      setStatusLog([]);
      addLog('SOS beacon triggered. Dispatcher contact active.');
      addLog('Locating device GPS coordinates...');
    } else if (timeLeft === 295) {
      setCurrentStatus('Ambulance Assigned');
      addLog('GPS coordinates locked. Nearest trauma response team assigned: Unit 4-B.');
    } else if (timeLeft === 270) {
      setCurrentStatus('Ambulance Dispatched');
      addLog('Ambulance Unit 4-B dispatched with siren clearance.');
    } else if (timeLeft === 200) {
      setCurrentStatus('En Route');
      addLog('Unit 4-B has cleared traffic junction 12. Estimated remaining: 3 minutes.');
    } else if (timeLeft === 100) {
      setCurrentStatus('Approaching Destination');
      addLog('Unit 4-B is approaching your immediate block.');
    }
  }, [timeLeft, dispatchActive]);

  const addLog = (message) => {
    const stamp = new Date().toLocaleTimeString();
    setStatusLog((prev) => [`[${stamp}] ${message}`, ...prev]);
  };

  const handleStartDispatch = () => {
    setDispatchActive(true);
    setTimeLeft(300);
  };

  const handleCancelDispatch = () => {
    setDispatchActive(false);
    setTimeLeft(300);
    setCurrentStatus('Standby');
    setStatusLog([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hotlines = [
    { name: 'National Emergency Siren', number: '911 / 112', desc: 'For life-threatening critical situations requiring police, fire, or immediate ambulance.' },
    { name: 'Poison Control Hotline', number: '1-800-222-1222', desc: 'Free, confidential support for accidental ingestion, chemical contact, or overdose guidance.' },
    { name: 'Cardiac Emergency Unit', number: '1-800-555-0199', desc: 'Direct regional paramedic hotline for active cardiovascular pressure, angina, or strokes.' },
    { name: 'Crisis Lifeline', number: '988', desc: 'National prevention resource offering active support for extreme stress, anxiety, or emotional issues.' }
  ];

  const firstAidManual = [
    {
      title: 'CPR (Cardiopulmonary Resuscitation)',
      symptoms: 'Unresponsiveness, lack of normal breathing or pulse',
      steps: [
        'Call emergency dispatch (911) immediately and locate an Automated External Defibrillator (AED) if available.',
        'Place the heel of one hand on the center of the person\'s chest, and place the other hand on top, interlocking fingers.',
        'Push hard and fast: Compress the chest 2 to 2.4 inches at a rate of 100 to 120 compressions per minute.',
        'Allow the chest to recoil completely between compressions. Minimize interruptions in compressions.',
        'If trained, give 2 rescue breaths after every 30 compressions. Otherwise, perform hands-only CPR until help arrives.'
      ]
    },
    {
      title: 'Choking Rescue (Heimlich Maneuver)',
      symptoms: 'Inability to speak, cough, or breathe; grasping the throat (universal choking sign)',
      steps: [
        'Ask the person: "Are you choking?" and get their permission to help.',
        'Stand behind the person, wrap your arms around their waist, and lean them slightly forward.',
        'Make a fist with one hand and place it slightly above the person\'s navel (well below the breastbone).',
        'Grasp your fist with your other hand and press hard into the abdomen with a quick, upward thrust.',
        'Perform thrusts until the object is expelled or the person becomes unresponsive. If they become unconscious, start CPR.'
      ]
    },
    {
      title: 'Severe Bleeding Control',
      symptoms: 'Spurt or continuous heavy flow of blood from a deep cut or laceration',
      steps: [
        'Put on sterile protective gloves if available. Remove any loose debris from the wound (do not remove deeply embedded objects).',
        'Apply firm, direct pressure to the wound using a clean dressing, gauze, or cloth.',
        'Maintain steady pressure until the bleeding stops. Secure the dressing with a bandage, but do not cut off circulation.',
        'If blood seeps through, place another layer of gauze on top. Do not remove the initial dressing.',
        'If bleeding is life-threatening and direct pressure does not stop it, apply a tourniquet above the wound if trained.'
      ]
    },
    {
      title: 'Thermal & Chemical Burns',
      symptoms: 'Redness, severe pain, blisters, charred skin, or chemical contact on skin',
      steps: [
        'Thermal: Immediately cool the burn area under cool (not ice-cold) running tap water for 10-20 minutes.',
        'Chemical: Flush the affected skin with large quantities of running water immediately to wash away chemical residues.',
        'Do not apply butter, oil, ointments, or ice to the burn, as these can trap heat and worsen tissue damage.',
        'Remove rings, jewelry, or restrictive clothing gently before the area begins to swell.',
        'Cover the burn loosely with a sterile, non-stick bandage or clean cloth. Seek professional medical evaluation.'
      ]
    }
  ];

  const filteredManuals = firstAidManual.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Disclaimer Alert */}
      <div className="bg-red-500/10 border border-red-500/25 p-5 rounded-2xl flex items-start gap-3.5 text-xs text-red-700 dark:text-red-400 font-semibold leading-relaxed shadow-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-red-500 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase">CRITICAL SYSTEM NOTICE: </span>
          This simulator does NOT trigger real-world emergency dispatches. If you are experiencing an actual acute medical crisis, please immediately hang up, pick up a real telephone line, and dial <span className="underline">911</span> or your national dispatcher.
        </div>
      </div>

      {/* Grid splits SOS simulator and Hotlines/Manuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOS Panel */}
        <GlassCard className="flex flex-col items-center justify-center p-8 gap-6 border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/5 to-transparent">
          <div className="text-center">
            <h3 className="font-extrabold text-lg text-red-600 dark:text-red-400">Emergency Dispatch Center</h3>
            <p className="text-xs text-slate-400 mt-1">Activate the telemetry beacon to simulate emergency routing.</p>
          </div>

          {/* Pulsing Beacon Ring */}
          <div className="relative flex items-center justify-center w-52 h-52">
            {dispatchActive && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-red-500/20 animate-ping duration-1000"></div>
                <div className="absolute w-52 h-52 rounded-full bg-red-500/10 animate-ping-slow duration-2000"></div>
              </>
            )}
            
            <button
              onClick={dispatchActive ? handleCancelDispatch : handleStartDispatch}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
                dispatchActive
                  ? 'bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-red-500/40 border-4 border-red-500'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20'
              }`}
            >
              <ShieldAlert className="w-10 h-10 mb-1 animate-float" />
              <span className="font-extrabold text-sm tracking-wider uppercase">
                {dispatchActive ? 'Cancel SOS' : 'Trigger SOS'}
              </span>
              {dispatchActive && <span className="text-xs font-bold mt-1 tracking-widest">{formatTime(timeLeft)}</span>}
            </button>
          </div>

          {/* Dispatcher Details */}
          {dispatchActive && (
            <div className="w-full space-y-4 animate-fade-in">
              <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Ambulance Arrival</p>
                  <p className="text-2xl font-extrabold text-red-500">{formatTime(timeLeft)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Code</p>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest animate-pulse mt-0.5">{currentStatus}</p>
                </div>
              </div>

              {/* Status log panel */}
              <div className="bg-black/90 p-4 rounded-xl font-mono text-[10px] text-emerald-500 h-32 overflow-y-auto space-y-1.5 shadow-inner">
                {statusLog.map((log, idx) => (
                  <p key={idx}>{log}</p>
                ))}
              </div>
            </div>
          )}

          {!dispatchActive && (
            <div className="text-center max-w-sm">
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Clicking the SOS button launches an advanced simulation connecting to a regional ambulance coordinator, fetching patient medical card details, and tracing GPS mock vectors.
              </p>
            </div>
          )}
        </GlassCard>

        {/* Hotlines Panel */}
        <div className="space-y-6">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-500" /> Essential Crisis Hotlines
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {hotlines.map((hotline) => (
              <GlassCard key={hotline.name} className="flex gap-4 p-5 hover:scale-[1.01]">
                <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 h-fit">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{hotline.name}</h4>
                    <span className="text-red-500 dark:text-red-400 font-black text-sm tracking-wide bg-red-500/5 px-2.5 py-0.5 rounded-lg border border-red-500/10">{hotline.number}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{hotline.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>

      {/* First Aid Manual Section */}
      <GlassCard className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-500 animate-float" /> First Aid Response Manual
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick diagnostic instructions and self-care steps for critical incidents.</p>
          </div>
          
          {/* Search Manual */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search first aid topics..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Accordions */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredManuals.length > 0 ? (
            filteredManuals.map((item, idx) => {
              const isOpen = expandedManual === idx;
              return (
                <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setExpandedManual(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm hover:text-emerald-500 dark:hover:text-emerald-400 py-1 transition-colors"
                  >
                    <div>
                      <span>{item.title}</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Symptoms: {item.symptoms}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {isOpen && (
                    <div className="mt-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 space-y-3 animate-fade-in">
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Recommended Actions</h4>
                      <ol className="list-decimal list-inside text-xs font-semibold leading-relaxed space-y-2.5 text-slate-700 dark:text-slate-300">
                        {item.steps.map((step, sIdx) => (
                          <li key={sIdx} className="pl-1">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 font-medium py-4 text-center">No manuals matching search criteria.</p>
          )}
        </div>
      </GlassCard>

    </div>
  );
};

export default Emergency;
