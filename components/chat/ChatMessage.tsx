
import React from 'react';
import { Message, User } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  sender: User;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, sender }) => {
  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && <Avatar src={sender.photoURL} alt={sender.name} size="sm" />}
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md lg:max-w-lg ${
          isOwnMessage
            ? 'bg-saffron text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      {isOwnMessage && <Avatar src={sender.photoURL} alt={sender.name} size="sm" />}
    </div>
  );
};
