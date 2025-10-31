export enum PipelineStatus {
    Running = 'Running',
    Completed = 'Completed',
    Failed = 'Failed',
    Scheduled = 'Scheduled',
}

export interface Pipeline {
    id: string;
    name: string;
    status: PipelineStatus;
    lastRun: string;
    nextRun: string;
    avgDuration: string;
}

export enum BatchJobStatus {
    Pending = 'Pending',
    Running = 'Running',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
}

export interface BatchJob {
    id: string;
    name: string;
    status: BatchJobStatus;
    schedule: string;
    lastRun: string;
    avgDuration: string;
    dataSource: string;
}

export type AgentLogLevel = 'info' | 'warning' | 'error';

export interface AgentLog {
    id: string;
    timestamp: string;
    agent: string;
    level: AgentLogLevel;
    message: string;
}

export interface MetricDataPoint {
    name: string;
    value: number;
}

export interface Metrics {
    queriesPerMinute: MetricDataPoint[];
    averageLatency: MetricDataPoint[];
}

export type NotificationType = 'alert' | 'info' | 'success';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: string;
    read: boolean;
}

export type View =
  | 'dashboard'
  | 'data-sources'
  | 'pipelines'
  | 'batch-processing'
  | 'relationship-discovery'
  | 'data-lineage'
  | 'changes-approvals'
  | 'security-incidents'
  | 'console'
  | 'settings'
  | 'help'
  | 'access-denied';

export type PermissionId =
  | 'view_dashboard'
  | 'view_datasources'
  | 'view_pipelines'
  | 'view_batch_processing'
  | 'view_relationship_discovery'
  | 'view_data_lineage'
  | 'view_changes'
  | 'manage_changes'
  | 'view_security_incidents'
  | 'view_console'
  | 'view_settings'
  | 'view_help'
  | 'impersonate_users'
  | 'view_settings_general'
  | 'view_settings_agents'
  | 'manage_settings_agents'
  | 'view_settings_workflows'
  | 'manage_settings_workflows'
  | 'view_settings_connections'
  | 'manage_settings_connections'
  | 'view_settings_users'
  | 'manage_settings_users'
  | 'view_settings_authentication'
  | 'view_settings_compliance'
  | 'export_console_logs';

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: PermissionId[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    avatarUrl: string;
    lastLogin: string;
}

export enum DataSourceType {
    Snowflake = 'Snowflake',
    Databricks = 'Databricks',
    S3 = 'Amazon S3',
    PostgreSQL = 'PostgreSQL',
    Synapse = 'Azure Synapse'
}

export interface DataSource {
    id: string;
    name: string;
    type: DataSourceType;
    status: 'connected' | 'disconnected' | 'error';
    lastIngested: string;
    schemaDescription: string;
}

export enum DatabaseConnectionType {
    Snowflake = 'Snowflake',
    Databricks = 'Databricks',
    Neo4j = 'Neo4j',
    AzureSynapse = 'Azure Synapse',
    PostgreSQL = 'PostgreSQL',
}

export interface DatabaseConnection {
    id: string;
    name: string;
    type: DatabaseConnectionType;
    status: 'Connected' | 'Disconnected' | 'Testing...';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    token?: string;
    account?: string;
    warehouse?: string;
    database?: string;
    schema?: string;
    httpPath?: string;
    server?: string;
}

export type LineageNodeType = 'Table' | 'Column' | 'Transformation' | 'Report';
export interface LineageNode {
    id: string;
    label: string;
    type: LineageNodeType;
    position: { x: number; y: number };
}
export interface LineageEdge {
    id: string;
    source: string;
    target: string;
}
export interface LineageGraph {
    nodes: LineageNode[];
    edges: LineageEdge[];
}

export interface RelationshipConfig {
    id: string;
    name: string;
    sources: string[];
    method: 'Column Name Similarity' | 'Foreign Key Analysis' | 'Content-based Correlation';
    parameters: {
        similarityThreshold?: number;
    };
    lastRun: string;
}

export type ConsoleLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
export type ConsoleLogCategory = 'System Event' | 'User Action' | 'API Call' | 'Security' | 'Audit' | 'Access Control';
export interface ConsoleLog {
    id: string;
    timestamp: string;
    level: ConsoleLogLevel;
    category: ConsoleLogCategory;
    user?: string;
    message: string;
}

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Reported' | 'Investigating' | 'Identified' | 'Contained' | 'Resolved' | 'Post-Mortem';
export interface IncidentTimelineEntry {
    timestamp: string;
    status: IncidentStatus;
    notes: string;
    user: string;
}
export interface SecurityIncident {
    id: string;
    title: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    reportedBy: string;
    reportedAt: string;
    description: string;
    timeline: IncidentTimelineEntry[];
}

export type SettingsTab = 'General' | 'Agents' | 'Workflows' | 'Connections' | 'Users & Roles' | 'Authentication' | 'Compliance';
export interface EnvironmentConfig { name: string; url: string; status: 'Active' | 'Inactive'; }
export type LLMProviderType = 'Gemini' | 'OpenAI' | 'Claude';
export interface LLMProviderConfig { id: string; name: string; provider: LLMProviderType; apiKey: string; }
export interface AgentConfig { id: string; name: string; description: string; llmProviderConfigId: string | null; }

export interface WorkflowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { label: string; [key: string]: any };
}
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}
export interface Workflow {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface Permission {
  id: PermissionId;
  name: string;
  description: string;
  category: string;
}

export type SSOProvider = 'Google' | 'Okta' | 'AzureAD' | 'ADFS/SAML';
export interface AuthSettings {
  isSsoEnabled: boolean;
  ssoProvider: SSOProvider | null;
  ssoConfig: {
    domain?: string;
    clientId?: string;
    clientSecret?: string;
  }
}

export interface AccessReview { id: string; quarter: string; status: 'In Progress' | 'Completed'; dueDate: string; reviewer: string; }
export interface Vendor { id: string; name: string; service: string; risk: 'High' | 'Medium' | 'Low'; status: 'Active' | 'Inactive'; nextReview: string; }

export type AssistantPanel = 'chat' | 'history' | 'prompt-library';

export interface Prompt {
    id: string;
    title: string;
    description: string;
    prompt: string;
    category: string;
}

export interface AssistantMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string | React.ReactNode;
    timestamp: string;
}

export type ChangeRequestSource = 'Manual Submission' | 'Schema Change' | 'Performance Anomaly' | 'AI Assistant Feedback';

export type ApprovalStageStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';

export interface ApprovalStage {
    name: string;
    status: ApprovalStageStatus;
    approver?: string;
    timestamp?: string;
    notes?: string;
}

export interface AuditEntry {
    timestamp: string;
    user: string;
    action: string;
    details?: string;
}

export interface ChangeRequest {
    id: string;
    title: string;
    description: string;
    requestedBy: ChangeRequestSource | string;
    requestedAt: string;
    currentStage: string;
    stages: ApprovalStage[];
    auditTrail: AuditEntry[];
    generatedBRD?: string;
}