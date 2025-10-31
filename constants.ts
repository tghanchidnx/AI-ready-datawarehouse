import {
  Pipeline, PipelineStatus, AgentLog, Metrics, Notification, User, Role, PermissionId, DataSource, DataSourceType,
  LineageGraph, RelationshipConfig, ConsoleLog, SecurityIncident,
  EnvironmentConfig, DatabaseConnection, DatabaseConnectionType, LLMProviderConfig, AgentConfig, Workflow, Permission, AuthSettings, AccessReview, Vendor, Prompt, ChangeRequest, BatchJob, BatchJobStatus
} from './types';

export const APP_VERSION = '1.2.3';

export const MOCK_PIPELINES: Pipeline[] = [
    { id: 'pipe-001', name: 'Customer Data Ingestion', status: PipelineStatus.Running, lastRun: '2025-10-31 10:00 UTC', nextRun: '2025-10-31 11:00 UTC', avgDuration: '5m 32s' },
    { id: 'pipe-002', name: 'Sales Data Transformation', status: PipelineStatus.Completed, lastRun: '2025-10-31 09:45 UTC', nextRun: '2025-10-31 10:45 UTC', avgDuration: '12m 15s' },
    { id: 'pipe-003', name: 'Product Catalog Sync', status: PipelineStatus.Failed, lastRun: '2025-10-31 09:30 UTC', nextRun: '2025-10-31 10:30 UTC', avgDuration: '2m 3s' },
    { id: 'pipe-004', name: 'Inventory Update', status: PipelineStatus.Scheduled, lastRun: '2025-10-30 22:00 UTC', nextRun: '2025-10-31 22:00 UTC', avgDuration: '8m 45s' },
];

export const MOCK_BATCH_JOBS: BatchJob[] = [
    { id: 'job-001', name: 'End-of-Month Reporting', status: BatchJobStatus.Succeeded, schedule: '0 2 1 * *', lastRun: '2025-10-01 02:15 UTC', avgDuration: '45m 10s', dataSource: 'Prod Snowflake Warehouse' },
    { id: 'job-002', name: 'Historical Data Backfill', status: BatchJobStatus.Running, schedule: 'Manual', lastRun: '2025-10-31 09:00 UTC', avgDuration: '3h 20m', dataSource: 'Demo: Archived Sales Data' },
    { id: 'job-003', name: 'ML Model Training Data Prep', status: BatchJobStatus.Failed, schedule: '0 0 * * 1', lastRun: '2025-10-27 00:05 UTC', avgDuration: '1h 5m', dataSource: 'Staging Databricks Workspace' },
    { id: 'job-004', name: 'GDPR Data Deletion', status: BatchJobStatus.Pending, schedule: '0 1 * * *', lastRun: '2025-10-31 01:00 UTC', avgDuration: '12m 5s', dataSource: 'All Production Sources' },
];

export const MOCK_AGENT_LOGS: AgentLog[] = [
    { id: 'log-1', timestamp: '10:01:15', agent: 'Orchestrator', level: 'info', message: 'Starting pipeline "Customer Data Ingestion".' },
    { id: 'log-2', timestamp: '10:01:18', agent: 'SnowflakeConnector', level: 'info', message: 'Connected to Snowflake successfully.' },
    { id: 'log-3', timestamp: '10:02:45', agent: 'DataQualityAgent', level: 'warning', message: 'Found 12 rows with missing `email` field in `staging.customers`.' },
    { id: 'log-4', timestamp: '10:03:51', agent: 'SchemaDiscoveryAgent', level: 'info', message: 'Detected new column `last_login_ip` in `source.users`.' },
    { id: 'log-5', timestamp: '10:05:02', agent: 'Orchestrator', level: 'error', message: 'Pipeline "Product Catalog Sync" failed at step `transform_json`. Timeout exceeded.' },
];

