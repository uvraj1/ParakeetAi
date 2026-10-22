import React, { useState, useEffect } from 'react';
import { Video, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';

export default function MeetingDetector({ onMeetingChange }) {
  const [selectedApp, setSelectedApp] = useState('Google Meet');
  const [isOpen, setIsOpen] = useState(false);

  const apps = [
    { name: 'Google Meet', domain: 'meet.google.com', active: true, color: '#34d399' },
    { name: 'Zoom Meeting', domain: 'zoom.us', active: false, color: '#38bdf8' },
    { name: 'Microsoft Teams', domain: 'teams.microsoft.com', active: false, color: '#c084fc' },
    { name: 'Webex / Cisco', domain: 'webex.com', active: false, color: '#f59e0b' },
    { name: 'CoderPad / CodeSignal', domain: 'coderpad.io', active: false, color: '#10b981' }
  ];

  const handleSelect = (appName) => {
    setSelectedApp(appName);
    setIsOpen(false);
    if (onMeetingChange) onMeetingChange(appName);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          color: '#34d399',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        title="Detected active video conferencing application"
      >
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          boxShadow: '0 0 8px #10b981'
        }} />
        <Video size={13} />
        <span>Connected: {selectedApp}</span>
        <ChevronDown size={13} />
      </button>

      {isOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '240px',
            padding: '6px',
            zIndex: 500,
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '6px 8px', fontWeight: 600, textTransform: 'uppercase' }}>
            Meeting Audio Stream
          </div>

          {apps.map(app => (
            <div
              key={app.name}
              onClick={() => handleSelect(app.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: selectedApp === app.name ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: selectedApp === app.name ? '#34d399' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: selectedApp === app.name ? 600 : 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = selectedApp === app.name ? 'rgba(16, 185, 129, 0.15)' : 'transparent'}
            >
              <span>{app.name}</span>
              {selectedApp === app.name && <CheckCircle2 size={13} color="#10b981" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
