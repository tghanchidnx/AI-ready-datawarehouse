import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { MOCK_RELATIONSHIP_CONFIGS, MOCK_DEMO_DATA_SOURCES, MOCK_DB_CONNECTIONS } from '../../constants';
import type { RelationshipConfig } from '../../types';
import { PlusCircle, Sliders, Play, Loader, Edit, X, Check } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const emptyConfig: Omit<RelationshipConfig, 'id' | 'lastRun'> = {
    name: '',
    sources: [],
    method: 'Column Name Similarity',
    parameters: {
        similarityThreshold: 0.85,
    },
};

const DISCOVERY_METHOD_DESCRIPTIONS: Record<RelationshipConfig['method'], string> = {
    'Column Name Similarity': 'Identifies relationships by comparing column names across tables using fuzzy string matching. Good for finding quick, obvious links.',
    'Foreign Key Analysis': 'Analyzes declared foreign key constraints in the database schema. Highly accurate but limited to well-defined schemas.',
    'Content-based Correlation': 'Scans and correlates the actual data within columns to find content overlap. Most powerful but computationally intensive.',
};

const userConfiguredSources = MOCK_DB_CONNECTIONS.filter(c => c.status === 'Connected').map(conn => ({
    id: conn.id,
    name: conn.name,
}));

const allAvailableSources = [...userConfiguredSources, ...MOCK_DEMO_DATA_SOURCES];