export const MOCK_METRICS: Metrics = {
    queriesPerMinute: [
        { name: '-30m', value: 120 }, { name: '-25m', value: 150 }, { name: '-20m', value: 140 }, { name: '-15m', value: 180 }, { name: '-10m', value: 210 }, { name: '-5m', value: 250 }, { name: 'Now', value: 230 },
    ],
    averageLatency: [
        { name: '-30m', value: 250 }, { name: '-25m', value: 260 }, { name: '-20m', value: 240 }, { name: '-15m', value: 220 }, { name: '-10m', value: 200 }, { name: '-5m', value: 180 }, { name: 'Now', value: 190 },
    ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'alert', message: 'Pipeline "Product Catalog Sync" failed.', timestamp: '2 minutes ago', read: false },
    { id: 'n2', type: 'info', message: 'Schema change detected in "source.users".', timestamp: '15 minutes ago', read: false },
    { id: 'n3', type: 'success', message: 'Sales data transformation completed successfully.', timestamp: '1 hour ago', read: true },
];

export const MOCK_PERMISSIONS: Permission[] = [
    // Dashboard
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the main dashboard with metrics and logs.', category: 'General' },
    // Data Sources
    { id: 'view_datasources', name: 'View Data Sources', description: 'Can view connected data sources and their schemas.', category: 'Data Sources' },
    // Pipelines
    { id: 'view_pipelines', name: 'View Pipelines', description: 'Can view data pipelines and their status.', category: 'Pipelines' },
    // Batch Processing
    { id: 'view_batch_processing', name: 'View Batch Processing', description: 'Can view batch processing jobs.', category: 'Pipelines' },
    // Relationship Discovery
    { id: 'view_relationship_discovery', name: 'View Relationship Discovery', description: 'Can view relationship discovery configurations.', category: 'Discovery' },
    // Data Lineage
    { id: 'view_data_lineage', name: 'View Data Lineage', description: 'Can view data lineage graphs.', category: 'Discovery' },
    // Changes & Approvals
    { id: 'view_changes', name: 'View Changes & Approvals', description: 'Can view change requests and approvals.', category: 'Governance' },
    { id: 'manage_changes', name: 'Manage Changes & Approvals', description: 'Can approve, reject, and comment on change requests.', category: 'Governance' },
    // Security
    { id: 'view_security_incidents', name: 'View Security Incidents', description: 'Can view security incidents.', category: 'Security' },
    // Console
    { id: 'view_console', name: 'View System Console', description: 'Can view the system console logs.', category: 'System' },
    { id: 'export_console_logs', name: 'Export Console Logs', description: 'Can export logs from the system console.', category: 'System' },
    // Settings
    { id: 'view_settings', name: 'View Settings', description: 'Can view all settings pages.', category: 'Settings' },
    { id: 'view_settings_general', name: 'View General Settings', description: 'Can view general application settings.', category: 'Settings' },
    { id: 'view_settings_agents', name: 'View Agent Settings', description: 'Can view LLM and Agent configurations.', category: 'Settings' },
    { id: 'manage_settings_agents', name: 'Manage Agent Settings', description: 'Can create, edit, and delete LLM and Agent configurations.', category: 'Settings' },
    { id: 'view_settings_workflows', name: 'View Workflow Settings', description: 'Can view workflow configurations.', category: 'Settings' },
    { id: 'manage_settings_workflows', name: 'Manage Workflow Settings', description: 'Can create and edit workflows.', category: 'Settings' },
    { id: 'view_settings_connections', name: 'View Connection Settings', description: 'Can view database connection settings.', category: 'Settings' },
    { id: 'manage_settings_connections', name: 'Manage Connection Settings', description: 'Can create, edit, and delete database connections.', category: 'Settings' },
    { id: 'view_settings_users', name: 'View User Settings', description: 'Can view users, roles, and permissions.', category: 'Settings' },
    { id: 'manage_settings_users', name: 'Manage User Settings', description: 'Can invite, edit, and delete users and manage roles.', category: 'Settings' },
    { id: 'view_settings_authentication', name: 'View Authentication Settings', description: 'Can view SSO and authentication settings.', category: 'Settings' },
    { id: 'view_settings_compliance', name: 'View Compliance Settings', description: 'Can view SOX and SOC 2 compliance controls.', category: 'Settings' },
    // Misc
    { id: 'view_help', name: 'View Help & Docs', description: 'Can view the help and documentation page.', category: 'General' },
    { id: 'impersonate_users', name: 'Impersonate Users', description: 'Can impersonate other users to view the application from their perspective.', category: 'System' },
];

const allPermissionIds: PermissionId[] = MOCK_PERMISSIONS.map(p => p.id);

