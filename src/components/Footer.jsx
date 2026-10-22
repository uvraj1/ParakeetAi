import React from 'react';
import { Bot, Shield, CheckCircle, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ navigate }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      padding: '60px 24px 32px',
      marginTop: '80px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '48px'
      }}>
        {/* Col 1: Brand & Guarantee */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Bot size={18} />
            </div>
            <span className="font-heading" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Parakeet<span style={{ color: '#10b981' }}>AI</span>
            </span>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '16px', color: 'var(--text-muted)' }}>
            #1 Real-Time AI Interview Assistant. Get the right answer while you're still talking across interviews, sales calls, and technical screens.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '12px',
            color: '#34d399'
          }}>
            <Shield size={14} /> 100% Undetectable Guarantee
          </div>
        </div>

        {/* Col 2: Products & AI Tools */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
            AI Tools
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <li><span onClick={() => navigate('call-session')} style={{ cursor: 'pointer', color: '#10b981', fontWeight: 500 }}>Live Interview Assistant</span></li>
            <li><span onClick={() => navigate('download')} style={{ cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>Download Desktop App (.exe)</span></li>
            <li><span onClick={() => navigate('question-bank')} style={{ cursor: 'pointer', color: 'inherit' }}>Company Question Bank</span></li>
            <li><span onClick={() => navigate('mock-interview')} style={{ cursor: 'pointer', color: 'inherit' }}>Voice Mock Interviews</span></li>
            <li><span onClick={() => navigate('resume-maker')} style={{ cursor: 'pointer', color: 'inherit' }}>ATS Resume Maker</span></li>
            <li><span onClick={() => navigate('headshots')} style={{ cursor: 'pointer', color: 'inherit' }}>AI Professional Headshots</span></li>
            <li><span onClick={() => navigate('dashboard')} style={{ cursor: 'pointer', color: 'inherit' }}>Session History & Vault</span></li>
          </ul>
        </div>

        {/* Col 3: Integrations & Stealth */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
            Platforms Supported
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="#10b981" /> Zoom & Teams Invisible</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="#10b981" /> Google Meet & Webex</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="#10b981" /> LeetCode & HackerRank</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="#10b981" /> CoderPad & CodeSignal</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="#10b981" /> Phone Screen Companion</li>
          </ul>
        </div>

        {/* Col 4: Trust & Compliance */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
            Privacy & Trust
          </h4>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '12px' }}>
            Zero audio saved to public models. End-to-end ephemeral local processing. No bot joins your call.
          </p>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Compliance: <code>compliance@parakeet-ai.com</code></span>
            <span style={{ color: 'var(--text-secondary)' }}>Protocol: <code>parakeetai://</code> desktop</span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        <div>
          © {new Date().getFullYear()} ParakeetAI Inc. All rights reserved. Reconstructed with REA MCP Suite.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </div>
    </footer>
  );
}
