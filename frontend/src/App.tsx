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

export function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [userRole, setUserRole] = useState<'owner' | 'family'>('owner');

  const currentUser = userRole === 'owner' 
    ? { full_name: 'Rajesh Sharma', role: 'owner', email: 'owner@estate.demo' }
    : { full_name: 'Rahul Sharma (Son)', role: 'family_member', email: 'rahul@estate.demo' };

  const userPermissions = userRole === 'owner'
    ? { vault: true, documents: true, estate: true, actions: true, audit: true }
    : { vault: false, documents: true, estate: true, actions: true, audit: false };

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentUser={currentUser}
        onSwitchUserRole={setUserRole}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userPermissions={userPermissions}
          isOwner={userRole === 'owner'}
        />

        <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