export const MOCK_ROLES: Role[] = [
    { id: 'role_admin', name: 'Administrator', description: 'Has all permissions.', permissions: allPermissionIds },
    { id: 'role_data_engineer', name: 'Data Engineer', description: 'Manages data sources, pipelines, and connections.', permissions: ['view_dashboard', 'view_datasources', 'view_pipelines', 'view_batch_processing', 'view_data_lineage', 'view_settings', 'view_settings_connections', 'manage_settings_connections', 'view_settings_agents', 'manage_settings_agents', 'view_settings_workflows', 'manage_settings_workflows', 'view_console', 'view_help', 'view_changes', 'manage_changes'] },
    { id: 'role_security_analyst', name: 'Security Analyst', description: 'Monitors security and compliance.', permissions: ['view_dashboard', 'view_security_incidents', 'view_console', 'view_settings', 'view_settings_authentication', 'view_settings_compliance', 'view_settings_users', 'view_help', 'view_changes'] },
    { id: 'role_business_analyst', name: 'Business Analyst', description: 'Views dashboards, reports, and data lineage.', permissions: ['view_dashboard', 'view_datasources', 'view_data_lineage', 'view_relationship_discovery', 'view_help'] },
    { id: 'role_viewer', name: 'Viewer', description: 'Read-only access to dashboards.', permissions: ['view_dashboard', 'view_help'] },
];

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alice Admin', email: 'alice@example.com', roleId: 'role_admin', avatarUrl: 'https://i.pravatar.cc/40?u=user-1', lastLogin: '2025-10-31 10:05 UTC' },
    { id: 'user-2', name: 'Bob Engineer', email: 'bob@example.com', roleId: 'role_data_engineer', avatarUrl: 'https://i.pravatar.cc/40?u=user-2', lastLogin: '2025-10-31 09:58 UTC' },
    { id: 'user-3', name: 'Charlie Security', email: 'charlie@example.com', roleId: 'role_security_analyst', avatarUrl: 'https://i.pravatar.cc/40?u=user-3', lastLogin: '2025-10-31 08:30 UTC' },
    { id: 'user-4', name: 'Diana Analyst', email: 'diana@example.com', roleId: 'role_business_analyst', avatarUrl: 'https://i.pravatar.cc/40?u=user-4', lastLogin: '2025-10-30 14:00 UTC' },
    { id: 'user-5', name: 'Evan Viewer', email: 'evan@example.com', roleId: 'role_viewer', avatarUrl: 'https://i.pravatar.cc/40?u=user-5', lastLogin: '2025-10-29 11:11 UTC' },
];

export const MOCK_DEMO_DATA_SOURCES: DataSource[] = [
    { id: 'ds-demo-1', name: 'Demo: Customer Analytics DB', type: DataSourceType.PostgreSQL, status: 'connected', lastIngested: '2025-10-31 08:00 UTC', schemaDescription: 'Contains tables for customer profiles, orders, and product interactions.' },
    { id: 'ds-demo-2', name: 'Demo: Product Catalog Lakehouse', type: DataSourceType.Databricks, status: 'connected', lastIngested: '2025-10-31 06:00 UTC', schemaDescription: 'Parquet files with product metadata, pricing, and inventory levels.' },
    { id: 'ds-demo-3', name: 'Demo: Archived Sales Data', type: DataSourceType.S3, status: 'disconnected', lastIngested: '2025-09-30 12:00 UTC', schemaDescription: 'Historical sales records in CSV format, partitioned by year and month.' },
];

export const MOCK_LINEAGE_GRAPH: LineageGraph = {
    nodes: [
        { id: 'table_customers', label: 'customers', type: 'Table', position: { x: 50, y: 150 } },
        { id: 'col_customers_id', label: 'id', type: 'Column', position: { x: 50, y: 250 } },
        { id: 'table_orders', label: 'orders', type: 'Table', position: { x: 50, y: 400 } },
        { id: 'col_orders_customer_id', label: 'customer_id', type: 'Column', position: { x: 50, y: 500 } },
        { id: 'transform_join', label: 'Join Orders & Customers', type: 'Transformation', position: { x: 350, y: 275 } },
        { id: 'report_sales', label: 'Sales Report', type: 'Report', position: { x: 650, y: 275 } },
    ],
    edges: [
        { id: 'e1', source: 'table_customers', target: 'transform_join' },
        { id: 'e2', source: 'col_customers_id', target: 'transform_join' },
        { id: 'e3', source: 'table_orders', target: 'transform_join' },
        { id: 'e4', source: 'col_orders_customer_id', target: 'transform_join' },
        { id: 'e5', source: 'transform_join', target: 'report_sales' },
    ]
};

