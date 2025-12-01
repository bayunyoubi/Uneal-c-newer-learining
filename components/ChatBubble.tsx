import React, { useState } from 'react';
import { Message, Sender } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-[#2a2a2a] border border-gray-700 text-gray-200 rounded-tl-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-mono uppercase tracking-wider">
          {isUser ? <span>你 (You)</span> : <span className="text-blue-400">AI 导师</span>}
        </div>
        {message.isLoading ? (
            <div className="flex space-x-1 h-6 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        ) : (
            <MarkdownRenderer content={message.text} />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;