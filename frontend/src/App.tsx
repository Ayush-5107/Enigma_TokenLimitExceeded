import { useState, useCallback } from 'react';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Vault } from './pages/Vault';
import { Documents } from './pages/Documents';
import { Estate } from './pages/Estate';
import { Actions } from './pages/Actions';
import { Family } from './pages/Family';
import { Audit } from './pages/Audit';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { ToastContainer } from './components/Toast';
import type { ToastData } from './components/Toast';
import { EstateProvider, useEstate } from './context/EstateContext';
import { ShieldAlert, Menu, X } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [userRole, setUserRole] = useState<'owner' | 'family'>('owner');
  const [authView, setAuthView] = useState<'none' | 'login' | 'register' | 'landing'>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const { familyMembers } = useEstate();

  // Toast management
  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Active User Profile
  const currentUser = userRole === 'owner' 
    ? { full_name: 'Rajesh Sharma', role: 'owner', email: 'owner@estate.demo' }
    : { full_name: 'Rahul Sharma (Son)', role: 'family_member', email: 'rahul@estate.demo' };

  // Look up permissions for the active role from EstateContext
  const memberObj = familyMembers.find(m => userRole === 'owner' ? m.role === 'owner' : m.email === 'rahul@estate.demo');
  const userPermissions = userRole === 'owner'
    ? { vault: true, documents: true, estate: true, actions: true, audit: true }
    : memberObj?.permissions_json || { vault: false, documents: true, estate: true, actions: true, audit: false };

  const handleAuthSuccess = (user: any) => {
    if (user.role === 'owner') {
      setUserRole('owner');
    } else {
      setUserRole('family');
    }
    setAuthView('none');
    setCurrentTab('home');
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  if (authView === 'landing') {
    return <LandingPage onEnterApp={() => setAuthView('none')} />;
  }

  if (authView === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--surface)', padding: '2rem' }}>
        <Login
          onSuccess={handleAuthSuccess}
          onNavigateToRegister={() => setAuthView('register')}
        />
      </div>
    );
  }

  if (authView === 'register') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--surface)', padding: '2rem' }}>
        <Register
          onSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setAuthView('login')}
        />
      </div>
    );
  }

  const renderContent = () => {
    // Permission guard for family members
    const sectionRequired: Record<string, string> = {
      vault: 'vault',
      audit: 'audit',
      documents: 'documents',
      estate: 'estate',
      actions: 'actions'
    };

    if (userRole !== 'owner' && sectionRequired[currentTab]) {
      const allowed = userPermissions[sectionRequired[currentTab] as keyof typeof userPermissions];
      if (!allowed) {
        return (
          <div className="neu-card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '520px', margin: '3rem auto' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: '#fff1f2',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: 'var(--neu-shadow-btn)'
            }}>
              <ShieldAlert size={26} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Access Restricted
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Your account does not have permission to view this section. Contact the estate owner to request access.
            </p>
            <button
              onClick={() => setCurrentTab('home')}
              className="neu-btn-primary"
            >
              Return to Dashboard
            </button>
          </div>
        );
      }
    }

    switch (currentTab) {
      case 'home':
        return <Home onNavigate={handleSelectTab} />;
      case 'vault':
        return <Vault isOwner={userRole === 'owner'} />;
      case 'documents':
        return <Documents onNavigate={handleSelectTab} />;
      case 'estate':
        return <Estate />;
      case 'actions':
        return <Actions />;
      case 'family':
        return <Family isOwner={userRole === 'owner'} onToast={addToast} />;
      case 'audit':
        return <Audit />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={handleSelectTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <Navbar
        currentUser={currentUser}
        onSwitchUserRole={(role) => {
          setUserRole(role);
          // If family member was on a restricted tab, go back to home
          const restrictedSections = ['vault', 'audit', 'documents', 'estate', 'actions'] as const;
          type PermKey = typeof restrictedSections[number];
          if (role === 'family' && restrictedSections.includes(currentTab as PermKey)) {
            const allowed = userPermissions[currentTab as PermKey];
            if (!allowed) setCurrentTab('home');
          }
          addToast({
            type: 'info',
            title: `Switched to ${role === 'owner' ? 'Owner' : 'Family'} View`,
            message: role === 'owner' ? 'Full estate access enabled' : 'Access restricted to permitted sections'
          });
        }}
        onOpenLogin={() => setAuthView('login')}
      />

      {/* Mobile Top Bar with Menu Button */}
      <div style={{
        display: 'none',
        padding: '0.6rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
        background: 'var(--surface)',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="mobile-nav-bar">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="neu-btn"
          style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Menu</span>
        </button>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
          {currentTab.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar for Desktop & Mobile Toggle */}
        <div className={`sidebar-container ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Sidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            userPermissions={userPermissions}
            isOwner={userRole === 'owner'}
          />
        </div>

        <main style={{
          flex: 1,
          padding: '1.25rem 1.75rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}>
          {renderContent()}
        </main>
      </div>

      {/* Global Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <EstateProvider>
      <AppContent />
    </EstateProvider>
  );
}

export default App;
