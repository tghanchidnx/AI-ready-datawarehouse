import type { DataSource, Pipeline, AgentLog, PerformanceSuggestion, Notification, BatchJob, RelationshipConfig, LineageGraph, ChangeRequest, ChangelogEntry, EnvironmentConfig, DatabaseConnection, ConsoleLog, Role, Permission, AccessReview, Vendor, SecurityIncident, DisasterRecoveryPlan, PolicyDocument, LLMProviderConfig, AgentConfig, Workflow } from './types';
import { DataSourceType, PipelineStatus, TransformationType, BatchJobStatus, ChangeRequestStatus, EnvironmentType, DatabaseConnectionType } from './types';

export const APP_VERSION = '1.8.0';

export const MOCK_DEMO_DATA_SOURCES: DataSource[] = [
  { id: 'ds-demo-001', name: 'Archived Sales Data', type: DataSourceType.S3, status: 'connected', lastIngested: '2025-10-28 12:00 UTC', schemaDescription: 'Parquet files containing historical sales data from 2010-2020. Used for long-term trend analysis. This is a demo source.' },
  { id: 'ds-demo-002', name: 'Customer Support Synapse', type: DataSourceType.Synapse, status: 'error', lastIngested: 'N/A', schemaDescription: 'Azure Synapse workspace for customer support tickets and interactions. Connection failed due to invalid credentials. This is a demo source.' },
];

export const MOCK_PIPELINES: Pipeline[] = [
  { id: 'pl-001', name: 'Customer 360 Knowledge Graph', source: 'Production Snowflake WH', target: TransformationType.Graph, status: PipelineStatus.Completed, lastRun: '2025-10-30 08:30 UTC', duration: '45 min', workflowId: 'wf-001' },
  { id: 'pl-002', name: 'Product Similarity Vectors', source: 'Marketing Event Stream', target: TransformationType.Vector, status: PipelineStatus.Running, lastRun: '2025-10-30 09:10 UTC', duration: 'In Progress', workflowId: 'wf-001' },
  { id: 'pl-003', name: 'Sales Trend Analysis KG', source: 'Archived Sales Data', target: TransformationType.Graph, status: PipelineStatus.Failed, lastRun: '2025-10-29 14:00 UTC', duration: '15 min', workflowId: 'wf-001' },
  { id: 'pl-004', name: 'Support Ticket Semantic Search', source: 'Customer Support Synapse', target: TransformationType.Vector, status: PipelineStatus.Scheduled, lastRun: 'N/A', duration: 'N/A' },
];

export const MOCK_AGENT_LOGS: AgentLog[] = [
  { id: 1, timestamp: '09:15:02', agent: 'Orchestration Agent', message: 'Initiated pipeline `pl-002` for vector embedding.', level: 'info' },
  { id: 2, timestamp: '09:15:01', agent: 'Data Catalog Agent', message: 'Schema change detected in `Production Snowflake WH`. Rescanning...', level: 'info' },
  { id: 3, timestamp: '09:14:30', agent: 'Orchestration Agent', message: 'Resource usage high: Spark cluster at 92% capacity.', level: 'warning' },
  { id: 4, timestamp: '09:12:05', agent: 'Self-Improvement Agent', message: 'Logged new RAG performance suggestion #SUG-012.', level: 'info' },
  { id: 5, timestamp: '09:10:00', agent: 'Orchestration Agent', message: 'Starting scheduled pipeline runs.', level: 'info' },
];

export const MOCK_PERFORMANCE_SUGGESTIONS: PerformanceSuggestion[] = [
    { id: 'SUG-012', timestamp: '2025-10-30 09:12 UTC', agent: 'Self-Improvement Agent', suggestion: 'Re-chunk product descriptions from 256 to 512 tokens.', rationale: 'Queries about product features are frequently truncated. Increasing chunk size will improve context for the embedding model, reducing hallucinations by an estimated 15%.', impact: 'High', status: 'pending' },
    { id: 'SUG-011', timestamp: '2025-10-29 18:45 UTC', agent: 'Self-Improvement Agent', suggestion: 'Add `customer_location` as a node property in the Customer 360 KG.', rationale: 'Multiple analytical queries required an extra hop to find customer locations. Adding it directly to the customer node will speed up geo-based queries by approx. 2x.', impact: 'Medium', status: 'approved' },
    { id: 'SUG-010', timestamp: '2025-10-29 11:20 UTC', agent: 'Self-Improvement Agent', suggestion: 'Switch embedding model for support tickets to `text-embedding-3-large`.', rationale: 'The current model struggles with technical jargon in support tickets. A more advanced model could improve semantic search accuracy for complex issues.', impact: 'High', status: 'pending' },
    { id: 'SUG-009', timestamp: '2025-10-28 22:10 UTC', agent: 'Self-Improvement Agent', suggestion: 'Create a new relationship `[ORDER]-[:CONTAINS_PRODUCT]->[PRODUCT]`', rationale: 'The current model traverses through `ORDER_ITEMS`. A direct relationship would simplify many common queries.', impact: 'Low', status: 'rejected' },
];

