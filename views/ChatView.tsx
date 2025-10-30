
import React, { useState, useEffect } from 'react';
import { ChatList } from '../components/chat/ChatList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Chat } from '../types';
import { api } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';

export const ChatView: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchChats = async () => {
      try {
        setLoading(true);
        const userChats = await api.getChatsForUser(user.id);
        setChats(userChats);
        if (userChats.length > 0) {
            setSelectedChat(userChats[0]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  if(loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>

  return (
    <div className="flex h-[calc(100vh-150px)] rounded-lg shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <ChatList chats={chats} onSelectChat={setSelectedChat} selectedChatId={selectedChat?.id} />
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <p>Select a conversation to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
