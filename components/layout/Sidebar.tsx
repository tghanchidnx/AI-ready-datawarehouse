
import React from 'react';
// FIX: Import PermissionId for correct typing.
import type { View, PermissionId } from '../../types';
import { LayoutDashboard, Database, Zap, LifeBuoy, Bot, Settings, Layers3, GitFork, Share2, ClipboardCheck, Terminal, ShieldAlert } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { APP_VERSION } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavItemConfig {
    id: View;
    label: string;
    icon: React.ReactNode;
    // FIX: Changed permission type from string to PermissionId.
    permission: PermissionId;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <Tooltip text={label} position="right">
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200
          ${isActive
            ? 'bg-brand-accent text-white'
            : 'text-brand-muted hover:bg-brand-border hover:text-white'
          }`}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </button>
    </Tooltip>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { can } = useAuth();

  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} />, permission: 'view_dashboard' },
    { id: 'data-sources', label: 'Data Sources', icon: <Database size={24} />, permission: 'view_datasources' },
    { id: 'pipelines', label: 'Pipelines', icon: <Zap size={24} />, permission: 'view_pipelines' },
    { id: 'batch-processing', label: 'Batch Processing', icon: <Layers3 size={24} />, permission: 'view_batch_processing' },
    { id: 'relationship-discovery', label: 'Relationship Discovery', icon: <Share2 size={24} />, permission: 'view_relationship_discovery' },
    { id: 'data-lineage', label: 'Data Lineage', icon: <GitFork size={24} />, permission: 'view_data_lineage' },
    { id: 'changes-approvals', label: 'Changes & Approvals', icon: <ClipboardCheck size={24} />, permission: 'view_changes' },
    { id: 'security-incidents', label: 'Security Incidents', icon: <ShieldAlert size={24} />, permission: 'view_security_incidents' },
    { id: 'console', label: 'System Console', icon: <Terminal size={24} />, permission: 'view_console' },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} />, permission: 'view_settings' },
    { id: 'help', label: 'Help & Docs', icon: <LifeBuoy size={24} />, permission: 'view_help' },
  ];

  const visibleNavItems = navItems.filter(item => can(item.permission));

  return (
    <aside className="flex flex-col items-center w-20 bg-brand-secondary border-r border-brand-border p-4">
      <div className="flex items-center justify-center w-12 h-12 mb-8 bg-brand-primary rounded-lg">
        <Bot size={28} className="text-brand-accent" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {visibleNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="text-xs text-brand-muted font-mono">
            v{APP_VERSION}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