export const MOCK_RELATIONSHIP_CONFIGS: RelationshipConfig[] = [
    { id: 'rc-001', name: 'User-Product Affinity', sources: ['ds-demo-1', 'ds-demo-2'], method: 'Content-based Correlation', parameters: {}, lastRun: '2025-10-30 14:20 UTC' },
    { id: 'rc-002', name: 'FK Discovery in Analytics DB', sources: ['ds-demo-1'], method: 'Foreign Key Analysis', parameters: {}, lastRun: '2025-10-29 09:00 UTC' },
];

export const MOCK_CONSOLE_LOGS: ConsoleLog[] = [
    { id: 'cl-1', timestamp: '10:15:01', level: 'INFO', category: 'User Action', user: 'alice@example.com', message: 'User logged in successfully.' },
    { id: 'cl-2', timestamp: '10:15:25', level: 'INFO', category: 'API Call', message: 'GET /api/v1/pipelines' },
    { id: 'cl-3', timestamp: '10:16:05', level: 'WARN', category: 'System Event', message: 'High CPU usage detected on node-3 (92%).' },
    { id: 'cl-4', timestamp: '10:17:10', level: 'INFO', category: 'Audit', user: 'bob@example.com', message: 'Updated connection `conn-snowflake-prod`.' },
    { id: 'cl-5', timestamp: '10:18:00', level: 'ERROR', category: 'System Event', message: 'Failed to connect to Redis cache.' },
    { id: 'cl-6', timestamp: '10:19:30', level: 'SUCCESS', category: 'System Event', message: 'Pipeline `pipe-002` completed successfully.' },
    { id: 'cl-7', timestamp: '10:20:00', level: 'INFO', category: 'Access Control', user: 'alice@example.com', message: 'Impersonation started: target=diana@example.com' },
];

export const MOCK_SECURITY_INCIDENTS: SecurityIncident[] = [
    {
        id: 'INC-001', title: 'Anomalous Data Egress from Production DB', severity: 'High', status: 'Investigating', reportedBy: 'AI Security Agent', reportedAt: '2025-10-30 22:15 UTC',
        description: 'The AI monitoring agent detected an unusually large data export from the `customers` table, initiated by a non-standard service account outside of normal operating hours. The volume of data (approx. 5GB) is significantly higher than baseline.',
        timeline: [
            { timestamp: '2025-10-30 22:15 UTC', status: 'Reported', notes: 'AI agent alert triggered for anomalous data egress.', user: 'AI Security Agent' },
            { timestamp: '2025-10-30 22:20 UTC', status: 'Investigating', notes: 'Incident assigned to Charlie. Initial investigation confirms anomalous activity. Affected service account has been temporarily disabled.', user: 'charlie@example.com' },
        ],
    },
];

export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
    {
        id: 'CR-001',
        title: 'Add `last_login_ip` to Customer Graph Node',
        description: 'The Schema Discovery Agent detected a new column `last_login_ip` in the source `users` table. This change request proposes adding this attribute to the `Customer` node in the knowledge graph to enable location-based security analysis.',
        requestedBy: 'Schema Change',
        requestedAt: '2025-10-31T09:30:00Z',
        currentStage: 'Technical Review',
        stages: [
            { name: 'Pending Review', status: 'Completed', approver: 'System', timestamp: '2025-10-31T09:30:00Z' },
            { name: 'Technical Review', status: 'In Progress' },
            { name: 'BRD Generation', status: 'Pending' },
            { name: 'Final Approval', status: 'Pending' },
            { name: 'Implemented', status: 'Pending' },
        ],
        auditTrail: [
            { timestamp: '2025-10-31T09:30:00Z', user: 'System', action: 'Request Created', details: 'Detected schema change in `source.users`.' },
            { timestamp: '2025-10-31T09:35:00Z', user: 'bob@example.com', action: 'Stage Approved', details: 'Approved "Pending Review" stage.' },
        ],
    },
    {
        id: 'CR-002',
        title: 'Assistant Request: "Summarize pipeline performance"',
        description: 'User asked the AI assistant to perform an action that is not currently supported: "Summarize the performance of all pipelines into a PDF report". This should be reviewed as a potential feature enhancement.',
        requestedBy: 'AI Assistant Feedback',
        requestedAt: '2025-10-31T10:15:00Z',
        currentStage: 'BRD Generation',
        stages: [
            { name: 'Pending Review', status: 'Completed', approver: 'AI Assistant', timestamp: '2025-10-31T10:15:00Z' },
            { name: 'Technical Review', status: 'Completed', approver: 'bob@example.com', timestamp: '2025-10-31T11:00:00Z' },
            { name: 'BRD Generation', status: 'In Progress' },
            { name: 'Final Approval', status: 'Pending' },
            { name: 'Implemented', status: 'Pending' },
        ],
        auditTrail: [
            { timestamp: '2025-10-31T10:15:00Z', user: 'AI Assistant', action: 'Request Created' },
            { timestamp: '2025-10-31T11:00:00Z', user: 'bob@example.com', action: 'Stage Approved', details: 'Technical Review approved. Looks feasible.' },
        ],
    }
];

