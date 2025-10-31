import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { View, AssistantMessage, ChangeRequest } from '../types';
import { MOCK_ASSISTANT_SUGGESTIONS } from '../constants';
import { Lightbulb } from 'lucide-react';

interface AssistantActions {
  setCurrentView: (view: View) => void;
  openNewPipelineModal: () => void;
  openNewBatchJobModal: () => void;
  createChangeRequest: (title: string, description: string) => void;
}

interface AssistantContextType extends AssistantActions {
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  chatHistory: AssistantMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  suggestions: string[];
  currentView: View;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const viewKeywords: { [key in View]?: string[] } = {
  'dashboard': ['dashboard', 'home', 'main page'],
  'data-sources': ['data sources', 'sources', 'connections'],
  'pipelines': ['pipelines', 'pipeline'],
  'batch-processing': ['batch processing', 'batch jobs', 'jobs'],
  'relationship-discovery': ['relationship discovery', 'relationships'],
  'data-lineage': ['data lineage', 'lineage'],
  'changes-approvals': ['changes', 'approvals', 'change requests'],
  'security-incidents': ['security', 'incidents'],
  'console': ['console', 'logs', 'system console'],
  'settings': ['settings', 'configuration', 'admin'],
  'help': ['help', 'docs', 'documentation'],
};

const helpContent: { [key in View]?: string } = {
    'dashboard': 'The Dashboard provides a high-level overview of system metrics, running pipelines, and recent agent activity.',
    'data-sources': 'This view shows all connected data sources, their status, and AI-generated descriptions of their schemas.',
    'pipelines': 'Here you can view, monitor, and manage all data transformation pipelines.',
    'data-lineage': 'The Data Lineage Explorer allows you to visualize the flow of data from source to destination, showing all transformations and dependencies.',
    'security-incidents': 'This view lists all detected security incidents, allowing you to investigate and track their resolution.',
    'settings': 'The Settings area is where you configure all aspects of the platform, from database connections to user roles and AI agents.',
};


export const AssistantProvider: React.FC<{ children: React.ReactNode } & AssistantActions & { currentView: View }> = ({ children, ...props }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (role: 'user' | 'assistant', content: string | React.ReactNode) => {
     const newMessage: AssistantMessage = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    addMessage('assistant', `Hello! I'm your AI assistant. I can help you navigate, create items, and answer questions. What would you like to do?`);
  }, []);

  const toggleAssistant = () => setIsAssistantOpen(prev => !prev);

  const handleUnsupportedRequest = (message: string) => {
    props.createChangeRequest(`Assistant Request: "${message}"`, `User asked the AI assistant to perform an action that is not currently supported: "${message}". This should be reviewed as a potential feature enhancement.`);
    addMessage('assistant', (
      <div className="space-y-2">
        <p>I can't do that yet, but I've logged your request for our team to review as a potential new feature!</p>
        <div className="flex items-center gap-2 text-xs p-2 bg-yellow-500/10 text-yellow-300 rounded-md">
            <Lightbulb size={16} />
            <span>A new item has been added to the "Changes & Approvals" queue.</span>
        </div>
      </div>
    ));
    props.setCurrentView('changes-approvals');
  };

  const sendMessage = useCallback(async (message: string) => {
    addMessage('user', message);
    setIsLoading(true);

    const lowerMessage = message.toLowerCase();

    // 1. Check for navigation commands
    for (const [view, keywords] of Object.entries(viewKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        addMessage('assistant', `Navigating to ${view.replace('-', ' ')}...`);
        props.setCurrentView(view as View);
        setIsLoading(false);
        return;
      }
    }

    // 2. Check for creation commands
    if (lowerMessage.includes('new pipeline') || lowerMessage.includes('create a pipeline')) {
        addMessage('assistant', 'Opening the new pipeline dialog for you.');
        props.openNewPipelineModal();
        setIsLoading(false);
        return;
    }
    if (lowerMessage.includes('new job') || lowerMessage.includes('create a job')) {
        addMessage('assistant', 'Sure, let\'s create a new batch job.');
        props.openNewBatchJobModal();
        setIsLoading(false);
        return;
    }

    // 3. Check for contextual help
    if (lowerMessage.includes('what is this page') || lowerMessage.includes('explain this view')) {
        const explanation = helpContent[props.currentView] || "I don't have specific information about this page, but it's part of our data transformation platform.";
        addMessage('assistant', explanation);
        setIsLoading(false);
        return;
    }
     if (lowerMessage.includes('how do i') || lowerMessage.includes('set up sso')) {
        addMessage('assistant', (
            <div>
                <p>I found some relevant documentation for setting up SSO:</p>
                <div className="mt-2 text-xs p-2 bg-brand-primary border border-brand-border rounded-md">
                    <p className="font-semibold">To set up SSO:</p>
                    <ol className="list-decimal pl-4">
                        <li>Navigate to Settings {'>'} Authentication.</li>
                        <li>Enable the Single Sign-On toggle.</li>
                        <li>Select your provider (e.g., Okta, Azure AD) and fill in the required details.</li>
                    </ol>
                </div>
                <button onClick={() => props.setCurrentView('settings')} className="text-xs text-brand-accent hover:underline mt-2">Take me to Settings</button>
            </div>
        ));
        setIsLoading(false);
        return;
     }

    // 4. If no command matched, log as enhancement request
    handleUnsupportedRequest(message);
    setIsLoading(false);
    
  }, [props.currentView]);

  const value = {
    ...props,
    isAssistantOpen,
    toggleAssistant,
    chatHistory,
    isLoading,
    sendMessage,
    suggestions: MOCK_ASSISTANT_SUGGESTIONS,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = (): AssistantContextType => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};