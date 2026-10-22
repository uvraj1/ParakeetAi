import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Code2, 
  Building2, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Play, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { COMPANY_QUESTIONS } from '../services/mockData';

export default function QuestionBankPage({ navigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedId, setExpandedId] = useState('goog-1');
  const [copiedId, setCopiedId] = useState(null);

  const companies = ['All', 'Google', 'Meta', 'Amazon', 'Stripe', 'Microsoft'];
  const categories = ['All', 'Coding & Algorithms', 'System Design', 'Behavioral (STAR)', 'Idempotency & Concurrency', 'AI & Machine Learning'];
  const difficulties = ['All', 'Medium', 'Hard'];

  const filteredQuestions = COMPANY_QUESTIONS.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCompany = selectedCompany === 'All' || q.company === selectedCompany;
    const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchSearch && matchCompany && matchCategory && matchDiff;
  });

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge" style={{ marginBottom: '12px' }}>Real Candidate Reports</span>
        <h1 className="font-heading" style={{ fontSize: '38px', fontWeight: 800 }}>
          Top Tech Interview Question Bank
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '8px auto 0' }}>
          Browse questions asked by top engineering teams, ranked by recurrence frequency and verified by recent hires.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* Search Input */}
          <div style={{
            flex: '1',
            minWidth: '240px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Search by keyword, algorithm, or LeetCode number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>)}
          </select>
        </div>

        {/* Company Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Company:</span>
          {companies.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              style={{
                background: selectedCompany === c ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                border: `1px solid ${selectedCompany === c ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)'}`,
                color: selectedCompany === c ? '#34d399' : 'var(--text-secondary)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredQuestions.map(q => {
          const isExpanded = expandedId === q.id;
          return (
            <div 
              key={q.id}
              className="glass-panel"
              style={{
                padding: '24px',
                border: isExpanded ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s'
              }}
            >
              {/* Question Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-primary)'
                    }}>
                      {q.company}
                    </span>

                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {q.role}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: q.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 179, 1, 0.15)',
                      color: q.difficulty === 'Hard' ? '#f87171' : '#f5b301',
                      fontWeight: 600
                    }}>
                      {q.difficulty}
                    </span>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                      <Flame size={14} /> {q.frequency}% Recurrence
                    </span>
                  </div>

                  <h3 className="font-heading" style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>
                    {q.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {q.question}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isExpanded ? <ChevronUp size={20} color="#10b981" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded Solution & Breakdown */}
              {isExpanded && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {q.tags.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '11px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#34d399',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Ideal Answer */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Ideal Talking Points & Architectural Strategy
                    </h4>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                      {q.idealAnswer}
                    </p>
                  </div>

                  {/* Code snippet if present */}
                  {q.codeSnippet && (
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        borderTopLeftRadius: 'var(--radius-sm)',
                        borderTopRightRadius: 'var(--radius-sm)',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Python3 Solution</span>
                        <button
                          onClick={() => handleCopyCode(q.id, q.codeSnippet)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#10b981',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {copiedId === q.id ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedId === q.id ? "Copied" : "Copy Code"}</span>
                        </button>
                      </div>

                      <pre style={{
                        background: 'var(--bg-primary)',
                        padding: '16px',
                        borderBottomLeftRadius: 'var(--radius-sm)',
                        borderBottomRightRadius: 'var(--radius-sm)',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        color: '#e5e7eb',
                        margin: 0
                      }}>
                        {q.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Practice In Assistant CTA */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button
                      onClick={() => navigate('call-session', q)}
                      className="btn-primary"
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      <span>Simulate in Live Assistant</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
