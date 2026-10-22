import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Camera, 
  Shield, 
  Radio, 
  LayoutDashboard, 
  ChevronDown, 
  Sun, 
  Moon, 
  Zap, 
  Menu, 
  X,
  ExternalLink,
  Globe,
  Download,
  Laptop,
  ShieldCheck
} from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

export default function Navbar({ 
  currentRoute, 
  navigate, 
  theme, 
  toggleTheme, 
  onToggleStealth, 
  isStealthActive,
  onOpenPrivacyModal,
  onOpenDownloadModal
}) {
  const [prepareDropdownOpen, setPrepareDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { locale, changeLocale, t, currentLocaleData, locales } = useLocale();

  return (
    <header style={{
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      width: 'calc(100% - 32px)',
      maxWidth: '1360px',
      margin: '0 auto',
      transition: 'all 0.3s ease'
    }}>
      <nav 
        className="glass-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('landing')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            background: '#fef08a'
          }}>
            <img 
              src="/logo.png" 
              alt="Parakeet AI Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-heading" style={{ 
              fontSize: '19px', 
              fontWeight: 700, 
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Parakeet<span style={{ color: '#10b981' }}>AI</span>
              <span className="badge" style={{ fontSize: '10px', padding: '2px 8px', marginLeft: '4px', background: 'rgba(16, 185, 129, 0.2)' }}>
                {t('freeBadge')}
              </span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px'
        }} className="desktop-nav">
          <button 
            onClick={() => navigate('landing')}
            className="btn-link"
            style={{
              background: 'none',
              border: 'none',
              color: currentRoute === 'landing' ? '#10b981' : 'var(--text-secondary)',
              fontWeight: currentRoute === 'landing' ? 600 : 500,
              fontSize: '14px',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'color 0.2s'
            }}
          >
            {t('assistant')}
          </button>

          {/* Prepare Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setPrepareDropdownOpen(true)}
            onMouseLeave={() => setPrepareDropdownOpen(false)}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                color: ['question-bank', 'mock-interview', 'resume-maker', 'headshots'].includes(currentRoute) 
                  ? '#10b981' 
                  : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '14px',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {t('prepare')} <ChevronDown size={14} />
            </button>

            {prepareDropdownOpen && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div 
                  onClick={() => { navigate('question-bank'); setPrepareDropdownOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: currentRoute === 'question-bank' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = currentRoute === 'question-bank' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'}
                >
                  <BookOpen size={18} color="#10b981" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t('questionBank')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top company questions with frequency ranks</div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('mock-interview'); setPrepareDropdownOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: currentRoute === 'mock-interview' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = currentRoute === 'mock-interview' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'}
                >
                  <Bot size={18} color="#34d399" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t('mockInterview')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive voice practice with real-time feedback</div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('resume-maker'); setPrepareDropdownOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: currentRoute === 'resume-maker' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = currentRoute === 'resume-maker' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'}
                >
                  <FileText size={18} color="#38bdf8" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t('resumeMaker')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Role-tailored ATS optimization & bullet enhancer</div>
                  </div>
                </div>

                <div 
                  onClick={() => { navigate('headshots'); setPrepareDropdownOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: currentRoute === 'headshots' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = currentRoute === 'headshots' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'}
                >
                  <Camera size={18} color="#c084fc" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t('headshots')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Studio portraits for LinkedIn & resumes</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: currentRoute === 'dashboard' ? '#10b981' : 'var(--text-secondary)',
              fontWeight: currentRoute === 'dashboard' ? 600 : 500,
              fontSize: '14px',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LayoutDashboard size={15} /> {t('dashboard')}
          </button>

          {/* Download Desktop App Link */}
          <button 
            onClick={() => navigate('download')}
            style={{
              background: currentRoute === 'download' ? 'rgba(16, 185, 129, 0.15)' : 'none',
              border: currentRoute === 'download' ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              color: currentRoute === 'download' ? '#10b981' : 'var(--text-secondary)',
              fontWeight: currentRoute === 'download' ? 600 : 500,
              fontSize: '14px',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} color="#10b981" />
            <span>Download</span>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>.EXE</span>
          </button>
        </div>

        {/* Right CTA / Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Privacy & Anti-Detection Shield Button */}
          <button
            onClick={onOpenPrivacyModal}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Screen Invisibility (100% Invisible on Zoom/Meet) & Anti-Proctor Status"
          >
            <ShieldCheck size={15} color="#10b981" />
            <span className="hide-on-mobile">Privacy Shield</span>
          </button>

          {/* Stealth Mode Toggle */}
          <button
            onClick={onToggleStealth}
            style={{
              background: isStealthActive ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-card)',
              border: `1px solid ${isStealthActive ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
              color: isStealthActive ? '#34d399' : 'var(--text-secondary)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Toggle Undetectable Stealth Floating Overlay"
          >
            <Shield size={14} color={isStealthActive ? '#34d399' : 'currentColor'} />
            <span className="hide-on-mobile">{isStealthActive ? 'Stealth On' : t('stealthMode')}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Internationalization i18n Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '7px 10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}
              title="Change Language"
            >
              <span>{currentLocaleData.flag}</span>
              <span style={{ textTransform: 'uppercase' }}>{currentLocaleData.code}</span>
              <ChevronDown size={12} />
            </button>

            {langDropdownOpen && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '160px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 250,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                {locales.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeLocale(l.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: l.code === locale ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: l.code === locale ? '#10b981' : 'var(--text-primary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span style={{ fontWeight: l.code === locale ? 700 : 400 }}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA: Start Live Call */}
          <button 
            onClick={() => navigate('call-session')}
            className="btn-primary"
            style={{
              fontSize: '13px',
              padding: '8px 16px'
            }}
          >
            <Radio size={14} className="animate-glow" />
            <span>Launch Assistant</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'none',
              padding: '6px'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="glass-panel"
          style={{
            marginTop: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div onClick={() => { navigate('landing'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer', fontWeight: 600 }}>Home / Features</div>
          <div onClick={() => { navigate('call-session'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer', color: '#10b981', fontWeight: 600 }}>Launch Live Call Session</div>
          <div onClick={() => { navigate('mock-interview'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer' }}>Mock Interviews</div>
          <div onClick={() => { navigate('question-bank'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer' }}>Question Bank</div>
          <div onClick={() => { navigate('resume-maker'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer' }}>Resume Maker</div>
          <div onClick={() => { navigate('headshots'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer' }}>AI Headshots</div>
          <div onClick={() => { navigate('dashboard'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer' }}>Dashboard</div>
          <div onClick={() => { navigate('download'); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer', color: '#10b981', fontWeight: 600 }}>Download Desktop App (.exe/.dmg)</div>
          <div onClick={() => { if (onOpenPrivacyModal) onOpenPrivacyModal(); setMobileMenuOpen(false); }} style={{ padding: '8px', cursor: 'pointer', color: '#34d399' }}>Privacy Shield (100% Invisible)</div>
        </div>
      )}
    </header>
  );
}
