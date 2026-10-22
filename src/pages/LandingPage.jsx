import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  Zap, 
  Shield, 
  Code2, 
  FileText, 
  BookOpen, 
  Camera, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  ChevronRight,
  Play,
  Copy,
  Check,
  Cpu,
  Monitor,
  Eye,
  EyeOff,
  Download,
  Laptop,
  ShieldCheck,
  Layers,
  Lock
} from 'lucide-react';
import { REVIEWS, FAQS, PRICING_PLANS } from '../services/mockData';
import AudioVisualizer from '../components/AudioVisualizer';
import { streamInterviewAnswer } from '../services/aiService';

export default function LandingPage({ 
  navigate, 
  onToggleStealth, 
  onOpenDownloadModal, 
  onOpenPrivacyModal 
}) {
  // Live Simulator state right on hero
  const [selectedQuestion, setSelectedQuestion] = useState("Trapping Rain Water: How do you optimize from O(N²) to O(N)?");
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [screenShareDemoView, setScreenShareDemoView] = useState('candidate'); // 'candidate' | 'interviewer'
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleQuestions = [
    "Trapping Rain Water: How do you optimize from O(N²) to O(N)?",
    "Tell me about a time you had a technical disagreement with a colleague.",
    "Design a scalable rate limiter capable of 50M requests/sec."
  ];

  const runSimulation = async (q) => {
    setSelectedQuestion(q);
    setIsSimulating(true);
    setStreamedAnswer("");

    let style = 'bullet';
    if (/trapping|algorithm|code/i.test(q)) style = 'code';
    if (/disagreement|conflict|time/i.test(q)) style = 'star';
    if (/design|rate limiter/i.test(q)) style = 'system_design';

    let fullText = "";
    for await (const chunk of streamInterviewAnswer(q, style)) {
      fullText += chunk;
      setStreamedAnswer(fullText);
    }
    setIsSimulating(false);
  };

  const handleCopy = () => {
    if (streamedAnswer) {
      navigator.clipboard.writeText(streamedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '60px 24px 80px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Background Atmosphere Beams */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(52, 211, 153, 0.05) 50%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: -1
        }} />

        {/* Floating Badges */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>🏆 No. 1 Viral App</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>in United States 🇺🇸</span>
          </div>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#f5b301" color="#f5b301" />
              ))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>4.86</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(340K+ reviews)</span>
          </div>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>🎁 100% Free Forever • Zero Paywalls</span>
        </div>

        {/* Parakeet Mascot Avatar */}
        <div style={{
          position: 'relative',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(16, 185, 129, 0.4), 0 0 24px rgba(245, 179, 1, 0.35)',
            border: '3px solid rgba(16, 185, 129, 0.6)',
            background: '#fef08a',
            margin: '0 auto',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(-3deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          >
            <img 
              src="/logo.png" 
              alt="Parakeet AI Mascot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span className="badge" style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap'
          }}>
            Parakeet Co-pilot
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading" style={{
          fontSize: 'clamp(38px, 6vw, 68px)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-1.5px',
          maxWidth: '920px',
          marginBottom: '20px'
        }}>
          Your <span className="text-gradient">Real-Time</span> AI Interview Assistant
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: 1.6,
          marginBottom: '36px'
        }}>
          Get the right answer while you're still talking, through interviews, sales calls, client meetings, or any conversation where freezing up isn't an option. <strong>100% free and unrestricted for all candidates.</strong>
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <button 
            onClick={() => navigate('call-session')}
            className="btn-primary"
            style={{
              fontSize: '16px',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Radio size={18} />
            <span>Start Free Assistant</span>
            <ArrowRight size={16} />
          </button>

          <button 
            onClick={() => navigate('download')}
            className="btn-secondary"
            style={{
              fontSize: '15px',
              padding: '14px 24px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399'
            }}
          >
            <Download size={16} color="#10b981" />
            <span>Download Desktop App (.exe)</span>
          </button>

          <button 
            onClick={onToggleStealth}
            className="btn-secondary"
            style={{
              fontSize: '15px',
              padding: '14px 24px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Shield size={16} color="#10b981" />
            <span>Launch Stealth Overlay</span>
          </button>
        </div>

        {/* Supported Platforms Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '56px'
        }}>
          <span>100% Invisible across:</span>
          {['Zoom', 'Microsoft Teams', 'Google Meet', 'Webex', 'LeetCode', 'HackerRank', 'CoderPad'].map((platform, i) => (
            <span key={i} style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}>
              {platform}
            </span>
          ))}
        </div>

        {/* Interactive Live Simulator Studio */}
        <div 
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '960px',
            padding: '24px',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '14px',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }} />
              <span style={{ fontSize: '15px', fontWeight: 700 }}>Interactive Real-Time Assistant Preview</span>
              <span className="badge">Sub-200ms Latency</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AudioVisualizer isListening={isSimulating} height={24} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isSimulating ? "Streaming AI Guidance..." : "Click a prompt to simulate"}
              </span>
            </div>
          </div>

          {/* Quick Prompt Selectors */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => runSimulation(q)}
                style={{
                  background: selectedQuestion === q ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${selectedQuestion === q ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                  color: selectedQuestion === q ? '#34d399' : 'var(--text-secondary)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Output Display Terminal */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            border: '1px solid var(--border-subtle)',
            minHeight: '220px',
            fontFamily: streamedAnswer.includes('```') ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            position: 'relative'
          }}>
            {streamedAnswer ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {streamedAnswer}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Sparkles size={28} color="#10b981" style={{ margin: '0 auto 10px', display: 'block' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Select one of the sample interview questions above.</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  Watch how ParakeetAI structures the exact answer you can glance at mid-sentence.
                </p>
              </div>
            )}

            {streamedAnswer && (
              <button
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy Answer"}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 className="font-heading" style={{ fontSize: '38px', fontWeight: 800, marginBottom: '12px' }}>
            Everything You Need, Mid-Conversation
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Engineered with dual audio loopbacks, low-latency LLM inference, and zero screen detection.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Feature 1: Sub-200ms Transcription */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              marginBottom: '18px'
            }}>
              <Zap size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Blazing Fast Transcription
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Speech-to-text operates in sub-200ms increments. As the interviewer finishes their sentence, Parakeet has already processed the question and generated talking points.
            </p>
          </div>

          {/* Feature 2: Full Coding Support & LeetCode Snapper */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              marginBottom: '18px'
            }}>
              <Code2 size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Full Coding & LeetCode Support
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Take a snapshot of any problem statement on LeetCode, HackerRank, or CoderPad. Parakeet extracts the constraints, produces idiomatic code, and provides Big-O time and space analysis.
            </p>
          </div>

          {/* Feature 3: 100% Invisible Stealth */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(192, 132, 252, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
              marginBottom: '18px'
            }}>
              <Shield size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              100% Private & Invisible
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              No bot ever joins your Zoom, Teams, or Meet call. Parakeet renders an invisible floating overlay that screen-sharing applications completely ignore, preserving your complete confidentiality.
            </p>
          </div>

          {/* Feature 4: STAR Framework Behavioral Generator */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 179, 1, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5b301',
              marginBottom: '18px'
            }}>
              <FileText size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              STAR Framework Generator
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Inject your resume once. When asked tricky behavioral questions ("Tell me about a failure"), Parakeet structures an instant Situation, Task, Action, and Result anchored to your actual background.
            </p>
          </div>

          {/* Feature 5: Auto-Answer & Follow-up Predictor */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e',
              marginBottom: '18px'
            }}>
              <Cpu size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Follow-Up Predictor
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Parakeet doesn't just answer the current question; it accurately predicts the next 3 questions the interviewer is likely to ask, keeping you two steps ahead throughout the interview.
            </p>
          </div>

          {/* Feature 6: AI Meeting Notes & Post-Call Debrief */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              AI Notes & Post-Call Debrief
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Immediately after the call ends, receive a full session transcript, key talking points discussed, actionable feedback, and an automated thank-you email draft to send the recruiter.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Screen Share Invisibility Showcase */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div 
          className="glass-panel"
          style={{
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
            background: 'linear-gradient(180deg, rgba(14, 20, 16, 0.85) 0%, rgba(10, 14, 12, 0.95) 100%)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              marginBottom: '14px'
            }}>
              <ShieldCheck size={16} color="#10b981" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', letterSpacing: '0.5px' }}>
                HARDWARE-LEVEL DWM EXCLUSION
              </span>
            </div>

            <h2 className="font-heading" style={{ fontSize: '34px', fontWeight: 800, margin: '0 0 12px' }}>
              100% Invisible During Live Screen Sharing
            </h2>

            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              The #1 question candidates ask: <em>"Can the interviewer see my screen overlay on Zoom, Teams, or Google Meet?"</em><br />
              <strong>The answer is NO.</strong> Test it live below:
            </p>
          </div>

          {/* Interactive Screen Comparison Component */}
          <div style={{
            maxWidth: '920px',
            margin: '0 auto 32px'
          }}>
            {/* View Switcher Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setScreenShareDemoView('candidate')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: screenShareDemoView === 'candidate' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  background: screenShareDemoView === 'candidate' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: screenShareDemoView === 'candidate' ? '#34d399' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Eye size={16} />
                <span>Candidate View (Your Screen)</span>
              </button>

              <button
                onClick={() => setScreenShareDemoView('interviewer')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: screenShareDemoView === 'interviewer' ? '2px solid #ef4444' : '1px solid var(--border-subtle)',
                  background: screenShareDemoView === 'interviewer' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: screenShareDemoView === 'interviewer' ? '#f87171' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <EyeOff size={16} />
                <span>Interviewer View (Zoom / Meet Stream)</span>
              </button>
            </div>

            {/* Simulated Desktop Screen Container */}
            <div style={{
              background: '#0d1117',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              position: 'relative',
              minHeight: '260px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
            }}>
              {/* Window Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '10px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>
                  {screenShareDemoView === 'candidate' 
                    ? "💻 Candidate Display: Live Assistant Active" 
                    : "📹 Interviewer Screen Share: WDA_EXCLUDEFROMCAPTURE Render Target"
                  }
                </span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  background: screenShareDemoView === 'candidate' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: screenShareDemoView === 'candidate' ? '#34d399' : '#f87171'
                }}>
                  {screenShareDemoView === 'candidate' ? "VISIBLE ONLY TO YOU" : "100% INVISIBLE (0 PIXELS)"}
                </span>
              </div>

              {/* Fake IDE Workspace */}
              <div style={{
                background: '#161b22',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e6edf3',
                minHeight: '170px',
                position: 'relative'
              }}>
                <div style={{ color: '#8b949e', marginBottom: '8px' }}>// LeetCode 42: Trapping Rain Water (Hard)</div>
                <div><span style={{ color: '#ff7b72' }}>class</span> <span style={{ color: '#d2a8ff' }}>Solution</span> &#123;</div>
                <div style={{ paddingLeft: '16px' }}><span style={{ color: '#ff7b72' }}>public int</span> <span style={{ color: '#79c0ff' }}>trap</span>(<span style={{ color: '#ff7b72' }}>int</span>[] height) &#123;</div>
                <div style={{ paddingLeft: '32px', color: '#7ee787' }}>int left = 0, right = height.length - 1;</div>
                <div style={{ paddingLeft: '32px', color: '#7ee787' }}>int leftMax = 0, rightMax = 0, total = 0;</div>
                <div style={{ paddingLeft: '32px', color: '#8b949e' }}>// Candidate writing two-pointer optimal solution...</div>
                <div style={{ paddingLeft: '16px' }}>&#125;</div>
                <div>&#125;</div>

                {/* Floating AI Assistant (Visible on Candidate View, Disappears on Interviewer View) */}
                {screenShareDemoView === 'candidate' ? (
                  <div style={{
                    position: 'absolute',
                    right: '20px',
                    top: '20px',
                    width: '300px',
                    background: 'rgba(14, 20, 16, 0.95)',
                    border: '1px solid #10b981',
                    borderRadius: '10px',
                    padding: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 16px rgba(16, 185, 129, 0.35)',
                    color: '#f3f5f3',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={13} /> ParakeetAI Copilot
                      </span>
                      <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        WDA_EXCLUDE
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#d1d5db', lineHeight: 1.5, borderLeft: '2px solid #10b981', paddingLeft: '8px' }}>
                      <strong>Real-Time Talking Points:</strong><br />
                      • "Instead of calculating max heights per element (O(N) space), we use two pointers."<br />
                      • Space complexity: O(1) auxiliary.<br />
                      • Time complexity: O(N) single pass.
                    </div>
                  </div>
                ) : (
                  <div style={{
                    position: 'absolute',
                    right: '20px',
                    top: '20px',
                    width: '300px',
                    height: '110px',
                    border: '1px dashed rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.04)',
                    textAlign: 'center',
                    padding: '12px'
                  }}>
                    <EyeOff size={22} color="#ef4444" style={{ marginBottom: '6px' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>0 Pixels Captured by Zoom</span>
                    <span style={{ fontSize: '10px', color: '#8b949e', marginTop: '2px' }}>
                      Interviewer sees only your clean IDE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenPrivacyModal && onOpenPrivacyModal()}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <ShieldCheck size={16} /> Open Privacy Control Center
            </button>

            <button
              onClick={() => navigate('download')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <Download size={16} color="#10b981" /> Download Desktop App (.exe)
            </button>
          </div>
        </div>
      </section>

      {/* Prepare Tools Suite */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Prepare Tools Suite</span>
          <h2 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
            Before, During, And After The Call
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '8px auto 0' }}>
            From company question banks to voice mock interviews and ATS resume optimization.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Tool 1: Question Bank */}
          <div 
            onClick={() => navigate('question-bank')}
            className="glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <BookOpen size={20} />
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Question Bank
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Browse real questions asked by Google, Meta, Amazon, Apple, and Netflix, ranked by frequency.
            </p>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Explore Questions →</span>
          </div>

          {/* Tool 2: Mock Interview */}
          <div 
            onClick={() => navigate('mock-interview')}
            className="glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <Bot size={20} />
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Mock Interviews
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Practice out loud with an AI interviewer that listens, speaks back, and grades your answer.
            </p>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>Start Mock Interview →</span>
          </div>

          {/* Tool 3: Resume Maker */}
          <div 
            onClick={() => navigate('resume-maker')}
            className="glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 179, 1, 0.15)', color: '#f5b301' }}>
                <FileText size={20} />
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Resume Maker
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Build a resume tailored to the target role with real-time ATS match scoring and bullet rewriting.
            </p>
            <span style={{ fontSize: '13px', color: '#f5b301', fontWeight: 600 }}>Tailor Resume →</span>
          </div>

          {/* Tool 4: AI Headshots */}
          <div 
            onClick={() => navigate('headshots')}
            className="glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
                <Camera size={20} />
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              AI Headshots
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Transform a casual photo into studio-quality portraits for LinkedIn and your resume portfolio.
            </p>
            <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 600 }}>Generate Headshots →</span>
          </div>
        </div>
      </section>

      {/* Social Proof / Reviews Section */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
            People Trust & Love ParakeetAI
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            Real candidates who landed high-impact roles at premier technology companies.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {REVIEWS.map(r => (
            <div key={r.id} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f5b301" color="#f5b301" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '20px', fontStyle: 'italic' }}>
                  "{r.content}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={r.avatar} 
                  alt={r.name} 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>🎁 100% Free Forever</span>
          <h2 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
            Priceless Career Advantage. $0 Cost.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Zero paywalls. No credit card required. Built to give every candidate an unfair advantage in tech interviews.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {PRICING_PLANS.map(plan => (
            <div 
              key={plan.id}
              className="glass-panel"
              style={{
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: plan.popular ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.6px'
                }}>
                  Unrestricted Access
                </div>
              )}

              <div>
                <h3 className="font-heading" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  {plan.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px' }}>
                  <span className="font-heading" style={{ fontSize: '42px', fontWeight: 800, color: '#10b981' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 600 }}>{plan.billing}</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {plan.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('call-session')}
                className={plan.popular ? "btn-primary" : "btn-secondary"}
                style={{ width: '100%', padding: '12px' }}
              >
                Use {plan.name} (Free)
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '860px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="font-heading" style={{ fontSize: '34px', fontWeight: 800 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="glass-panel"
                style={{
                  padding: '18px 24px',
                  cursor: 'pointer',
                  border: isOpen ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)'
                }}
                onClick={() => setActiveFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{faq.question}</span>
                  <ChevronRight 
                    size={18} 
                    style={{ 
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? '#10b981' : 'var(--text-muted)'
                    }} 
                  />
                </div>
                {isOpen && (
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '12px' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div 
          className="glass-panel"
          style={{
            padding: '60px 32px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <h2 className="font-heading" style={{ fontSize: '42px', fontWeight: 800, marginBottom: '14px' }}>
            Ready To Answer Every Question? 100% Free.
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 32px' }}>
            Never freeze on an interview question again. Launch the assistant in your browser or desktop overlay right now with zero fees forever.
          </p>

          <button 
            onClick={() => navigate('call-session')}
            className="btn-primary"
            style={{
              fontSize: '16px',
              padding: '14px 32px'
            }}
          >
            <Radio size={18} />
            <span>Start Free Live Session Now</span>
          </button>
        </div>
      </section>
    </div>
  );
}
