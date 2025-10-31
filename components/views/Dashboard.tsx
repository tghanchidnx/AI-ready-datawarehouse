
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { MOCK_AGENT_LOGS, MOCK_METRICS, MOCK_PIPELINES } from '../../constants';
import type { AgentLog } from '../../types';
import { PipelineStatus } from '../../types';
import { Clock, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';

const StatusPill: React.FC<{ status: PipelineStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusMap = {
        [PipelineStatus.Running]: 'bg-blue-500/20 text-blue-300',
        [PipelineStatus.Completed]: 'bg-green-500/20 text-green-300',
        [PipelineStatus.Failed]: 'bg-red-500/20 text-red-300',
        [PipelineStatus.Scheduled]: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};


const LogItem: React.FC<{ log: AgentLog }> = ({ log }) => {
  const levelColor = {
    info: 'text-brand-muted',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };
  return (
    <div className="flex items-start space-x-3 text-sm">
      <span className="font-mono text-brand-muted">{log.timestamp}</span>
      <span className={`font-semibold ${levelColor[log.level]}`}>{log.agent}:</span>
      <span className="text-gray-300">{log.message}</span>
    </div>
  );
};

const Dashboard: React.FC = () => {
    const runningPipelines = MOCK_PIPELINES.filter(p => p.status === 'Running').length;
    const completedToday = MOCK_PIPELINES.filter(p => p.status === 'Completed').length;
    const failedPipelines = MOCK_PIPELINES.filter(p => p.status === 'Failed').length;
    
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-brand-accent/20 text-brand-accent">
                        <Cpu size={24}/>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-brand-muted">Running Pipelines</p>
                        <p className="text-2xl font-bold text-white">{runningPipelines}</p>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-brand-success/20 text-green-400">
                        <CheckCircle size={24}/>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-brand-muted">Completed Today</p>
                        <p className="text-2xl font-bold text-white">{completedToday}</p>
                    </div>
                </div>
            </Card>
             <Card>
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-brand-danger/20 text-red-400">
                        <AlertTriangle size={24}/>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-brand-muted">Failed Pipelines</p>
                        <p className="text-2xl font-bold text-white">{failedPipelines}</p>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-brand-warning/20 text-yellow-400">
                        <Clock size={24}/>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-brand-muted">Avg. Latency</p>
                        <p className="text-2xl font-bold text-white">{MOCK_METRICS.averageLatency.slice(-1)[0].value}ms</p>
                    </div>
                </div>
            </Card>
        </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Agent Queries per Minute">
             <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={MOCK_METRICS.queriesPerMinute} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#58A6FF" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="name" stroke="#8B949E" />
                    <YAxis stroke="#8B949E"/>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}/>
                    <Area type="monotone" dataKey="value" stroke="#58A6FF" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Average Query Latency (ms)">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={MOCK_METRICS.averageLatency} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#238636" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="name" stroke="#8B949E" />
                    <YAxis stroke="#8B949E"/>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}/>
                    <Area type="monotone" dataKey="value" stroke="#238636" fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
            </ResponsiveContainer>
          </Card>
      </div>
      
      <Card title="General Orchestration Agent Log">
        <div className="space-y-3 font-mono text-xs max-h-64 overflow-y-auto">
          {MOCK_AGENT_LOGS.map(log => <LogItem key={log.id} log={log} />)}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
