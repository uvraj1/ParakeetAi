import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Sparkles, 
  Shield, 
  Copy, 
  Check, 
  Volume2, 
  Radio, 
  Square, 
  RefreshCw, 
  Code2, 
  FileText, 
  ListOrdered, 
  Cpu, 
  HelpCircle, 
  Mail, 
  Award,
  ChevronRight,
  Sliders,
  Settings,
  Bot,
  MessageSquare,
  Send,
  UserCheck
} from 'lucide-react';
import { SpeechService } from '../services/speechService';
import { streamInterviewAnswer, predictFollowUpQuestions } from '../services/aiService';
import { captureScreenProblem } from '../services/screenService';
import AudioVisualizer from '../components/AudioVisualizer';
import MeetingDetector from '../components/MeetingDetector';
import SpeakerEnrollmentModal from '../components/SpeakerEnrollmentModal';
import PrivacyShieldModal from '../components/PrivacyShieldModal';
import { purgeSessionMemory } from '../services/stealthService';

export default function CallSessionPage({ onToggleStealth, isStealthActive, preloadedQuestion }) {
  const [isListening, setIsListening] = useState(false);
  const [activeChannel, setActiveChannel] = useState('interviewer'); // 'interviewer' | 'candidate'
  const [responseStyle, setResponseStyle] = useState('bullet'); // 'bullet' | 'star' | 'code' | 'system_design'
  const [audioLevels, setAudioLevels] = useState([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [purgedOnExit, setPurgedOnExit] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [centerTab, setCenterTab] = useState('stream'); // 'stream' | 'whisper'
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [isVoiceCalibrated, setIsVoiceCalibrated] = useState(() => localStorage.getItem('parakeet_speaker_enrolled') === 'true');
  const [whisperMessages, setWhisperMessages] = useState([
    { id: 1, sender: 'copilot', text: "I'm listening in real-time. Whisper side questions to me here or check the Live Guidance tab for full talking points." }
  ]);
  const [whisperInput, setWhisperInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      speaker: 'interviewer',
      text: "Thanks for coming in today! To start, could you walk me through how you would optimize a high-throughput read-heavy service facing cache invalidation stampedes?",
      time: "10:02 AM"
    }
  ]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUps, setFollowUps] = useState([
    "What cache eviction policy would you configure (LRU vs LFU)?",
    "How do you handle consistency between Redis and the primary PostgreSQL DB?",
    "What happens when the caching cluster itself fails (circuit breaking)?"
  ]);
  const [copied, setCopied] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [postCallSummary, setPostCallSummary] = useState(null);

  // Context profile
  const [targetCompany, setTargetCompany] = useState("Google");
  const [targetRole, setTargetRole] = useState("Senior Software Engineer (L5)");
  const [resumeContext, setResumeContext] = useState("Built distributed event-driven payment APIs in Go/Kubernetes handling 8,000 TPS with Redis clustering and Kafka.");

  const speechServiceRef = useRef(null);

  // Trigger answer generation
  const handleGenerateAnswer = async (questionText, style = responseStyle) => {
    setIsGenerating(true);
    setCurrentAnswer("");

    let textAccumulator = "";
    for await (const chunk of streamInterviewAnswer(questionText, style, {
      targetCompany,
      targetRole,
      resume: resumeContext
    })) {
      textAccumulator += chunk;
      setCurrentAnswer(textAccumulator);
    }
    setIsGenerating(false);

    // Predict upcoming follow-ups
    const predicted = predictFollowUpQuestions(questionText);
    setFollowUps(predicted);
  };

  // Handle Whisper Copilot side chat
  const handleSendWhisper = async (e) => {
    if (e) e.preventDefault();
    if (!whisperInput.trim()) return;
    const userText = whisperInput.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setWhisperMessages(prev => [...prev, newMsg]);
    setWhisperInput('');

    // AI copilot response
    const botMsgId = Date.now() + 1;
    setWhisperMessages(prev => [...prev, { id: botMsgId, sender: 'copilot', text: 'Analyzing...' }]);

    let reply = "";
    for await (const chunk of streamInterviewAnswer(`Candidate whisper prompt during live call: "${userText}". Context: ${targetCompany} (${targetRole}). Give ultra-concise, tactical bullet talking points.`, 'bullet', {
      targetCompany,
      targetRole,
      resume: resumeContext
    })) {
      reply += chunk;
      setWhisperMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: reply } : m));
    }
  };

  // If coming from Question Bank with a preloaded question
  useEffect(() => {
    if (preloadedQuestion) {
      const qText = preloadedQuestion.question || preloadedQuestion.title || String(preloadedQuestion);
      if (preloadedQuestion.company) setTargetCompany(preloadedQuestion.company);
      const cat = preloadedQuestion.category || "";
      const style = cat.includes('Coding') ? 'code' : 
                    cat.includes('System') ? 'system_design' : 
                    cat.includes('Behavioral') ? 'star' : 'bullet';
      setResponseStyle(style);
      setConversationHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          speaker: 'interviewer',
          text: qText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      handleGenerateAnswer(qText, style);
    }
  }, [preloadedQuestion]);

  // Setup Speech Recognition
  useEffect(() => {
    speechServiceRef.current = new SpeechService(
      (transcript, isFinal) => {
        setCurrentTranscript(transcript);
        if (isFinal) {
          // Add to conversation history
          setConversationHistory(prev => [
            ...prev,
            {
              id: Date.now(),
              speaker: activeChannel,
              text: transcript,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          if (activeChannel === 'interviewer') {
            handleGenerateAnswer(transcript);
          }
        }
      },
      (finalText) => {
        if (finalText && activeChannel === 'interviewer') {
          handleGenerateAnswer(finalText);
        }
      },
      (avgLevel, levels) => {
        setAudioLevels(levels);
      }
    );

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
    };
  }, [activeChannel, responseStyle, targetCompany, targetRole, resumeContext]);

  const toggleListening = () => {
    if (isListening) {
      speechServiceRef.current?.stop();
      setIsListening(false);
    } else {
      speechServiceRef.current?.start();
      setIsListening(true);
    }
  };

  // Screen Snapper
  const handleSnapScreen = async () => {
    const result = await captureScreenProblem();
    if (result && result.problemSummary) {
      setConversationHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          speaker: 'interviewer',
          text: `[Screen Snapped: ${result.problemTitle}] - ${result.problemSummary}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setResponseStyle('code');
      handleGenerateAnswer(result.problemSummary, 'code');
    }
  };

  const handleCopy = () => {
    if (currentAnswer) {
      navigator.clipboard.writeText(currentAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEndCall = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stop();
    }
    setIsListening(false);
    setCallEnded(true);
    setPostCallSummary({
      duration: "32 mins",
      topicsCovered: ["Cache Stampedes & Mutex Locking", "Two-Phase Commits vs Sagas", "STAR Behavioral Leadership"],
      performanceScore: 94,
      scoreColor: "#10b981",
      feedback: "Strong technical clarity and structured communication. Great adherence to business impact metrics.",
      thankYouEmailDraft: `Hi ${targetCompany} Team,\n\nThank you so much for taking the time to speak with me today regarding the ${targetRole} position! I really enjoyed our conversation regarding cache invalidation stampedes and distributed resiliency patterns.\n\nLooking forward to next steps!\n\nBest regards,\nCandidate`
    });
  };

  return (
    <div style={{
      maxWidth: '1380px',
      margin: '0 auto',
      padding: '24px 20px',
      minHeight: 'calc(100vh - 120px)'
    }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            flexShrink: 0,
            background: '#fef08a'
          }}>
            <img src="/logo.png" alt="Parakeet AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-heading" style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
                Live AI Interview Assistant
              </h1>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isListening ? '#10b981' : '#f59e0b',
                boxShadow: isListening ? '0 0 10px #10b981' : 'none'
              }} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Session ID: <code style={{ color: '#10b981' }}>pk_session_9a3d07cd</code> • Target: {targetCompany} ({targetRole})
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Reverse-Engineered Meeting Detector Integration */}
          <MeetingDetector />

          {/* Voice Acoustic Calibration Button */}
          <button
            onClick={() => setShowEnrollmentModal(true)}
            style={{
              background: isVoiceCalibrated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 179, 1, 0.15)',
              border: `1px solid ${isVoiceCalibrated ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 179, 1, 0.4)'}`,
              color: isVoiceCalibrated ? '#34d399' : '#f5b301',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Calibrate your acoustic profile to isolate interviewer questions"
          >
            <UserCheck size={14} />
            <span>{isVoiceCalibrated ? "Voice Calibrated" : "Calibrate Voice"}</span>
          </button>

          {/* Screen Share Invisibility Badge */}
          <div 
            onClick={() => setShowPrivacyModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 12px',
              fontSize: '12px',
              color: '#34d399',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Hardware DWM exclusion is active. Click to test & verify invisibility."
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span>Screen Share: 100% Invisible</span>
          </div>

          {/* Privacy & Anti-Detection Shield Button */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Open Anti-Detection & Screen Invisibility Control Center"
          >
            <Shield size={14} color="#10b981" />
            <span>Privacy Shield</span>
          </button>

          <button
            onClick={onToggleStealth}
            style={{
              background: isStealthActive ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-card)',
              border: `1px solid ${isStealthActive ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
              color: isStealthActive ? '#34d399' : 'var(--text-secondary)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={15} color="#10b981" />
            <span>{isStealthActive ? "Stealth Overlay Active" : "Undetectable Overlay"}</span>
          </button>

          <button
            onClick={toggleListening}
            className={isListening ? "btn-primary" : "btn-secondary"}
            style={{
              background: isListening ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'var(--bg-card)',
              color: '#ffffff',
              boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.4)' : 'none'
            }}
          >
            {isListening ? <Square size={14} /> : <Mic size={14} />}
            <span>{isListening ? "Pause Audio" : "Start Live Listening"}</span>
          </button>

          <button
            onClick={handleEndCall}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            End & Debrief
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 340px',
        gap: '20px',
        alignItems: 'start'
      }} className="studio-grid">
        
        {/* Left Column: Context & Conversation Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Audio Input State */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Audio Ingestion Channel
              </span>
              <span className="badge" style={{ fontSize: '11px' }}>
                {isListening ? "ACTIVE" : "STANDBY"}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => setActiveChannel('interviewer')}
                style={{
                  background: activeChannel === 'interviewer' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                  border: `1px solid ${activeChannel === 'interviewer' ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
                  color: activeChannel === 'interviewer' ? '#34d399' : 'var(--text-muted)',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Interviewer Speaker
              </button>

              <button
                onClick={() => setActiveChannel('candidate')}
                style={{
                  background: activeChannel === 'candidate' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                  border: `1px solid ${activeChannel === 'candidate' ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
                  color: activeChannel === 'candidate' ? '#34d399' : 'var(--text-muted)',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Candidate Mic
              </button>
            </div>

            <AudioVisualizer isListening={isListening} levels={audioLevels} height={32} />

            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {currentTranscript || (isListening ? "Listening for speech..." : "Click 'Start Live Listening' above")}
            </div>
          </div>

          {/* Screen / LeetCode Problem Snapper */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
              Visual Coding Problem Solver
            </span>
            <button
              onClick={handleSnapScreen}
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.3)'
              }}
            >
              <Camera size={16} />
              <span>Snap LeetCode / Screen</span>
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px', textAlign: 'center' }}>
              Instantly grabs problem constraints & solves code
            </span>
          </div>

          {/* Live Transcript Log */}
          <div className="glass-panel" style={{ padding: '16px', maxHeight: '360px', overflowY: 'auto' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
              Live Transcript Feed
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {conversationHistory.map(item => (
                <div 
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: item.speaker === 'interviewer' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(16, 185, 129, 0.08)',
                    borderLeft: `3px solid ${item.speaker === 'interviewer' ? '#38bdf8' : '#10b981'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize', color: item.speaker === 'interviewer' ? '#38bdf8' : '#34d399' }}>
                      {item.speaker}
                    </span>
                    <span>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Real-Time Answer Guidance Feed & Whisper Copilot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Reverse-Engineered View Switcher: Live Stream vs Whisper Copilot */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <button
              onClick={() => setCenterTab('stream')}
              style={{
                background: centerTab === 'stream' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: `1px solid ${centerTab === 'stream' ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                color: centerTab === 'stream' ? '#10b981' : 'var(--text-secondary)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={14} />
              <span>Instant AI Guidance</span>
            </button>
            <button
              onClick={() => setCenterTab('whisper')}
              style={{
                background: centerTab === 'whisper' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: `1px solid ${centerTab === 'whisper' ? 'rgba(59, 130, 246, 0.4)' : 'transparent'}`,
                color: centerTab === 'whisper' ? '#60a5fa' : 'var(--text-secondary)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <MessageSquare size={14} />
              <span>Whisper AI Copilot Chat</span>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '10px', padding: '1px 6px' }}>LIVE</span>
            </button>
          </div>

          {centerTab === 'stream' ? (
            <>
              {/* Response Style Switcher */}
              <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Guidance Style:
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'bullet', label: 'Glancable Bullets', icon: ListOrdered },
                    { id: 'star', label: 'STAR Method', icon: FileText },
                    { id: 'code', label: 'Code & Big-O', icon: Code2 },
                    { id: 'system_design', label: 'System Design', icon: Cpu }
                  ].map(mode => {
                    const Icon = mode.icon;
                    const isSelected = responseStyle === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setResponseStyle(mode.id);
                          if (conversationHistory.length > 0) {
                            const lastQuestion = [...conversationHistory].reverse().find(c => c.speaker === 'interviewer');
                            if (lastQuestion) handleGenerateAnswer(lastQuestion.text, mode.id);
                          }
                        }}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--bg-secondary)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: `1px solid ${isSelected ? 'transparent' : 'var(--border-subtle)'}`,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Icon size={14} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Answer Stream Card */}
              <div 
                className="glass-panel"
                style={{
                  padding: '24px',
                  minHeight: '440px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#10b981" />
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>
                        Instant AI Guidance (Streaming &lt;150ms)
                      </span>
                      {isGenerating && <span className="badge">GENERATING</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={handleCopy}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Streaming Output Body */}
                  <div style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: 'var(--text-primary)',
                    fontFamily: currentAnswer.includes('```') ? 'var(--font-mono)' : 'var(--font-sans)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {currentAnswer || (
                      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <Mic size={32} color="#10b981" style={{ margin: '0 auto 12px', display: 'block' }} />
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Parakeet is listening for your interviewer's question.</p>
                        <p style={{ fontSize: '13px', marginTop: '6px' }}>
                          As soon as they ask a question or pause speaking, your structured talking points appear here automatically.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Test Prompt Trigger */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    placeholder="Or type/paste interviewer question manually..."
                    style={{
                      flex: 1,
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const q = e.target.value.trim();
                        setConversationHistory(prev => [
                          ...prev,
                          { id: Date.now(), speaker: 'interviewer', text: q, time: 'Just now' }
                        ]);
                        handleGenerateAnswer(q);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const demoQ = "How do you handle distributed transactions across microservices?";
                      setConversationHistory(prev => [
                        ...prev,
                        { id: Date.now(), speaker: 'interviewer', text: demoQ, time: 'Just now' }
                      ]);
                      handleGenerateAnswer(demoQ);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 12px' }}
                  >
                    Sample Question
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Whisper AI Copilot Chat Panel */
            <div 
              className="glass-panel"
              style={{
                padding: '20px',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1.5px solid rgba(59, 130, 246, 0.5)',
                      flexShrink: 0,
                      background: '#fef08a'
                    }}>
                      <img src="/logo.png" alt="Parakeet Copilot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>In-Call Whisper AI Copilot</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time discreet query line (`aiChatMessage` protocol)</div>
                    </div>
                  </div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>UNDETECTED</span>
                </div>

                {/* Messages feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto', paddingRight: '6px' }}>
                  {whisperMessages.map(msg => (
                    <div 
                      key={msg.id}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(255, 255, 255, 0.05)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                        color: '#ffffff',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      <div style={{ fontSize: '10px', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#60a5fa', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {msg.sender === 'user' ? (
                          'YOU (WHISPER)'
                        ) : (
                          <>
                            <img src="/logo.png" alt="" style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
                            PARAKEET COPILOT
                          </>
                        )}
                      </div>
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Whisper Input Form */}
              <form onSubmit={handleSendWhisper} style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={whisperInput}
                  onChange={(e) => setWhisperInput(e.target.value)}
                  placeholder="Whisper question (e.g. 'How should I justify using Kafka over RabbitMQ?')..."
                  style={{
                    flex: 1,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0 16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Predictive Follow-ups & Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Predictive Follow-ups */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={16} color="#f5b301" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                Anticipated Follow-Up Questions
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Interviewers commonly drill down into these 3 areas next:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {followUps.map((q, i) => (
                <div 
                  key={i}
                  onClick={() => handleGenerateAnswer(q)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                    e.currentTarget.style.color = '#34d399';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '2px', color: '#10b981' }}>#{i + 1} Likely Drilldown</div>
                  <div>{q}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Context & Personalization Settings */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Settings size={16} color="#10b981" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                Interview Context Profile
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resume Context / Talking Points</label>
                <textarea
                  rows={3}
                  value={resumeContext}
                  onChange={(e) => setResumeContext(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    resize: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Call Debrief Modal */}
      {callEnded && postCallSummary && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '32px',
              background: 'var(--bg-overlay)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={24} color="#10b981" />
                <h2 className="font-heading" style={{ fontSize: '22px', fontWeight: 800 }}>
                  Post-Interview AI Debrief
                </h2>
              </div>
              <span className="badge" style={{ fontSize: '13px' }}>
                Score: {postCallSummary.performanceScore} / 100
              </span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Topics Mastered
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {postCallSummary.topicsCovered.map((t, idx) => (
                  <span key={idx} style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Actionable Feedback
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {postCallSummary.feedback}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recruiter Follow-up Email Draft
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(postCallSummary.thankYouEmailDraft);
                    alert("Email draft copied to clipboard!");
                  }}
                  style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '12px', cursor: 'pointer' }}
                >
                  Copy Email
                </button>
              </div>
              <pre style={{
                background: 'var(--bg-primary)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)'
              }}>
                {postCallSummary.thankYouEmailDraft}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  purgeSessionMemory();
                  setPurgedOnExit(true);
                  setTimeout(() => setPurgedOnExit(false), 3000);
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '8px 14px', color: purgedOnExit ? '#10b981' : '#f87171' }}
              >
                {purgedOnExit ? "✓ Ephemeral Data Purged (0 Bytes)" : "Zero-Log Purge (Wipe All Call Cache)"}
              </button>

              <button 
                onClick={() => setCallEnded(false)}
                className="btn-primary"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reverse-Engineered Biometric Voice Calibration Modal */}
      <SpeakerEnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        onEnrollComplete={() => setIsVoiceCalibrated(true)}
      />

      {/* Privacy & Anti-Detection Control Center Modal */}
      <PrivacyShieldModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
}

