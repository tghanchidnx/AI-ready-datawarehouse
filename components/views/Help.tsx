import React from 'react';
import Card from '../common/Card';
import { LifeBuoy, BookOpen } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help & Documentation</h1>
      <Card title="Frequently Asked Questions">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white">How do I add a new data source?</h4>
            <p className="text-sm text-brand-muted">Navigate to Settings > Connections and click "Add New Connection". Follow the instructions for your specific database type.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">My pipeline failed. What should I do?</h4>
            <p className="text-sm text-brand-muted">Check the System Console for detailed error logs. The logs often provide specific reasons for the failure, such as connection issues or data transformation errors.</p>
          </div>
        </div>
      </Card>
       <Card title="Resources">
        <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-brand-accent hover:underline">
                <BookOpen size={18} /> Documentation
            </a>
             <a href="#" className="flex items-center gap-2 text-brand-accent hover:underline">
                <LifeBuoy size={18} /> Contact Support
            </a>
        </div>
      </Card>
    </div>
  );
};

export default Help;
