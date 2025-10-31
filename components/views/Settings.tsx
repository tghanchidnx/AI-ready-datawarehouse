
import React, { useState } from 'react';
import Card from '../common/Card';
import ToggleSwitch from '../common/ToggleSwitch';
import Modal from '../common/Modal';
import Tooltip from '../common/Tooltip';
import WorkflowEditor from './WorkflowEditor';
import { MOCK_ENVIRONMENTS, MOCK_DB_CONNECTIONS, DB_CONNECTION_METADATA, MOCK_ROLES, MOCK_PERMISSIONS, MOCK_ACCESS_REVIEWS, MOCK_VENDORS, MOCK_DR_PLAN, MOCK_LLM_PROVIDER_CONFIGS, MOCK_AGENT_CONFIGS, MOCK_WORKFLOWS, MOCK_USERS, MOCK_AUTH_SETTINGS } from '../../constants';
import type { EnvironmentConfig, DatabaseConnection, Role, Permission, AccessReview, Vendor, LLMProviderConfig, AgentConfig, LLMProviderType, Workflow, SettingsTab, User, AuthSettings, PermissionId, SSOProvider } from '../../types';
import { DatabaseConnectionType } from '../../types';
import { PlusCircle, Edit, Trash2, Plug, BookOpen, Youtube, ShieldCheck, FileClock, Users as UsersIcon, KeyRound, CloudCog, Bot, BrainCircuit, Settings as SettingsIcon, Database as DatabaseIcon, Shield as ShieldIcon, Lock, Landmark, Projector, UserPlus, Fingerprint } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { groupBy } from 'lodash';

const emptyConnection: Omit<DatabaseConnection, 'id' | 'status'> = {
    name: '', type: DatabaseConnectionType.Neo4j, host: '', port: 0, username: '', password: '', token: '', account: '', warehouse: '', database: '', schema: '', httpPath: '', server: '',
};

const emptyLlmProvider: Omit<LLMProviderConfig, 'id'> = { name: '', provider: 'Gemini', apiKey: '' };
const emptyAgent: Omit<AgentConfig, 'id'> = { name: '', description: '', llmProviderConfigId: null };
const emptyUser: Omit<User, 'id' | 'lastLogin' | 'avatarUrl'> = { name: '', email: '', roleId: MOCK_ROLES.find(r => r.name === 'Business Analyst')?.id || '' };