const RelationshipDiscovery: React.FC = () => {
    const [configs, setConfigs] = useState<RelationshipConfig[]>(MOCK_RELATIONSHIP_CONFIGS);
    const [selectedConfig, setSelectedConfig] = useState<RelationshipConfig | null>(configs[0] || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newConfig, setNewConfig] = useState(emptyConfig);
    const [runningDiscovery, setRunningDiscovery] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedConfig, setEditedConfig] = useState<RelationshipConfig | null>(null);
    
    const handleSelectConfig = (config: RelationshipConfig) => {
        setSelectedConfig(config);
        setIsEditing(false); // Exit edit mode when switching configs
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'sources') {
            const options = (e.target as HTMLSelectElement).options;
            const selectedSources = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selectedSources.push(options[i].value);
                }
            }
            setNewConfig(prev => ({ ...prev, sources: selectedSources }));
        } else {
             setNewConfig(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editedConfig) return;
        const { name, value } = e.target;
        setEditedConfig(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        const createdConfig: RelationshipConfig = {
            id: `rc-${String(configs.length + 1).padStart(3, '0')}`,
            lastRun: 'Never',
            ...newConfig,
        };
        setConfigs(prev => [createdConfig, ...prev]);
        setIsModalOpen(false);
        setNewConfig(emptyConfig);
    };
    
    const handleStartEditing = () => {
        setEditedConfig(selectedConfig);
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setEditedConfig(null);
        setIsEditing(false);
    };

    const handleSaveChanges = () => {
        if (!editedConfig) return;
        setConfigs(prev => prev.map(c => c.id === editedConfig.id ? editedConfig : c));
        setSelectedConfig(editedConfig);
        setIsEditing(false);
        setEditedConfig(null);
    };

    const handleRunDiscovery = (id: string) => {
        setRunningDiscovery(id);
        setTimeout(() => {
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
            const updateLastRun = (prev: RelationshipConfig[]) => prev.map(c => c.id === id ? { ...c, lastRun: timestamp } : c);
            setConfigs(updateLastRun);
            if (selectedConfig?.id === id) {
                setSelectedConfig(prev => prev ? { ...prev, lastRun: timestamp } : null);
            }
            setRunningDiscovery(null);
        }, 3000);
    };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-1 flex flex-col">
        <Card className="flex-grow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Discovery Configurations</h2>
                <Tooltip text="New Configuration">
                    <button onClick={() => setIsModalOpen(true)} className="p-2 text-brand-muted hover:text-brand-accent transition-colors">
                        <PlusCircle size={22} />
                    </button>
                </Tooltip>
            </div>
            <ul className="space-y-2">
                {configs.map(config => (
                    <li key={config.id}>
                        <button 
                            onClick={() => handleSelectConfig(config)}
                            className={`w-full text-left p-3 rounded-md transition-colors flex items-center space-x-4 ${selectedConfig?.id === config.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}
                        >
                            <div>
                                <p className={`font-semibold ${selectedConfig?.id === config.id ? 'text-brand-accent' : 'text-gray-200'}`}>{config.name}</p>
                                <p className="text-sm text-brand-muted">{config.sources.length} source(s)</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedConfig ? (
            <Card className="h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                        {isEditing && editedConfig ? (
                             <input type="text" name="name" value={editedConfig.name} onChange={handleEditFormChange} className="text-2xl font-bold bg-brand-primary border-b-2 border-brand-accent text-white w-full" />
                        ) : (
                            <h3 className="text-2xl font-bold text-white">{selectedConfig.name}</h3>
                        )}
                        <p className="text-brand-muted">Last Run: {selectedConfig.lastRun}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Tooltip text="Cancel">
                                    <button onClick={handleCancelEditing} className="p-2 text-brand-muted hover:text-white"><X size={18}/></button>
                                </Tooltip>
                                <Tooltip text="Save Changes">
                                    <button onClick={handleSaveChanges} className="p-2 text-brand-success hover:text-white"><Check size={18}/></button>
                                </Tooltip>
                            </>
                        ) : (
                             <Tooltip text="Edit">
                                <button onClick={handleStartEditing} className="p-2 text-brand-muted hover:text-brand-accent"><Edit size={18}/></button>
                            </Tooltip>
                        )}
                        <button 
                            onClick={() => handleRunDiscovery(selectedConfig.id)}
                            disabled={runningDiscovery !== null || isEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-success text-white rounded-lg hover:bg-green-500 transition-colors font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {runningDiscovery === selectedConfig.id ? (
                                <Loader size={18} className="animate-spin" />
                            ) : (
                                <Play size={18} />
                            )}
                            <span>{runningDiscovery === selectedConfig.id ? 'Running...' : 'Run Discovery'}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-200 mb-2">Target Data Sources</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedConfig.sources.map(sourceId => {
                                const source = allAvailableSources.find(ds => ds.id === sourceId);
                                return source ? (
                                    <span key={sourceId} className="px-3 py-1 bg-brand-primary border border-brand-border rounded-full text-sm text-gray-300">
                                        {source.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>

                    <div>
                      <h4 className="flex items-center space-x-2 text-lg font-semibold text-brand-accent mb-3">
                          <Sliders size={20}/>
                          <span>Algorithm Configuration</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                            <label htmlFor="method" className="block text-sm font-medium text-brand-muted mb-1">Discovery Method</label>
                            <select id="method" name="method" value={isEditing && editedConfig ? editedConfig.method : selectedConfig.method} disabled={!isEditing} onChange={handleEditFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent disabled:opacity-70 disabled:cursor-not-allowed">
                                {Object.keys(DISCOVERY_METHOD_DESCRIPTIONS).map(method => (
                                    <option key={method}>{method}</option>
                                ))}
                            </select>
                            {isEditing && editedConfig && (
                                <p className="text-xs text-brand-muted mt-2">{DISCOVERY_METHOD_DESCRIPTIONS[editedConfig.method]}</p>
                            )}
                        </div>
                        
                        {(isEditing ? editedConfig?.method : selectedConfig.method) === 'Column Name Similarity' && (
                            <div>
                                <label htmlFor="threshold" className="block text-sm font-medium text-brand-muted mb-1">Similarity Threshold</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" id="threshold" min="0.5" max="1.0" step="0.05" defaultValue={selectedConfig.parameters.similarityThreshold} disabled={!isEditing} className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" />
                                    <span className="font-mono text-white">{selectedConfig.parameters.similarityThreshold}</span>
                                </div>
                            </div>
                        )}
                      </div>
                  </div>
                </div>

            </Card>
        ) : (
            <Card className="h-full flex items-center justify-center">
                <p className="text-brand-muted">Select a configuration to view details.</p>
            </Card>
        )}
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Discovery Configuration">
        <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-muted mb-1">Configuration Name</label>
                <input type="text" name="name" id="name" value={newConfig.name} onChange={handleFormChange} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="e.g., Cross-departmental User Analysis" />
            </div>
            <div>
                <label htmlFor="sources" className="block text-sm font-medium text-brand-muted mb-1">Data Sources (select multiple)</label>
                <select name="sources" id="sources" value={newConfig.sources} onChange={handleFormChange} multiple required className="w-full h-32 bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                    {allAvailableSources.map(ds => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="method" className="block text-sm font-medium text-brand-muted mb-1">Discovery Method</label>
                <select name="method" id="method" value={newConfig.method} onChange={handleFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">
                    {Object.keys(DISCOVERY_METHOD_DESCRIPTIONS).map(method => (
                        <option key={method}>{method}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">Save Configuration</button>
            </div>
        </form>
    </Modal>
    </>
  );
};

export default RelationshipDiscovery;