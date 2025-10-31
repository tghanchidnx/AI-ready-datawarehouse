import React from 'react';
import type { View } from '../../types';
import { LayoutDashboard, Database, Zap, LifeBuoy, Bot, Settings, Layers3, GitFork, Share2, ClipboardCheck, Terminal, ShieldAlert } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { APP_VERSION } from '../../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
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
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'data-sources', label: 'Data Sources', icon: <Database size={24} /> },
    { id: 'pipelines', label: 'Pipelines', icon: <Zap size={24} /> },
    { id: 'batch-processing', label: 'Batch Processing', icon: <Layers3 size={24} /> },
    { id: 'relationship-discovery', label: 'Relationship Discovery', icon: <Share2 size={24} /> },
    { id: 'data-lineage', label: 'Data Lineage', icon: <GitFork size={24} /> },
    { id: 'changes-approvals', label: 'Changes & Approvals', icon: <ClipboardCheck size={24} /> },
    { id: 'security-incidents', label: 'Security Incidents', icon: <ShieldAlert size={24} /> },
    { id: 'console', label: 'System Console', icon: <Terminal size={24} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} /> },
    { id: 'help', label: 'Help & Docs', icon: <LifeBuoy size={24} /> },
  ];

  return (
    <aside className="flex flex-col items-center w-20 bg-brand-secondary border-r border-brand-border p-4">
      <div className="flex items-center justify-center w-12 h-12 mb-8 bg-brand-primary rounded-lg">
        <Bot size={28} className="text-brand-accent" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.id}
              onClick={() => setCurrentView(item.id as View)}
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
