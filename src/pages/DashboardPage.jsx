import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  History, 
  FileText, 
  Settings, 
  Radio, 
  Award, 
  Clock, 
  Zap, 
  Shield, 
  Trash2, 
  Download, 
  ExternalLink,
  Sliders,
  ChevronRight,
  Sparkles,
  Check,
  X
} from 'lucide-react';

export default function DashboardPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sessions' | 'documents' | 'settings'

  const [aiModel, setAiModel] = useState(() => localStorage.getItem('parakeet_model') || 'gemini-2.5-flash');
  const [latencySpeed, setLatencySpeed] = useState('ultra');
  const [autoAnswerDelay, setAutoAnswerDelay] = useState(() => parseFloat(localStorage.getItem('parakeet_silence_delay')) || 1.5);
  const [hotkeyTrigger, setHotkeyTrigger] = useState(() => localStorage.getItem('parakeet_hotkey') || 'Ctrl + Space');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [selectedSessionModal, setSelectedSessionModal] = useState(null);

  const [documents, setDocuments] = useState([
    { id: 1, name: "Alex_Morgan_Staff_SWE_Resume.pdf", size: "142 KB", updated: "2 days ago", active: true },
    { id: 2, name: "Google_L5_Distributed_Systems_Notes.md", size: "38 KB", updated: "Yesterday", active: true },
    { id: 3, name: "Meta_System_Design_Cheatsheet.pdf", size: "89 KB", updated: "1 week ago", active: false }
  ]);

  const docInputRef = useRef(null);

  const pastSessions = [
    {
      id: "sess-1",
      company: "Google",
      role: "Staff Software Engineer (L5/L6)",
      date: "Today, 10:02 AM",
      duration: "32 mins",
      score: 94,
      topics: ["Cache Stampedes", "Distributed Mutex", "STAR Leadership"],
      transcriptPreview: "Interviewer: How do you prevent cache stampedes during high-volume reads?\nCandidate: We deployed probabilistic early expiration with Redis alongside local process cache locks. This reduced origin database load by 98% during traffic spikes."
    },
    {
      id: "sess-2",
      company: "Meta",
      role: "Engineering Manager (E6)",
      date: "Yesterday",
      duration: "45 mins",
      score: 91,
      topics: ["Disagreement & Commit", "Team Scalability", "Capacity Planning"],
      transcriptPreview: "Interviewer: Tell me about a time you killed a project with positive results.\nCandidate: Situation: In Q3, our prototype had an unsustainable blast radius on database replication lag. Task: I needed to evaluate if continuing was a sunken cost trap. Action: I gathered telemetry, presented a pivot plan to leadership, and repurposed 80% of our code. Result: Saved $1.2M in annual cloud overhead."
    },
    {
      id: "sess-3",
      company: "Stripe",
      role: "Senior Backend Engineer",
      date: "3 days ago",
      duration: "38 mins",
      score: 96,
      topics: ["Idempotency Keys", "Two-Phase Commits", "Postgres Citus"],
      transcriptPreview: "Interviewer: What happens when the banking webhook times out?\nCandidate: We enforce unique idempotency keys in headers with distributed locks in Redis. If duplicate events arrive, our state machine recognizes the existing transaction UUID and responds with the cached result without double charging."
    }
  ];

  const handleSaveSettings = () => {
    localStorage.setItem('parakeet_model', aiModel);
    localStorage.setItem('parakeet_silence_delay', autoAnswerDelay.toString());
    localStorage.setItem('parakeet_hotkey', hotkeyTrigger);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      const newDoc = {
        id: Date.now(),
        name: file.name,
        size: sizeStr,
        updated: "Just now",
        active: true
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
  };

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span className="badge" style={{ marginBottom: '8px' }}>User Portal</span>
          <h1 className="font-heading" style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>
            Candidate Command Center
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Plan: <span style={{ color: '#10b981', fontWeight: 700 }}>100% Free Forever Tier (Active)</span> • Credits: <span style={{ color: '#38bdf8', fontWeight: 700 }}>Unlimited (∞)</span> • Zero Paywalls • Account: <code>alex.morgan@domain.com</code>
          </p>
        </div>

        <button
          onClick={() => navigate('call-session')}
          className="btn-primary"
          style={{ padding: '10px 20px', gap: '8px' }}
        >
          <Radio size={16} />
          <span>Launch Live Call Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
          { id: 'sessions', label: 'Past Interview Sessions', icon: History },
          { id: 'documents', label: 'Resume & Documents Vault', icon: FileText },
          { id: 'settings', label: 'AI Model & Stealth Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: isSelected ? '#34d399' : 'var(--text-secondary)',
                border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Interview Readiness Score
              </span>
              <div className="font-heading" style={{ fontSize: '38px', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
                94%
              </div>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
                ↑ 8% increase this week
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Live Sessions Completed
              </span>
              <div className="font-heading" style={{ fontSize: '38px', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
                14 Calls
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Across 8 tech companies
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Average AI Answer Latency
              </span>
              <div className="font-heading" style={{ fontSize: '38px', fontWeight: 800, color: '#f5b301', marginBottom: '4px' }}>
                142 ms
              </div>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
                Instant streaming enabled
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Stealth Integrity
              </span>
              <div className="font-heading" style={{ fontSize: '38px', fontWeight: 800, color: '#c084fc', marginBottom: '4px' }}>
                100%
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Zero bot join detection
              </span>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Recent Interviews & Transcripts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pastSessions.map(s => (
                <div
                  key={s.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{s.company}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {s.role}</span>
                      <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Score: {s.score}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {s.date} • Duration: {s.duration}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedSessionModal(s)}
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Read Transcript
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Archived Interview Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pastSessions.map(s => (
              <div
                key={s.id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>{s.company} — {s.role}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.date} • {s.duration}</span>
                  </div>
                  <span style={{ fontSize: '13px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                    Rubric Score: {s.score}/100
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {s.topics.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', margin: 0, fontStyle: 'italic', whiteSpace: 'pre-line' }}>
                  "{s.transcriptPreview}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700 }}>
                Candidate Knowledge Vault
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Upload your resumes, project sheets, and company research notes. Parakeet automatically indexes them for answer personalization.
              </p>
            </div>
            
            <input 
              type="file" 
              ref={docInputRef} 
              style={{ display: 'none' }} 
              onChange={handleDocUpload}
            />

            <button 
              onClick={() => docInputRef.current?.click()}
              className="btn-primary" 
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              + Upload Document
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((doc) => (
              <div 
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.size} • Updated {doc.updated}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {doc.active && (
                    <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Active In Live Session
                    </span>
                  )}
                  <button 
                    onClick={() => handleDeleteDoc(doc.id)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '720px' }}>
          <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            AI Model & Assistant Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Primary AI Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended: Ultra-low sub-150ms latency)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Best for deep complex architecture)</option>
                <option value="gpt-4o">GPT-4o (Balanced conversational pacing)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Auto-Answer Trigger Delay (Silence Threshold)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.1"
                  value={autoAnswerDelay}
                  onChange={(e) => setAutoAnswerDelay(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '60px' }}>
                  {autoAnswerDelay} sec
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Time interviewer must pause speaking before Parakeet streams the answer.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Stealth Emergency Hotkey
              </label>
              <input
                type="text"
                value={hotkeyTrigger}
                onChange={(e) => setHotkeyTrigger(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Pressing this hotkey immediately hides/shows the floating stealth widget.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={handleSaveSettings}
                className="btn-primary"
                style={{ padding: '10px 24px', gap: '6px' }}
              >
                {settingsSaved ? <Check size={16} /> : null}
                <span>{settingsSaved ? "Saved to LocalStorage!" : "Save Configuration"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      {selectedSessionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '680px',
            width: '100%',
            padding: '28px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                  {selectedSessionModal.company} — Transcript Details
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedSessionModal.role} • {selectedSessionModal.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedSessionModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              marginBottom: '20px'
            }}>
              {selectedSessionModal.transcriptPreview}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedSessionModal.transcriptPreview);
                  alert("Transcript copied to clipboard!");
                }}
                className="btn-secondary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Copy Transcript
              </button>
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