// from Settings.tsx
export const MOCK_ENVIRONMENTS: EnvironmentConfig[] = [
  { name: 'Production', url: 'https://prod.api.example.com', status: 'Active' },
  { name: 'Staging', url: 'https://staging.api.example.com', status: 'Active' },
  { name: 'Development', url: 'https://dev.api.example.com', status: 'Inactive' },
];

export const MOCK_DB_CONNECTIONS: DatabaseConnection[] = [
  { id: 'conn-snowflake-prod', name: 'Prod Snowflake Warehouse', type: DatabaseConnectionType.Snowflake, account: 'ab12345.us-east-1', status: 'Connected' },
  { id: 'conn-databricks-staging', name: 'Staging Databricks Workspace', type: DatabaseConnectionType.Databricks, host: 'dbc-1234.cloud.databricks.com', status: 'Connected' },
  { id: 'conn-neo4j-dev', name: 'Dev Knowledge Graph', type: DatabaseConnectionType.Neo4j, host: 'localhost', port: 7687, status: 'Disconnected' },
];

export const DB_CONNECTION_METADATA: Record<DatabaseConnectionType, { docsUrl: string, videoUrl: string, fields: { name: keyof DatabaseConnection, label: string, type: string, required: boolean, placeholder?: string }[] }> = {
    [DatabaseConnectionType.Snowflake]: {
        docsUrl: '#', videoUrl: '#',
        fields: [
            { name: 'account', label: 'Account Identifier', type: 'text', required: true, placeholder: 'org-account.region' },
            { name: 'warehouse', label: 'Warehouse', type: 'text', required: true, placeholder: 'COMPUTE_WH' },
            { name: 'database', label: 'Database', type: 'text', required: true, placeholder: 'PROD_DB' },
            { name: 'schema', label: 'Schema', type: 'text', required: false, placeholder: 'PUBLIC' },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ]
    },
    [DatabaseConnectionType.Databricks]: {
        docsUrl: '#', videoUrl: '#',
        fields: [
            { name: 'host', label: 'Workspace URL', type: 'text', required: true, placeholder: 'dbc-123.cloud.databricks.com' },
            { name: 'httpPath', label: 'HTTP Path', type: 'text', required: true, placeholder: '/sql/1.0/warehouses/...' },
            { name: 'token', label: 'Personal Access Token', type: 'password', required: true },
        ]
    },
    [DatabaseConnectionType.Neo4j]: {
        docsUrl: '#', videoUrl: '#',
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '7687' },
            { name: 'database', label: 'Database', type: 'text', required: false, placeholder: 'neo4j' },
            { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'neo4j' },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ]
    },
    [DatabaseConnectionType.AzureSynapse]: {
        docsUrl: '#', videoUrl: '#',
        fields: [
            { name: 'server', label: 'Server', type: 'text', required: true, placeholder: 'your-workspace.sql.azuresynapse.net' },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ]
    },
     [DatabaseConnectionType.PostgreSQL]: {
        docsUrl: '#', videoUrl: '#',
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '5432' },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
        ]
    },
};

export const MOCK_ACCESS_REVIEWS: AccessReview[] = [
    { id: 'ar-1', quarter: 'Q3 2025', status: 'Completed', dueDate: '2025-09-30', reviewer: 'alice@example.com' },
    { id: 'ar-2', quarter: 'Q4 2025', status: 'In Progress', dueDate: '2025-12-31', reviewer: 'charlie@example.com' },
];

