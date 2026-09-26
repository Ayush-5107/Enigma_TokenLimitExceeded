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
    { id: 'home', label: 'Home Dashboard', icon: Home, section: 'estate' },
    { id: 'estate', label: 'Estate Inventory', icon: PieChart, section: 'estate' },
    { id: 'vault', label: 'Legacy Vault', icon: FolderKey, section: 'vault' },
    { id: 'documents', label: 'Documents & TEE', icon: FileText, section: 'documents' },
    { id: 'actions', label: 'Action Engine', icon: CheckSquare, section: 'actions' },
    { id: 'family', label: 'Family & Access', icon: Users, section: 'estate' },
    { id: 'audit', label: 'Security & Audit', icon: ShieldAlert, section: 'audit' },
    { id: 'settings', label: 'Settings & PWA', icon: Settings, section: 'estate' },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      gap: '0.4rem',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem 0.5rem 0.75rem' }}>
        Navigation
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isAllowed = isOwner || userPermissions[item.section] !== false;
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
              borderRadius: '10px',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
              background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: !isAllowed ? '#475569' : isActive ? '#38bdf8' : '#cbd5e1',
              cursor: isAllowed ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              fontSize: '0.88rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} color={!isAllowed ? '#475569' : isActive ? '#38bdf8' : '#94a3b8'} />
              <span>{item.label}</span>
            </div>
            {!isAllowed && <Lock size={14} color="#f43f5e" />}
          </button>
        );
      })}
    </aside>
  );
};
