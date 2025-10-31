import React from 'react';
import Card from '../common/Card';
import { ClipboardCheck } from 'lucide-react';

const ChangesApprovals: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full text-center">
                <div className="flex flex-col items-center">
                    <ClipboardCheck size={48} className="text-brand-accent mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Changes & Approvals</h2>
                    <p className="text-brand-muted">
                        This feature is under development. Review, approve, and track changes to critical configurations and production environments.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ChangesApprovals;
