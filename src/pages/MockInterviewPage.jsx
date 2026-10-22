import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  Send, 
  RotateCcw, 
  ArrowRight, 
  Star,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_INTERVIEWS } from '../services/mockData';
import { SpeechService } from '../services/speechService';
import { evaluateMockSession } from '../services/aiService';
import AudioVisualizer from '../components/AudioVisualizer';

export default function MockInterviewPage() {
  const [selectedMock, setSelectedMock] = useState(MOCK_INTERVIEWS[0]);
  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechLevels, setSpeechLevels] = useState([]);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [mockScore, setMockScore] = useState(null);

  const speechRef = React.useRef(null);

  const speakText = (text) => {
    if (voiceMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const startSession = (mock) => {
    setSelectedMock(mock);
    setSessionActive(true);
    setMockScore(null);
    const initialMsg = {
      id: 1,
      sender: 'interviewer',
      text: mock.initialPrompt,
      time: 'Just now'
    };
    setMessages([initialMsg]);
    speakText(mock.initialPrompt);
  };

  const handleSendAnswer = () => {
    if (!inputAnswer.trim() || isAIResponding) return;

    const userMsg = {
      id: Date.now(),
      sender: 'candidate',
      text: inputAnswer.trim(),
      time: 'Just now'
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputAnswer('');
    setIsAIResponding(true);

    if (speechRef.current && isListening) {
      speechRef.current.stop();
      setIsListening(false);
    }

    setTimeout(() => {
      let aiFollowUp = "";
      if (newHistory.length < 5) {
        aiFollowUp = "That's a solid start. You mentioned partitioning the data—how would you handle rebalancing shards when hot keys cause 10x traffic spikes on a single node without causing cascading failures?";
      } else {
        aiFollowUp = "Excellent explanation. We are at the end of the round. You demonstrated strong system design intuition, especially with the failover strategies. Let's look at your final score!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'interviewer',
          text: aiFollowUp,
          time: 'Just now'
        }
      ]);
      speakText(aiFollowUp);
      setIsAIResponding(false);

      if (newHistory.length >= 5) {
        completeSession();
      }
    }, 1400);
  };

  const completeSession = () => {
    const report = evaluateMockSession(messages);
    setMockScore(report);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleMic = () => {
    if (isListening) {
      speechRef.current?.stop();
      setIsListening(false);
    } else {
      speechRef.current = new SpeechService(
        (transcript) => setInputAnswer(transcript),
        (finalText) => {
          if (finalText) setInputAnswer(finalText);
        },
        (avg, levels) => setSpeechLevels(levels)
      );
      speechRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge" style={{ marginBottom: '12px' }}>Interactive AI Interviewer</span>
        <h1 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
          Practice Out Loud With An AI Interviewer
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '8px auto 0' }}>
          Real speech synthesis, adaptive follow-ups, and comprehensive scorecards with actionable feedback.
        </p>
      </div>

      {!sessionActive ? (
        /* Scenario Selection Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {MOCK_INTERVIEWS.map(mock => (
            <div 
              key={mock.id}
              className="glass-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img 
                    src={mock.avatar} 
                    alt={mock.interviewer} 
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700 }}>
                      {mock.title}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {mock.interviewer}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
                    ⏱️ {mock.duration}
                  </span>
                  <span style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
                    🔥 {mock.difficulty}
                  </span>
                  <span style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
                    🎯 {mock.questionsCount} rounds
                  </span>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Focus Areas:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {mock.focus.map((f, i) => (
                      <span key={i} style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '3px 8px', borderRadius: '4px' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startSession(mock)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                <span>Begin Mock Interview</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active Interview Simulator Room */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
          alignItems: 'start'
        }} className="mock-grid">
          
          {/* Main Interview Conversation Stream */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px', justifyContent: 'space-between' }}>
            {/* Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={selectedMock.avatar} 
                  alt={selectedMock.interviewer} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedMock.interviewer}</div>
                  <div style={{ fontSize: '12px', color: '#10b981' }}>Live Speaking Mode</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setVoiceMuted(!voiceMuted)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px',
                    color: voiceMuted ? '#f87171' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  title={voiceMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                >
                  {voiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                  onClick={() => setSessionActive(false)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map(m => (
                <div 
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'interviewer' ? 'flex-start' : 'flex-end',
                    maxWidth: '80%',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    background: m.sender === 'interviewer' ? 'var(--bg-secondary)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: m.sender === 'interviewer' ? '1px solid var(--border-subtle)' : 'none',
                    lineHeight: 1.5,
                    fontSize: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px', fontWeight: 600 }}>
                    {m.sender === 'interviewer' ? selectedMock.interviewer : 'You (Candidate)'}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}

              {isAIResponding && (
                <div style={{ alignSelf: 'flex-start', padding: '10px 16px', color: '#10b981', fontSize: '13px' }}>
                  Interviewer is analyzing your response...
                </div>
              )}
            </div>

            {/* Input & Voice Recorder Bar */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {isListening && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px' }}>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Speaking:</span>
                  <AudioVisualizer isListening={isListening} levels={speechLevels} height={20} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={toggleMic}
                  style={{
                    background: isListening ? '#ef4444' : 'var(--bg-secondary)',
                    color: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title={isListening ? "Stop microphone" : "Speak answer out loud"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  placeholder="Speak or type your answer..."
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                  style={{
                    flex: 1,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />

                <button
                  onClick={handleSendAnswer}
                  className="btn-primary"
                  style={{ padding: '10px 18px' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Scorecard & Rubric */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
              Real-Time Evaluation Rubric
            </h3>

            {mockScore ? (
              <div>
                <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                  <div className="font-heading" style={{ fontSize: '52px', fontWeight: 800, color: '#10b981' }}>
                    {mockScore.overallScore}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Overall Performance / 100</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span>Technical Depth</span>
                      <span style={{ fontWeight: 600 }}>{mockScore.technicalDepth}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${mockScore.technicalDepth}%`, height: '100%', background: '#10b981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span>Communication Clarity</span>
                      <span style={{ fontWeight: 600 }}>{mockScore.clarityScore}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${mockScore.clarityScore}%`, height: '100%', background: '#38bdf8' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span>STAR Framework Structure</span>
                      <span style={{ fontWeight: 600 }}>{mockScore.structureScore}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${mockScore.structureScore}%`, height: '100%', background: '#f5b301' }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>Top Strengths:</h4>
                  <ul style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-secondary)', paddingLeft: '16px' }}>
                    {mockScore.strengths.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '12px' }}>
                  The AI grades your response across 4 core competencies:
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#10b981" /> Technical Accuracy</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#10b981" /> Architecture & Tradeoffs</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#10b981" /> Vocal Pacing & Confidence</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#10b981" /> Actionable Impact Metrics</li>
                </ul>
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button 
                    onClick={completeSession}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                  >
                    Finish Early & Grade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
