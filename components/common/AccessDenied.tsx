import React from 'react';
import Card from './Card';
import { Lock } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-md w-full text-center">
        <div className="flex flex-col items-center">
          <Lock size={48} className="text-brand-danger mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-brand-muted">
            You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AccessDenied;
