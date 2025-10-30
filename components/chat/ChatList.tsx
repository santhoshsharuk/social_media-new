
import React from 'react';
import { Chat } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat }) => {
    const { user: currentUser } = useAuth();
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <div className="flex-grow overflow-y-auto">
                {chats.map(chat => {
                    const otherParticipant = chat.participants.find(p => p.id !== currentUser?.id);
                    if (!otherParticipant) return null;

                    const lastMessage = chat.messages[chat.messages.length - 1];

                    return (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className={`flex items-center p-3 cursor-pointer transition-colors ${
                                selectedChatId === chat.id ? 'bg-saffron/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Avatar src={otherParticipant.photoURL} alt={otherParticipant.name} size="md" />
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{otherParticipant.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage?.text || 'No messages yet'}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
