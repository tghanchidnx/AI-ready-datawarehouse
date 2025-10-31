import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { MOCK_CHANGE_REQUESTS } from '../../constants';
import type { ChangeRequest, ChangeRequestApproval } from '../../types';
import { ChangeRequestStatus } from '../../types';
import { Bot, User, Check, X, FileText, Cpu, GitMerge, Rocket, PartyPopper, Link } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const ImpactPill: React.FC<{ impact: ChangeRequest['impact'] }> = ({ impact }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
    const impactMap = {
        High: 'bg-red-500/20 text-red-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        Low: 'bg-blue-500/20 text-blue-300',
    };
    return <span className={`${baseClasses} ${impactMap[impact]}`}>{impact}</span>;
};

const StatusPill: React.FC<{ status: ChangeRequestStatus }> = ({ status }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 capitalize';
    const statusMap = {
        [ChangeRequestStatus.PendingApproval]: 'bg-gray-500/20 text-gray-300',
        [ChangeRequestStatus.BRDGeneration]: 'bg-blue-500/20 text-blue-300',
        [ChangeRequestStatus.BRDApproval]: 'bg-yellow-500/20 text-yellow-300',
        [ChangeRequestStatus.Implementation]: 'bg-purple-500/20 text-purple-300',
        [ChangeRequestStatus.ReadyForTest]: 'bg-indigo-500/20 text-indigo-300',
        [ChangeRequestStatus.ReadyForUAT]: 'bg-pink-500/20 text-pink-300',
        [ChangeRequestStatus.ReadyForProd]: 'bg-orange-500/20 text-orange-300',
        [ChangeRequestStatus.Completed]: 'bg-green-500/20 text-green-300',
        [ChangeRequestStatus.Rejected]: 'bg-red-500/20 text-red-300',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

const getNextStatus = (currentStatus: ChangeRequestStatus): ChangeRequestStatus | null => {
    const flow = [
        ChangeRequestStatus.PendingApproval,
        ChangeRequestStatus.BRDGeneration,
        ChangeRequestStatus.BRDApproval,
        ChangeRequestStatus.Implementation,
        ChangeRequestStatus.ReadyForTest,
        ChangeRequestStatus.ReadyForUAT,
        ChangeRequestStatus.ReadyForProd,
        ChangeRequestStatus.Completed,
    ];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex !== -1 && currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
}

const getRequiredApprover = (status: ChangeRequestStatus): string => {
    const approverMap: Partial<Record<ChangeRequestStatus, string>> = {
        [ChangeRequestStatus.PendingApproval]: 'Product Manager',
        [ChangeRequestStatus.BRDApproval]: 'Engineering Lead',
        [ChangeRequestStatus.Implementation]: 'QA Lead',
        [ChangeRequestStatus.ReadyForTest]: 'Business Owner',
        [ChangeRequestStatus.ReadyForUAT]: 'Security Officer',
        [ChangeRequestStatus.ReadyForProd]: 'Release Manager',
    };
    return approverMap[status] || 'Admin';
}

const needsEvidence = (status: ChangeRequestStatus): boolean => {
    return [
        ChangeRequestStatus.ReadyForTest,
        ChangeRequestStatus.ReadyForUAT,
        ChangeRequestStatus.ReadyForProd,
    ].includes(status);
}


const ChangesApprovals: React.FC = () => {
    const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(MOCK_CHANGE_REQUESTS);
    const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(changeRequests[0] || null);
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [evidenceLink, setEvidenceLink] = useState('');
    const [actionToConfirm, setActionToConfirm] = useState<{ id: string, status: ChangeRequestStatus } | null>(null);

    const handleUpdateRequest = (id: string, newStatus: ChangeRequestStatus, details: Partial<ChangeRequest & { approval_details: Partial<ChangeRequestApproval> }> = {}) => {
        setChangeRequests(prev => prev.map(req => {
            if (req.id === id) {
                const newHistory: ChangeRequestApproval = { 
                    status: newStatus, 
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC', 
                    user: 'Admin',
                    requiredApprover: getRequiredApprover(newStatus),
                    ...details.approval_details
                };
                return { ...req, status: newStatus, approvalHistory: [...req.approvalHistory, newHistory], ...details };
            }
            return req;
        }));

        setSelectedRequest(prev => {
            if (!prev || prev.id !== id) return prev;
             const newHistory: ChangeRequestApproval = { 
                status: newStatus, 
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC', 
                user: 'Admin',
                requiredApprover: getRequiredApprover(newStatus),
                ...details.approval_details
             };
            return { ...prev, status: newStatus, approvalHistory: [...prev.approvalHistory, newHistory], ...details };
        });
    };
    
    const handleGenerateBrd = (id: string) => {
        const brdContent = `**Project Name:** ${selectedRequest?.title}\n\n**1. Overview:** This document outlines the requirements for implementing the feature: "${selectedRequest?.title}".\n\n**2. Rationale:** ${selectedRequest?.description}\n\n**3. Functional Requirements:**\n- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]\n\n**4. Success Criteria:**\n- The change should result in the projected impact of: ${selectedRequest?.impact}.\n- No regressions in existing functionality.`;
        handleUpdateRequest(id, ChangeRequestStatus.BRDApproval, { brdContent });
    };

    const handleAction = (id: string, currentStatus: ChangeRequestStatus) => {
        if (currentStatus === ChangeRequestStatus.BRDGeneration) {
             handleGenerateBrd(id);
             return;
        }
        
        const nextStatus = getNextStatus(currentStatus);
        if(nextStatus) {
            if (needsEvidence(nextStatus)) {
                setActionToConfirm({ id, status: nextStatus });
                setIsEvidenceModalOpen(true);
            } else {
                handleUpdateRequest(id, nextStatus);
            }
        }
    };
    
    const handleEvidenceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(actionToConfirm) {
            handleUpdateRequest(actionToConfirm.id, actionToConfirm.status, { approval_details: { evidenceLink } });
        }
        setIsEvidenceModalOpen(false);
        setEvidenceLink('');
        setActionToConfirm(null);
    };

    const ActionPanel: React.FC<{ request: ChangeRequest }> = ({ request }) => {
        const actions: { [key in ChangeRequestStatus]?: { text: string; icon: React.ReactNode; className: string } } = {
            [ChangeRequestStatus.PendingApproval]: { text: 'Approve Idea', icon: <Check size={16} />, className: 'bg-green-600 hover:bg-green-500' },
            [ChangeRequestStatus.BRDGeneration]: { text: 'Generate BRD with Gemini', icon: <FileText size={16} />, className: 'bg-blue-600 hover:bg-blue-500' },
            [ChangeRequestStatus.BRDApproval]: { text: 'Approve BRD', icon: <Check size={16} />, className: 'bg-green-600 hover:bg-green-500' },
            [ChangeRequestStatus.Implementation]: { text: 'Simulate Implementation', icon: <Cpu size={16} />, className: 'bg-purple-600 hover:bg-purple-500' },
            [ChangeRequestStatus.ReadyForTest]: { text: 'Promote to Test', icon: <GitMerge size={16} />, className: 'bg-indigo-600 hover:bg-indigo-500' },
            [ChangeRequestStatus.ReadyForUAT]: { text: 'Promote to UAT', icon: <Rocket size={16} />, className: 'bg-pink-600 hover:bg-pink-500' },
            [ChangeRequestStatus.ReadyForProd]: { text: 'Deploy to Production', icon: <Rocket size={16} />, className: 'bg-orange-600 hover:bg-orange-500' },
        };
        const currentAction = actions[request.status];

        return (
            <div className="mt-6 flex items-center gap-4">
                {currentAction && (
                     <button 
                        onClick={() => handleAction(request.id, request.status)}
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-semibold ${currentAction.className}`}
                    >
                        {currentAction.icon}
                        <span>{currentAction.text}</span>
                    </button>
                )}
                {request.status !== ChangeRequestStatus.Completed && request.status !== ChangeRequestStatus.Rejected && (
                    <button 
                        onClick={() => handleUpdateRequest(request.id, ChangeRequestStatus.Rejected, {approval_details: {notes: 'Rejected by Admin'}})}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-500 transition-colors font-semibold">
                        <X size={16} />
                        <span>Reject</span>
                    </button>
                )}
                 {request.status === ChangeRequestStatus.Completed && (
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                        <PartyPopper size={20} />
                        <span>Change successfully implemented!</span>
                    </div>
                 )}
            </div>
        );
    }

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-1 flex flex-col">
          <Card className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">Change Requests</h2>
              <ul className="space-y-2">
                  {changeRequests.map(req => (
                      <li key={req.id}>
                          <button 
                              onClick={() => setSelectedRequest(req)}
                              className={`w-full text-left p-3 rounded-md transition-colors flex flex-col ${selectedRequest?.id === req.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}
                          >
                                <div className="flex items-center gap-3">
                                    <Tooltip text={req.source}>
                                        {req.source === 'AI Agent' ? <Bot className="text-brand-accent" size={20} /> : <User className="text-green-400" size={20} />}
                                    </Tooltip>
                                    <p className={`font-semibold ${selectedRequest?.id === req.id ? 'text-brand-accent' : 'text-gray-200'}`}>{req.title}</p>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <StatusPill status={req.status} />
                                    <span className="text-xs text-brand-muted">{req.id}</span>
                                </div>
                          </button>
                      </li>
                  ))}
              </ul>
          </Card>
        </div>
        <div className="lg:col-span-2">
            {selectedRequest ? (
                <Card className="h-full">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold text-white">{selectedRequest.title}</h3>
                        <ImpactPill impact={selectedRequest.impact} />
                    </div>
                    <p className="text-sm text-brand-muted">Suggested on {selectedRequest.timestamp} by {selectedRequest.source}</p>
                    <div className="mt-4 p-4 bg-brand-primary border border-brand-border rounded-md prose prose-invert prose-sm max-w-none text-gray-300">
                        <p>{selectedRequest.description}</p>
                    </div>

                    {selectedRequest.brdContent && (
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-brand-accent mb-2">Generated BRD</h4>
                            <div className="p-4 bg-brand-primary border border-brand-border rounded-md prose prose-invert prose-sm max-w-none text-gray-300 max-h-48 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans">{selectedRequest.brdContent}</pre>
                            </div>
                        </div>
                    )}
                    
                    <ActionPanel request={selectedRequest} />

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-2">Approval History & Audit Trail</h4>
                        <div className="space-y-2">
                            {selectedRequest.approvalHistory.map((entry, index) => (
                                <div key={index} className="p-3 bg-brand-primary border border-brand-border rounded-md">
                                    <p className="font-semibold text-white">{entry.status}</p>
                                    <p className="text-sm text-brand-muted">
                                        {entry.timestamp} by <span className="text-gray-300">{entry.user}</span>
                                        {entry.requiredApprover && ` (Required Approver: ${entry.requiredApprover})`}
                                    </p>
                                    {entry.notes && <p className="text-sm italic text-yellow-300/80 mt-1">"{entry.notes}"</p>}
                                    {entry.evidenceLink && (
                                        <a href={entry.evidenceLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-accent hover:underline">
                                            <Link size={14} />
                                            <span>View Evidence</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </Card>
            ) : (
                <Card className="h-full flex items-center justify-center">
                    <p className="text-brand-muted">Select a change request to view details.</p>
                </Card>
            )}
        </div>
    </div>
     <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Provide Approval Evidence"
      >
        <form onSubmit={handleEvidenceSubmit} className="space-y-4">
            <div>
                <label htmlFor="evidenceLink" className="block text-sm font-medium text-brand-muted mb-1">
                    Evidence Link
                </label>
                <p className="text-xs text-brand-muted mb-2">Provide a link to supporting documentation (e.g., test results, UAT sign-off, deployment plan).</p>
                <input
                    type="url"
                    id="evidenceLink"
                    value={evidenceLink}
                    onChange={(e) => setEvidenceLink(e.target.value)}
                    className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent"
                    placeholder="https://jira.example.com/TEST-124"
                    required
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsEvidenceModalOpen(false)} className="px-4 py-2 bg-brand-border text-white rounded-md hover:bg-gray-600 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-500 transition-colors font-semibold">
                    Approve and Submit
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default ChangesApprovals;