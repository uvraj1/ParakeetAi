import React from 'react';

export default function AudioVisualizer({ levels = [], isListening = false, height = 36 }) {
  // If levels is empty or not listening, show subtle baseline bars
  const bars = isListening && levels.length > 0 
    ? levels 
    : [20, 30, 45, 25, 60, 35, 75, 50, 40, 65, 30, 55, 40, 25, 35, 20];

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '3px', 
        height: `${height}px`,
        padding: '0 8px'
      }}
      title={isListening ? "Listening to live audio..." : "Microphone idle"}
    >
      {bars.map((level, i) => {
        const barHeight = isListening ? Math.max(15, Math.min(100, level)) : 20;
        return (
          <div
            key={i}
            style={{
              width: '4px',
              height: `${barHeight}%`,
              borderRadius: '4px',
              background: isListening
                ? 'linear-gradient(180deg, #34d399 0%, #10b981 100%)'
                : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isListening ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'height 0.1s ease, background 0.2s ease'
            }}
          />
        );
      })}
    </div>
  );
}
