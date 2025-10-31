import React from 'react';
import Card from '../common/Card';
import { MOCK_CHANGELOG, MOCK_POLICIES } from '../../constants';
import { BookUser } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help & Documentation</h1>
      
      <div className="space-y-8">
        <Card title="Changelog">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {MOCK_CHANGELOG.map(entry => (
                    <div key={entry.version} className="border-l-4 border-brand-accent pl-4">
                        <div className="flex items-baseline space-x-2">
                            <h4 className="text-lg font-semibold text-white">Version {entry.version}</h4>
                            <p className="text-sm text-brand-muted">{entry.date}</p>
                        </div>
                        <h5 className="font-semibold text-gray-300 mt-1">{entry.title}</h5>
                        <p className="text-sm text-gray-400">{entry.description}</p>
                    </div>
                ))}
            </div>
        </Card>
        
        <Card title="Application Modules">
          <div className="prose prose-invert max-w-none text-gray-300">
            <p>This platform is composed of several powerful, interconnected modules:</p>
            <ul>
              <li><strong>Dashboard:</strong> Provides a real-time overview of system health, including running pipelines, agent query metrics, and recent logs.</li>
              <li><strong>Data Sources:</strong> Connect to and manage your enterprise data warehouses and data lakes. The platform's AI Data Catalog Agent automatically analyzes and describes schemas.</li>
              <li><strong>Pipelines:</strong> Define and monitor data transformation pipelines that convert relational data into AI-native Graph DBs (Neo4j) or Vector Embeddings (Pinecone).</li>
              <li><strong>Batch Processing:</strong> Schedule and manage large-scale, recurring data processing jobs based on your defined pipelines.</li>
              <li><strong>Relationship Discovery:</strong> Configure and run algorithms to automatically discover hidden relationships within and across your data sources.</li>
              <li><strong>Data Lineage:</strong> Visually explore the dependencies between your data assets, from raw tables to transformations and final reports.</li>
              <li><strong>Changes & Approvals:</strong> A full-featured, SOX-compliant workflow for managing system improvements, including multi-stage approvals, evidence requirements, and LLM-powered BRD generation.</li>
              <li><strong>Security Incidents:</strong> A dedicated hub for logging, tracking, and resolving security incidents. Features an AI Security Agent that can be configured to automatically detect and report potential threats.</li>
              <li><strong>System Console:</strong> A real-time, filterable log stream of all system events, user actions, API calls, and security/audit alerts for comprehensive observability.</li>
              <li><strong>Settings:</strong> Configure every aspect of the platform, including database connections, compliance policies, RBAC, environment endpoints, and the new AI Agent Management module.</li>
               <li><strong>AI Agent Management (in Settings):</strong> A new centralized hub to configure all AI agents. Manage LLM provider API keys, edit agent system prompts, and assign specific models to different agents.</li>
            </ul>
          </div>
        </Card>

        <Card title="CLI Commands">
          <div className="prose prose-invert max-w-none text-gray-300">
            <p>The CLI provides a powerful way to interact with and automate the platform.</p>
            <pre className="bg-brand-primary border border-brand-border rounded-md text-sm">
              <code>
                <span className="text-green-400"># DATA SOURCES & PIPELINES</span><br />
                platform datasources add --type snowflake ...<br />
                platform pipeline create --name "My New Pipeline" ...<br />
                platform pipeline run pl-001<br />
                platform job create --name "My New Job" --pipeline "My New Pipeline"<br />
                <br />
                 <span className="text-green-400"># AI AGENT MANAGEMENT</span><br />
                platform agents llm-provider add --name "Gemini Prod" --provider Gemini --key "..."<br />
                platform agents configure --agent "Security Agent" --llm-provider "Gemini Prod"<br />
                <br />
                <span className="text-green-400"># CHANGES & APPROVALS</span><br />
                platform changes approve CR-001 --evidence "https://jira.example.com/TEST-123"<br />
                <br />
                <span className="text-green-400"># SECURITY & COMPLIANCE</span><br />
                platform security rbac grant --role "Analyst" --permission "view_lineage"<br />
                platform security access-review start --quarter "Q1 2026"<br />
                platform security incident list<br />
                platform security incident create --title "Suspicious Activity" --severity High<br />
                platform security incident update INC-001 --status Investigating<br />
                platform security vendor list<br />
                platform security vendor review ven-001<br />
                <br />
                <span className="text-green-400"># CONSOLE & LOGS</span><br />
                platform console stream --category Audit<br />
              </code>
            </pre>
          </div>
        </Card>
        
        <Card title="Security & Compliance">
          <div className="prose prose-invert max-w-none text-gray-300">
            <h4 className="text-white">SOC 2 Compliance Support</h4>
            <p>The platform includes a robust set of features to help meet SOC 2 trust services criteria for Security, Availability, and Confidentiality.</p>
            <ul>
              <li><strong>Incident Response Management:</strong> A dedicated <strong>Security Incidents</strong> hub provides a formal process for reporting, investigating, and resolving security events, with a full audit trail of actions taken.</li>
              <li><strong>Vendor Risk Management:</strong> Under <strong>Settings &gt; Compliance</strong>, administrators can track and manage third-party vendors, ensuring they meet security standards.</li>
              <li><strong>Strict Access Controls:</strong> Policies for enforcing Multi-Factor Authentication (MFA) and setting session timeouts can be configured in Settings.</li>
              <li><strong>Data Encryption:</strong> The platform enforces industry-standard encryption (e.g., TLS 1.2+ in transit, AES-256 at rest). Key management policies are configurable in Settings.</li>
              <li><strong>Disaster Recovery Plan:</strong> The platform's business continuity status, including backup frequency and RPO/RTO, is visible in the SOC 2 Settings, ensuring availability.</li>
            </ul>

            <h4 className="text-white">SOX Compliance Support</h4>
            <ul>
              <li><strong>Auditable Change Management:</strong> The <strong>Changes & Approvals</strong> workflow enforces segregation of duties and requires evidence for all production changes.</li>
              <li><strong>Quarterly Access Reviews:</strong> The <strong>Settings &gt; Compliance</strong> section provides a system for conducting and documenting regular user access certifications.</li>
               <li><strong>Detailed Audit Trails:</strong> The System Console captures all significant events under the 'Audit' category, providing a clear record for auditors.</li>
            </ul>
          </div>
        </Card>

        <Card title="Company Policy Hub">
            <div className="space-y-3">
              {MOCK_POLICIES.map(policy => (
                <a key={policy.id} href={policy.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-brand-primary rounded-md border border-brand-border hover:border-brand-accent transition-colors">
                    <div className="flex items-center gap-3">
                        <BookUser className="text-brand-accent" size={20} />
                        <div>
                            <p className="font-semibold text-white">{policy.title}</p>
                            <p className="text-xs text-brand-muted">Version {policy.version} &bull; Owner: {policy.owner}</p>
                        </div>
                    </div>
                    <span className="text-xs text-brand-muted">Last Updated: {policy.lastUpdated}</span>
                </a>
              ))}
            </div>
        </Card>

        <Card title="Deployment Instructions">
          <div className="prose prose-invert max-w-none text-gray-300">
            <h4 className="text-white">Cloud Deployment (AWS)</h4>
            <ol>
              <li>Deploy the provided CloudFormation template to set up the VPC, EKS cluster, and IAM roles.</li>
              <li>Configure the `secrets.env` file with your database credentials and LLM API keys.</li>
              <li>Apply the Kubernetes deployment manifests using `kubectl apply -f .`</li>
            </ol>
            <h4 className="text-white">On-Prem Deployment</h4>
            <p>For on-premise deployment, please contact support for a customized installation guide. This typically involves Docker Compose or a standalone Kubernetes cluster.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;
