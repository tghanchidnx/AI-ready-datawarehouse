import React from 'react';
import Card from '../common/Card';
import { Layers3 } from 'lucide-react';

const BatchProcessing: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full text-center">
                <div className="flex flex-col items-center">
                    <Layers3 size={48} className="text-brand-accent mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Batch Processing</h2>
                    <p className="text-brand-muted">
                        This feature is under development. Define and manage large-scale, offline data processing jobs here.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default BatchProcessing;
