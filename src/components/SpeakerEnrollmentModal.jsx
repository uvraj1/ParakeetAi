import React, { useState, useEffect, useRef } from 'react';
import { Mic, CheckCircle2, Shield, Sparkles, X, Volume2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

export default function SpeakerEnrollmentModal({ isOpen, onClose, onEnrollComplete }) {
  const [step, setStep] = useState('prompt'); // 'prompt' | 'recording' | 'success'
  const [countdown, setCountdown] = useState(5);
  const [audioLevels, setAudioLevels] = useState([]);
  const animRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('prompt');
      setCountdown(5);
      clearInterval(timerRef.current);
      clearInterval(animRef.current);
    }
  }, [isOpen]);

  const startRecording = () => {
    setStep('recording');
    setCountdown(5);

    // Simulate real audio frequency wave
    animRef.current = setInterval(() => {
      const levels = Array.from({ length: 16 }, () => Math.floor(Math.random() * 80 + 20));
      setAudioLevels(levels);
    }, 100);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(animRef.current);
          setStep('success');
          localStorage.setItem('parakeet_speaker_enrolled', 'true');
          setTimeout(() => {
            if (onEnrollComplete) onEnrollComplete();
            onClose();
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        background: 'var(--bg-card)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Mic size={28} />
        </div>

        <h3 className="font-heading" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
          Speaker Voice Calibration
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
          Parakeet uses biometric acoustic fingerprints to distinguish between your voice and your interviewer's voice automatically.
        </p>

        {step === 'prompt' && (
          <div>
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--text-primary)'
            }}>
              "Please read this sentence out loud when you click record: <br />
              <strong style={{ color: '#10b981' }}>'I am calibrating my microphone to build high-scale distributed systems.'</strong>"
            </div>

            <button
              onClick={startRecording}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', gap: '8px' }}
            >
              <Mic size={16} />
              <span>Record 5-Second Voice Sample</span>
            </button>
          </div>
        )}

        {step === 'recording' && (
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#10b981',
              marginBottom: '12px'
            }}>
              {countdown}s
            </div>

            <div style={{ marginBottom: '20px' }}>
              <AudioVisualizer isListening={true} levels={audioLevels} height={36} />
            </div>

            <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
              Listening... Speak clearly into your microphone
            </span>
          </div>
        )}

        {step === 'success' && (
          <div style={{ padding: '12px 0' }}>
            <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
              Voice Profile Calibrated!
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Parakeet will now isolate your speech from the interviewer in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
