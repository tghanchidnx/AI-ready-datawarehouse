import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { MOCK_PIPELINES, MOCK_DB_CONNECTIONS, MOCK_WORKFLOWS } from '../../constants';
import { PipelineStatus, TransformationType } from '../../types';
import type { Pipeline } from '../../types';
import { Zap, Clock, Database, GitBranch, PlusCircle, Edit } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const StatusPill: React.FC<{ status: PipelineStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
    const statusMap = {
        [PipelineStatus.Running]: 'bg-blue-500/20 text-blue-300',
        [PipelineStatus.Completed]: 'bg-green-500/20 text-green-300',
        [PipelineStatus.Failed]: 'bg-red-500/20 text-red-300',
        [PipelineStatus.Scheduled]: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

const emptyPipeline: Omit<Pipeline, 'id' | 'status' | 'lastRun' | 'duration'> = {
    name: '',
    source: MOCK_DB_CONNECTIONS.length > 0 ? MOCK_DB_CONNECTIONS[0].name : '',
    target: TransformationType.Graph,
    workflowId: MOCK_WORKFLOWS.length > 0 ? MOCK_WORKFLOWS[0].id : undefined,
};

const Pipelines: React.FC = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>(MOCK_PIPELINES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
    const [pipelineForm, setPipelineForm] = useState(emptyPipeline);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPipelineForm(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSavePipeline = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPipeline) {
            setPipelines(prev => prev.map(p => p.id === editingPipeline.id ? { ...p, ...pipelineForm } : p));
        } else {
            const createdPipeline: Pipeline = {
                id: `pl-${String(pipelines.length + 1).padStart(3, '0')}`,
                status: PipelineStatus.Scheduled,
                lastRun: 'N/A',
                duration: 'N/A',
                ...pipelineForm,
            };
            setPipelines(prev => [createdPipeline, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleOpenModal = (pipeline: Pipeline | null) => {
        if (pipeline) {
            setEditingPipeline(pipeline);
            setPipelineForm({
                name: pipeline.name,
                source: pipeline.source,
                target: pipeline.target,
                workflowId: pipeline.workflowId,
            });
        } else {
            setEditingPipeline(null);
            setPipelineForm(emptyPipeline);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPipeline(null);
        setPipelineForm(emptyPipeline);
    };

  return (
    <>
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Transformation Pipelines</h1>
                <Tooltip text="Create New Pipeline">
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold">
                        <PlusCircle size={20} />
                        <span>New Pipeline</span>
                    </button>
                </Tooltip>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <Card className="overflow-hidden">
                        <table className="min-w-full divide-y divide-brand-border">
                            <thead className="bg-brand-secondary/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Pipeline Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Source & Target</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Last Run</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Duration</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {pipelines.map(pipeline => (
                                    <tr key={pipeline.id} className="hover:bg-brand-border/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-brand-primary rounded-md mr-4 border border-brand-border">
                                                    <Zap size={20} className="text-brand-accent"/>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{pipeline.name}</div>
                                                    <div className="text-xs text-brand-muted font-mono">{pipeline.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusPill status={pipeline.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Database size={16} className="text-brand-muted"/>
                                                <span>{pipeline.source}</span>
                                                <GitBranch size={16} className="text-brand-muted"/>
                                                <span>{pipeline.target}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pipeline.lastRun}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-brand-muted"/>
                                                <span>{pipeline.duration}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Tooltip text="Edit Pipeline">
                                                <button onClick={() => handleOpenModal(pipeline)} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-full transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingPipeline ? 'Edit Pipeline' : 'Create New Pipeline'}
        >
            <form onSubmit={handleSavePipeline} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-muted mb-1">Pipeline Name</label>
                    <input type="text" name="name" id="name" value={pipelineForm.name} onChange={handleFormChange} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="e.g., Real-time Fraud Detection KG" />
                </div>
                 <div>
                    <label htmlFor="source" className="block text-sm font-medium text-brand-muted mb-1">Source Data Connection</label>
                    <select name="source" id="source" value={pipelineForm.source} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                        {MOCK_DB_CONNECTIONS.filter(c => c.status === 'Connected').map(conn => (
                            <option key={conn.id} value={conn.name}>{conn.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="target" className="block text-sm font-medium text-brand-muted mb-1">Target AI-Native Format</label>
                    <select name="target" id="target" value={pipelineForm.target} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                        {Object.values(TransformationType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="workflowId" className="block text-sm font-medium text-brand-muted mb-1">Orchestration Workflow</label>
                    <select name="workflowId" id="workflowId" value={pipelineForm.workflowId} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                        {MOCK_WORKFLOWS.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">{editingPipeline ? 'Save Changes' : 'Create Pipeline'}</button>
                </div>
            </form>
        </Modal>
    </>
  );
};

export default Pipelines;