export const MOCK_METRICS = {
    queriesPerMinute: [
        { name: '08:00', value: 120 }, { name: '08:15', value: 150 }, { name: '08:30', value: 140 },
        { name: '08:45', value: 180 }, { name: '09:00', value: 210 }, { name: '09:15', value: 250 }
    ],
    averageLatency: [
        { name: '08:00', value: 250 }, { name: '08:15', value: 240 }, { name: '08:30', value: 220 },
        { name: '08:45', value: 200 }, { name: '09:00', value: 180 }, { name: '09:15', value: 150 }
    ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', message: 'Pipeline `pl-003` failed due to a connection error.', timestamp: '5m ago', read: false, type: 'alert' },
  { id: 'notif-2', message: 'Schema change detected in `Production Snowflake WH`.', timestamp: '30m ago', read: false, type: 'info' },
  { id: 'notif-3', message: 'Pipeline `pl-001` completed successfully.', timestamp: '1h ago', read: true, type: 'success' },
  { id: 'notif-4', message: 'Resource usage high: Spark cluster at 92% capacity.', timestamp: '2h ago', read: true, type: 'alert' },
];

export const MOCK_BATCH_JOBS: BatchJob[] = [
    { id: 'job-001', name: 'Nightly Customer 360 Refresh', pipelineName: 'Customer 360 Knowledge Graph', status: BatchJobStatus.Succeeded, submitted: '2025-10-30 02:00 UTC', schedule: '0 2 * * *', resources: { clusterSize: 'Medium', retries: 2 } },
    { id: 'job-002', name: 'Hourly Product Vector Update', pipelineName: 'Product Similarity Vectors', status: BatchJobStatus.Running, submitted: '2025-10-30 09:00 UTC', schedule: '0 * * * *', resources: { clusterSize: 'Large', retries: 3 } },
    { id: 'job-003', name: 'Historical Sales KG Backfill', pipelineName: 'Sales Trend Analysis KG', status: BatchJobStatus.Failed, submitted: '2025-10-29 18:00 UTC', schedule: 'Manual', resources: { clusterSize: 'Large', retries: 0 } },
    { id: 'job-004', name: 'Weekly Support Ticket Indexing', pipelineName: 'Support Ticket Semantic Search', status: BatchJobStatus.Pending, submitted: '2025-10-30 09:30 UTC', schedule: '0 0 * * 1', resources: { clusterSize: 'Medium', retries: 2 } },
];

export const MOCK_RELATIONSHIP_CONFIGS: RelationshipConfig[] = [
    { id: 'rc-001', name: 'Discover Customer-Product Links', sources: ['ds-001', 'ds-002'], method: 'Foreign Key Analysis', parameters: {}, lastRun: '2025-10-29 10:00 UTC' },
    { id: 'rc-002', name: 'Identify Similar Support Tickets', sources: ['ds-004'], method: 'Content-based Correlation', parameters: { correlationMinSupport: 5 }, lastRun: 'Never' },
    { id: 'rc-003', name: 'Find Related Columns Across Sources', sources: ['ds-001', 'ds-004'], method: 'Column Name Similarity', parameters: { similarityThreshold: 0.85 }, lastRun: '2025-10-28 15:30 UTC' },
];

export const MOCK_LINEAGE_GRAPH: LineageGraph = {
    nodes: [
        { id: 'sf-table-customers', label: 'CUSTOMERS', type: 'Table', position: { x: 50, y: 150 } },
        { id: 'sf-col-cust-id', label: 'customer_id', type: 'Column', position: { x: 250, y: 50 } },
        { id: 'sf-col-cust-name', label: 'name', type: 'Column', position: { x: 250, y: 125 } },
        { id: 'sf-table-orders', label: 'ORDERS', type: 'Table', position: { x: 50, y: 350 } },
        { id: 'sf-col-ord-id', label: 'order_id', type: 'Column', position: { x: 250, y: 275 } },
        { id: 'sf-col-ord-cust-id', label: 'customer_id', type: 'Column', position: { x: 250, y: 350 } },
        { id: 'sf-col-ord-date', label: 'order_date', type: 'Column', position: { x: 250, y: 425 } },
        { id: 'trans-join-cust-ord', label: 'Join Customer & Orders', type: 'Transformation', position: { x: 500, y: 250 } },
        { id: 'report-q3-sales', label: 'Q3 Sales Report', type: 'Report', position: { x: 750, y: 250 } },
    ],
    edges: [
        { id: 'e1', source: 'sf-table-customers', target: 'sf-col-cust-id' },
        { id: 'e2', source: 'sf-table-customers', target: 'sf-col-cust-name' },
        { id: 'e3', source: 'sf-table-orders', target: 'sf-col-ord-id' },
        { id: 'e4', source: 'sf-table-orders', target: 'sf-col-ord-cust-id' },
        { id: 'e5', source: 'sf-table-orders', target: 'sf-col-ord-date' },
        { id: 'e6', source: 'sf-col-cust-id', target: 'trans-join-cust-ord' },
        { id: 'e7', source: 'sf-col-ord-cust-id', target: 'trans-join-cust-ord' },
        { id: 'e8', source: 'sf-col-ord-date', target: 'trans-join-cust-ord' },
        { id: 'e9', source: 'trans-join-cust-ord', target: 'report-q3-sales' },
    ]
};

export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
    {
        id: 'CR-001',
        timestamp: '2025-10-30 09:12 UTC',
        source: 'AI Agent',
        title: 'Re-chunk product descriptions from 256 to 512 tokens.',
        description: 'Queries about product features are frequently truncated. Increasing chunk size will improve context for the embedding model, reducing hallucinations by an estimated 15%.',
        impact: 'High',
        status: ChangeRequestStatus.PendingApproval,
        approvalHistory: [{ status: 'Created', timestamp: '2025-10-30 09:12 UTC', user: 'Self-Improvement Agent', requiredApprover: 'Data Science Lead' }],
    },
    {
        id: 'CR-002',
        timestamp: '2025-10-29 11:20 UTC',
        source: 'AI Agent',
        title: 'Switch embedding model for support tickets to `text-embedding-3-large`',
        description: 'The current model struggles with technical jargon in support tickets. A more advanced model could improve semantic search accuracy for complex issues.',
        impact: 'High',
        status: ChangeRequestStatus.BRDGeneration,
        approvalHistory: [
            { status: 'Created', timestamp: '2025-10-29 11:20 UTC', user: 'Self-Improvement Agent', requiredApprover: 'Data Science Lead' },
            { status: 'Approved', timestamp: '2025-10-29 13:00 UTC', user: 'Admin', notes: 'High potential ROI, proceed to BRD.', requiredApprover: 'Product Manager' }
        ],
    },
    {
        id: 'CR-003',
        timestamp: '2025-10-28 15:00 UTC',
        source: 'User Feedback',
        title: 'Add a Dark Mode toggle to the UI',
        description: 'A user submitted feedback requesting a dark mode option for the UI to reduce eye strain during night-time work sessions.',
        impact: 'Low',
        status: ChangeRequestStatus.Implementation,
        brdContent: `**Project Name:** UI Dark Mode Feature\n\n**1. Overview:** Implement a user-toggleable dark theme for the application interface to improve user experience in low-light environments.\n\n**2. Requirements:**\n- A toggle switch should be available in the user settings menu.\n- All UI components (text, backgrounds, buttons, charts) must have a corresponding dark theme style.\n- The selected theme should persist across user sessions.`,
        approvalHistory: [
            { status: 'Created', timestamp: '2025-10-28 15:00 UTC', user: 'Feedback System', requiredApprover: 'Product Manager' },
            { status: 'Approved', timestamp: '2025-10-28 16:00 UTC', user: 'Admin', requiredApprover: 'Product Manager' },
            { status: 'BRD Generated', timestamp: '2025-10-28 16:05 UTC', user: 'Gemini 2.5 Pro' },
            { status: 'BRD Approved', timestamp: '2025-10-28 17:30 UTC', user: 'Admin', notes: 'BRD is sufficient. Proceed.', requiredApprover: 'Engineering Lead' }
        ],
        implementationLLM: 'Claude 3 Opus',
    },
     {
        id: 'CR-004',
        timestamp: '2025-10-27 10:00 UTC',
        source: 'AI Agent',
        title: 'Add `customer_location` as a node property in the Customer 360 KG',
        description: 'Multiple analytical queries required an extra hop to find customer locations. Adding it directly to the customer node will speed up geo-based queries by approx. 2x.',
        impact: 'Medium',
        status: ChangeRequestStatus.Completed,
        brdContent: `**BRD:** Add a new property 'location' of type String to the 'Customer' node in the Neo4j graph schema. Update the 'Customer 360 Knowledge Graph' pipeline (pl-001) to populate this property from the 'CUSTOMERS.customer_address' column in Snowflake.`,
        approvalHistory: [
            { status: 'Created', timestamp: '2025-10-27 10:00 UTC', user: 'Self-Improvement Agent', requiredApprover: 'Data Science Lead' },
            { status: 'Approved', timestamp: '2025-10-27 11:00 UTC', user: 'Admin', requiredApprover: 'Product Manager' },
            { status: 'BRD Generated', timestamp: '2025-10-27 11:05 UTC', user: 'Gemini 2.5 Pro' },
            { status: 'BRD Approved', timestamp: '2025-10-27 11:30 UTC', user: 'Admin', requiredApprover: 'Engineering Lead' },
            { status: 'Implementation Complete', timestamp: '2025-10-27 14:00 UTC', user: 'Gemini 2.5 Pro'},
            { status: 'Testing Passed', timestamp: '2025-10-27 16:00 UTC', user: 'QA Automation', requiredApprover: 'QA Lead', evidenceLink: 'https://jira.example.com/TEST-123' },
            { status: 'UAT Passed', timestamp: '2025-10-28 10:00 UTC', user: 'Business Analyst', requiredApprover: 'Business Owner', evidenceLink: 'https://wiki.example.com/UAT-Signoff' },
            { status: 'Deployed to Prod', timestamp: '2025-10-28 11:00 UTC', user: 'Admin', requiredApprover: 'Security Officer', evidenceLink: 'https://splunk.example.com/deployment-log-123' }
        ],
        implementationLLM: 'Gemini 2.5 Pro',
    },
];

