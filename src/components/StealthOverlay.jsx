import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mic, 
  MicOff, 
  Camera, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  X,
  Move,
  Play,
  Layers,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { initPanicKey, purgeSessionMemory } from '../services/stealthService';

export default function StealthOverlay({ 
  isOpen, 
  onClose, 
  isListening, 
  onToggleMic, 
  audioLevels, 
  latestAnswer, 
  onSnapScreen,
  currentTranscript,
  onTriggerSample,
  onOpenPrivacyModal
}) {
  const [opacity, setOpacity] = useState(0.92);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false); // Click-through overlay mode
  const [isInterviewerSim, setIsInterviewerSim] = useState(false); // Live Interviewer screen test
  const [panicWiped, setPanicWiped] = useState(false);

  // Position state for dragging
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // Emergency Panic Key Listener: Double Escape or Ctrl+Shift+X
  useEffect(() => {
    const unbindPanic = initPanicKey(() => {
      setPanicWiped(true);
      purgeSessionMemory();
      // Hide or collapse instantly
      setTimeout(() => {
        onClose();
        setPanicWiped(false);
      }, 350);
    });
    return unbindPanic;
  }, [onClose]);

  useEffect(() => {
    // Center or place bottom-right initially
    if (position.x === null) {
      const initialRight = 24;
      const initialBottom = 24;
      setPosition({ 
        x: Math.max(10, window.innerWidth - 460 - initialRight), 
        y: Math.max(10, window.innerHeight - 440 - initialBottom) 
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    // Only drag from header, ignore buttons/sliders
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x || 0,
      initialY: position.y || 0
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 300, dragRef.current.initialX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (latestAnswer) {
      navigator.clipboard.writeText(latestAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="stealth-widget"
      style={{
        position: 'fixed',
        left: position.x !== null ? `${position.x}px` : 'auto',
        top: position.y !== null ? `${position.y}px` : 'auto',
        right: position.x === null ? '24px' : 'auto',
        bottom: position.y === null ? '24px' : 'auto',
        width: isCollapsed ? '280px' : '450px',
        maxWidth: '94vw',
        background: isInterviewerSim 
          ? 'transparent' 
          : `rgba(14, 18, 15, ${opacity})`,
        border: isInterviewerSim 
          ? '1px dashed rgba(239, 68, 68, 0.4)' 
          : isGhostMode
          ? '1px solid rgba(56, 189, 248, 0.6)'
          : '1px solid rgba(16, 185, 129, 0.45)',
        boxShadow: isInterviewerSim
          ? 'none'
          : '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 24px rgba(16, 185, 129, 0.3)',
        backdropFilter: isInterviewerSim ? 'none' : 'blur(20px)',
        color: '#f3f5f3',
        transition: isDragging ? 'none' : 'width 0.2s ease, opacity 0.15s ease',
        zIndex: 9999,
        borderRadius: 'var(--radius-lg)',
        userSelect: isDragging ? 'none' : 'auto',
        pointerEvents: isGhostMode ? 'none' : 'auto' // Ghost mode clicks pass through to background IDE
      }}
    >
      {/* Panic Wipe Alert Banner */}
      {panicWiped && (
        <div style={{
          padding: '8px 12px',
          background: '#ef4444',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          textAlign: 'center',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          ⚡ PANIC ACTIVATED: WIPING OVERLAY & MEMORY
        </div>
      )}

      {/* Header / Draggable Bar (Always clickable even in ghost mode) */}
      <div 
        onMouseDown={handleMouseDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          background: isInterviewerSim ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            flexShrink: 0,
            background: '#fef08a'
          }}>
            <img src="/logo.png" alt="Parakeet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isListening ? '#10b981' : '#f59e0b',
            boxShadow: isListening ? '0 0 10px #10b981' : 'none'
          }} />
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Move size={12} color="#9ca3af" /> Parakeet Stealth
          </span>

          {/* Stealth badge or Interviewer sim badge */}
          {isInterviewerSim ? (
            <span style={{ 
              fontSize: '10px', 
              background: 'rgba(239, 68, 68, 0.25)', 
              color: '#f87171', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontWeight: 700
            }}>
              INTERVIEWER VIEW (CLEAN)
            </span>
          ) : (
            <span style={{ 
              fontSize: '10px', 
              background: isGhostMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.15)', 
              color: isGhostMode ? '#38bdf8' : '#34d399', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontWeight: 700
            }}>
              {isGhostMode ? "GHOST (CLICK-THROUGH)" : "UNDETECTABLE"}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Ghost Mode Toggle */}
          <button
            onClick={() => setIsGhostMode(!isGhostMode)}
            style={{
              background: isGhostMode ? 'rgba(56, 189, 248, 0.25)' : 'none',
              border: isGhostMode ? '1px solid rgba(56, 189, 248, 0.5)' : 'none',
              color: isGhostMode ? '#38bdf8' : '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            title={isGhostMode ? "Ghost Mode Active: Clicks pass right through to IDE" : "Enable Ghost Mode (Click-Through)"}
          >
            <Layers size={14} />
          </button>

          {/* Interviewer View Simulator Toggle */}
          <button
            onClick={() => setIsInterviewerSim(!isInterviewerSim)}
            style={{
              background: isInterviewerSim ? 'rgba(239, 68, 68, 0.25)' : 'none',
              border: isInterviewerSim ? '1px solid rgba(239, 68, 68, 0.5)' : 'none',
              color: isInterviewerSim ? '#f87171' : '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            title={isInterviewerSim ? "Back to Candidate View" : "Test Interviewer Invisibility View (What Zoom sees)"}
          >
            {isInterviewerSim ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>

          {/* Privacy Shield Button */}
          {onOpenPrivacyModal && (
            <button
              onClick={onOpenPrivacyModal}
              style={{
                background: 'none',
                border: 'none',
                color: '#10b981',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Open Privacy & Invisibility Center"
            >
              <ShieldCheck size={15} />
            </button>
          )}

          {/* Opacity selector */}
          <input 
            type="range" 
            min="0.3" 
            max="1.0" 
            step="0.05" 
            value={opacity} 
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            title={`Opacity: ${Math.round(opacity * 100)}%`}
            style={{ width: '42px', accentColor: '#10b981', cursor: 'pointer' }}
          />

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}
            title="Exit Stealth Overlay (or tap Esc twice)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div style={{
          padding: '12px 14px',
          maxHeight: '440px',
          overflowY: 'auto',
          pointerEvents: isGhostMode ? 'none' : 'auto'
        }}>
          {/* If in Interviewer Simulation mode, show the clean transparent screen proof */}
          {isInterviewerSim ? (
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px dashed rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px 16px',
              textAlign: 'center',
              color: '#f87171'
            }}>
              <EyeOff size={28} color="#ef4444" style={{ margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontSize: '14px', fontWeight: 700 }}>
                Interviewer Screen Share View: ZERO PIXELS VISIBLE
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 12px', lineHeight: 1.5 }}>
                Due to Windows DWM <code>WDA_EXCLUDEFROMCAPTURE</code>, Zoom, Teams, Meet, and Webex 
                capture only your code editor underneath. The AI answers never render into their video stream.
              </p>
              <button
                onClick={() => setIsInterviewerSim(false)}
                className="btn-primary"
                style={{ fontSize: '11px', padding: '6px 12px', pointerEvents: 'auto' }}
              >
                Return to Candidate View
              </button>
            </div>
          ) : (
            <>
              {/* Live Transcript / Speech Indicator */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                marginBottom: '10px',
                pointerEvents: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                  <AudioVisualizer isListening={isListening} levels={audioLevels} height={20} />
                  <span style={{ 
                    fontSize: '12px', 
                    color: isListening ? '#34d399' : '#9ca3af',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {currentTranscript || (isListening ? "Listening for interviewer speech..." : "Mic standby. Click Mic or Snap")}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px', marginLeft: '6px' }}>
                  <button
                    onClick={onToggleMic}
                    style={{
                      background: isListening ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      color: isListening ? '#34d399' : '#f87171',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                    title={isListening ? "Mute mic" : "Start listening"}
                  >
                    {isListening ? <Mic size={13} /> : <MicOff size={13} />}
                    <span>{isListening ? "Listening" : "Muted"}</span>
                  </button>

                  <button
                    onClick={onSnapScreen}
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                    title="Snap LeetCode or coding problem on screen"
                  >
                    <Camera size={13} /> Snap
                  </button>
                </div>
              </div>

              {/* Glancable AI Answer Content */}
              <div style={{
                fontSize: '13px',
                lineHeight: 1.55,
                color: '#e5e7eb',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                position: 'relative',
                minHeight: '120px'
              }}>
                {latestAnswer ? (
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {latestAnswer}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 8px', color: '#9ca3af' }}>
                    <Sparkles size={20} color="#10b981" style={{ margin: '0 auto 6px', display: 'block' }} />
                    <span style={{ fontWeight: 600 }}>Ready for interview questions</span>
                    <p style={{ fontSize: '11px', marginTop: '4px', color: '#6b7280' }}>
                      Speak, click Snap LeetCode, or test with the sample trigger below:
                    </p>

                    <button
                      onClick={onTriggerSample}
                      style={{
                        marginTop: '8px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#34d399',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        pointerEvents: 'auto'
                      }}
                    >
                      <Play size={12} /> Test Sample Question
                    </button>
                  </div>
                )}

                {latestAnswer && (
                  <button
                    onClick={handleCopy}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      pointerEvents: 'auto'
                    }}
                    title="Copy answer"
                  >
                    {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              {/* Stealth Hotkey Hint Bar */}
              <div style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#6b7280',
                padding: '2px 4px'
              }}>
                <span>Emergency Boss Key: <code style={{ color: '#f87171' }}>Esc + Esc</code></span>
                <span>Toggle Overlay: <code style={{ color: '#10b981' }}>Ctrl + Space</code></span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
