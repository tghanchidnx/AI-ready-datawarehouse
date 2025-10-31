import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { MOCK_PIPELINES } from '../../constants';
import { Pipeline, PipelineStatus } from '../../types';
import { Play, RefreshCw, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StatusPill: React.FC<{ status: PipelineStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusMap = {
        [PipelineStatus.Running]: 'bg-blue-500/20 text-blue-300 animate-pulse',
        [PipelineStatus.Completed]: 'bg-green-500/20 text-green-300',
        [PipelineStatus.Failed]: 'bg-red-500/20 text-red-300',
        [PipelineStatus.Scheduled]: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

interface PipelinesProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const Pipelines: React.FC<PipelinesProps> = ({ isModalOpen, onClose }) => {
  const { can } = useAuth();
  const [pipelines, setPipelines] = useState<Pipeline[]>(MOCK_PIPELINES);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Combine external and internal modal state
  const modalVisible = isModalOpen || isNewModalOpen;
  const openModal = () => setIsNewModalOpen(true);
  const closeModal = () => {
    setIsNewModalOpen(false);
    onClose(); // Also call the parent's close handler
  };

  // FIX: Specified form event type to correctly access form elements.
  const handleCreatePipeline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to create a new pipeline would go here
    const newPipeline: Pipeline = {
        id: `pipe-${Date.now()}`,
        name: (e.currentTarget.elements.namedItem('pipelineName') as HTMLInputElement).value,
        status: PipelineStatus.Scheduled,
        lastRun: 'Never',
        nextRun: new Date(Date.now() + 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        avgDuration: 'N/A'
    };
    setPipelines(prev => [newPipeline, ...prev]);
    closeModal();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Data Pipelines</h1>
          {can('manage_settings_workflows') && (
            <button 
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
            >
              <PlusCircle size={18} />
              <span>New Pipeline</span>
            </button>
          )}
        </div>
        <Card>
          <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Name</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Status</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Last Run</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Next Run</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Avg. Duration</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelines.map((pipeline: Pipeline) => (
                    <tr key={pipeline.id} className="border-b border-brand-border last:border-b-0">
                      <td className="py-3 px-3 font-semibold text-white">{pipeline.name}</td>
                      <td className="py-3 px-3"><StatusPill status={pipeline.status} /></td>
                      <td className="py-3 px-3 text-sm text-gray-300">{pipeline.lastRun}</td>
                      <td className="py-3 px-3 text-sm text-gray-300">{pipeline.nextRun}</td>
                      <td className="py-3 px-3 text-sm text-gray-300">{pipeline.avgDuration}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-brand-muted hover:text-brand-accent"><Play size={16}/></button>
                          <button className="p-2 text-brand-muted hover:text-brand-accent"><RefreshCw size={16}/></button>
                          <button className="p-2 text-brand-muted hover:text-brand-accent"><MoreHorizontal size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </Card>
      </div>
       <Modal isOpen={modalVisible} onClose={closeModal} title="Create New Pipeline">
        <form onSubmit={handleCreatePipeline} className="space-y-4">
          <div>
            <label htmlFor="pipelineName" className="block text-sm font-medium text-brand-muted mb-1">Pipeline Name</label>
            <input type="text" id="pipelineName" name="pipelineName" required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/>
          </div>
          <div>
            <label htmlFor="workflow" className="block text-sm font-medium text-brand-muted mb-1">Workflow</label>
            <select id="workflow" className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
              <option>Standard Ingestion</option>
              <option>Real-time Sync</option>
            </select>
          </div>
           <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">Create Pipeline</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Pipelines;