const Settings: React.FC = () => {
  const { can } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Agents');
  const [activeUsersTab, setActiveUsersTab] = useState<'Users' | 'Roles'>('Users');
  
  // General Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true, inAppNotifications: true, pipelineFailure: true, schemaChange: true, resourceUsage: false, resourceThreshold: 90, logRetention: '90',
  });
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>(MOCK_ENVIRONMENTS);

  // Agent Settings State
  const [llmProviders, setLlmProviders] = useState<LLMProviderConfig[]>(MOCK_LLM_PROVIDER_CONFIGS);
  const [agents, setAgents] = useState<AgentConfig[]>(MOCK_AGENT_CONFIGS);
  const [isLlmModalOpen, setIsLlmModalOpen] = useState(false);
  const [editingLlm, setEditingLlm] = useState<LLMProviderConfig | null>(null);
  const [llmForm, setLlmForm] = useState(emptyLlmProvider);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [agentForm, setAgentForm] = useState(emptyAgent);

  // Workflow Settings State
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0] || null);

  // Connection Settings State
  const [dbConnections, setDbConnections] = useState<DatabaseConnection[]>(MOCK_DB_CONNECTIONS);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<DatabaseConnection | null>(null);
  const [connectionForm, setConnectionForm] = useState<Omit<DatabaseConnection, 'id' | 'status'>>(emptyConnection);
  
  // Users & Roles State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState(emptyUser);
  
  // Authentication State
  const [authSettings, setAuthSettings] = useState<AuthSettings>(MOCK_AUTH_SETTINGS);

  // Compliance State
  const [complianceSettings, setComplianceSettings] = useState({
    soxStrictChangeControl: true, soxEnableAuditTrail: true, soxSiemEndpoint: 'https://splunk.corp.internal:8088/services/collector', soc2MfaRequired: true, soc2SessionTimeout: 30,
  });
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>(MOCK_ACCESS_REVIEWS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);

  const tabs: { name: SettingsTab, icon: React.ReactNode, permission: PermissionId }[] = [
    { name: 'General', icon: <SettingsIcon size={18} />, permission: 'view_settings_general' },
    { name: 'Agents', icon: <BrainCircuit size={18} />, permission: 'view_settings_agents' },
    { name: 'Workflows', icon: <Projector size={18} />, permission: 'view_settings_workflows' },
    { name: 'Connections', icon: <DatabaseIcon size={18} />, permission: 'view_settings_connections' },
    { name: 'Users & Roles', icon: <UsersIcon size={18} />, permission: 'view_settings_users' },
    { name: 'Authentication', icon: <Fingerprint size={18} />, permission: 'view_settings_authentication' },
    { name: 'Compliance', icon: <Landmark size={18} />, permission: 'view_settings_compliance' },
  ];
  const visibleTabs = tabs.filter(tab => can(tab.permission));

  // Generic Handlers
  const handleToggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const isNumber = e.target.type === 'number';
      setSettings(prev => ({...prev, [name]: isNumber ? parseInt(value) : value}));
  };

  // Agent Tab Handlers
  const handleOpenLlmModal = (llm: LLMProviderConfig | null) => {
    setEditingLlm(llm);
    setLlmForm(llm ? { ...llm } : emptyLlmProvider);
    setIsLlmModalOpen(true);
  };
  const handleSaveLlm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLlm) {
      setLlmProviders(prev => prev.map(p => p.id === editingLlm.id ? { ...p, ...llmForm } : p));
    } else {
      setLlmProviders(prev => [...prev, { id: `llm-p-${Date.now()}`, ...llmForm }]);
    }
    setIsLlmModalOpen(false);
  };
  const handleDeleteLlm = (id: string) => {
    setLlmProviders(prev => prev.filter(p => p.id !== id));
    setAgents(prev => prev.map(a => a.llmProviderConfigId === id ? { ...a, llmProviderConfigId: null } : a));
  };
  const handleAgentChange = (agentId: string, field: keyof AgentConfig, value: any) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, [field]: value } : a));
  };
  const handleOpenAgentModal = (agent: AgentConfig | null) => {
      setEditingAgent(agent);
      setAgentForm(agent ? { ...agent } : emptyAgent);
      setIsAgentModalOpen(true);
  };
   const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...a, ...agentForm } : a));
    } else {
      setAgents(prev => [...prev, { id: `agent-${Date.now()}`, ...agentForm }]);
    }
    setIsAgentModalOpen(false);
  };
  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };
  
  // Workflow handlers
  const handleWorkflowUpdate = (updatedWorkflow: Workflow) => {
      setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
      setSelectedWorkflow(updatedWorkflow);
  };

  const handleCreateNewWorkflow = () => {
    const newWorkflow: Workflow = {
        id: `wf-${Date.now()}`,
        name: 'New Untitled Workflow',
        nodes: [
             { id: 'start', type: 'Start', position: { x: 50, y: 150 }, data: { label: 'Start' } },
             { id: 'end', type: 'End', position: { x: 650, y: 150 }, data: { label: 'End' } },
        ],
        edges: [],
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };

  // Connection Tab Handlers
  const handleOpenDbModal = (conn: DatabaseConnection | null) => {
    setEditingConnection(conn);
    if (conn) {
      setConnectionForm({ ...emptyConnection, ...conn });
    } else {
      const defaultType = DatabaseConnectionType.Neo4j;
      const initialPort = DB_CONNECTION_METADATA[defaultType].fields.find(f => f.name === 'port')?.placeholder;
      setConnectionForm({ ...emptyConnection, type: defaultType, port: initialPort ? parseInt(initialPort) : 0 });
    }
    setIsDbModalOpen(true);
  };
  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConnection) {
        setDbConnections(prev => prev.map(c => c.id === editingConnection.id ? { ...c, ...connectionForm } : c));
    } else {
        setDbConnections(prev => [...prev, { id: `conn-${Date.now()}`, status: 'Disconnected', ...connectionForm }]);
    }
    setIsDbModalOpen(false);
  };
  const handleDeleteConnection = (id: string) => setDbConnections(prev => prev.filter(c => c.id !== id));
  const handleTestConnection = (id: string) => {
    setDbConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'Testing...' } : c));
    setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        setDbConnections(prev => prev.map(c => c.id === id ? { ...c, status: success ? 'Connected' : 'Disconnected' } : c));
    }, 1500);
  };
  const handleConnectionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      const newType = value as DatabaseConnectionType;
      const newPort = DB_CONNECTION_METADATA[newType].fields.find(f => f.name === 'port')?.placeholder;
      setConnectionForm({ ...emptyConnection, name: connectionForm.name, type: newType, port: newPort ? parseInt(newPort) : undefined });
    } else {
       const fieldMeta = DB_CONNECTION_METADATA[connectionForm.type].fields.find(f => f.name === name);
       setConnectionForm(prev => ({ ...prev, [name]: fieldMeta?.type === 'number' ? parseInt(value, 10) || 0 : value }));
    }
  };

  // Users & Roles Handlers
  const handleOpenUserModal = (user: User | null) => {
    setEditingUser(user);
    setUserForm(user ? { name: user.name, email: user.email, roleId: user.roleId } : emptyUser);
    setIsUserModalOpen(true);
  };
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
    } else {
        const newUser: User = {
            id: `user-${Date.now()}`,
            lastLogin: 'Never',
            avatarUrl: `https://i.pravatar.cc/40?u=user-${Date.now()}`,
            ...userForm
        };
        setUsers(prev => [...prev, newUser]);
    }
    setIsUserModalOpen(false);
  };
  const handleDeleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const handlePermissionChange = (roleId: string, permissionId: PermissionId, checked: boolean) => {
    setRoles(prevRoles => prevRoles.map(role => {
        if (role.id === roleId) {
            const newPermissions = checked ? [...role.permissions, permissionId] : role.permissions.filter(p => p !== permissionId);
            return { ...role, permissions: newPermissions };
        }
        return role;
    }));
  };
  const groupedPermissions = groupBy(MOCK_PERMISSIONS, 'category');
  
  // Authentication Handlers
  const handleAuthSsoConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthSettings(prev => ({
      ...prev,
      ssoConfig: {
        ...prev.ssoConfig,
        [name]: value
      }
    }));
  };

  // Compliance Handlers
  const handleComplianceToggle = (key: keyof typeof complianceSettings) => setComplianceSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const handleComplianceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setComplianceSettings(prev => ({...prev, [name]: e.target.type === 'number' ? parseInt(value) : value}));
  }

  const StatusPill: React.FC<{ status: DatabaseConnection['status'] }> = ({ status }) => {
    const statusMap: Record<DatabaseConnection['status'], string> = { 'Connected': 'bg-green-500/20 text-green-300', 'Disconnected': 'bg-red-500/20 text-red-300', 'Testing...': 'bg-blue-500/20 text-blue-300 animate-pulse' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>{status}</span>;
  };
  
  const riskColorMap: Record<Vendor['risk'], string> = {
    High: 'bg-red-500/20 text-red-300',
    Medium: 'bg-yellow-500/20 text-yellow-300',
    Low: 'bg-blue-500/20 text-blue-300',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex border-b border-brand-border overflow-x-auto">
        {visibleTabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.name
                ? 'border-b-2 border-brand-accent text-brand-accent'
                : 'border-b-2 border-transparent text-brand-muted hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {activeTab === 'General' && (<>
            <Card title="Notification Channels">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-primary rounded-md border border-brand-border">
                  <div><h4 className="font-semibold text-white">Email Notifications</h4><p className="text-sm text-brand-muted">Receive critical alerts and summaries via email.</p></div>
                  <ToggleSwitch checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-primary rounded-md border border-brand-border">
                  <div><h4 className="font-semibold text-white">In-App Notifications</h4><p className="text-sm text-brand-muted">Show notifications in the application header.</p></div>
                  <ToggleSwitch checked={settings.inAppNotifications} onChange={() => handleToggle('inAppNotifications')} />
                </div>
              </div>
            </Card>
            <Card title="Alert Rules">
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-brand-primary rounded-md border border-brand-border">
                    <div><h4 className="font-semibold text-white">Pipeline Failure</h4><p className="text-sm text-brand-muted">Notify when a data transformation pipeline fails.</p></div>
                    <ToggleSwitch checked={settings.pipelineFailure} onChange={() => handleToggle('pipelineFailure')} />
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-primary rounded-md border border-brand-border">
                    <div><h4 className="font-semibold text-white">Schema Change Detected</h4><p className="text-sm text-brand-muted">Notify when a change is detected in a source schema.</p></div>
                    <ToggleSwitch checked={settings.schemaChange} onChange={() => handleToggle('schemaChange')} />
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-primary rounded-md border border-brand-border">
                    <div><h4 className="font-semibold text-white">High Resource Usage</h4><p className="text-sm text-brand-muted">Notify when cluster resource usage exceeds a threshold.</p></div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input type="number" value={settings.resourceThreshold} onChange={(e) => setSettings(p => ({...p, resourceThreshold: parseInt(e.target.value)}))} disabled={!settings.resourceUsage} className="w-20 bg-brand-secondary border border-brand-border rounded-md px-2 py-1 text-white disabled:opacity-50" />
                            <span className="text-brand-muted">%</span>
                        </div>
                        <ToggleSwitch checked={settings.resourceUsage} onChange={() => handleToggle('resourceUsage')} />
                    </div>
                </div>
              </div>
            </Card>
            <Card title="Log Management">
                <div className="p-4 bg-brand-primary rounded-md border border-brand-border">
                    <div className="flex items-center justify-between">
                         <div><h4 className="font-semibold text-white">Log Retention Period</h4><p className="text-sm text-brand-muted">Duration to store system console logs before purging.</p></div>
                          <select name="logRetention" value={settings.logRetention} onChange={handleSettingChange} className="bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent">
                              <option value="30">30 Days</option><option value="90">90 Days</option><option value="180">180 Days</option><option value="365">1 Year</option><option value="-1">Indefinite</option>
                          </select>
                    </div>
                </div>
            </Card>
             <Card title="Environment Configuration">
              <div className="space-y-4">{environments.map((env) => (<div key={env.name} className="p-4 bg-brand-primary rounded-md border border-brand-border"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${env.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{env.name}</span><input type="text" value={env.url} readOnly className="w-64 bg-brand-secondary border border-brand-border rounded-md px-3 py-1 text-sm text-gray-400" /></div><button className="text-sm text-brand-accent hover:underline">Configure</button></div></div>))}</div>
            </Card>
        </>)}

        {activeTab === 'Agents' && (<>
            <Card title="LLM Provider Configurations">
              <div className="flex justify-end mb-4">
                {can('manage_settings_agents') && <button onClick={() => handleOpenLlmModal(null)} className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"><PlusCircle size={18} /><span>Add Provider</span></button>}
                </div>
              <div className="space-y-3">
                {llmProviders.map(llm => (
                  <div key={llm.id} className="p-4 bg-brand-primary rounded-md border border-brand-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <KeyRound size={20} className="text-brand-accent"/>
                      <div><p className="font-semibold text-white">{llm.name}</p><p className="text-sm text-brand-muted">{llm.provider}</p></div>
                    </div>
                    {can('manage_settings_agents') && <div className="flex items-center gap-2">
                        <Tooltip text="Edit"><button onClick={() => handleOpenLlmModal(llm)} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-full transition-colors"><Edit size={18} /></button></Tooltip>
                        <Tooltip text="Delete"><button onClick={() => handleDeleteLlm(llm.id)} className="p-2 text-brand-muted hover:text-brand-danger hover:bg-brand-border rounded-full transition-colors"><Trash2 size={18} /></button></Tooltip>
                    </div>}
                  </div>))}
              </div>
            </Card>

            <Card title="Agent Configurations">
              <div className="flex justify-end mb-4">{can('manage_settings_agents') && <button onClick={() => handleOpenAgentModal(null)} className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"><PlusCircle size={18} /><span>Add New Agent</span></button>}</div>
                <div className="space-y-4">
                    {agents.map(agent => (
                        <div key={agent.id} className="p-4 bg-brand-primary rounded-md border border-brand-border">
                            <div className="flex justify-between items-start">
                                <div><h5 className="font-semibold text-white flex items-center gap-2"><Bot size={18}/>{agent.name}</h5></div>
                                {can('manage_settings_agents') && <div className="flex items-center gap-2">
                                     <Tooltip text="Edit"><button onClick={() => handleOpenAgentModal(agent)} className="p-1 text-brand-muted hover:text-brand-accent"><Edit size={16} /></button></Tooltip>
                                     <Tooltip text="Delete"><button onClick={() => handleDeleteAgent(agent.id)} className="p-1 text-brand-muted hover:text-brand-danger"><Trash2 size={16} /></button></Tooltip>
                                </div>}
                            </div>
                            <p className="text-sm text-brand-muted mt-1 mb-3">{agent.description}</p>
                            <div className="max-w-xs">
                                <label className="block text-xs font-medium text-brand-muted mb-1">Assigned LLM Provider</label>
                                <select value={agent.llmProviderConfigId || ''} onChange={e => handleAgentChange(agent.id, 'llmProviderConfigId', e.target.value || null)} disabled={!can('manage_settings_agents')} className="w-full bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-sm text-white focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50">
                                    <option value="">None</option>
                                    {llmProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </>)}
        
        {activeTab === 'Workflows' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[75vh]">
                <Card className="md:col-span-1 flex flex-col p-0">
                    <div className="p-4 border-b border-brand-border">
                        <h3 className="font-semibold text-white">Saved Workflows</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <ul className="space-y-1 p-2">
                           {workflows.map(wf => (
                               <li key={wf.id}>
                                   <button 
                                       onClick={() => setSelectedWorkflow(wf)}
                                       className={`w-full text-left p-2 rounded-md transition-colors ${selectedWorkflow?.id === wf.id ? 'bg-brand-accent/20 text-brand-accent' : 'hover:bg-brand-border'}`}
                                    >
                                       {wf.name}
                                   </button>
                               </li>
                           ))}
                        </ul>
                    </div>
                    {can('manage_settings_workflows') && <div className="p-2 border-t border-brand-border">
                        <button onClick={handleCreateNewWorkflow} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold">
                            <PlusCircle size={18} />
                            <span>New Workflow</span>
                        </button>
                    </div>}
                </Card>
                <div className="md:col-span-3 h-full">
                    {selectedWorkflow ? (
                         <WorkflowEditor 
                            key={selectedWorkflow.id}
                            workflow={selectedWorkflow}
                            agents={agents}
                            onUpdate={handleWorkflowUpdate} 
                        />
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <p className="text-brand-muted">Select a workflow or create a new one.</p>
                        </Card>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'Connections' && (<>
            <Card title="Database Connections">
                <div className="flex justify-end mb-4">{can('manage_settings_connections') && <button onClick={() => handleOpenDbModal(null)} className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"><PlusCircle size={18} /><span>Add New Connection</span></button>}</div>
                <div className="space-y-3">
                {dbConnections.map(conn => (<div key={conn.id} className="p-4 bg-brand-primary rounded-md border border-brand-border"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><StatusPill status={conn.status} /><div><p className="font-semibold text-white">{conn.name}</p><p className="text-sm text-brand-muted">{conn.type} &bull; {conn.host || conn.account || conn.server || 'Configured'}</p></div></div>{can('manage_settings_connections') && <div className="flex items-center gap-2"><Tooltip text="Test Connection"><button onClick={() => handleTestConnection(conn.id)} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-full transition-colors"><Plug size={18} /></button></Tooltip><Tooltip text="Edit"><button onClick={() => handleOpenDbModal(conn)} className="p-2 text-brand-muted hover:text-brand-accent hover:bg-brand-border rounded-full transition-colors"><Edit size={18} /></button></Tooltip><Tooltip text="Delete"><button onClick={() => handleDeleteConnection(conn.id)} className="p-2 text-brand-muted hover:text-brand-danger hover:bg-brand-border rounded-full transition-colors"><Trash2 size={18} /></button></Tooltip></div>}</div></div>))}
                </div>
            </Card>
        </>)}

        {activeTab === 'Users & Roles' && (
          <>
            <div className="flex border-b border-brand-border">
              <button onClick={() => setActiveUsersTab('Users')} className={`px-4 py-2 text-sm font-medium ${activeUsersTab === 'Users' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted'}`}>Users</button>
              <button onClick={() => setActiveUsersTab('Roles')} className={`px-4 py-2 text-sm font-medium ${activeUsersTab === 'Roles' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted'}`}>Roles & Permissions</button>
            </div>
            {activeUsersTab === 'Users' && (
              <Card title="User Management">
                 <div className="flex justify-end mb-4">{can('manage_settings_users') && <button onClick={() => handleOpenUserModal(null)} className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-accent text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"><UserPlus size={18} /><span>Invite User</span></button>}</div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead><tr><th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">User</th><th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Role</th><th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Last Login</th><th className="py-2 text-left text-xs font-medium text-brand-muted uppercase">Actions</th></tr></thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b border-brand-border">
                            <td className="py-3"><div className="flex items-center gap-3"><img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" /><div><p className="font-semibold text-white">{user.name}</p><p className="text-sm text-brand-muted">{user.email}</p></div></div></td>
                            <td className="py-3 text-sm text-gray-300">{roles.find(r => r.id === user.roleId)?.name}</td>
                            <td className="py-3 text-sm text-gray-300">{user.lastLogin}</td>
                            <td className="py-3">{can('manage_settings_users') && <div className="flex items-center gap-2"><Tooltip text="Edit"><button onClick={() => handleOpenUserModal(user)} className="p-2 text-brand-muted hover:text-brand-accent"><Edit size={16}/></button></Tooltip><Tooltip text="Delete"><button onClick={() => handleDeleteUser(user.id)} className="p-2 text-brand-muted hover:text-brand-danger"><Trash2 size={16}/></button></Tooltip></div>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </Card>
            )}
            {activeUsersTab === 'Roles' && (
              <Card title="Role-Based Access Control (RBAC)">
                <div className="space-y-6">{roles.map(role => (<div key={role.id} className="p-4 bg-brand-primary rounded-md border border-brand-border"><h5 className="font-semibold text-white">{role.name}</h5><p className="text-sm text-brand-muted mb-4">{role.description}</p>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h6 className="text-sm font-semibold text-brand-accent mb-2">{category}</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">{permissions.map(permission => (<label key={permission.id} className="flex items-center space-x-2"><input type="checkbox" className="h-4 w-4 rounded bg-brand-secondary border-brand-border text-brand-accent focus:ring-brand-accent disabled:opacity-50" checked={role.permissions.includes(permission.id)} onChange={(e) => handlePermissionChange(role.id, permission.id, e.target.checked)} disabled={!can('manage_settings_users')} /><Tooltip text={permission.description} position="right"><span className="text-sm text-gray-300 cursor-help">{permission.name}</span></Tooltip></label>))}</div>
                    </div>
                  ))}
                </div>
                </div>))}</div>
              </Card>
            )}
          </>
        )}
        
        {activeTab === 'Authentication' && (
          <Card title="Authentication Method">
            <div className="p-4 bg-brand-primary rounded-md border border-brand-border">
              <div className="flex items-start justify-between">
                <div><h4 className="font-semibold text-white">Enable Single Sign-On (SSO)</h4><p className="text-sm text-brand-muted max-w-md">Allow users to log in using a third-party identity provider. When enabled, username/password login will be disabled.</p></div>
                <ToggleSwitch checked={authSettings.isSsoEnabled} onChange={(checked) => setAuthSettings(p => ({...p, isSsoEnabled: checked}))} />
              </div>
              {authSettings.isSsoEnabled && (
                <div className="mt-6 pt-4 border-t border-brand-border space-y-4">
                  <div>
                    <label htmlFor="ssoProvider" className="block text-sm font-medium text-brand-muted mb-1">SSO Provider</label>
                    <select id="ssoProvider" name="ssoProvider" value={authSettings.ssoProvider || ''} onChange={(e) => setAuthSettings(p => ({...p, ssoProvider: e.target.value as SSOProvider}))} className="w-full max-w-xs bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white">
                      <option>Google</option><option>Okta</option><option>AzureAD</option><option>ADFS/SAML</option>
                    </select>
                  </div>
                  {authSettings.ssoProvider === 'Okta' && <div><label htmlFor="domain" className="block text-sm font-medium text-brand-muted mb-1">Okta Domain</label><input type="text" name="domain" value={authSettings.ssoConfig.domain || ''} onChange={handleAuthSsoConfigChange} className="w-full bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="your-org.okta.com" /></div>}
                  {authSettings.ssoProvider === 'AzureAD' && <div><label htmlFor="clientId" className="block text-sm font-medium text-brand-muted mb-1">Client ID</label><input type="text" name="clientId" value={authSettings.ssoConfig.clientId || ''} onChange={handleAuthSsoConfigChange} className="w-full bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="Enter Client ID" /></div>}
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'Compliance' && (<>
            <Card title="SOC 2 Compliance Controls">
                <div className="space-y-6">
                    <div><h4 className="flex items-center gap-2 text-lg font-semibold text-brand-accent mb-3"><ShieldCheck size={20}/><span>Access Control Policies</span></h4><div className="p-4 bg-brand-primary rounded-md border border-brand-border space-y-4"><div className="flex items-start justify-between"><div><h4 className="font-semibold text-white">Enforce Multi-Factor Authentication (MFA)</h4><p className="text-sm text-brand-muted max-w-md">Requires all users to configure and use a second factor for authentication.</p></div><ToggleSwitch checked={complianceSettings.soc2MfaRequired} onChange={() => handleComplianceToggle('soc2MfaRequired')} /></div><div className="flex items-center justify-between"><div><h4 className="font-semibold text-white">User Session Timeout</h4><p className="text-sm text-brand-muted">Automatically log out users after a period of inactivity.</p></div><div className="flex items-center gap-2"><input type="number" name="soc2SessionTimeout" value={complianceSettings.soc2SessionTimeout} onChange={handleComplianceChange} className="w-20 bg-brand-secondary border border-brand-border rounded-md px-2 py-1 text-white" /><span className="text-brand-muted text-sm">minutes</span></div></div></div></div>
                    <div><h4 className="flex items-center gap-2 text-lg font-semibold text-brand-accent mb-3"><UsersIcon size={20}/><span>Vendor Risk Management</span></h4><div className="p-4 bg-brand-primary rounded-md border border-brand-border"><table className="w-full text-sm text-left"><thead className="text-xs text-brand-muted uppercase"><tr><th className="py-2">Vendor</th><th className="py-2">Risk</th><th className="py-2">Next Review</th><th className="py-2">Status</th></tr></thead><tbody>{vendors.map(vendor => (<tr key={vendor.id} className="border-t border-brand-border"><td className="py-2 font-semibold text-white">{vendor.name} <span className="font-normal text-brand-muted">({vendor.service})</span></td><td className="py-2"><span className={`px-2 py-0.5 text-xs rounded-full ${riskColorMap[vendor.risk]}`}>{vendor.risk}</span></td><td className="py-2 text-gray-300">{vendor.nextReview}</td><td className="py-2"><span className={`px-2 py-0.5 text-xs rounded-full ${vendor.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{vendor.status}</span></td></tr>))}</tbody></table></div></div>
                    <div><h4 className="flex items-center gap-2 text-lg font-semibold text-brand-accent mb-3"><KeyRound size={20}/><span>Data Encryption & Key Management</span></h4><div className="p-4 bg-brand-primary rounded-md border border-brand-border space-y-3"><p className="text-sm text-gray-300">Data at Rest: <span className="font-semibold text-white">AES-256 Encryption (Enabled)</span></p><p className="text-sm text-gray-300">Data in Transit: <span className="font-semibold text-white">TLS 1.2+ (Enforced)</span></p><button className="text-sm text-brand-accent hover:underline">View Key Rotation Policy</button></div></div>
                    <div><h4 className="flex items-center gap-2 text-lg font-semibold text-brand-accent mb-3"><CloudCog size={20}/><span>Disaster Recovery Plan</span></h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="p-3 bg-brand-primary rounded-md border border-brand-border"><p className="text-xs text-brand-muted">Last Backup</p><p className="font-semibold text-white">{MOCK_DR_PLAN.lastFullBackup.split(' ')[0]}</p></div><div className="p-3 bg-brand-primary rounded-md border border-brand-border"><p className="text-xs text-brand-muted">Last DR Test</p><p className="font-semibold text-white">{MOCK_DR_PLAN.lastDrTestDate}</p></div><div className="p-3 bg-brand-primary rounded-md border border-brand-border"><p className="text-xs text-brand-muted">RPO</p><p className="font-semibold text-white">{MOCK_DR_PLAN.rpo}</p></div><div className="p-3 bg-brand-primary rounded-md border border-brand-border"><p className="text-xs text-brand-muted">RTO</p><p className="font-semibold text-white">{MOCK_DR_PLAN.rto}</p></div></div></div>
                </div>
            </Card>
            <Card title="SOX Compliance">
                <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 bg-brand-primary rounded-md border border-brand-border"><div><h4 className="font-semibold text-white">Enforce Strict Change Control</h4><p className="text-sm text-brand-muted max-w-md">Requires all changes to production environments to go through the full, multi-stage approval workflow. Blocks direct deployment.</p></div><ToggleSwitch checked={complianceSettings.soxStrictChangeControl} onChange={() => handleComplianceToggle('soxStrictChangeControl')} /></div>
                    <div><h4 className="flex items-center gap-2 text-lg font-semibold text-brand-accent mb-3"><FileClock size={20}/><span>Quarterly User Access Reviews</span></h4><div className="p-4 bg-brand-primary rounded-md border border-brand-border"><div className="flex justify-end mb-3"><button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-accent/80 text-white rounded-lg hover:bg-brand-accent transition-colors font-semibold"><PlusCircle size={16} /><span>Start New Review</span></button></div><div className="space-y-2">{accessReviews.map(review => (<div key={review.id} className="p-3 bg-brand-secondary rounded-md flex items-center justify-between"><div><p className="font-semibold text-white">{review.quarter} Access Review</p><p className="text-xs text-brand-muted">Due: {review.dueDate} &bull; Reviewer: {review.reviewer}</p></div><div className="flex items-center gap-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{review.status}</span><button className="text-sm text-brand-accent hover:underline">Details</button></div></div>))}</div></div></div>
                    <div><h4 className="text-lg font-semibold text-brand-accent mb-3">Audit Trail & SIEM Integration</h4><div className="p-4 bg-brand-primary rounded-md border border-brand-border space-y-4"><div className="flex items-start justify-between"><div><h4 className="font-semibold text-white">Enable Detailed Audit Trail</h4><p className="text-sm text-brand-muted max-w-md">Record all security-sensitive actions (e.g., permission changes, approvals) in the System Console under the 'Audit' category.</p></div><ToggleSwitch checked={complianceSettings.soxEnableAuditTrail} onChange={() => handleComplianceToggle('soxEnableAuditTrail')} /></div><div><label htmlFor="siem-endpoint" className="block text-sm font-medium text-brand-muted mb-1">SIEM Endpoint URL (e.g., Splunk HEC)</label><input type="text" name="soxSiemEndpoint" id="siem-endpoint" value={complianceSettings.soxSiemEndpoint} onChange={handleComplianceChange} className="w-full bg-brand-secondary border border-brand-border rounded-md px-3 py-2 text-white font-mono text-sm focus:ring-brand-accent focus:border-brand-accent" /></div></div></div>
                </div>
            </Card>
        </>)}
      </div>

      {/* Modals */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={editingUser ? 'Edit User' : 'Invite New User'}>
        <form onSubmit={handleSaveUser} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-brand-muted mb-1">Full Name</label><input type="text" id="name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/></div>
            <div><label htmlFor="email" className="block text-sm font-medium text-brand-muted mb-1">Email Address</label><input type="email" id="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/></div>
            <div><label htmlFor="roleId" className="block text-sm font-medium text-brand-muted mb-1">Role</label><select id="roleId" value={userForm.roleId} onChange={e => setUserForm({...userForm, roleId: e.target.value})} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white">{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">{editingUser ? 'Save Changes' : 'Send Invite'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={isDbModalOpen} onClose={() => setIsDbModalOpen(false)} title={editingConnection ? 'Edit Database Connection' : 'Add New Database Connection'}>
        <form onSubmit={handleSaveConnection} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="name" className="block text-sm font-medium text-brand-muted mb-1">Connection Name</label><input type="text" name="name" id="name" value={connectionForm.name} onChange={handleConnectionFormChange} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent" placeholder="e.g., Prod Knowledge Graph" /></div>
                <div><label htmlFor="type" className="block text-sm font-medium text-brand-muted mb-1">Database Type</label><select name="type" id="type" value={connectionForm.type} onChange={handleConnectionFormChange} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent">{Object.values(DatabaseConnectionType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {DB_CONNECTION_METADATA[connectionForm.type].fields.map(field => (<div key={field.name} className={DB_CONNECTION_METADATA[connectionForm.type].fields.length === 1 ? 'col-span-2' : ''}><label htmlFor={field.name} className="block text-sm font-medium text-brand-muted mb-1">{field.label}</label><input type={field.type} name={field.name} id={field.name} value={(connectionForm as any)[field.name] || ''} onChange={handleConnectionFormChange} required={field.required} placeholder={field.placeholder} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent" /></div>))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-brand-border mt-6">
                <div className="flex items-center gap-4"><a href={DB_CONNECTION_METADATA[connectionForm.type].docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-accent hover:underline"><BookOpen size={16} /><span>Read Docs</span></a><a href={DB_CONNECTION_METADATA[connectionForm.type].videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-accent hover:underline"><Youtube size={16} /><span>Watch Tutorial</span></a></div>
                <div className="flex justify-end space-x-3"><button type="button" onClick={() => setIsDbModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600 transition-colors">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 transition-colors font-semibold">Save Connection</button></div>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isLlmModalOpen} onClose={() => setIsLlmModalOpen(false)} title={editingLlm ? 'Edit LLM Provider' : 'Add LLM Provider'}>
        <form onSubmit={handleSaveLlm} className="space-y-4">
          <div><label htmlFor="llmName" className="block text-sm font-medium text-brand-muted mb-1">Configuration Name</label><input type="text" id="llmName" value={llmForm.name} onChange={e => setLlmForm({...llmForm, name: e.target.value})} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="e.g., Gemini Prod Key" /></div>
          <div><label htmlFor="llmProvider" className="block text-sm font-medium text-brand-muted mb-1">LLM Provider</label><select id="llmProvider" value={llmForm.provider} onChange={e => setLlmForm({...llmForm, provider: e.target.value as LLMProviderType})} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"><option>Gemini</option><option>Claude</option><option>OpenAI</option></select></div>
          <div><label htmlFor="llmApiKey" className="block text-sm font-medium text-brand-muted mb-1">API Key</label><input type="password" id="llmApiKey" value={llmForm.apiKey} onChange={e => setLlmForm({...llmForm, apiKey: e.target.value})} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white" placeholder="••••••••••••••••••••" /></div>
          <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={() => setIsLlmModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">{editingLlm ? 'Save Changes' : 'Add Provider'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={isAgentModalOpen} onClose={() => setIsAgentModalOpen(false)} title={editingAgent ? 'Edit Agent' : 'Add New Agent'}>
        <form onSubmit={handleSaveAgent} className="space-y-4">
          <div><label htmlFor="agentName" className="block text-sm font-medium text-brand-muted mb-1">Agent Name</label><input type="text" id="agentName" value={agentForm.name} onChange={e => setAgentForm({...agentForm, name: e.target.value})} required className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/></div>
          <div><label htmlFor="agentDescription" className="block text-sm font-medium text-brand-muted mb-1">Description / System Prompt</label><textarea id="agentDescription" value={agentForm.description} onChange={e => setAgentForm({...agentForm, description: e.target.value})} required rows={4} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"/></div>
          <div><label htmlFor="agentLlm" className="block text-sm font-medium text-brand-muted mb-1">Assigned LLM Provider</label><select id="agentLlm" value={agentForm.llmProviderConfigId || ''} onChange={e => setAgentForm({...agentForm, llmProviderConfigId: e.target.value || null})} className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white"><option value="">None</option>{llmProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={() => setIsAgentModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 font-semibold">{editingAgent ? 'Save Changes' : 'Add Agent'}</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
