import React from 'react';
import Card from '../common/Card';
import { MOCK_PIPELINES } from '../../constants';
import { Pipeline, PipelineStatus } from '../../types';
import { Play, RefreshCw, MoreHorizontal } from 'lucide-react';

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

const Pipelines: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Data Pipelines</h1>
      <Card>
        <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Name</th>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Status</th>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Last Run</th>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Next Run</th>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Avg. Duration</th>
                  <th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PIPELINES.map((pipeline: Pipeline) => (
                  <tr key={pipeline.id} className="border-b border-brand-border">
                    <td className="py-3 font-semibold text-white">{pipeline.name}</td>
                    <td className="py-3"><StatusPill status={pipeline.status} /></td>
                    <td className="py-3 text-sm text-gray-300">{pipeline.lastRun}</td>
                    <td className="py-3 text-sm text-gray-300">{pipeline.nextRun}</td>
                    <td className="py-3 text-sm text-gray-300">{pipeline.avgDuration}</td>
                    <td className="py-3">
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
  );
};

export default Pipelines;
