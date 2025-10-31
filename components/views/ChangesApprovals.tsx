import React, { useState } from 'react';
import Card from '../common/Card';
import { ClipboardCheck, Check, X, Bot, GitCommit, AlertTriangle, User, FileText, BotMessageSquare, Loader } from 'lucide-react';
import type { ChangeRequest, ChangeRequestSource, ApprovalStage } from '../../types';
import Tooltip from '../common/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI } from '@google/genai';

interface ChangesApprovalsProps {
    changeRequests: ChangeRequest[];
    setChangeRequests: React.Dispatch<React.SetStateAction<ChangeRequest[]>>;
}

const SourceIcon: React.FC<{ source: ChangeRequestSource | string }> = ({ source }) => {
    const iconMap: Partial<Record<ChangeRequestSource, React.ReactNode>> = {
        'AI Assistant Feedback': <Bot size={20} className="text-purple-400" />,
        'Schema Change': <GitCommit size={20} className="text-blue-400" />,
        'Performance Anomaly': <AlertTriangle size={20} className="text-orange-400" />,
        'Manual Submission': <User size={20} className="text-gray-400" />,
    };
    const icon = iconMap[source as ChangeRequestSource] || <User size={20} className="text-gray-400"/>;
    return <Tooltip text={source}>{icon}</Tooltip>;
}

const StageStatusIcon: React.FC<{ status: ApprovalStage['status'] }> = ({ status }) => {
    const iconMap = {
        'Completed': <Check size={16} className="text-green-400" />,
        'Approved': <Check size={16} className="text-green-400" />,
        'In Progress': <Loader size={16} className="text-blue-400 animate-spin" />,
        'Pending': <div className="w-2 h-2 rounded-full bg-gray-500"></div>,
        'Rejected': <X size={16} className="text-red-400" />,
    };
    return <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-secondary border border-brand-border">{iconMap[status]}</div>;
};

