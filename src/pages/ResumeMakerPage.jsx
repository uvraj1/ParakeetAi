import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Zap, 
  RefreshCw,
  Plus,
  Trash2,
  Check,
  Copy,
  Layout,
  Palette,
  Eye,
  Edit3,
  Bot,
  Send,
  Download,
  Image as ImageIcon
} from 'lucide-react';

export default function ResumeMakerPage() {
  const [activeTab, setActiveTab] = useState('ats'); // 'ats' | 'edit' | 'ai' | 'design' | 'preview'

  const [targetRole, setTargetRole] = useState("Staff Backend Engineer");
  const [jobDescription, setJobDescription] = useState(
    "Seeking a Staff Backend Engineer with deep experience in distributed systems, Go, Kubernetes, high-throughput microservices, Redis caching, and Kafka event streaming."
  );

  // Resume Content State
  const [resumeData, setResumeData] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@domain.com",
    phone: "+1 (555) 349-2810",
    location: "San Francisco, CA",
    includePhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=450&auto=format&fit=crop&q=80",
    summary: "High-impact Backend Engineer with 6+ years architecting scalable cloud infrastructure, low-latency microservices, and distributed caching systems.",
    experience: [
      {
        id: 1,
        company: "Veloce Cloud",
        role: "Senior Software Engineer",
        period: "2022 - Present",
        bullets: [
          "Architected real-time event ingestion pipeline handling 14,000 requests/sec with Kafka and Go.",
          "Reduced P99 read latency from 240ms down to 18ms by deploying Redis cluster with read-through caching.",
          "Mentored 6 engineers and spearheaded zero-downtime database sharding migration across 40M records."
        ]
      },
      {
        id: 2,
        company: "Apex Platforms",
        role: "Software Engineer",
        period: "2019 - 2022",
        bullets: [
          "Developed REST and gRPC microservices deployed across AWS EKS using Terraform and Docker.",
          "Implemented rate limiting with token-bucket algorithms preventing abusive API scrapers."
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: "B.S. in Computer Science",
        school: "University of California, Berkeley",
        year: "2015 - 2019"
      }
    ],
    skills: ["Go", "Distributed Systems", "Kubernetes", "Kafka", "Redis", "PostgreSQL", "AWS EKS", "gRPC", "Docker", "System Architecture"]
  });

  // Design tokens state
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' | 'minimal' | 'executive'
  const [accentColor, setAccentColor] = useState('#10b981'); // emerald, blue, purple, amber
  const [fontFamily, setFontFamily] = useState('Inter');

  // AI Chat Assistant State
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi Alex! I've analyzed your resume against the Staff Backend Engineer role. I can propose high-impact STAR bullet rewrites or add missing keywords like 'Distributed Systems' and 'High-Throughput'."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiProposal, setAiProposal] = useState(null);

  // ATS Keyword analysis
  const keywords = ["distributed systems", "Go", "Kubernetes", "Kafka", "Redis", "microservices", "high-throughput"];
  const matchedKeywords = keywords.filter(k => 
    JSON.stringify(resumeData).toLowerCase().includes(k.toLowerCase())
  );
  const atsScore = Math.min(100, Math.round((matchedKeywords.length / keywords.length) * 100));

  const handleSendAiChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: chatInput.trim() };
    setAiChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const proposalText = "Architected high-throughput distributed microservices in Go and Kubernetes, scaling Kafka ingestion to 25,000 req/sec while enforcing 99.99% system availability.";
      setAiProposal(proposalText);
      setAiChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: `Here is a tailored proposal incorporating high-throughput and Go metrics:\n\n"${proposalText}"`
        }
      ]);
    }, 800);
  };

  const handleAcceptProposal = () => {
    if (!aiProposal) return;
    setResumeData(prev => {
      const exp = [...prev.experience];
      if (exp[0]) {
        exp[0] = { ...exp[0], bullets: [...exp[0].bullets, aiProposal] };
      }
      return { ...prev, experience: exp };
    });
    setAiProposal(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Tailoring & Document Suite</span>
        <h1 className="font-heading" style={{ fontSize: '36px', fontWeight: 800 }}>
          Resume Maker Studio
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '6px auto 0' }}>
          Align your resume with the specific job description so you pass recruiter ATS filters with zero paywalls.
        </p>
      </div>

      {/* 5-Tab Navigation matching Parakeet Reverse Engineering */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'ats', label: '1. ATS Scanner', icon: Zap },
          { id: 'edit', label: '2. Edit Sections', icon: Edit3 },
          { id: 'ai', label: '3. AI Assistant & Proposals', icon: Bot },
          { id: 'design', label: '4. Design & Templates', icon: Palette },
          { id: 'preview', label: '5. Preview & PDF', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: isSelected ? '#34d399' : 'var(--text-secondary)',
                border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: ATS Scanner */}
      {activeTab === 'ats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Target Job Description
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Job Post Requirements</label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700 }}>
                ATS Match Telemetry
              </h3>
              <span className="font-heading" style={{ fontSize: '28px', fontWeight: 800, color: atsScore > 80 ? '#10b981' : '#f5b301' }}>
                {atsScore}%
              </span>
            </div>

            <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: `${atsScore}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
            </div>

            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              Role Critical Keyword Signals:
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {keywords.map((k, i) => {
                const isMatched = matchedKeywords.includes(k);
                return (
                  <span key={i} style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: isMatched ? '#34d399' : '#f87171',
                    fontWeight: 600
                  }}>
                    {isMatched ? '✓' : '✗'} {k}
                  </span>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('ai')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', gap: '8px' }}
            >
              <Sparkles size={16} />
              <span>Fix Missing Keywords in AI Assistant</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Edit Sections */}
      {activeTab === 'edit' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '860px', margin: '0 auto' }}>
          <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            Candidate Information & Experience
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email</label>
              <input
                type="text"
                value={resumeData.email}
                onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Executive Summary</label>
            <textarea
              rows={3}
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Work Experience</h4>
          </div>

          {resumeData.experience.map((exp, expIdx) => (
            <div key={exp.id} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => {
                    const updated = [...resumeData.experience];
                    updated[expIdx].role = e.target.value;
                    setResumeData({ ...resumeData, experience: updated });
                  }}
                  style={{ flex: 1, padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...resumeData.experience];
                    updated[expIdx].company = e.target.value;
                    setResumeData({ ...resumeData, experience: updated });
                  }}
                  style={{ flex: 1, padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exp.bullets.map((b, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].bullets[bIdx] = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      style={{ flex: 1, padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '12px' }}
                    />
                    <button
                      onClick={() => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].bullets = updated[expIdx].bullets.filter((_, i) => i !== bIdx);
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setActiveTab('preview')}
            className="btn-primary"
            style={{ width: 'fit-content', padding: '10px 20px', marginTop: '10px' }}
          >
            Save & View Preview
          </button>
        </div>
      )}

      {/* Tab 3: AI Assistant & Proposals */}
      {activeTab === 'ai' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '860px', margin: '0 auto' }}>
          <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            Interactive AI Resume Copilot
          </h3>

          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            minHeight: '260px',
            maxHeight: '380px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            {aiChatMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: msg.sender === 'user' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                  border: msg.sender === 'user' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {aiProposal && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '6px' }}>
                AI Tailored Proposal Ready To Apply:
              </span>
              <p style={{ fontSize: '13px', margin: '0 0 12px 0' }}>{aiProposal}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleAcceptProposal}
                  className="btn-primary"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  <Check size={14} /> Accept Proposal Into Resume
                </button>
                <button
                  onClick={() => setAiProposal(null)}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask AI: e.g. 'Add more metrics to my Veloce Cloud job' or 'Make it punchier'..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiChat()}
              style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
            />
            <button
              onClick={handleSendAiChat}
              className="btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Design & Templates */}
      {activeTab === 'design' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '860px', margin: '0 auto' }}>
          <h3 className="font-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            Typography, Color Palette & Template
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>Template Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: 'modern', name: 'Emerald Modern', desc: 'Clean header with accent markers' },
                { id: 'minimal', name: 'Minimalist Monochrome', desc: 'High-density tech executive' },
                { id: 'executive', name: 'Silicon Valley Classic', desc: 'Standard recruiter favored format' }
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedTemplate === t.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                    border: `1.5px solid ${selectedTemplate === t.id ? '#10b981' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', color: selectedTemplate === t.id ? '#10b981' : 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>Accent Palette</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['#10b981', '#38bdf8', '#c084fc', '#f59e0b', '#111827'].map(c => (
                <div
                  key={c}
                  onClick={() => setAccentColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    cursor: 'pointer',
                    border: accentColor === c ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: accentColor === c ? '0 0 12px rgba(255, 255, 255, 0.5)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <input
              type="checkbox"
              id="includePhoto"
              checked={resumeData.includePhoto}
              onChange={(e) => setResumeData({ ...resumeData, includePhoto: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
            />
            <label htmlFor="includePhoto" style={{ fontSize: '14px', cursor: 'pointer' }}>
              Include AI Studio Headshot photo in resume header
            </label>
          </div>

          <button
            onClick={() => setActiveTab('preview')}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            Apply & View Preview
          </button>
        </div>
      )}

      {/* Tab 5: Preview & PDF */}
      {activeTab === 'preview' && (
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ padding: '10px 20px', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
          </div>

          <div 
            className="glass-panel"
            style={{
              padding: '48px',
              background: '#ffffff',
              color: '#111827',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${accentColor}`, paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  {resumeData.name}
                </h1>
                <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                  {resumeData.email} • {resumeData.phone} • {resumeData.location}
                </div>
              </div>

              {resumeData.includePhoto && (
                <img
                  src={resumeData.photoUrl}
                  alt={resumeData.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${accentColor}`
                  }}
                />
              )}
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: accentColor, marginBottom: '6px' }}>
                Professional Summary
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#374151', margin: 0 }}>
                {resumeData.summary}
              </p>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: accentColor, marginBottom: '14px' }}>
                Work Experience
              </h3>

              {resumeData.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{exp.role} — {exp.company}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{exp.period}</span>
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.6, color: '#374151', margin: 0 }}>
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: accentColor, marginBottom: '8px' }}>
                Core Technical Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resumeData.skills.map((s, idx) => (
                  <span key={idx} style={{ fontSize: '12px', background: '#f3f4f6', color: '#1f2937', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