export const MOCK_CHANGELOG: ChangelogEntry[] = [
    { version: '1.8.0', date: '2025-11-08', title: 'AI Agent Integration & UI Functionality', description: 'Implemented functional modals for creating new pipelines, batch jobs, and discovery configurations. Activated the "Run Discovery" button. Introduced a new AI Security Agent to automatically detect and report security incidents, with configuration options in Settings.' },
    { version: '1.7.0', date: '2025-11-05', title: 'SOC 2 Compliance Framework', description: "Implemented a comprehensive suite of features for SOC 2 readiness, including a Security Incident Response Hub, Vendor Risk Management, formal Policy Hub, and explicit controls for MFA, session timeout, data encryption, and disaster recovery." },
    { version: '1.6.0', date: '2025-11-02', title: 'SOX Compliance and Auditing', description: "Introduced a comprehensive SOX compliance module, including quarterly user access reviews, strict change control policies, and an enhanced audit trail. The change approval workflow now requires evidence for key stages." },
    { version: '1.5.0', date: '2025-10-31', title: 'System Console, RBAC Security, and Expanded Connectivity', description: "Introduced a new System Console for real-time logging, a comprehensive RBAC security module in Settings, and added support for Databricks, Azure, and Redis connections. The Help & Docs section has been completely overhauled with full CLI documentation." },
    { version: '1.4.2', date: '2025-10-28', title: 'Enhanced Customer 360 Graph', description: "Added `customer_location` as a direct node property in the Customer 360 Knowledge Graph to accelerate geo-based queries. This was implemented via change request CR-004." },
    { version: '1.4.1', date: '2025-10-25', title: 'Security Patch', description: 'Addressed a potential XSS vulnerability in the agent log viewer.' },
    { version: '1.4.0', date: '2025-10-22', title: 'Data Lineage Module', description: 'Launched the new Data Lineage Explorer feature for visualizing object dependencies.' },
];

