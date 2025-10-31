import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { Layers3, PlusCircle } from 'lucide-react';
import { MOCK_BATCH_JOBS } from '../../constants';
// FIX: Imported BatchJobStatus as a value to be used in the component.
import type { BatchJob } from '../../types';
import { BatchJobStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Tooltip from '../common/Tooltip';
import { Play, MoreHorizontal } from 'lucide-react';

const StatusPill: React.FC<{ status: BatchJobStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusMap = {
        [BatchJobStatus.Running]: 'bg-blue-500/20 text-blue-300 animate-pulse',
        [BatchJobStatus.Succeeded]: 'bg-green-500/20 text-green-300',
        [BatchJobStatus.Failed]: 'bg-red-500/20 text-red-300',
        [BatchJobStatus.Pending]: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};


interface BatchProcessingProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const BatchProcessing: React.FC<BatchProcessingProps> = ({ isModalOpen, onClose }) => {
    const { can } = useAuth();
    const [jobs, setJobs] = useState<BatchJob[]>(MOCK_BATCH_JOBS);
    const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

    const modalVisible = isModalOpen || isNewJobModalOpen;
    const openModal = () => setIsNewJobModalOpen(true);
    const closeModal = () => {
        setIsNewJobModalOpen(false);
        onClose();
    };
    
    // FIX: Specified form event type to correctly access form elements.
    const handleCreateJob = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newJob: BatchJob = {
            id: `job-${Date.now()}`,
            name: (e.currentTarget.elements.namedItem('jobName') as HTMLInputElement).value,
            dataSource: (e.currentTarget.elements.namedItem('jobSource') as HTMLSelectElement).value,
            status: BatchJobStatus.Pending,
            schedule: 'Manual',
            lastRun: 'Never',
            avgDuration: 'N/A',
        };
        setJobs(prev => [newJob, ...prev]);
        closeModal();
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Batch Processing</h1>
                     {can('manage_settings_workflows') && (
                        <button 
                            onClick={openModal}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                        >
                            <PlusCircle size={18} />
                            <span>New Job</span>
                        </button>
                    )}
                </div>
                 <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Job Name</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Status</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Schedule</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Data Source</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Last Run</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Avg. Duration</th>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-brand-muted uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                <tr key={job.id} className="border-b border-brand-border last:border-b-0">
                                    <td className="py-3 px-3 font-semibold text-white">{job.name}</td>
                                    <td className="py-3 px-3"><StatusPill status={job.status} /></td>
                                    <td className="py-3 px-3 font-mono text-sm text-gray-300">{job.schedule}</td>
                                    <td className="py-3 px-3 text-sm text-gray-300">{job.dataSource}</td>
                                    <td className="py-3 px-3 text-sm text-gray-300">{job.lastRun}</td>
                                    <td className="py-3 px-3 text-sm text-gray-300">{job.avgDuration}</td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <Tooltip text="Run Job"><button className="p-2 text-brand-muted hover:text-brand-accent"><Play size={16}/></button></Tooltip>
                                            <Tooltip text="More Options"><button className="p-2 text-brand-muted hover:text-brand-accent"><MoreHorizontal size={16}/></button></Tooltip>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
             <Modal isOpen={modalVisible} onClose={closeModal} title="Create New Batch Job">
                <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                        <label htmlFor="jobName" className="block text-sm font-medium text-brand-muted mb-1">Job Name</label>
                        <input type="text" id="jobName" name="jobName" required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/>
                    </div>
                     <div>
                        <label htmlFor="jobSource" className="block text-sm font-medium text-brand-muted mb-1">Data Source</label>
                        <select id="jobSource" name="jobSource" className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                            <option>Prod Snowflake Warehouse</option>
                            <option>Staging Databricks Workspace</option>
                            <option>Demo: Archived Sales Data</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">Schedule Job</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default BatchProcessing;