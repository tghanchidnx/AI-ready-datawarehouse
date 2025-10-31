import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../../contexts/AssistantContext';
import { Bot, X, MessageSquare, Library, Send, Loader } from 'lucide-react';
import type { ChatMessage, Prompt } from '../../types';

const ChatPanel: React.FC = () => {
    const { chatHistory, isLoading, sendMessage } = useAssistant();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [chatHistory]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };
    
    const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
        const isUser = message.role === 'user';
        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${isUser ? 'bg-brand-accent text-white' : 'bg-brand-border text-gray-300'}`}>
                    <p className="text-sm">{message.content}</p>
                </div>
            </div>
        );
    }

    return (
         <div className="flex flex-col h-full">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {chatHistory.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-brand-border text-gray-300">
                           <Loader className="animate-spin" size={18} />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-brand-border flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask the assistant..."
                    className="flex-grow bg-brand-primary border border-brand-border rounded-lg px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent"
                />
                <button type="submit" disabled={isLoading} className="p-2 bg-brand-accent text-white rounded-lg disabled:bg-gray-500">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

const PromptLibraryPanel: React.FC = () => {
    const { promptLibrary, sendMessage, setActivePanel } = useAssistant();
    const [searchTerm, setSearchTerm] = useState('');

    const handlePromptClick = (prompt: Prompt) => {
        // A real implementation might open a modal to fill in variables
        const filledPrompt = prompt.prompt.replace(/\{.*?\}/g, '[Your Value Here]');
        sendMessage(filledPrompt);
        setActivePanel('chat');
    };

    const filteredPrompts = promptLibrary.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 space-y-4">
             <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="w-full bg-brand-primary border border-brand-border rounded-lg px-3 py-2 text-white"
            />
            <div className="space-y-3 max-h-[75vh] overflow-y-auto">
                {filteredPrompts.map(prompt => (
                    <div key={prompt.id} className="p-3 bg-brand-border rounded-md">
                        <h5 className="font-semibold text-white">{prompt.title}</h5>
                        <p className="text-xs text-brand-muted mt-1">{prompt.category}</p>
                        <p className="text-sm text-gray-300 mt-2">{prompt.description}</p>
                        <button onClick={() => handlePromptClick(prompt)} className="text-sm text-brand-accent hover:underline mt-2">Use Prompt</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Assistant: React.FC = () => {
    const { isAssistantOpen, toggleAssistant, activePanel, setActivePanel } = useAssistant();

    return (
        <>
            <button
                onClick={toggleAssistant}
                className="fixed bottom-6 right-6 p-4 bg-brand-accent text-white rounded-full shadow-lg hover:bg-blue-500 transition-transform hover:scale-110"
                aria-label="Toggle AI Assistant"
            >
                <Bot size={24} />
            </button>
            {isAssistantOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleAssistant}></div>
            )}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-secondary border-l border-brand-border shadow-2xl z-50 transform transition-transform ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="p-4 border-b border-brand-border flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
                        <button onClick={toggleAssistant} className="p-1 text-brand-muted hover:text-white"><X size={20} /></button>
                    </header>
                    <nav className="flex border-b border-brand-border">
                        <button onClick={() => setActivePanel('chat')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${activePanel === 'chat' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted'}`}><MessageSquare size={16}/>Chat</button>
                        <button onClick={() => setActivePanel('prompt-library')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${activePanel === 'prompt-library' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted'}`}><Library size={16}/>Prompt Library</button>
                    </nav>
                    <main className="flex-grow overflow-hidden">
                        {activePanel === 'chat' && <ChatPanel />}
                        {activePanel === 'prompt-library' && <PromptLibraryPanel />}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Assistant;
