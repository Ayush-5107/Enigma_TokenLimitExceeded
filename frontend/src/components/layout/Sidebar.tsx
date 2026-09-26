import React from 'react';
import { Home, FolderKey, FileText, PieChart, CheckSquare, Users, ShieldAlert, Settings, Lock } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userPermissions: Record<string, boolean>;
  isOwner: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, userPermissions, isOwner }) => {
  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home, permKey: null },
    { id: 'estate', label: 'Estate Inventory', icon: PieChart, permKey: 'estate' },
    { id: 'vault', label: 'Legacy Vault', icon: FolderKey, permKey: 'vault' },
    { id: 'documents', label: 'Documents & TEE', icon: FileText, permKey: 'documents' },
    { id: 'actions', label: 'Action Engine', icon: CheckSquare, permKey: 'actions' },
    { id: 'family', label: 'Family & Access', icon: Users, permKey: null },
    { id: 'audit', label: 'Security & Audit', icon: ShieldAlert, permKey: 'audit' },
    { id: 'settings', label: 'Settings & PWA', icon: Settings, permKey: null },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--surface)',
      borderRight: '1px solid rgba(255, 255, 255, 0.75)',
      boxShadow: '4px 0 12px rgba(182, 192, 206, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.85rem',
      gap: '0.45rem',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '0 0.5rem 0.35rem 0.5rem',
        fontFamily: 'var(--font-mono)'
      }}>
        Navigation
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isAllowed = isOwner || !item.permKey || userPermissions[item.permKey] !== false;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => isAllowed && onSelectTab(item.id)}
            disabled={!isAllowed}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid rgba(0, 102, 102, 0.25)' : '1px solid rgba(255, 255, 255, 0.7)',
              background: 'var(--surface)',
              boxShadow: !isAllowed 
                ? 'none' 
                : isActive 
                  ? 'var(--neu-shadow-inset)' 
                  : 'var(--neu-shadow-btn)',
              color: !isAllowed 
                ? 'var(--text-dim)' 
                : isActive 
                  ? 'var(--primary)' 
                  : 'var(--text-main)',
              cursor: isAllowed ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              fontSize: '0.82rem',
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'var(--font-primary)',
              letterSpacing: '-0.01em',
              transition: 'all 0.15s ease',
              opacity: !isAllowed ? 0.6 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Icon size={17} color={!isAllowed ? 'var(--text-dim)' : isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </div>
            {!isAllowed && <Lock size={13} color="var(--danger)" />}
          </button>
        );
      })}
    </aside>
  );
};
