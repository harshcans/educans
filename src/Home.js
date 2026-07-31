import React, { useState, useEffect } from 'react';
import "./styles.css";

const CapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CpuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
  </svg>
);



export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login', role: 'student' });
  const [currentUser, setCurrentUser] = useState(null);



  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const openAuthModal = (mode = 'login', role = 'student') => {
    window.history.pushState({ mode, role }, '', `/${mode}?selec=${role}`);
    setAuthModal({ isOpen: true, mode, role });
  };

  const switchAuthRole = (newRole) => {
    window.history.pushState({ mode: authModal.mode, role: newRole }, '', `/${authModal.mode}?selec=${newRole}`);
    setAuthModal((prev) => ({ ...prev, role: newRole }));
  };

  useEffect(() => {
    const handleUrlSync = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const selecRole = searchParams.get('selec');
      const isTeacherOrStudent = selecRole === 'student' || selecRole === 'teacher';

      if (isTeacherOrStudent) {
        const mode = window.location.pathname.includes('signup') ? 'signup' : 'login';
        setAuthModal({ isOpen: true, mode, role: selecRole });
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const closeAuthModal = () => {
    window.history.pushState({}, '', '/');
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const isTeacher = authModal.role === 'teacher';

    const user = {
      name: isTeacher ? 'Dr. R. K. Verma' : 'Aarav Sharma (JEE Aspirant)',
      email: `${authModal.role}@educans.in`,
      role: authModal.role
    };

    setCurrentUser(user);
    closeAuthModal();
    showToast(`Signed in as ${authModal.role.toUpperCase()}! Welcome to Educans.`, 'success');
    setCurrentView(isTeacher ? 'teacher-portal' : 'student-dashboard');
  };
  
    return (
  <div className="app-wrapper home">

    {/* Toast Notification */}
    {toast.show && (
      <div className="ed-toast">
        <div 
          className="ed-toast-dot" 
          style={{ backgroundColor: toast.type === 'success' ? '#059669' : '#4f46e5' }} 
        />
        <span>{toast.message}</span>
      </div>
    )}

    {/* Navigation */}
    <nav className="ed-nav">
      <div className="ed-container ed-nav-inner">
        <div className="ed-logo" onClick={() => setCurrentView('landing')}>
          <div className="ed-logo-icon">
            <BookIcon />
          </div>
          <span className="ed-logo-text">Educans</span>
        </div>

        

        <div className="ed-nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {currentUser.name}
              </span>
              <button 
                className="ed-btn ed-btn-secondary" 
                onClick={() => { setCurrentUser(null); setCurrentView('landing'); }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="ed-btn ed-btn-secondary" onClick={() => openAuthModal('login', 'student')}>
                Login
              </button>
              <button className="ed-btn ed-btn-primary" onClick={() => openAuthModal('signup', 'student')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Main Body */}
    <main style={{ flex: 1 }}>
        <div>
          <section className="ed-hero">
            <div className="ed-hero-bg" />
            <div className="ed-container ed-hero-content">
              <div className="ed-badge-pill">
                <SparkleIcon /> Dedicated Engine for JEE & NEET Competitive Aspirants
              </div>
              <h1 className="ed-hero-title">
                Ace JEE & NEET with AI Exam Creation & <span className="ed-hero-gradient">Smart PDF Scans</span>
              </h1>
              <p className="ed-hero-subtitle">
                Educans converts paper question papers and PDFs into interactive competitive exam tests with detailed instant scorecards for JEE Mains, JEE Advanced, & NEET UG.
              </p>

              <div className="ed-hero-cta">
                <button 
                  className="ed-btn ed-btn-primary" 
                  style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 700 }}
                  onClick={() => openAuthModal('signup', 'student')}
                >
                  Sign Up
                </button>

                <button 
                  className="ed-btn ed-btn-secondary" 
                  style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
                  onClick={() => openAuthModal('login', 'student')}
                >
                  Login
                </button>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
            <div className="ed-container">
              <div className="ed-section-header">
                <h2 className="ed-section-title">Built Specially for JEE & NEET Preparation</h2>
                <p className="ed-section-subtitle">AI-powered paper extraction tailored to Physics, Chemistry, Mathematics, and Biology.</p>
              </div>

              <div className="ed-grid-3">
                <div className="ed-card">
                  <div className="ed-card-icon ed-icon-cyan">
                    <CpuIcon />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI PDF Question Extractor</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Faculty can upload PDF question banks or past year JEE/NEET paper scans. Educans AI extracts questions directly into runnable tests.
                  </p>
                </div>

                <div className="ed-card">
                  <div className="ed-card-icon ed-icon-indigo">
                    <CapIcon />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Focused Student Portal</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Students practice with timed exam interfaces matching actual JEE NTA / NEET online test conditions.
                  </p>
                </div>

                <div className="ed-card">
                  <div className="ed-card-icon ed-icon-emerald">
                    <CheckIcon />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instant Solutions & Metrics</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Get step-by-step solutions for Physics derivations, Chemistry reaction mechanisms, and Biology explanations immediately.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

   
    </main>


    {/* Footer */}
    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', backgroundColor: '#ffffff', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <div className="ed-container">
        <p>© {new Date().getFullYear()} Educans Platform. AI-Powered PDF & Scan Test Maker for JEE & NEET Competitive Exams.</p>
      </div>
    </footer>
  </div>
);
}