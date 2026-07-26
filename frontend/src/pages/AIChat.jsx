import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import {
  MessageSquare,
  Plus,
  Send,
  HeartPulse,
  Trash2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const AIChat = () => {
  const location = useLocation();
  const { showToast } = useToast();
  
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  // If redirected from Dashboard, we can resume a session
  useEffect(() => {
    const resumeId = location.state?.resumeSessionId;
    if (resumeId) {
      loadSessionDetails(resumeId);
    } else {
      loadSessions(true); // Load sessions and select latest
    }
  }, [location.state]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessions = async (autoSelectLatest = false) => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
      if (autoSelectLatest && res.data.length > 0 && !currentSessionId) {
        loadSessionDetails(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load chat history', 'error');
    }
  };

  const loadSessionDetails = async (sessionId) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/session/${sessionId}`);
      setMessages(res.data.messages);
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve conversation details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim()) return;
    
    setInputMessage('');
    // Optimistic UI updates
    const localUserMsg = { sender: 'user', content: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, localUserMsg]);
    
    setLoading(true);
    try {
      const res = await api.post('/chat', {
        message: textToSend,
        session_id: currentSessionId
      });
      
      const localAiMsg = { sender: 'ai', content: res.data.message, timestamp: new Date() };
      setMessages((prev) => [...prev, localAiMsg]);
      
      // Update session list to update titles
      if (!currentSessionId) {
        setCurrentSessionId(res.data.session_id);
      }
      loadSessions(false);
    } catch (err) {
      console.error(err);
      showToast('Could not generate AI response', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    showToast('Started new consultation session', 'info');
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation history?')) return;
    try {
      await api.delete(`/chat/session/${sessionId}`);
      showToast('Conversation deleted', 'success');
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      loadSessions(false);
    } catch (err) {
       console.error(err);
       showToast('Could not delete session', 'error');
    }
  };

  const suggestionPrompts = [
    "I have fever and headache.",
    "What are the symptoms of diabetes?",
    "What foods should I eat during fever?"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkbg-100/40 backdrop-blur-xl overflow-hidden relative">
      
      {/* Sidebar toggle button (Mobile Only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute md:hidden top-3 left-3 z-30 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
      >
        History
      </button>

      {/* --- SIDEBAR: PAST CONVERSATIONS --- */}
      <div className={`w-64 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-darkbg-100/60 backdrop-blur-md flex-shrink-0 flex flex-col transition-all duration-300 md:relative absolute md:translate-x-0 inset-y-0 left-0 z-20 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:flex`}>
        {/* Header action */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
          <span className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Consultations</span>
          <button
            onClick={handleStartNewSession}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 transition-colors"
            title="Start New Consultation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.length > 0 ? (
            sessions.map((sess) => {
              const active = currentSessionId === sess.id;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    loadSessionDetails(sess.id);
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold leading-relaxed transition-all ${
                    active
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{sess.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(sess.id, e)}
                    className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white ${
                      active ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 text-[10px] py-8">No past chats logged</p>
          )}
        </div>
      </div>

      {/* --- MAIN CHAT PANEL --- */}
      <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-darkbg-200/10 relative">
        
        {/* Warning Alert Bar */}
        <div className="bg-amber-500/10 border-b border-amber-500/25 p-3 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 px-6">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <span>Notice: AI output is simulated/advisory. Call emergency services if facing acute symptoms.</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 border text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-emerald-500 border-emerald-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {/* Render newlines */}
                    <div className="whitespace-pre-line font-medium">{msg.content}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-6">
              <div className="bg-emerald-500/15 p-4 rounded-3xl text-emerald-600 dark:text-emerald-400 animate-bounce">
                <HeartPulse className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg">Consult MediAssist Clinical AI</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Describe your symptoms, query health conditions, or explore medicine uses. Use the presets below to start.
                </p>
              </div>

              {/* Suggestions Presets */}
              <div className="flex flex-col gap-2 w-full pt-4">
                {suggestionPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSendMessage(p)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loader */}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="max-w-[80%] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-xs font-semibold text-slate-400">AI is evaluating parameters...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white/70 dark:bg-darkbg-100/70 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your health question here..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3.5 rounded-xl shadow-md shadow-emerald-500/10 flex items-center justify-center transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AIChat;
