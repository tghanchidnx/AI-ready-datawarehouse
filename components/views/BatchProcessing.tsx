import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { MOCK_BATCH_JOBS, MOCK_PIPELINES } from '../../constants';
import { BatchJobStatus } from '../../types';
import type { BatchJob } from '../../types';
import { Layers3, Calendar, Cpu, Repeat, PlusCircle, Edit } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const StatusPill: React.FC<{ status: BatchJobStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
    const statusMap = {
        [BatchJobStatus.Running]: 'bg-blue-500/20 text-blue-300',
        [BatchJobStatus.Succeeded]: 'bg-green-500/20 text-green-300',
        [BatchJobStatus.Failed]: 'bg-red-500/20 text-red-300',
        [BatchJobStatus.Pending]: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

const emptyJob: Omit<BatchJob, 'id' | 'status' | 'submitted'> = {
    name: '',
    pipelineName: MOCK_PIPELINES.length > 0 ? MOCK_PIPELINES[0].name : '',
    schedule: '0 * * * *',
    resources: {
        clusterSize: 'Medium',
        retries: 2,
    }
};

const BatchProcessing: React.FC = () => {
  const [jobs, setJobs] = useState<BatchJob[]>(MOCK_BATCH_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<BatchJob | null>(null);
  const [jobForm, setJobForm] = useState(emptyJob);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name in jobForm.resources) {
          setJobForm(prev => ({
              ...prev,
              resources: {
                  ...prev.resources,
                  [name]: name === 'retries' ? parseInt(value) : value,
              }
          }));
      } else {
          setJobForm(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleSaveJob = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingJob) {
          setJobs(prev => prev.map(job => job.id === editingJob.id ? { ...job, ...jobForm } : job));
      } else {
          const createdJob: BatchJob = {
              id: `job-${String(jobs.length + 1).padStart(3, '0')}`,
              status: BatchJobStatus.Pending,
              submitted: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              ...jobForm,
          };
          setJobs(prev => [createdJob, ...prev]);
      }
      setIsModalOpen(false);
  };

  const handleOpenModal = (job: BatchJob | null) => {
      if (job) {
          setEditingJob(job);
          setJobForm({
              name: job.name,
              pipelineName: job.pipelineName,
              schedule: job.schedule,
              resources: { ...job.resources }
          });
      } else {
          setEditingJob(null);
          setJobForm(emptyJob);
      }
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setJobForm(emptyJob);
  }

  return (
    <>
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Batch Processing Jobs</h1>
                <Tooltip text="Create New Batch Job">
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold">
                        <PlusCircle size={20} />
                        <span>New Job</span>
                    </button>
                </Tooltip>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <Card className="overflow-hidden">
                        <table className="min-w-full divide-y divide-brand-border">
                            <thead className="bg-brand-secondary/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Job Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Schedule</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Resources</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">Submitted</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {jobs.map(job => (
                                    <tr key={job.id} className="hover:bg-brand-border/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-brand-primary rounded-md mr-4 border border-brand-border">
                                                    <Layers3 size={20} className="text-brand-accent"/>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{job.name}</div>
                                                    <div className="text-xs text-brand-muted">{job.pipelineName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusPill status={job.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-brand-muted"/>
                                                <span className="font-mono">{job.schedule}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex items-center gap-4">
                                                <Tooltip text="Cluster Size">
                                                    <div className="flex items-center gap-1.5">
                                                        <Cpu size={16} className="text-brand-muted"/>
                                                        <span>{job.resources.clusterSize}</span>
                                                    </div>
                                                </Tooltip>
                                                <Tooltip text="Retries">
                                                    <div className="flex items-center gap-1.5">
                                                        <Repeat size={16} className="text-brand-muted"/>
                                                        <span>{job.resources.retries}</span>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.submitted}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Tooltip text="Edit Job">
                                                <button onClick={() => handleOpenModal(job)} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-full transition-colors">
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingJob ? 'Edit Batch Job' : 'Create New Batch Job'}>
            <form onSubmit={handleSaveJob} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-muted mb-1">Job Name</label>
                    <input type="text" name="name" id="name" value={jobForm.name} onChange={handleFormChange} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="e.g., Daily Vector Refresh" />
                </div>
                <div>
                    <label htmlFor="pipelineName" className="block text-sm font-medium text-brand-muted mb-1">Pipeline to Run</label>
                    <select name="pipelineName" id="pipelineName" value={jobForm.pipelineName} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                        {MOCK_PIPELINES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-brand-muted mb-1">Schedule (CRON Format)</label>
                    <input type="text" name="schedule" id="schedule" value={jobForm.schedule} onChange={handleFormChange} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white font-mono" placeholder="0 2 * * *" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="clusterSize" className="block text-sm font-medium text-brand-muted mb-1">Cluster Size</label>
                        <select name="clusterSize" id="clusterSize" value={jobForm.resources.clusterSize} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="retries" className="block text-sm font-medium text-brand-muted mb-1">Retries on Failure</label>
                        <input type="number" name="retries" id="retries" value={jobForm.resources.retries} onChange={handleFormChange} required min="0" className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">{editingJob ? 'Save Changes' : 'Create Job'}</button>
                </div>
            </form>
        </Modal>
    </>
  );
};

export default BatchProcessing;