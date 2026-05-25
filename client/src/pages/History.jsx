import React, { useEffect, useState } from 'react';
import { getHistory, deleteHistory } from '../services/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Avoid triggering accordion toggle
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteHistory(id);
        setHistory(history.filter(item => item._id !== id));
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredHistory = history.filter(item => 
    item.originalContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.generatedSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.contentCategory && item.contentCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366f1' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Summary History
      </h1>
      
      <div className="card">
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by keywords, content, category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.75rem' }}
          />
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondaryText)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', color: '#6366f1' }}></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <p style={{ fontWeight: 500 }}>No matching history records found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredHistory.map(item => {
              const isExpanded = !!expandedItems[item._id];
              return (
                <div key={item._id} className="history-list-item">
                  <div className="history-header" onClick={() => toggleExpand(item._id)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, marginRight: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                        <span className="tag" style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1' }}>{item.summaryType}</span>
                        <span className="tag" style={{ background: 'rgba(168, 85, 247, 0.08)', color: '#a855f7' }}>{item.summaryLength}</span>
                        {item.contentCategory && (
                          <span className="tag" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>{item.contentCategory}</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>
                        {item.originalContent}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--secondaryText)', fontWeight: 500 }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem', borderRadius: '8px' }} 
                        onClick={(e) => handleDelete(e, item._id)}
                        aria-label="Delete record"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
                          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          color: 'var(--secondaryText)'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="history-body">
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondaryText)', marginBottom: '0.5rem', fontWeight: 600 }}>Original Snippet</h4>
                        <p style={{ fontSize: '0.925rem', opacity: 0.85, background: 'var(--background)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', lineHeight: '1.6' }}>
                          {item.originalContent}
                        </p>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondaryText)', marginBottom: '0.5rem', fontWeight: 600 }}>Generated Summary</h4>
                        <div style={{ fontSize: '0.975rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--text)', background: 'var(--background)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          {item.generatedSummary}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
