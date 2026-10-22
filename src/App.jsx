import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StealthOverlay from './components/StealthOverlay';
import LandingPage from './pages/LandingPage';
import CallSessionPage from './pages/CallSessionPage';
import MockInterviewPage from './pages/MockInterviewPage';
import QuestionBankPage from './pages/QuestionBankPage';
import ResumeMakerPage from './pages/ResumeMakerPage';
import HeadshotsPage from './pages/HeadshotsPage';
import DashboardPage from './pages/DashboardPage';
import DesktopDownloadPage from './pages/DesktopDownloadPage';
import PrivacyShieldModal from './components/PrivacyShieldModal';
import DesktopDownloadModal from './components/DesktopDownloadModal';
import { captureScreenProblem } from './services/screenService';
import { streamInterviewAnswer } from './services/aiService';
import { SpeechService } from './services/speechService';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [isStealthActive, setIsStealthActive] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [preloadedQuestion, setPreloadedQuestion] = useState(null);

  // Global live assistant state accessible by stealth overlay
  const [isListening, setIsListening] = useState(false);
  const [audioLevels, setAudioLevels] = useState([]);
  const [latestAnswer, setLatestAnswer] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');

  const globalSpeechRef = useRef(null);

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Global hotkey: Ctrl + Space to toggle Stealth Overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        setIsStealthActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleToggleStealth = () => {
    setIsStealthActive(prev => !prev);
  };

  const navigate = (route, params = null) => {
    if (params) setPreloadedQuestion(params);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global speech service for stealth overlay
  const toggleGlobalMic = () => {
    if (isListening) {
      globalSpeechRef.current?.stop();
      setIsListening(false);
    } else {
      globalSpeechRef.current = new SpeechService(
        (transcript, isFinal) => {
          setCurrentTranscript(transcript);
          if (isFinal) {
            triggerAnswerStream(transcript);
          }
        },
        (finalText) => {
          if (finalText) {
            triggerAnswerStream(finalText);
          }
        },
        (avg, levels) => {
          setAudioLevels(levels);
        }
      );
      globalSpeechRef.current.start();
      setIsListening(true);
    }
  };

  const triggerAnswerStream = async (questionText, style = 'bullet') => {
    let text = "";
    for await (const chunk of streamInterviewAnswer(questionText, style)) {
      text += chunk;
      setLatestAnswer(text);
    }
  };

  // Stealth overlay screen snap
  const handleStealthSnap = async () => {
    const result = await captureScreenProblem();
    if (result && result.problemSummary) {
      setCurrentTranscript(`[Screen Snapped: ${result.problemTitle}]`);
      triggerAnswerStream(result.problemSummary, 'code');
    }
  };

  const handleSampleTrigger = () => {
    const sample = "How do you design a real-time collaborative document editor like Google Docs?";
    setCurrentTranscript(sample);
    triggerAnswerStream(sample, 'system_design');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleStealth={handleToggleStealth}
        isStealthActive={isStealthActive}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'landing' && (
          <LandingPage 
            navigate={navigate} 
            onToggleStealth={handleToggleStealth} 
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          />
        )}

        {currentRoute === 'call-session' && (
          <CallSessionPage 
            onToggleStealth={handleToggleStealth}
            isStealthActive={isStealthActive}
            preloadedQuestion={preloadedQuestion}
          />
        )}

        {currentRoute === 'mock-interview' && (
          <MockInterviewPage />
        )}

        {currentRoute === 'question-bank' && (
          <QuestionBankPage navigate={navigate} />
        )}

        {currentRoute === 'resume-maker' && (
          <ResumeMakerPage />
        )}

        {currentRoute === 'headshots' && (
          <HeadshotsPage />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage navigate={navigate} />
        )}

        {currentRoute === 'download' && (
          <DesktopDownloadPage 
            navigate={navigate} 
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          />
        )}
      </main>

      {/* Undetectable Stealth Floating Overlay */}
      <StealthOverlay
        isOpen={isStealthActive}
        onClose={() => setIsStealthActive(false)}
        isListening={isListening}
        onToggleMic={toggleGlobalMic}
        audioLevels={audioLevels}
        latestAnswer={latestAnswer}
        onSnapScreen={handleStealthSnap}
        currentTranscript={currentTranscript}
        onTriggerSample={handleSampleTrigger}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Privacy & Anti-Detection Control Center Modal */}
      <PrivacyShieldModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Desktop Application Download Modal */}
      <DesktopDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}