export const MOCK_ENVIRONMENTS: EnvironmentConfig[] = [
    { name: 'Dev', url: 'https://dev.platform.internal', apiKey: 'dev_xxxxxxxxxxxx', status: 'Active' },
    { name: 'Test', url: 'https://test.platform.internal', apiKey: 'test_xxxxxxxxxxxx', status: 'Active' },
    { name: 'UAT', url: 'https://uat.platform.internal', apiKey: 'uat_xxxxxxxxxxxx', status: 'Inactive' },
    { name: 'Prod', url: 'https://app.platform.com', apiKey: 'prod_xxxxxxxxxxxx', status: 'Active' },
];

export const MOCK_DB_CONNECTIONS: DatabaseConnection[] = [
    {
        id: 'conn-sf-001',
        name: 'Production Snowflake WH',
        type: DatabaseConnectionType.Snowflake,
        account: 'ab12345.us-east-1',
        warehouse: 'COMPUTE_WH',
        database: 'PROD',
        schema: 'PUBLIC',
        username: 'prod_user',
        status: 'Connected',
    },
    {
        id: 'conn-db-001',
        name: 'Marketing Event Stream',
        type: DatabaseConnectionType.Databricks,
        host: 'adb-marketing.azuredatabricks.net',
        httpPath: '/sql/1.0/warehouses/abcde12345',
        status: 'Connected',
    },
    {
        id: 'conn-001',
        name: 'Primary Knowledge Graph',
        type: DatabaseConnectionType.Neo4j,
        host: 'neo4j.prod.internal',
        port: 7687,
        username: 'neo4j_admin',
        password: 'supersecretpassword',
        status: 'Connected',
    },
    {
        id: 'conn-002',
        name: 'Vector Embeddings Store',
        type: DatabaseConnectionType.Pinecone,
        token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        status: 'Connected',
    },
    {
        id: 'conn-003',
        name: 'Staging Graph DB',
        type: DatabaseConnectionType.AWSNeptune,
        host: 'staging-neptune.cluster-xxxx.us-east-1.neptune.amazonaws.com',
        port: 8182,
        username: 'iam_user',
        password: 'stagingpassword',
        status: 'Disconnected',
    },
];


