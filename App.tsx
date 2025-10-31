import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import DataSources from './components/views/DataSources';
import Pipelines from './components/views/Pipelines';
import ChangesApprovals from './components/views/ChangesApprovals';
import Help from './components/views/Help';
import Settings from './components/views/Settings';
import BatchProcessing from './components/views/BatchProcessing';
import RelationshipDiscovery from './components/views/RelationshipDiscovery';
import DataLineage from './components/views/DataLineage';
import Console from './components/views/Console';
import SecurityIncidents from './components/views/SecurityIncidents';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
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

  return (
    <div className="flex h-screen bg-brand-primary font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-primary p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;