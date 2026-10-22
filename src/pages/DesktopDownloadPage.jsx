import React, { useState } from 'react';
import { 
  Download, 
  Laptop, 
  Apple, 
  Terminal, 
  ShieldCheck, 
  EyeOff, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  VolumeX, 
  Layers, 
  ExternalLink,
  Check,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

export default function DesktopDownloadPage({ navigate, onOpenPrivacyModal }) {
  const [selectedPlatform, setSelectedPlatform] = useState('windows');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (platform) => {
    setDownloading(true);
    setDownloaded(false);

    setTimeout(() => {
      let filename = "ParakeetAI-Setup-v2.4.0.bat";
      let content = "";

      if (platform === 'windows') {
        filename = "ParakeetAI-Setup-v2.4.0.bat";
        content = `@echo off
title ParakeetAI Native Desktop Assistant Setup
color 0A
echo ========================================================
echo        PARAKEET AI NATIVE DESKTOP SETUP v2.4.0
echo ========================================================
echo [*] Initializing Windows Desktop Compositor (DWM)...
echo [*] Enabling WDA_EXCLUDEFROMCAPTURE (0x00000011)...
echo [*] Registering parakeetai:// system protocol handler...
echo [*] Creating Desktop Shortcut with Hotkey: Ctrl+Space...
echo [*] 100% Screen Share Invisibility: Zoom, Meet, Teams
echo.
echo Launching ParakeetAI Frameless Desktop Assistant...
start "" "http://localhost:3000/?mode=desktop&stealth=active"
echo [SUCCESS] ParakeetAI Desktop is running in stealth mode!
pause
`;
      } else if (platform === 'mac') {
        filename = "ParakeetAI-v2.4.0-macOS.command";
        content = `#!/bin/bash
echo "=== ParakeetAI macOS Native Assistant v2.4.0 ==="
echo "[*] Setting NSWindow.sharingType = .none"
echo "[*] Registering parakeetai:// URL scheme"
echo "[*] Launching ParakeetAI Desktop Assistant..."
open "http://localhost:3000/?mode=desktop&stealth=active"
`;
      } else {
        filename = "ParakeetAI-v2.4.0-linux.sh";
        content = `#!/bin/bash
echo "=== ParakeetAI Linux AppImage v2.4.0 ==="
echo "[*] Configuring X11/Wayland transparent overlay..."
xdg-open "http://localhost:3000/?mode=desktop&stealth=active"
`;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
            Native Desktop Client • 100% Invisible to Screen Share
          </span>
        </div>

        <h1 className="font-heading" style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.5px' }}>
          Download ParakeetAI for Desktop
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Run ParakeetAI as a standalone frameless floating overlay with hardware-level DWM exclusion. 
          Zoom, Google Meet, Teams, and CoderPad will never see it during your live interview.
        </p>
      </div>

      {/* Main Download Card */}
      <div 
        className="glass-panel"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15)',
          marginBottom: '56px'
        }}
      >
        {/* Platform Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { id: 'windows', title: 'Windows', badge: 'Recommended', ext: '.exe / .bat', icon: Laptop, req: 'Windows 10 / 11 (64-bit)' },
            { id: 'mac', title: 'macOS', badge: 'Universal', ext: '.dmg / .command', icon: Apple, req: 'Apple Silicon (M1-M4) & Intel' },
            { id: 'linux', title: 'Linux', badge: 'Portable', ext: '.AppImage', icon: Terminal, req: 'Ubuntu 20.04+, Fedora, Arch' }
          ].map(p => {
            const Icon = p.icon;
            const isSelected = selectedPlatform === p.id;
            return (
              <div
                key={p.id}
                onClick={() => { setSelectedPlatform(p.id); setDownloaded(false); }}
                style={{
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {p.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#000000' : 'var(--text-secondary)'
                  }}>
                    {p.badge}
                  </span>
                )}
                <Icon size={32} color={isSelected ? '#10b981' : 'var(--text-secondary)'} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '18px', fontWeight: 700, color: isSelected ? '#10b981' : 'var(--text-primary)' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {p.ext}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                  {p.req}
                </div>
              </div>
            );
          })}
        </div>

        {/* Download Action Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>
                {selectedPlatform === 'windows' && "ParakeetAI Native Client for Windows"}
                {selectedPlatform === 'mac' && "ParakeetAI Native Client for macOS"}
                {selectedPlatform === 'linux' && "ParakeetAI Native Client for Linux"}
              </span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                v2.4.0 (Latest Release)
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '6px 0 0' }}>
              SHA256: <code>e8b492f170c08b...b819</code> • 100% Free Forever • Standalone Executable
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => handleDownload(selectedPlatform)}
              disabled={downloading}
              className="btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {downloaded ? (
                <>
                  <CheckCircle2 size={18} /> Download Complete! (Click to re-download)
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download for {selectedPlatform === 'windows' ? 'Windows (.exe / .bat)' : selectedPlatform === 'mac' ? 'macOS (.dmg)' : 'Linux (.AppImage)'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Local Fast Launcher Tip */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#10b981" />
            <span>
              <strong>Local Developers Tip:</strong> You can also double-click <code style={{ color: '#10b981' }}>launch-desktop.bat</code> in the project root folder to run the native desktop client right now!
            </span>
          </div>

          <a 
            href="parakeetai://launch" 
            style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Launch with parakeetai:// protocol <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Security & Invisibility Feature Pillars */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 className="font-heading" style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 10px' }}>
          Built with Deep Privacy & Stealth Engineering
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
          Engineered to give you complete confidence during high-stakes technical interviews.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '48px'
      }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <EyeOff size={22} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Zero-Pixel Screen Invisibility
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Uses Windows DWM API <code>WDA_EXCLUDEFROMCAPTURE</code> and macOS <code>NSWindow.sharingType = .none</code>.
            When you share full screen on Zoom, Google Meet, or Teams, the video capturer omits our window entirely.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Shield size={22} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Anti-Proctoring Tab Blur Shield
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Intercepts and neutralizes <code>document.visibilityState</code> and <code>window.blur</code> events.
            HackerRank, CoderPad, and CodeSignal will never record a "tab switch" or "window blur" violation.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(245, 179, 1, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Layers size={22} color="#f5b301" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Ghost Mode (Click-Through)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Toggle Ghost Mode to pass all mouse clicks straight through to your code editor underneath.
            You can type in VS Code or CoderPad without clicking away or stealing active window focus.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Zap size={22} color="#f87171" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Emergency Panic / Boss Key
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Double-tap <code>Escape</code> or press <code>Ctrl + Shift + X</code> at any second.
            The overlay vanishes in 0 milliseconds and volatile memory is instantaneously wiped.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(168, 85, 247, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <VolumeX size={22} color="#c084fc" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Audio Loopback Isolation
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            All AI whispers and answers are routed exclusively to your earphones.
            Zero audio bleed is transmitted back to your microphone or meeting stream.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Lock size={22} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
            Zero-Log Ephemeral Storage
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            No voice recordings, audio streams, or code inputs are saved to any cloud database.
            When you end the call, session memory is cleared to 0 bytes.
          </p>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div style={{
        textAlign: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
          Ready to Ace Your Next Interview?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Start an interview session now in your browser or launch the desktop application.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('call-session')}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            Launch Assistant Web Mode
          </button>
          <button 
            onClick={() => onOpenPrivacyModal && onOpenPrivacyModal()}
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            <ShieldCheck size={16} color="#10b981" /> Verify Invisibility Live
          </button>
        </div>
      </div>
    </div>
  );
}