export const MOCK_VENDORS: Vendor[] = [
    { id: 'ven-1', name: 'Snowflake', service: 'Data Warehouse', risk: 'Medium', status: 'Active', nextReview: '2026-03-01' },
    { id: 'ven-2', name: 'Databricks', service: 'Data Lakehouse', risk: 'Medium', status: 'Active', nextReview: '2026-04-15' },
    { id: 'ven-3', name: 'OpenAI', service: 'LLM Provider', risk: 'High', status: 'Active', nextReview: '2026-01-10' },
];

export const MOCK_DR_PLAN = { lastFullBackup: '2025-10-31 04:00 UTC', lastDrTestDate: '2025-08-15', rpo: '1 hour', rto: '4 hours' };

export const MOCK_LLM_PROVIDER_CONFIGS: LLMProviderConfig[] = [
  { id: 'llm-p-1', name: 'Gemini Main', provider: 'Gemini', apiKey: '...key1' },
  { id: 'llm-p-2', name: 'OpenAI Fallback', provider: 'OpenAI', apiKey: '...key2' },
];

export const MOCK_AGENT_CONFIGS: AgentConfig[] = [
  { id: 'agent-1', name: 'Data Quality Agent', description: 'Identifies potential data quality issues in source data.', llmProviderConfigId: 'llm-p-1' },
  { id: 'agent-2', name: 'Schema Discovery Agent', description: 'Detects and catalogs schema changes in data sources.', llmProviderConfigId: 'llm-p-1' },
  { id: 'agent-3', name: 'Security Agent', description: 'Monitors for anomalous access patterns and potential threats.', llmProviderConfigId: 'llm-p-2' },
];

export const MOCK_WORKFLOWS: Workflow[] = [
    {
        id: 'wf-1', name: 'Standard Ingestion',
        nodes: [
            { id: 'start', type: 'Start', position: { x: 50, y: 150 }, data: { label: 'Start' } },
            { id: 'read', type: 'Action', position: { x: 250, y: 50 }, data: { label: 'Read from Source', actionType: 'Read' } },
            { id: 'quality', type: 'Agent', position: { x: 250, y: 250 }, data: { label: 'Data Quality Agent', agentId: 'agent-1' } },
            { id: 'write', type: 'Action', position: { x: 450, y: 150 }, data: { label: 'Write to GraphDB', actionType: 'WriteGraph' } },
            { id: 'end', type: 'End', position: { x: 650, y: 150 }, data: { label: 'End' } },
        ],
        edges: [
            { id: 'e-start-read', source: 'start', target: 'read' },
            { id: 'e-start-quality', source: 'start', target: 'quality' },
            { id: 'e-read-write', source: 'read', target: 'write' },
            { id: 'e-quality-write', source: 'quality', target: 'write' },
            { id: 'e-write-end', source: 'write', target: 'end' },
        ],
    },
];

export const MOCK_AUTH_SETTINGS: AuthSettings = {
  isSsoEnabled: false,
  ssoProvider: null,
  ssoConfig: {},
};

export const MOCK_PROMPT_LIBRARY: Prompt[] = [
    { id: 'p1', title: 'Summarize Schema', description: 'Generate a natural language summary of a database schema.', prompt: 'Summarize the following DDL schema for a business analyst. Focus on the main entities and their relationships:\n\n{schema}', category: 'Data Exploration' },
    { id: 'p2', title: 'Suggest Data Quality Rules', description: 'Propose data quality checks based on column names and types.', prompt: 'Given the table "{table_name}" with columns ({columns}), suggest 3 data quality rules with explanations.', category: 'Data Quality' },
    { id: 'p3', title: 'Generate Cypher Query', description: 'Translate a natural language question into a Cypher query for Neo4j.', prompt: 'Translate this question into a Cypher query for a graph with nodes :User, :Product, and :Order and relationships :BOUGHT and :VIEWED. Question: "{question}"', category: 'Query Generation' },
];

export const MOCK_ASSISTANT_SUGGESTIONS: string[] = [
    "Show me the data lineage view",
    "Create a new pipeline",
    "What is this page for?",
    "How do I set up SSO?",
    "Take me to the security incidents",
];