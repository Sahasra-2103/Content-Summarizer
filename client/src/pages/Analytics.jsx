import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="empty-state" style={{ minHeight: '300px' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', color: '#6366f1' }}></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <p style={{ fontWeight: 500 }}>No analytics data available yet. Generate some summaries to populate graphs!</p>
      </div>
    );
  }

  // Calculate totals for percentage displays
  const totalTypes = Object.values(analytics.summaryTypeUsage || {}).reduce((sum, val) => sum + val, 0) || 1;
  const totalCategories = Object.values(analytics.categoryDistribution || {}).reduce((sum, val) => sum + val, 0) || 1;

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366f1' }}>
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Analytics Dashboard
      </h1>
      
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="stat-value" style={{ fontSize: '2.5rem' }}>{analytics.totalSummaries || 0}</div>
          <div className="stat-label">Total Summaries Generated</div>
        </div>
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="stat-value" style={{ fontSize: '2.5rem' }}>{Math.round(analytics.averageContentLength || 0)}</div>
          <div className="stat-label">Avg. Content Length (chars)</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366f1' }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Summary Type Usage
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(analytics.summaryTypeUsage || {}).map(([type, count]) => {
              const pct = Math.round((count / totalTypes) * 100);
              return (
                <div key={type} className="analytics-progress-container">
                  <div className="analytics-progress-meta">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{type}</span>
                    <span style={{ color: 'var(--secondaryText)', fontSize: '0.85rem', fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                  <div className="analytics-progress-track">
                    <div className="analytics-progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)' }}></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(analytics.summaryTypeUsage || {}).length === 0 && (
              <span className="empty-state" style={{ padding: '1rem' }}>No usage logs recorded yet</span>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a855f7' }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Category Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(analytics.categoryDistribution || {}).map(([category, count]) => {
              const pct = Math.round((count / totalCategories) * 100);
              return (
                <div key={category} className="analytics-progress-container">
                  <div className="analytics-progress-meta">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{category}</span>
                    <span style={{ color: 'var(--secondaryText)', fontSize: '0.85rem', fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                  <div className="analytics-progress-track">
                    <div className="analytics-progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)' }}></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(analytics.categoryDistribution || {}).length === 0 && (
              <span className="empty-state" style={{ padding: '1rem' }}>No categorized content processed yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
