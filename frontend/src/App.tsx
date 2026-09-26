import { useState } from 'react';
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

export function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [userRole, setUserRole] = useState<'owner' | 'family'>('owner');
  const [authView, setAuthView] = useState<'none' | 'login' | 'register'>('none');

  const currentUser = userRole === 'owner' 
    ? { full_name: 'Rajesh Sharma', role: 'owner', email: 'owner@estate.demo' }
    : { full_name: 'Rahul Sharma (Son)', role: 'family_member', email: 'rahul@estate.demo' };

  const userPermissions = userRole === 'owner'
    ? { vault: true, documents: true, estate: true, actions: true, audit: true }
    : { vault: false, documents: true, estate: true, actions: true, audit: false };

  const handleAuthSuccess = (user: any) => {
    if (user.role === 'owner') {
      setUserRole('owner');
    } else {
      setUserRole('family');
    }
    setAuthView('none');
    setCurrentTab('home');
  };

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
    switch (currentTab) {
      case 'home':
        return <Home onNavigate={setCurrentTab} />;
      case 'vault':
        return <Vault isOwner={userRole === 'owner'} />;
      case 'documents':
        return <Documents onNavigate={setCurrentTab} />;
      case 'estate':
        return <Estate />;
      case 'actions':
        return <Actions />;
      case 'family':
        return <Family isOwner={userRole === 'owner'} />;
      case 'audit':
        return <Audit />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <Navbar
        currentUser={currentUser}
        onSwitchUserRole={setUserRole}
        onOpenLogin={() => setAuthView('login')}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userPermissions={userPermissions}
          isOwner={userRole === 'owner'}
        />

        <main style={{ flex: 1, padding: '1.75rem 2.25rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