export const DB_CONNECTION_METADATA = {
    [DatabaseConnectionType.Neo4j]: {
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'bolt://localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '7687' },
            { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'neo4j' },
            { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
        ],
        docsUrl: 'https://neo4j.com/docs/getting-started/current/',
        videoUrl: 'https://www.youtube.com/watch?v=sKta2v_2_kY'
    },
    [DatabaseConnectionType.Pinecone]: {
        fields: [
            { name: 'token', label: 'API Key', type: 'password', required: true, placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
        ],
        docsUrl: 'https://docs.pinecone.io/home',
        videoUrl: 'https://www.youtube.com/watch?v=__-0g_G_3A0'
    },
    [DatabaseConnectionType.Snowflake]: {
        fields: [
            { name: 'account', label: 'Account Identifier', type: 'text', required: true, placeholder: 'your_account.us-east-1' },
            { name: 'warehouse', label: 'Warehouse', type: 'text', required: true, placeholder: 'COMPUTE_WH' },
            { name: 'database', label: 'Database', type: 'text', required: true, placeholder: 'PROD_DB' },
            { name: 'schema', label: 'Schema', type: 'text', required: true, placeholder: 'PUBLIC' },
            { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'snowflake_user' },
            { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
        ],
        docsUrl: 'https://docs.snowflake.com/en/user-guide/connecting',
        videoUrl: 'https://www.youtube.com/watch?v=yM_42_3c-DA'
    },
    [DatabaseConnectionType.ChromaDB]: {
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'http://localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '8000' },
        ],
        docsUrl: 'https://docs.trychroma.com/getting-started',
        videoUrl: 'https://www.youtube.com/watch?v=K3w_c5s_2pA'
    },
    [DatabaseConnectionType.PostgreSQL]: {
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '5432' },
            { name: 'database', label: 'Database', type: 'text', required: true, placeholder: 'mydatabase' },
            { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'postgres' },
            { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
        ],
        docsUrl: 'https://www.postgresql.org/docs/current/libpq-connect.html',
        videoUrl: 'https://www.youtube.com/watch?v=hVf1gJCsunM'
    },
    [DatabaseConnectionType.AWSNeptune]: {
        fields: [
            { name: 'host', label: 'Cluster Endpoint', type: 'text', required: true, placeholder: 'your-cluster.cluster-xxxx.us-east-1.neptune.amazonaws.com' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '8182' },
            { name: 'username', label: 'IAM Username (Optional)', type: 'text', required: false, placeholder: 'iam_user' },
            { name: 'password', label: 'IAM Password (Optional)', type: 'password', required: false, placeholder: '••••••••' },
        ],
        docsUrl: 'https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-gremlin-console.html',
        videoUrl: 'https://www.youtube.com/watch?v=ReK9-0IsY78'
    },
    [DatabaseConnectionType.Databricks]: {
        fields: [
            { name: 'host', label: 'Workspace URL', type: 'text', required: true, placeholder: 'adb-xxxx.azuredatabricks.net' },
            { name: 'httpPath', label: 'HTTP Path', type: 'text', required: true, placeholder: '/sql/1.0/warehouses/xxxx' },
            { name: 'token', label: 'Access Token', type: 'password', required: true, placeholder: 'dapi-xxxxxxxxxxxxxxxx' },
        ],
        docsUrl: 'https://docs.databricks.com/en/integrations/connectors/python-sql-connector.html',
        videoUrl: 'https://www.youtube.com/watch?v=u-4-tHnh_k8'
    },
    [DatabaseConnectionType.AzureSynapse]: {
        fields: [
            { name: 'server', label: 'Server', type: 'text', required: true, placeholder: 'your-workspace.sql.azuresynapse.net' },
            { name: 'database', label: 'Database', type: 'text', required: true, placeholder: 'SQLPOOL1' },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
        ],
        docsUrl: 'https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-connection-strings',
        videoUrl: 'https://www.youtube.com/watch?v=9L2P_qT-s5o'
    },
    [DatabaseConnectionType.AzureSQL]: {
        fields: [
            { name: 'server', label: 'Server', type: 'text', required: true, placeholder: 'your-server.database.windows.net' },
            { name: 'database', label: 'Database', type: 'text', required: true, placeholder: 'your-database' },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
        ],
        docsUrl: 'https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-python',
        videoUrl: 'https://www.youtube.com/watch?v=c2t4Evy_L0s'
    },
    [DatabaseConnectionType.Redis]: {
        fields: [
            { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
            { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '6379' },
            { name: 'password', label: 'Password (Optional)', type: 'password', required: false, placeholder: '••••••••' },
        ],
        docsUrl: 'https://redis.io/docs/latest/develop/connect/clients/python/',
        videoUrl: 'https://www.youtube.com/watch?v=j_vKBU2t3gU'
    }
};

export const MOCK_CONSOLE_LOGS: ConsoleLog[] = [
    { id: 1, timestamp: '10:01:15', level: 'INFO', category: 'System Event', message: 'Application server started successfully on port 8080.' },
    { id: 2, timestamp: '10:01:18', level: 'INFO', category: 'API Call', message: 'Connection test initiated for `Primary Knowledge Graph` (conn-001).', user: 'Admin' },
    { id: 3, timestamp: '10:01:19', level: 'SUCCESS', category: 'API Call', message: 'Connection `Primary Knowledge Graph` (conn-001) test successful.', user: 'Admin' },
    { id: 4, timestamp: '10:02:30', level: 'INFO', category: 'User Action', message: 'User navigated to Data Sources page.', user: 'Data Analyst' },
    { id: 5, timestamp: '10:03:00', level: 'INFO', category: 'System Event', message: 'Nightly batch job `job-001` scheduled to run at 02:00 UTC.' },
    { id: 6, timestamp: '10:05:22', level: 'WARN', category: 'System Event', message: 'Resource usage high on Databricks cluster: 85% CPU utilization.' },
    { id: 7, timestamp: '10:06:45', level: 'INFO', category: 'User Action', message: 'User approved change request `CR-001`. Status changed to BRD Generation.', user: 'Admin' },
    { id: 8, timestamp: '10:08:10', level: 'ERROR', category: 'API Call', message: 'Failed to connect to data source `Customer Support Synapse` (ds-004): Invalid credentials.', user: 'System' },
    { id: 9, timestamp: '10:10:00', level: 'INFO', category: 'Security', message: 'User `Admin` logged in successfully from IP 192.168.1.100.' },
    { id: 10, timestamp: '10:11:05', level: 'SUCCESS', category: 'System Event', message: 'Pipeline `pl-001` completed successfully. Duration: 45 min.' },
    { id: 11, timestamp: '10:12:50', level: 'WARN', category: 'Security', message: 'Failed login attempt for user `unknown_user` from IP 203.0.113.55.' },
    { id: 12, timestamp: '10:14:00', level: 'SUCCESS', category: 'Audit', message: 'RBAC permissions for role `Business Analyst` updated successfully.', user: 'Admin' },
    { id: 13, timestamp: '10:15:00', level: 'SUCCESS', category: 'Audit', message: 'Change request `CR-004` deployed to Production.', user: 'Admin' },
    { id: 14, timestamp: '10:16:21', level: 'INFO', category: 'Audit', message: 'Quarterly Access Review `Q4 2025` initiated.', user: 'Admin' },
    { id: 15, timestamp: '10:18:00', level: 'WARN', category: 'Access Control', message: 'Global setting updated: MFA is now enforced for all users.', user: 'Admin' },
    { id: 16, timestamp: '10:19:30', level: 'INFO', category: 'Security', message: 'Security incident `INC-001` created: "Suspicious Login Activity".', user: 'Security Officer' },
];

export const MOCK_PERMISSIONS: Permission[] = [
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the main dashboard and metrics.' },
    { id: 'manage_datasources', name: 'Manage Data Sources', description: 'Can add, edit, and delete data sources.' },
    { id: 'manage_pipelines', name: 'Manage Pipelines', description: 'Can create, edit, run, and schedule pipelines.' },
    { id: 'manage_batch', name: 'Manage Batch Jobs', description: 'Can create and manage batch processing jobs.' },
    { id: 'view_lineage', name: 'View Data Lineage', description: 'Can access and explore the data lineage graph.' },
    { id: 'approve_changes', name: 'Approve Changes', description: 'Can approve or reject change requests.' },
    { id: 'manage_settings', name: 'Manage System Settings', description: 'Can modify application settings, including connections and notifications.' },
    { id: 'manage_security', name: 'Manage Security', description: 'Can manage user roles, permissions, and security settings.' },
    { id: 'manage_incidents', name: 'Manage Security Incidents', description: 'Can create, update, and resolve security incidents.' },
];

export const MOCK_ROLES: Role[] = [
    {
        id: 'role_admin',
        name: 'Admin',
        description: 'Has full access to all platform features and settings.',
        permissions: ['view_dashboard', 'manage_datasources', 'manage_pipelines', 'manage_batch', 'view_lineage', 'approve_changes', 'manage_settings', 'manage_security', 'manage_incidents'],
    },
    {
        id: 'role_engineer',
        name: 'Data Engineer',
        description: 'Can manage data infrastructure like sources, pipelines, and jobs.',
        permissions: ['view_dashboard', 'manage_datasources', 'manage_pipelines', 'manage_batch', 'view_lineage'],
    },
    {
        id: 'role_analyst',
        name: 'Business Analyst',
        description: 'Can view data and reports, but cannot modify infrastructure.',
        permissions: ['view_dashboard', 'view_lineage'],
    },
    {
        id: 'role_security',
        name: 'Security Officer',
        description: 'Manages security settings, compliance, and incident response.',
        permissions: ['manage_security', 'manage_incidents', 'approve_changes'],
    }
];

export const MOCK_ACCESS_REVIEWS: AccessReview[] = [
    {
        id: 'ar-002',
        quarter: 'Q4 2025',
        status: 'In Progress',
        dueDate: '2026-01-15',
        reviewer: 'Security Officer',
        userAccessList: [
            { userId: 'u001', userName: 'Admin', role: 'Admin', lastLogin: '2025-10-31', isCertified: false },
            { userId: 'u002', userName: 'Data Engineer', role: 'Data Engineer', lastLogin: '2025-10-30', isCertified: false },
            { userId: 'u003', userName: 'Data Analyst', role: 'Business Analyst', lastLogin: '2025-10-31', isCertified: true },
        ],
    },
    {
        id: 'ar-001',
        quarter: 'Q3 2025',
        status: 'Completed',
        dueDate: '2025-10-15',
        completedDate: '2025-10-12',
        reviewer: 'Security Officer',
        userAccessList: [],
    },
];

export const MOCK_VENDORS: Vendor[] = [
    { id: 'ven-001', name: 'Google Cloud', service: 'LLM Provider (Gemini)', risk: 'High', status: 'Active', lastReview: '2025-09-15', nextReview: '2026-03-15' },
    { id: 'ven-002', name: 'AWS', service: 'Cloud Infrastructure', risk: 'High', status: 'Active', lastReview: '2025-08-20', nextReview: '2026-02-20' },
    { id: 'ven-003', name: 'Datadog', service: 'Monitoring & SIEM', risk: 'Medium', status: 'Active', lastReview: '2025-10-01', nextReview: '2026-04-01' },
    { id: 'ven-004', name: 'Okta', service: 'Identity Provider (SSO)', risk: 'High', status: 'Active', lastReview: '2025-09-05', nextReview: '2026-03-05' },
];

export const MOCK_SECURITY_INCIDENTS: SecurityIncident[] = [
    {
        id: 'INC-001',
        title: 'Suspicious Login Activity from Unrecognized IP',
        severity: 'High',
        status: 'Investigating',
        reportedBy: 'System Monitor',
        reportedAt: '2025-11-04 14:30 UTC',
        description: 'Multiple failed login attempts for user `Admin` were detected from IP address 198.51.100.82, followed by a successful login.',
        timeline: [
            { timestamp: '2025-11-04 14:30 UTC', status: 'Reported', notes: 'Automated alert triggered by anomaly detection.', user: 'System' },
            { timestamp: '2025-11-04 14:35 UTC', status: 'Investigating', notes: 'Security Officer acknowledged the alert. Affected user account has been temporarily locked. Initiating investigation.', user: 'Security Officer' },
        ],
    },
    {
        id: 'INC-002',
        title: 'Potential Data Exfiltration via Leaked API Key',
        severity: 'Critical',
        status: 'Contained',
        reportedBy: 'Data Engineer',
        reportedAt: '2025-10-28 09:00 UTC',
        description: 'A development API key for the Snowflake data warehouse was found in a public code repository.',
        timeline: [
            { timestamp: '2025-10-28 09:00 UTC', status: 'Reported', notes: 'Key discovered during routine code scan.', user: 'Data Engineer' },
            { timestamp: '2025-10-28 09:05 UTC', status: 'Investigating', notes: 'Incident response team assembled.', user: 'Security Officer' },
            { timestamp: '2025-10-28 09:15 UTC', status: 'Contained', notes: 'Leaked API key has been revoked. Auditing logs for unauthorized access.', user: 'Admin' },
        ],
    },
    {
        id: 'INC-003',
        title: 'Phishing Email Reported by User',
        severity: 'Low',
        status: 'Resolved',
        reportedBy: 'Data Analyst',
        reportedAt: '2025-11-03 11:00 UTC',
        description: 'User reported a suspicious email asking for their platform credentials.',
        timeline: [
            { timestamp: '2025-11-03 11:00 UTC', status: 'Reported', notes: 'User forwarded phishing email to security team.', user: 'Data Analyst' },
            { timestamp: '2025-11-03 11:15 UTC', status: 'Investigating', notes: 'Email headers analyzed. Confirmed as phishing attempt.', user: 'Security Officer' },
            { timestamp: '2025-11-03 12:00 UTC', status: 'Resolved', notes: 'Email domain blocked at gateway. Reminder sent to all staff about phishing awareness.', user: 'Security Officer' },
        ],
    },
];

export const MOCK_DR_PLAN: DisasterRecoveryPlan = {
    lastFullBackup: '2025-11-05 04:00 UTC',
    backupFrequency: 'Daily',
    lastDrTestDate: '2025-09-20',
    drTestFrequency: 'Quarterly',
    rpo: '24 hours',
    rto: '4 hours',
};

export const MOCK_POLICIES: PolicyDocument[] = [
    { id: 'pol-01', title: 'Acceptable Use Policy (AUP)', version: '2.1', lastUpdated: '2025-08-01', owner: 'CISO', url: '#' },
    { id: 'pol-02', title: 'Incident Response Plan', version: '1.5', lastUpdated: '2025-09-15', owner: 'Security Team', url: '#' },
    { id: 'pol-03', title: 'Data Classification Policy', version: '2.0', lastUpdated: '2025-07-10', owner: 'Data Governance', url: '#' },
    { id: 'pol-04', title: 'Vendor Management Policy', version: '1.2', lastUpdated: '2025-10-01', owner: 'CISO', url: '#' },
];

export const MOCK_LLM_PROVIDER_CONFIGS: LLMProviderConfig[] = [
    { id: 'llm-p-1', name: 'Gemini 2.5 Pro (Prod)', provider: 'Gemini', apiKey: 'prod_gemini_key_xxxx' },
    { id: 'llm-p-2', name: 'Claude 3 Opus (Dev)', provider: 'Claude', apiKey: 'dev_claude_key_xxxx' },
    { id: 'llm-p-3', name: 'GPT-4o (Analytics)', provider: 'OpenAI', apiKey: 'analytics_openai_key_xxxx' },
];

export const MOCK_AGENT_CONFIGS: AgentConfig[] = [
    { id: 'agent-1', name: 'General Orchestration Agent', description: 'Monitors, logs, and coordinates all activities across the platform, including data lineage, agent performance, and resource usage.', llmProviderConfigId: 'llm-p-1' },
    { id: 'agent-2', name: 'Data Catalog Agent', description: 'Analyzes relational schema and existing metadata to generate an LLM-native data dictionary.', llmProviderConfigId: 'llm-p-2' },
    { id: 'agent-3', name: 'Self-Improvement (RAG Evolution) Agent', description: 'Logs potential improvements to RAG performance (e.g., changes to chunking, new embedding models, or data sources) in a separate Performance Augmentation Log.', llmProviderConfigId: 'llm-p-1' },
    { id: 'agent-4', name: 'Security Incident Automation Agent', description: 'Automatically detects and reports potential security incidents based on system log analysis.', llmProviderConfigId: 'llm-p-3' },
];

export const MOCK_WORKFLOWS: Workflow[] = [
    {
        id: 'wf-001',
        name: 'Default Ingestion Workflow',
        nodes: [
            { id: 'start', type: 'Start', position: { x: 50, y: 200 }, data: { label: 'Start' } },
            { id: 'read', type: 'Action', position: { x: 250, y: 200 }, data: { label: 'Read from Source', actionType: 'Read' } },
            { id: 'agent-catalog', type: 'Agent', position: { x: 500, y: 200 }, data: { label: 'Data Catalog Agent', agentId: 'agent-2' } },
            { id: 'write', type: 'Action', position: { x: 750, y: 200 }, data: { label: 'Write to GraphDB', actionType: 'WriteGraph' } },
            { id: 'end', type: 'End', position: { x: 1000, y: 200 }, data: { label: 'End' } },
        ],
        edges: [
            { id: 'e1', source: 'start', target: 'read' },
            { id: 'e2', source: 'read', target: 'agent-catalog' },
            { id: 'e3', source: 'agent-catalog', target: 'write' },
            { id: 'e4', source: 'write', target: 'end' },
        ],
    },
    {
        id: 'wf-002',
        name: 'Complex RAG Enrichment',
        nodes: [],
        edges: [],
    }
