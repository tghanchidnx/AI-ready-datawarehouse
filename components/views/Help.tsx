import React from 'react';
import Card from '../common/Card';
import { LifeBuoy, BookOpen, Bot, GitCommit, Terminal } from 'lucide-react';
import { APP_VERSION } from '../../constants';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help & Documentation</h1>

      <Card title="Using the AI Assistant">
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
          <p>The AI Assistant, accessible via the <Bot size={16} className="inline-block text-brand-accent" /> icon in the bottom-right corner, allows you to control the application using natural language.</p>
          
          <div>
            <h4 className="font-semibold text-white">What can it do?</h4>
            <ul>
              <li><strong>Navigate:</strong> Quickly jump to any section of the application.</li>
              <li><strong>Create Items:</strong> Start common workflows like creating a new pipeline or batch job.</li>
              <li><strong>Get Information:</strong> Ask for an explanation of the current page.</li>
              <li><strong>Search Docs:</strong> Ask "how to" questions to find relevant information.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white">Example Commands:</h4>
            <ul className="list-disc pl-5">
              <li><em>"Take me to the data sources view."</em></li>
              <li><em>"Create a new pipeline."</em></li>
              <li><em>"What is the purpose of the Data Lineage view?"</em></li>
              <li><em>"How do I set up a new connection in settings?"</em></li>
            </ul>
          </div>
          
          <div>
              <h4 className="font-semibold text-white">Feature Requests</h4>
              <p>If you ask the assistant to do something it can't, it will automatically log your request as a new item in the <strong>Changes & Approvals</strong> queue. This helps our team prioritize and build the features you need most.</p>
          </div>
        </div>
      </Card>
      
      <Card title="Frequently Asked Questions">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white">How do I add a new data source?</h4>
            <p className="text-sm text-brand-muted">Navigate to Settings > Connections and click "Add New Connection". Follow the instructions for your specific database type. You can also ask the assistant: <em>"Take me to the connections settings."</em></p>
          </div>
          <div>
            <h4 className="font-semibold text-white">My pipeline failed. What should I do?</h4>
            <p className="text-sm text-brand-muted">Check the System Console for detailed error logs. The logs often provide specific reasons for the failure, such as connection issues or data transformation errors. Try asking the assistant: <em>"Show me the system console."</em></p>
          </div>
          <div>
            <h4 className="font-semibold text-white">How do I configure Single Sign-On (SSO)?</h4>
            <p className="text-sm text-brand-muted">Go to Settings > Authentication. From there, you can enable SSO and configure your identity provider (e.g., Okta, Azure AD).</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Changelog">
            <div className="space-y-3">
                <div>
                    <h4 className="font-semibold text-white flex items-center gap-2"><GitCommit size={16} className="text-brand-accent" /> Version {APP_VERSION} (Current)</h4>
                    <ul className="list-disc pl-5 text-sm text-brand-muted mt-1">
                        <li>Implemented multi-stage Changes & Approvals workflow.</li>
                        <li>Added Batch Processing module.</li>
                        <li>Enhanced Help & Docs with CLI reference and changelog.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Version 1.1.0</h4>
                    <ul className="list-disc pl-5 text-sm text-brand-muted mt-1">
                        <li>Introduced AI Assistant for natural language control.</li>
                        <li>Overhauled Settings with new Compliance and Agent tabs.</li>
                        <li>Added interactive Data Lineage graph.</li>
                    </ul>
                </div>
            </div>
        </Card>
        <Card title="CLI Command Reference">
             <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                <p>Use the `rgv-te` (Relational-to-Graph/Vector Transformation Engine) CLI for automation and advanced configuration.</p>
                <pre className="bg-brand-primary border border-brand-border rounded-md">
                    <code>
                        <span className="text-gray-500"># Initialize a new project</span><br/>
                        <span className="text-green-400">rgv-te</span> init --project my-project<br/><br/>
                        <span className="text-gray-500"># Start a transformation pipeline</span><br/>
                        <span className="text-green-400">rgv-te</span> start-pipeline --name customer-ingestion<br/><br/>
                        <span className="text-gray-500"># Deploy to a new environment</span><br/>
                        <span className="text-green-400">rgv-te</span> deploy --env staging
                    </code>
                </pre>
            </div>
        </Card>
      </div>

       <Card title="Resources">
        <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 text-brand-accent hover:underline">
                <BookOpen size={18} /> Full CLI Documentation
            </a>
            <a href="#" className="flex items-center gap-2 text-brand-accent hover:underline">
                <Terminal size={18} /> API Reference
            </a>
             <a href="#" className="flex items-center gap-2 text-brand-accent hover:underline">
                <LifeBuoy size={18} /> Contact Enterprise Support
            </a>
        </div>
      </Card>
    </div>
  );
};

export default Help;