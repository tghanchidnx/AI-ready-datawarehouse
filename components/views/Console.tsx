import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import { MOCK_CONSOLE_LOGS } from '../../constants';
import type { ConsoleLog, ConsoleLogLevel, ConsoleLogCategory } from '../../types';
import { Download, Trash2, Filter } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useAuth } from '../../contexts/AuthContext';

const LogLevelPill: React.FC<{ level: ConsoleLogLevel }> = ({ level }) => {
  const levelMap = {
    INFO: 'bg-blue-500/20 text-blue-300',
    WARN: 'bg-yellow-500/20 text-yellow-300',
    ERROR: 'bg-red-500/20 text-red-300',
    SUCCESS: 'bg-green-500/20 text-green-300',
  };
  return <span className={`w-16 text-center px-2 py-0.5 text-xs font-semibold rounded-full ${levelMap[level]}`}>{level}</span>;
};

const LogCategoryPill: React.FC<{ category: ConsoleLogCategory }> = ({ category }) => {
    const categoryMap = {
      'System Event': 'bg-gray-500/20 text-gray-300',
      'User Action': 'bg-purple-500/20 text-purple-300',
      'API Call': 'bg-indigo-500/20 text-indigo-300',
      'Security': 'bg-pink-500/20 text-pink-300',
      'Audit': 'bg-orange-500/20 text-orange-300',
      'Access Control': 'bg-teal-500/20 text-teal-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryMap[category]}`}>{category}</span>;
  };


const Console: React.FC = () => {
  const { can } = useAuth();
  const [logs, setLogs] = useState<ConsoleLog[]>(MOCK_CONSOLE_LOGS);
  const [filterLevel, setFilterLevel] = useState<ConsoleLogLevel | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<ConsoleLogCategory | 'ALL'>('ALL');
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
      const levelMatch = filterLevel === 'ALL' || log.level === filterLevel;
      const categoryMatch = filterCategory === 'ALL' || log.category === filterCategory;
      return levelMatch && categoryMatch;
  });

  const handleClearLogs = () => {
      setLogs([]);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `platform_logs_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Console</h1>
          <p className="text-brand-muted">Real-time stream of all application activity.</p>
        </div>
      </div>
      
      <Card className="flex-grow flex flex-col p-0">
        <div className="flex items-center justify-between p-3 border-b border-brand-border">
            <div className="flex items-center gap-4">
                <Filter size={18} className="text-brand-muted" />
                <div>
                    <label htmlFor="filter-level" className="sr-only">Filter by Level</label>
                    <select id="filter-level" value={filterLevel} onChange={e => setFilterLevel(e.target.value as any)} className="bg-brand-secondary border border-brand-border rounded-md px-3 py-1.5 text-sm text-white focus:ring-brand-accent focus:border-brand-accent">
                        <option value="ALL">All Levels</option>
                        <option value="INFO">INFO</option>
                        <option value="WARN">WARN</option>
                        <option value="ERROR">ERROR</option>
                        <option value="SUCCESS">SUCCESS</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
                    <select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)} className="bg-brand-secondary border border-brand-border rounded-md px-3 py-1.5 text-sm text-white focus:ring-brand-accent focus:border-brand-accent">
                        <option value="ALL">All Categories</option>
                        <option value="System Event">System Event</option>
                        <option value="User Action">User Action</option>
                        <option value="API Call">API Call</option>
                        <option value="Security">Security</option>
                        <option value="Audit">Audit</option>
                        <option value="Access Control">Access Control</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Tooltip text="Clear Logs">
                    <button onClick={handleClearLogs} className="p-2 text-brand-muted hover:text-brand-danger hover:bg-brand-border rounded-md transition-colors">
                        <Trash2 size={18} />
                    </button>
                </Tooltip>
                {can('export_console_logs') && (
                    <Tooltip text="Export Logs">
                        <button onClick={handleExportLogs} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-md transition-colors">
                            <Download size={18} />
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
        <div ref={logContainerRef} className="flex-grow p-4 overflow-y-auto bg-brand-primary/50">
            <div className="font-mono text-sm space-y-2">
                {filteredLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3">
                        <span className="text-brand-muted">{log.timestamp}</span>
                        <LogLevelPill level={log.level} />
                        <LogCategoryPill category={log.category} />
                        <span className="flex-1 text-gray-300">
                           {log.user && <span className="text-purple-400 font-semibold mr-2">[{log.user}]</span>}
                           {log.message}
                        </span>
                    </div>
                ))}
                 {filteredLogs.length === 0 && (
                    <div className="text-center text-brand-muted pt-8">No logs match the current filters.</div>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Console;
