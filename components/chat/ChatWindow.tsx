
import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage } from './ChatMessage';
import { api } from '../../services/firebase';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ChatWindowProps {
  chat: Chat;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>(chat.messages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParticipant = chat.participants.find(p => p.id !== currentUser?.id);

    useEffect(() => {
        setMessages(chat.messages);
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        
        const sentMessage = await api.sendMessage(chat.id, {
            senderId: currentUser.id,
            text: newMessage,
        });

        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    };

    if (!otherParticipant || !currentUser) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <Avatar src={otherParticipant.photoURL} alt={otherParticipant.name} size="md" />
                <h3 className="ml-3 font-semibold text-lg">{otherParticipant.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4">
                    {messages.map(message => (
                        <ChatMessage 
                            key={message.id} 
                            message={message} 
                            isOwnMessage={message.senderId === currentUser.id}
                            sender={message.senderId === currentUser.id ? currentUser : otherParticipant}
                        />
                    ))}
                </div>
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-saffron dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Button type="submit" isRound>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </Button>
                </form>
            </div>
        </div>
    );
};
