import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../../contexts/AssistantContext';
import { Bot, X, Send, Loader } from 'lucide-react';
import type { AssistantMessage } from '../../types';

const Assistant: React.FC = () => {
    const { isAssistantOpen, toggleAssistant, chatHistory, isLoading, sendMessage, suggestions } = useAssistant();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (isAssistantOpen) {
            scrollToBottom();
        }
    }, [chatHistory, isAssistantOpen]);

    const handleSend = (e: React.FormEvent, message?: string) => {
        e.preventDefault();
        const messageToSend = message || input;
        if (messageToSend.trim() && !isLoading) {
            sendMessage(messageToSend);
            setInput('');
        }
    };
    
    const ChatBubble: React.FC<{ message: AssistantMessage }> = ({ message }) => {
        const isUser = message.role === 'user';
        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg prose prose-sm prose-invert ${isUser ? 'bg-brand-accent text-white' : 'bg-brand-border text-gray-300'}`}>
                    {typeof message.content === 'string' ? <p>{message.content}</p> : message.content}
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={toggleAssistant}
                className="fixed bottom-6 right-6 p-4 bg-brand-accent text-white rounded-full shadow-lg hover:bg-blue-500 transition-transform hover:scale-110 z-50"
                aria-label="Toggle AI Assistant"
            >
               {isAssistantOpen ? <X size={24} /> : <Bot size={24} />}
            </button>
            {isAssistantOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleAssistant}></div>
            )}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-secondary border-l border-brand-border shadow-2xl z-50 transform transition-transform ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="p-4 border-b border-brand-border flex items-center justify-between flex-shrink-0">
                        <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
                        <button onClick={toggleAssistant} className="p-1 text-brand-muted hover:text-white"><X size={20} /></button>
                    </header>
                    <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {chatHistory.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-brand-border text-gray-300">
                                   <Loader className="animate-spin" size={18} />
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-4 border-t border-brand-border flex-shrink-0">
                        {chatHistory.length <= 1 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i} 
                                        onClick={(e) => handleSend(e, s)}
                                        className="px-3 py-1 bg-brand-border text-xs text-gray-300 rounded-full hover:bg-brand-accent hover:text-white transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask the assistant..."
                                className="flex-grow bg-brand-primary border border-brand-border rounded-lg px-3 py-2 text-white focus:ring-brand-accent focus:border-brand-accent"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-brand-accent text-white rounded-lg disabled:bg-gray-500 transition-colors">
                                <Send size={18} />
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Assistant;