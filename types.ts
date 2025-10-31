export type View = 'dashboard' | 'data-sources' | 'pipelines' | 'help' | 'settings' | 'batch-processing' | 'relationship-discovery' | 'data-lineage' | 'changes-approvals' | 'console' | 'security-incidents';

export enum DataSourceType {
  S3 = 'AWS S3',
  Redshift = 'AWS Redshift',
  DataLake = 'Azure Data Lake',
  Synapse = 'Azure Synapse',
  Snowflake = 'Snowflake',
  Databricks = 'Databricks',
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: 'connected' | 'disconnected' | 'error';
  lastIngested: string;
  schemaDescription: string;
}

export enum PipelineStatus {
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Scheduled = 'Scheduled',
}

export enum TransformationType {
    Graph = 'Graph DB (Neo4j)',
    Vector = 'Vector Embeddings (Pinecone)',
}

export interface Pipeline {
  id: string;
  name: string;
  source: string;
  target: TransformationType;
  status: PipelineStatus;
  lastRun: string;
  duration: string;
  workflowId?: string;
}

export interface AgentLog {
    id: number;
    timestamp: string;
    agent: string;
    message: string;
    level: 'info' | 'warning' | 'error';
}

export interface PerformanceSuggestion {
    id: string;
    timestamp: string;
    agent: string;
    suggestion: string;
    rationale: string;
    impact: 'High' | 'Medium' | 'Low';
    status: 'pending' | 'approved' | 'rejected';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
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
    pipelineName: string;
    status: BatchJobStatus;
    submitted: string;
    schedule: string;
    resources: {
        clusterSize: 'Small' | 'Medium' | 'Large';
        retries: number;
    };
}

export interface RelationshipConfig {
    id: string;
    name: string;
    sources: string[];
    method: 'Column Name Similarity' | 'Foreign Key Analysis' | 'Content-based Correlation';
    parameters: {
        similarityThreshold?: number;
        correlationMinSupport?: number;
    };
    lastRun: string;
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

export enum ChangeRequestStatus {
    PendingApproval = 'Pending Approval',
    BRDGeneration = 'BRD Generation',
    BRDApproval = 'BRD Approval',
    Implementation = 'Implementation',
    ReadyForTest = 'Ready for Test',
    ReadyForUAT = 'Ready for UAT',
    ReadyForProd = 'Ready for Prod',
    Completed = 'Completed',
    Rejected = 'Rejected',
}

export type LLMProvider = 'Gemini 2.5 Pro' | 'Claude 3 Opus' | 'GPT-4o';

export interface ChangeRequestApproval {
    status: string;
    timestamp: string;
    user: string;
    notes?: string;
    requiredApprover?: string;
    evidenceLink?: string;
}

export interface ChangeRequest {
    id: string;
    timestamp: string;
    source: 'AI Agent' | 'User Feedback';
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    status: ChangeRequestStatus;
    brdContent?: string;
    implementationLLM?: LLMProvider;
    approvalHistory: ChangeRequestApproval[];
}

export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    description: string;
}

export type EnvironmentType = 'Dev' | 'Test' | 'UAT' | 'Prod';

export interface EnvironmentConfig {
    name: EnvironmentType;
    url: string;
    apiKey: string;
    status: 'Active' | 'Inactive' | 'Not Configured';
}

export enum DatabaseConnectionType {
    Neo4j = 'Neo4j',
    Pinecone = 'Pinecone',
    Snowflake = 'Snowflake',
    ChromaDB = 'ChromaDB',
    PostgreSQL = 'PostgreSQL',
    AWSNeptune = 'AWS Neptune',
    Databricks = 'Databricks',
    AzureSynapse = 'Azure Synapse',
    AzureSQL = 'Azure SQL',
    Redis = 'Redis',
}

export interface DatabaseConnection {
    id: string;
    name: string;
    type: DatabaseConnectionType;
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
    status: 'Connected' | 'Disconnected' | 'Testing...';
}

export type ConsoleLogCategory = 'System Event' | 'User Action' | 'API Call' | 'Security' | 'Audit' | 'Access Control';
export type ConsoleLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export interface ConsoleLog {
    id: number;
    timestamp: string;
    level: ConsoleLogLevel;
    category: ConsoleLogCategory;
    message: string;
    user?: string;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[]; // Array of permission IDs
}

export interface UserAccess {
    userId: string;
    userName: string;
    role: string;
    lastLogin: string;
    isCertified: boolean;
}

export interface AccessReview {
    id: string;
    quarter: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    dueDate: string;
    completedDate?: string;
    reviewer: string;
    userAccessList: UserAccess[];
}

// SOC 2 Compliance Types
export interface Vendor {
    id: string;
    name: string;
    service: string;
    risk: 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Inactive';
    lastReview: string;
    nextReview: string;
}

export type IncidentStatus = 'Reported' | 'Investigating' | 'Identified' | 'Contained' | 'Resolved' | 'Post-Mortem';
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

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

export interface DisasterRecoveryPlan {
    lastFullBackup: string;
    backupFrequency: string;
    lastDrTestDate: string;
    drTestFrequency: string;
    rpo: string; // Recovery Point Objective
    rto: string; // Recovery Time Objective
}

export interface PolicyDocument {
    id: string;
    title: string;
    version: string;
    lastUpdated: string;
    owner: string;
    url: string;
}

export type LLMProviderType = 'Gemini' | 'Claude' | 'OpenAI';

export interface LLMProviderConfig {
  id: string;
  name: string;
  provider: LLMProviderType;
  apiKey: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string; // This can be the system prompt
  llmProviderConfigId: string | null;
}

// Workflow Types
export type WorkflowNodeType = 'Start' | 'End' | 'Agent' | 'Condition' | 'Action';

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    position: { x: number; y: number };
    data: {
        label: string;
        agentId?: string; // For 'Agent' type
        condition?: string; // For 'Condition' type
        actionType?: 'Read' | 'WriteGraph' | 'WriteVector'; // For 'Action' type
    };
}

export interface WorkflowEdge {
    id: string;
    source: string; // source node id
    sourceHandle?: string; // e.g., 'true' or 'false' for condition nodes
    target: string; // target node id
}

export interface Workflow {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}