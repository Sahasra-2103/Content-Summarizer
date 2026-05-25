import React, { useState } from 'react';
import { summarizeContent } from '../services/api';

const SUMMARY_TYPES = [
  'Brief Summary',
  'Bullet Points',
  'Detailed Summary',
  'Key Highlights',
  'Executive Summary',
  'Simplified Summary',
  'Action Items',
  'Study Notes',
  'FAQ Format',
  'Custom Summary'
];

const SUMMARY_LENGTHS = [
  'Very Short',
  'Short',
  'Medium',
  'Long',
  'Detailed'
];

function Dashboard() {
  const [content, setContent] = useState('');
  const [summaryType, setSummaryType] = useState(SUMMARY_TYPES[0]);
  const [summaryLength, setSummaryLength] = useState(SUMMARY_LENGTHS[2]);
  const [customInstruction, setCustomInstruction] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to summarize.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await summarizeContent({
        content,
        summaryType,
        summaryLength,
        customInstruction: summaryType === 'Custom Summary' ? customInstruction : ''
      });
      if (response.success) {
        setResult(response.summary);
      } else {
        setError('Failed to generate summary.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating the summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (result && result.generatedSummary) {
      navigator.clipboard.writeText(result.generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="dashboard-left">
        <div className="card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366f1' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
            </svg>
            Enter Content
          </h2>
          <div className="form-group textarea-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article, document, or notes here..."
            />
            <div className="char-counter">
              {content.length} chars | {content.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div className="controls-grid">
            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
                Summary Type
              </label>
              <select value={summaryType} onChange={(e) => setSummaryType(e.target.value)}>
                {SUMMARY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                Summary Length
              </label>
              <select value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)}>
                {SUMMARY_LENGTHS.map(len => (
                  <option key={len} value={len}>{len}</option>
                ))}
              </select>
            </div>
          </div>

          {summaryType === 'Custom Summary' && (
            <div className="form-group custom-instruction-wrapper">
              <label className="form-label">Custom Instructions</label>
              <input
                type="text"
                style={{ width: '100%' }}
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. Focus on technical concepts, summarize for students..."
              />
            </div>
          )}

          {error && (
            <div style={{ 
              color: 'var(--danger)', 
              background: 'rgba(244, 63, 94, 0.08)', 
              border: '1px solid rgba(244, 63, 94, 0.2)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  Generate Summary
                </>
              )}
            </button>
            <button className="btn btn-secondary" onClick={handleClear} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-right">
        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a855f7' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Result & Insights
          </h2>
          
          {loading ? (
            <div className="empty-state" style={{ flex: 1 }}>
              <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', marginBottom: '1.25rem', color: '#6366f1' }}></div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Analyzing & Summarizing</h3>
              <p style={{ maxWidth: '280px', fontSize: '0.9rem' }}>Extracting core insights and generating your content summary...</p>
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.975rem' }}>
                {result.generatedSummary}
              </div>
              
              <div className="btn-group" style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                <button className={`btn btn-secondary ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy Summary
                    </>
                  )}
                </button>
              </div>

              {result.keywords && result.keywords.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 className="form-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    Key Keywords
                  </h3>
                  <div className="tags-container">
                    {result.keywords.map((kw, i) => (
                      <span key={i} className="tag">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="stat-grid">
                <div className="stat-box">
                  <div className="stat-value">{result.readingTime}m</div>
                  <div className="stat-label">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '3px' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Reading Time
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-value" style={{ fontSize: '1.2rem' }}>{result.sentiment}</div>
                  <div className="stat-label">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '3px' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    Sentiment
                  </div>
                </div>
                <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                  <div className="stat-value" style={{ fontSize: '1.15rem' }}>{result.category}</div>
                  <div className="stat-label">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Content Category
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ flex: 1 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, marginTop: '0.5rem' }}>Awaiting Input</h3>
              <p style={{ maxWidth: '260px', fontSize: '0.875rem' }}>Your generated summary and content insights will appear here in real-time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
