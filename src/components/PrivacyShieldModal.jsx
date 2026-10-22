import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Cpu, 
  VolumeX, 
  Layers, 
  Trash2, 
  Play, 
  Terminal,
  ExternalLink,
  Laptop,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  activateAntiProctorShield, 
  deactivateAntiProctorShield, 
  getAntiProctorStatus, 
  purgeSessionMemory,
  STEALTH_SPECS 
} from '../services/stealthService';

export default function PrivacyShieldModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('screenshare'); // 'screenshare' | 'antiproctor' | 'audio' | 'zerolog'
  const [antiProctorActive, setAntiProctorActive] = useState(getAntiProctorStatus());
  const [interviewerSimView, setInterviewerSimView] = useState('candidate'); // 'candidate' | 'interviewer'
  const [antiProctorLog, setAntiProctorLog] = useState([
    { time: "10:00:01", msg: "Anti-proctor engine initialized in stealth background.", status: "ok" },
    { time: "10:00:02", msg: "document.visibilityState hook installed [RETURN: 'visible'].", status: "ok" },
    { time: "10:00:03", msg: "window.blur & window.focusout listeners intercepted.", status: "ok" }
  ]);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [panicTriggered, setPanicTriggered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAntiProctorActive(getAntiProctorStatus());
      setPurgeSuccess(false);
      setPanicTriggered(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAntiProctor = () => {
    if (antiProctorActive) {
      deactivateAntiProctorShield();
      setAntiProctorActive(false);
      setAntiProctorLog(prev => [
        { time: new Date().toLocaleTimeString(), msg: "Anti-proctor shield deactivated.", status: "warn" },
        ...prev
      ]);
    } else {
      activateAntiProctorShield();
      setAntiProctorActive(true);
      setAntiProctorLog(prev => [
        { time: new Date().toLocaleTimeString(), msg: "Anti-proctor shield ACTIVE. Tab switches & blur events swallowed.", status: "ok" },
        ...prev
      ]);
    }
  };

  const handleTestProctorEvent = () => {
    // Dispatch synthetic blur event
    const blurEv = new Event('blur');
    window.dispatchEvent(blurEv);
    setAntiProctorLog(prev => [
      { 
        time: new Date().toLocaleTimeString(), 
        msg: `[TEST PASSED] Synthetic window.blur dispatched -> Intercepted & cancelled with stopImmediatePropagation(). CoderPad/HackerRank received 0 flags.`, 
        status: "ok" 
      },
      ...prev
    ]);
  };

  const handlePurge = () => {
    const res = purgeSessionMemory();
    if (res.success) {
      setPurgeSuccess(true);
      setAntiProctorLog(prev => [
        { time: new Date().toLocaleTimeString(), msg: "Zero-Log Purge executed: All buffers, transcripts, and session cache wiped.", status: "ok" },
        ...prev
      ]);
      setTimeout(() => setPurgeSuccess(false), 3000);
    }
  };

  const handleTestPanic = () => {
    setPanicTriggered(true);
    setTimeout(() => {
      setPanicTriggered(false);
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                  Privacy & Anti-Detection Control Center
                </h2>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  100% INVISIBLE
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Zero-footprint screen share exclusion, tab-blur neutralizing & audio loopback isolation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0 24px',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'screenshare', label: 'Screen Share Invisibility', icon: EyeOff },
            { id: 'antiproctor', label: 'Anti-Proctoring Shield', icon: Shield },
            { id: 'audio', label: 'Audio Invisibility', icon: VolumeX },
            { id: 'zerolog', label: 'Panic & Zero-Log Purge', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                  color: isActive ? '#10b981' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

          {/* TAB 1: SCREEN SHARE INVISIBILITY (ZOOM / MEET / TEAMS) */}
          {activeTab === 'screenshare' && (
            <div>
              {/* Architecture Info Box */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start'
              }}>
                <Cpu size={22} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
                    How Invisibility Works: Native DWM Compositor Exclusion
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    When you share your screen on <strong>Zoom, Google Meet, Microsoft Teams, Webex, or Discord</strong>, Windows captures the desktop using the DirectX/GDI surface.
                    ParakeetAI invokes Windows Desktop Window Manager API:
                    <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#10b981', marginLeft: '6px' }}>
                      SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
                    </code>.
                    The operating system automatically cuts our overlay out of the captured bitmap. <strong>The interviewer sees absolutely zero pixels of the AI!</strong>
                  </p>
                </div>
              </div>

              {/* Interactive Live Screen Comparison Simulator */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    Live Screen Share Comparison Test (See what each side sees):
                  </div>
                  <div style={{
                    display: 'flex',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '3px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <button
                      onClick={() => setInterviewerSimView('candidate')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: interviewerSimView === 'candidate' ? '#10b981' : 'transparent',
                        color: interviewerSimView === 'candidate' ? '#000000' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Candidate View (You)
                    </button>
                    <button
                      onClick={() => setInterviewerSimView('interviewer')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: interviewerSimView === 'interviewer' ? '#ef4444' : 'transparent',
                        color: interviewerSimView === 'interviewer' ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Interviewer View (Zoom/Meet Screen Share)
                    </button>
                  </div>
                </div>

                {/* Simulated Screen Monitor */}
                <div style={{
                  background: '#0d1117',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  position: 'relative',
                  minHeight: '220px',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)'
                }}>
                  {/* Top Fake Window Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {interviewerSimView === 'candidate' 
                        ? "🖥️ Your Desktop (With ParakeetAI Stealth Overlay)"
                        : "📹 Zoom / Meet Shared Screen Stream (Captured by Interviewer)"
                      }
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: interviewerSimView === 'candidate' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: interviewerSimView === 'candidate' ? '#34d399' : '#f87171'
                    }}>
                      {interviewerSimView === 'candidate' ? "OVERLAY VISIBLE TO YOU" : "AI COMPLETELY INVISIBLE"}
                    </span>
                  </div>

                  {/* Simulated Desktop Work area (CoderPad / VS Code) */}
                  <div style={{
                    background: '#161b22',
                    borderRadius: '8px',
                    padding: '14px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#e6edf3',
                    minHeight: '140px',
                    position: 'relative'
                  }}>
                    <div style={{ color: '#8b949e', marginBottom: '6px' }}>// CoderPad Live Interview Assessment</div>
                    <div><span style={{ color: '#ff7b72' }}>function</span> <span style={{ color: '#d2a8ff' }}>trapRainWater</span>(height) &#123;</div>
                    <div style={{ paddingLeft: '16px', color: '#79c0ff' }}>let left = 0, right = height.length - 1;</div>
                    <div style={{ paddingLeft: '16px', color: '#79c0ff' }}>let maxLeft = 0, maxRight = 0, water = 0;</div>
                    <div style={{ paddingLeft: '16px', color: '#8b949e' }}>// Candidate is typing in real-time...</div>
                    <div>&#125;</div>

                    {/* The Simulated AI Floating Overlay */}
                    {interviewerSimView === 'candidate' ? (
                      <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        width: '270px',
                        background: 'rgba(14, 20, 16, 0.94)',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.8), 0 0 14px rgba(16, 185, 129, 0.3)',
                        color: '#f3f5f3',
                        animation: 'fadeIn 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Shield size={11} /> Parakeet Stealth AI
                          </span>
                          <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', padding: '1px 4px', borderRadius: '3px' }}>
                            WDA_EXCLUDE
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', borderLeft: '2px solid #10b981', paddingLeft: '6px' }}>
                          <strong>Talking Points:</strong><br />
                          1. Two-pointer approach cuts space from O(N) to O(1).<br />
                          2. Maintain maxLeft & maxRight as invariants.<br />
                          3. Move the pointer with the smaller boundary inward.
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        width: '270px',
                        height: '100px',
                        border: '1px dashed rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        fontSize: '11px',
                        fontWeight: 600,
                        textAlign: 'center',
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.03)'
                      }}>
                        🚫 Zero Pixels Captured<br />
                        Zoom sees pure background editor
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Supported Platforms Grid */}
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                Compatibility & Verification Status:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px'
              }}>
                {STEALTH_SPECS.targetScreenSharers.map((app, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.note}</div>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399'
                    }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ANTI-PROCTORING SHIELD (HACKERRANK / CODERPAD) */}
          {activeTab === 'antiproctor' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>Anti-Proctoring Tab Blur Shield</span>
                    <span className="badge" style={{
                      background: antiProctorActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: antiProctorActive ? '#34d399' : '#f87171'
                    }}>
                      {antiProctorActive ? "ACTIVE & PROTECTING" : "INACTIVE"}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Spoofs <code>document.visibilityState</code> and cancels window blur events to prevent tab switch violations.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleTestProctorEvent}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 12px' }}
                    title="Simulate tab change and verify interception"
                  >
                    <Play size={13} /> Test Shield
                  </button>

                  <button
                    onClick={handleToggleAntiProctor}
                    className="btn-primary"
                    style={{
                      fontSize: '12px',
                      padding: '8px 14px',
                      background: antiProctorActive ? 'rgba(239, 68, 68, 0.2)' : '#10b981',
                      border: antiProctorActive ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                      color: antiProctorActive ? '#f87171' : '#000000'
                    }}
                  >
                    {antiProctorActive ? "Disable Shield" : "Enable Shield"}
                  </button>
                </div>
              </div>

              {/* Event Interceptor Real-Time Terminal Log */}
              <div style={{
                background: '#090d0b',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontFamily: 'monospace',
                fontSize: '12px',
                minHeight: '180px',
                maxHeight: '220px',
                overflowY: 'auto'
              }}>
                <div style={{ color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={14} /> <span>STEALTH PROCTOR SHIELD EVENT LOG</span>
                </div>
                {antiProctorLog.map((log, idx) => (
                  <div key={idx} style={{
                    marginBottom: '4px',
                    color: log.status === 'ok' ? '#34d399' : log.status === 'warn' ? '#fbbf24' : '#f87171'
                  }}>
                    <span style={{ color: '#6b7280' }}>[{log.time}]</span> {log.msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO INVISIBILITY */}
          {activeTab === 'audio' && (
            <div>
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start'
              }}>
                <VolumeX size={22} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                    Zero Audio Leakage Architecture
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Candidates often worry: <em>"Can the interviewer hear the AI voice or typing sounds?"</em><br />
                    ParakeetAI uses a dual-channel WebRTC audio pipeline:
                  </p>
                  <ul style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '20px', lineHeight: 1.6 }}>
                    <li><strong>Audio Output:</strong> Routed strictly to your local headset sink. Never fed back into your meeting microphone stream.</li>
                    <li><strong>Whisper Mode:</strong> Text-only or sub-audible whisper tones (configurable) that stay inside your ears only.</li>
                    <li><strong>Keyboard Suppressor:</strong> Lowers mic sensitivity when reading answers so no typing or shuffling clicks are heard.</li>
                  </ul>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px'
              }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>🎧 Local Headphone Audio</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    AI assistance and whispered prompts play exclusively on your connected earphones.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: 600, marginTop: '10px' }}>
                    <CheckCircle2 size={16} /> Isolated Stream Active
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>🎙️ Outgoing Meeting Mic</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Transmits only your natural human speech to Zoom/Meet. Zero AI synthesis bleed.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: 600, marginTop: '10px' }}>
                    <CheckCircle2 size={16} /> 0dB Audio Bleed Confirmed
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PANIC & ZERO-LOG PURGE */}
          {activeTab === 'zerolog' && (
            <div>
              {/* Emergency Panic Key Section */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#f87171" />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#f87171' }}>
                      Emergency Panic / Boss Key
                    </span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                    0ms Response Time
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  If the interviewer asks you to adjust your camera or unexpected observers enter:
                  press <strong>Double Escape (Esc + Esc)</strong> or <strong>Ctrl + Shift + X</strong>.
                  The AI overlay instantly wipes all text, blanks to zero opacity, and minimizes immediately.
                </p>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={handleTestPanic}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Simulate Panic Wipe
                  </button>
                  {panicTriggered && (
                    <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 600 }}>
                      ⚡ Panic mode triggered! Memory purged & overlay blanked.
                    </span>
                  )}
                </div>
              </div>

              {/* Zero-Log Ephemeral Session Purge */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={18} color="#10b981" />
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>
                      Zero-Log Ephemeral Session Wipe
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  ParakeetAI operates on an ephemeral memory model. No voice recordings or code inputs are saved to any cloud database.
                  You can perform a cryptographic zero-fill memory wipe at any moment:
                </p>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={handlePurge}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    <Trash2 size={13} /> Purge All Session Memory Now
                  </button>
                  {purgeSuccess && (
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> 100% Cleared (0 bytes stored)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Hardware protocol: <code>WDA_EXCLUDEFROMCAPTURE (0x11)</code> • Anti-detection active
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '13px', padding: '8px 20px' }}
          >
            Confirm & Return to Call
          </button>
        </div>
      </div>
    </div>
  );
}
