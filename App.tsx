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
import type { View, PermissionId, ChangeRequest } from './types';
import { MOCK_CHANGE_REQUESTS } from './constants';

const viewPermissionMap: Record<Exclude<View, 'access-denied'>, PermissionId> = {
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

const MainContent: React.FC<{
  currentView: View,
  setCurrentView: (view: View) => void,
  isNewPipelineModalOpen: boolean,
  onPipelineModalClose: () => void,
  isNewBatchJobModalOpen: boolean,
  onBatchJobModalClose: () => void,
  changeRequests: ChangeRequest[],
  setChangeRequests: React.Dispatch<React.SetStateAction<ChangeRequest[]>>
}> = (props) => {
  const { can } = useAuth();
  
  if (props.currentView !== 'access-denied' && !can(viewPermissionMap[props.currentView])) {
    return <AccessDenied />;
  }
  
  switch (props.currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'data-sources':
      return <DataSources setCurrentView={props.setCurrentView} />;
    case 'pipelines':
      return <Pipelines isModalOpen={props.isNewPipelineModalOpen} onClose={props.onPipelineModalClose} />;
    case 'batch-processing':
      return <BatchProcessing isModalOpen={props.isNewBatchJobModalOpen} onClose={props.onBatchJobModalClose} />;
    case 'relationship-discovery':
      return <RelationshipDiscovery />;
    case 'data-lineage':
      return <DataLineage />;
    case 'changes-approvals':
      return <ChangesApprovals changeRequests={props.changeRequests} setChangeRequests={props.setChangeRequests} />;
    case 'security-incidents':
      return <SecurityIncidents />;
    case 'console':
      return <Console />;
    case 'settings':
      return <Settings />;
    case 'help':
      return <Help />;
    case 'access-denied':
        return <AccessDenied />;
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isNewPipelineModalOpen, setIsNewPipelineModalOpen] = useState(false);
  const [isNewBatchJobModalOpen, setIsNewBatchJobModalOpen] = useState(false);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(MOCK_CHANGE_REQUESTS);

  const assistantActions = {
    setCurrentView,
    openNewPipelineModal: () => setIsNewPipelineModalOpen(true),
    openNewBatchJobModal: () => setIsNewBatchJobModalOpen(true),
    createChangeRequest: (title: string, description: string) => {
      const newRequest: ChangeRequest = {
        id: `CR-${Date.now()}`,
        title,
        description,
        requestedBy: 'AI Assistant Feedback',
        requestedAt: new Date().toISOString(),
        currentStage: 'Pending Review',
        stages: [
          { name: 'Pending Review', status: 'Pending', notes: 'Automatically generated from user feedback.' },
          { name: 'Technical Review', status: 'Pending' },
          { name: 'BRD Generation', status: 'Pending' },
          { name: 'Final Approval', status: 'Pending' },
          { name: 'Implemented', status: 'Pending' },
        ],
        auditTrail: [{
          timestamp: new Date().toISOString(),
          user: 'AI Assistant',
          action: 'Created Request',
          details: `Title: ${title}`
        }]
      };
      setChangeRequests(prev => [newRequest, ...prev]);
    }
  };

  return (
    <AuthProvider>
      <AssistantProvider {...assistantActions} currentView={currentView}>
        <div className="flex h-screen bg-brand-primary text-gray-300">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header setCurrentView={setCurrentView} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <MainContent
                currentView={currentView}
                setCurrentView={setCurrentView}
                isNewPipelineModalOpen={isNewPipelineModalOpen}
                onPipelineModalClose={() => setIsNewPipelineModalOpen(false)}
                isNewBatchJobModalOpen={isNewBatchJobModalOpen}
                onBatchJobModalClose={() => setIsNewBatchJobModalOpen(false)}
                changeRequests={changeRequests}
                setChangeRequests={setChangeRequests}
              />
            </main>
          </div>
          <Assistant />
        </div>
      </AssistantProvider>
    </AuthProvider>
  );
};

export default App;