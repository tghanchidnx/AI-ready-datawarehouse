import React, { createContext, useContext, useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { AssistantPanel, ChatMessage, Prompt } from '../types';
import { MOCK_PROMPT_LIBRARY } from '../constants';

interface AssistantContextType {
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  activePanel: AssistantPanel;
  setActivePanel: (panel: AssistantPanel) => void;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  promptLibrary: Prompt[];
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<AssistantPanel>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptLibrary] = useState<Prompt[]>(MOCK_PROMPT_LIBRARY);

  const toggleAssistant = () => setIsAssistantOpen(prev => !prev);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      if (!process.env.API_KEY) {
          const errorMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: 'API_KEY is not configured. Please set the API_KEY environment variable.',
            timestamp: new Date().toLocaleTimeString(),
          };
          setChatHistory(prev => [...prev, errorMessage]);
          setIsLoading(false);
          return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
            role: "user",
            parts: [{ text: message }]
        }],
        config: {
            systemInstruction: 'You are a helpful AI assistant for a data transformation platform. Be concise and helpful.',
        }
      });
      
      const assistantMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: response.text,
          timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check the console for details.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isAssistantOpen,
    toggleAssistant,
    activePanel,
    setActivePanel,
    chatHistory,
    isLoading,
    sendMessage,
    promptLibrary,
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
