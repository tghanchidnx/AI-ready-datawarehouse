import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import DataSources from './components/views/DataSources';
import Pipelines from './components/views/Pipelines';
import BatchProcessing from './components/views/BatchProcessing';
import RelationshipDiscovery from './components/views/RelationshipDiscovery';
import DataLineage from './components/views/DataLineage';
import ChangesApprovals from './components/views/ChangesApprovals';
import SecurityIncidents from './components/views/SecurityIncidents';
import Console from './components/views/Console';
import Settings from './components/views/Settings';
import Help from './components/views/Help';
import AccessDenied from './components/common/AccessDenied';
import Assistant from './components/common/Assistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AssistantProvider } from './contexts/AssistantContext';
import type { View, PermissionId } from './types';

const viewPermissionMap: Record<View, PermissionId> = {
  'dashboard': 'view_dashboard',
  'data-sources': 'view_datasources',
  'pipelines': 'view_pipelines',
  'batch-processing': 'view_batch_processing',
  'relationship-discovery': 'view_relationship_discovery',
  'data-lineage': 'view_data_lineage',
  'changes-approvals': 'view_changes',
  'security-incidents': 'view_security_incidents',
  'console': 'view_console',
  'settings': 'view_settings',
  'help': 'view_help',
};

const MainContent: React.FC<{ currentView: View, setCurrentView: (view: View) => void }> = ({ currentView, setCurrentView }) => {
  const { can } = useAuth();
  
  if (!can(viewPermissionMap[currentView])) {
    return <AccessDenied />;
  }
  
  switch (currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'data-sources':
      return <DataSources setCurrentView={setCurrentView} />;
    case 'pipelines':
      return <Pipelines />;
    case 'batch-processing':
      return <BatchProcessing />;
    case 'relationship-discovery':
      return <RelationshipDiscovery />;
    case 'data-lineage':
      return <DataLineage />;
    case 'changes-approvals':
      return <ChangesApprovals />;
    case 'security-incidents':
      return <SecurityIncidents />;
    case 'console':
      return <Console />;
    case 'settings':
      return <Settings />;
    case 'help':
      return <Help />;
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <AuthProvider>
      <AssistantProvider>
        <div className="flex h-screen bg-brand-primary text-gray-300">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header setCurrentView={setCurrentView} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <MainContent currentView={currentView} setCurrentView={setCurrentView} />
            </main>
          </div>
          <Assistant />
        </div>
      </AssistantProvider>
    </AuthProvider>
  );
};

export default App;