const ChangesApprovals: React.FC<ChangesApprovalsProps> = ({ changeRequests, setChangeRequests }) => {
    const { effectiveUser, can } = useAuth();
    const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(changeRequests[0] || null);
    const [isBrdLoading, setIsBrdLoading] = useState(false);

    const updateRequest = (id: string, updates: Partial<ChangeRequest>) => {
        const updatedRequests = changeRequests.map(req => req.id === id ? { ...req, ...updates } : req);
        setChangeRequests(updatedRequests);
        // Also update the selectedRequest state if it's the one being changed
        if (selectedRequest?.id === id) {
            setSelectedRequest(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleAdvanceStage = (id: string, notes?: string) => {
        const req = changeRequests.find(r => r.id === id);
        if (!req) return;

        const currentStageIndex = req.stages.findIndex(s => s.name === req.currentStage);
        if (currentStageIndex === -1 || currentStageIndex === req.stages.length - 1) return;

        const nextStage = req.stages[currentStageIndex + 1];
        
        const newStages = req.stages.map((stage, index) => {
            if (index === currentStageIndex) {
                return { ...stage, status: 'Completed' as const, approver: effectiveUser.name, timestamp: new Date().toISOString(), notes };
            }
            if (index === currentStageIndex + 1) {
                 return { ...stage, status: 'In Progress' as const };
            }
            return stage;
        });

        const newAuditEntry = {
            timestamp: new Date().toISOString(),
            user: effectiveUser.email,
            action: `Approved Stage: "${req.currentStage}"`,
            details: notes,
        };
        
        updateRequest(id, {
            stages: newStages,
            currentStage: nextStage.name,
            auditTrail: [...req.auditTrail, newAuditEntry],
        });
    };

    const handleGenerateBrd = async (req: ChangeRequest) => {
        setIsBrdLoading(true);
        const prompt = `Based on the following change request, generate a formal Business Requirements Document (BRD) in Markdown format. The BRD should be concise and suitable for a final executive review.
        
        **Title:** ${req.title}
        **Description:** ${req.description}
        **Source:** ${req.requestedBy}`;

        try {
            // In a real app, process.env.API_KEY would be securely managed.
            if (!process.env.API_KEY) {
              throw new Error("API_KEY environment variable not set.");
            }
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            
            const brdText = response.text;
            
            const brdAuditEntry = { timestamp: new Date().toISOString(), user: 'AI Assistant', action: 'Generated BRD' };
            updateRequest(req.id, { generatedBRD: brdText, auditTrail: [...req.auditTrail, brdAuditEntry] });
        } catch (error) {
            console.error("Error generating BRD:", error);
            const errorAuditEntry = { timestamp: new Date().toISOString(), user: 'System', action: 'BRD Generation Failed', details: (error as Error).message };
            updateRequest(req.id, { auditTrail: [...req.auditTrail, errorAuditEntry] });
        } finally {
            setIsBrdLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 flex flex-col">
                <Card className="flex-grow">
                    <h2 className="text-xl font-semibold mb-4">Change Requests</h2>
                    <ul className="space-y-2">
                        {changeRequests.map(req => (
                            <li key={req.id}>
                                <button
                                    onClick={() => setSelectedRequest(req)}
                                    className={`w-full text-left p-3 rounded-md transition-colors flex items-start gap-3 ${selectedRequest?.id === req.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}
                                >
                                    <SourceIcon source={req.requestedBy} />
                                    <div className="flex-1">
                                        <p className={`font-semibold ${selectedRequest?.id === req.id ? 'text-brand-accent' : 'text-gray-200'}`}>{req.title}</p>
                                        <p className="text-xs text-brand-muted">Status: {req.currentStage}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <div className="lg:col-span-2">
                {selectedRequest ? (
                    <Card className="h-full overflow-y-auto">
                        <div className="pb-4 border-b border-brand-border">
                            <p className="text-sm text-brand-muted">{selectedRequest.id}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{selectedRequest.title}</h3>
                            <p className="mt-2 text-gray-300">{selectedRequest.description}</p>
                        </div>
                        
                        <div className="py-4 border-b border-brand-border">
                            <h4 className="font-semibold text-gray-200 mb-4">Approval Workflow</h4>
                            <ol className="relative border-l border-brand-border ml-3">
                                {selectedRequest.stages.map((stage, index) => (
                                    <li key={index} className="mb-6 ml-6">
                                        <StageStatusIcon status={stage.status} />
                                        <h5 className="font-semibold text-white">{stage.name}</h5>
                                        {stage.approver && <p className="text-xs text-brand-muted">By: {stage.approver} at {new Date(stage.timestamp!).toLocaleString()}</p>}
                                        {stage.notes && <p className="text-sm italic text-gray-400 mt-1">"{stage.notes}"</p>}

                                        {stage.name === 'BRD Generation' && stage.status === 'In Progress' && can('manage_changes') && !selectedRequest.generatedBRD && (
                                            <button onClick={() => handleGenerateBrd(selectedRequest)} disabled={isBrdLoading} className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold disabled:bg-gray-500">
                                                {isBrdLoading ? <Loader size={14} className="animate-spin" /> : <BotMessageSquare size={14} />}
                                                <span>Generate BRD with AI</span>
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ol>
                            {selectedRequest.stages.find(s => s.status === 'In Progress') && can('manage_changes') && <div className="mt-4 flex gap-2">
                                <button onClick={() => handleAdvanceStage(selectedRequest.id)} className="px-4 py-2 text-sm bg-brand-success text-white rounded-lg hover:bg-green-500 font-semibold">Approve Current Stage</button>
                            </div>}
                        </div>

                        {selectedRequest.generatedBRD && (
                             <div className="py-4 border-b border-brand-border">
                                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><FileText size={18} /> AI-Generated BRD</h4>
                                <div className="p-4 bg-brand-primary border border-brand-border rounded-md prose prose-sm prose-invert max-w-none text-gray-300">
                                    <pre className="whitespace-pre-wrap font-sans">{selectedRequest.generatedBRD}</pre>
                                </div>
                             </div>
                        )}

                        <div className="py-4">
                             <h4 className="font-semibold text-gray-200 mb-2">Audit Trail</h4>
                             <table className="w-full text-sm">
                                <tbody>
                                    {selectedRequest.auditTrail.map((entry, index) => (
                                        <tr key={index} className="border-b border-brand-border last:border-b-0">
                                            <td className="py-2 text-brand-muted font-mono whitespace-nowrap">{new Date(entry.timestamp).toLocaleString()}</td>
                                            <td className="py-2 px-4 text-purple-400">{entry.user}</td>
                                            <td className="py-2 text-gray-300">{entry.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>

                    </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <ClipboardCheck size={48} className="text-brand-muted mx-auto mb-4" />
                            <p className="text-brand-muted">Select a change request to view its details.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ChangesApprovals;