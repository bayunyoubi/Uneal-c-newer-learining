import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { createChatSession, sendMessageToGemini, explainTopic } from './services/geminiService';
import TopicList from './components/TopicList';
import ChatBubble from './components/ChatBubble';
import MarkdownRenderer from './components/MarkdownRenderer';
import { Topic, Message, Sender } from './types';
import { UNREAL_CURRICULUM } from './constants';

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(UNREAL_CURRICULUM.modules[0].topics[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'LESSON' | 'CHAT'>('LESSON');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session only once
  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
      
      // Add welcome message
      setMessages([{
        id: 'welcome',
        text: "**欢迎来到 Unreal C++ 大师之路！** \n\n我是你的 AI 导师。请在左侧选择一个主题开始学习，或者直接在这里问我任何关于虚幻引擎的问题。",
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error("Failed to init chat", e);
      setMessages([{
        id: 'error',
        text: "错误：API Key 缺失或无效。请检查您的环境配置。",
        sender: Sender.SYSTEM,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Fetch lesson content when active topic changes
  useEffect(() => {
    if (activeTopic) {
      const fetchLesson = async () => {
        setIsLessonLoading(true);
        setViewMode('LESSON'); // Switch to lesson view on topic change
        try {
          const content = await explainTopic(activeTopic.promptContext);
          setLessonContent(content);
        } catch (error) {
           setLessonContent("加载课程内容失败，请重试。");
        } finally {
          setIsLessonLoading(false);
        }
      };
      
      fetchLesson();
    }
  }, [activeTopic]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (viewMode === 'CHAT') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, viewMode]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Switch to chat view if not already
    setViewMode('CHAT');

    // Add placeholder for loading
    const loadingId = (Date.now() + 1).toString();
    const loadingMsg: Message = {
      id: loadingId,
      text: '',
      sender: Sender.AI,
      timestamp: Date.now(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMsg]);

    const responseText = await sendMessageToGemini(chatSession, userMsg.text);

    // Replace loading message with actual response
    setMessages(prev => prev.map(msg => 
      msg.id === loadingId ? { ...msg, text: responseText, isLoading: false } : msg
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <TopicList 
        onSelectTopic={setActiveTopic} 
        activeTopicId={activeTopic?.id || null} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Header / Tabs */}
        <div className="h-16 border-b border-gray-800 bg-[#161616] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-white truncate max-w-md">
                {activeTopic ? activeTopic.title : '请选择主题'}
             </h2>
             {activeTopic && (
                <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-900/50">
                    当前模块
                </span>
             )}
          </div>

          <div className="flex bg-[#0f0f0f] rounded-lg p-1 border border-gray-800">
             <button 
                onClick={() => setViewMode('LESSON')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'LESSON' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
                课程
             </button>
             <button 
                onClick={() => setViewMode('CHAT')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'CHAT' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
                AI 导师对话
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
            
            {/* Lesson View */}
            <div className={`absolute inset-0 overflow-y-auto p-8 transition-opacity duration-300 ${viewMode === 'LESSON' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               <div className="max-w-4xl mx-auto">
                    {activeTopic && (
                        <div className="mb-6 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                            <h3 className="text-blue-300 font-semibold text-sm uppercase tracking-wide mb-1">主题摘要</h3>
                            <p className="text-gray-400">{activeTopic.description}</p>
                        </div>
                    )}
                    
                    {isLessonLoading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                            <div className="h-32 bg-gray-800 rounded w-full"></div>
                            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none pb-20">
                            <MarkdownRenderer content={lessonContent} />
                        </div>
                    )}

                    {!isLessonLoading && (
                        <div className="mt-12 pt-8 border-t border-gray-800 flex justify-center">
                            <button 
                                onClick={() => {
                                    setViewMode('CHAT');
                                    setInputText(`请给我出一个关于 ${activeTopic?.title} 的测试题。`);
                                }}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                向导师提问
                            </button>
                        </div>
                    )}
               </div>
            </div>

            {/* Chat View */}
            <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 bg-[#0a0a0a] ${viewMode === 'CHAT' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                     <div className="max-w-4xl mx-auto w-full">
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                     </div>
                 </div>

                 {/* Input Area */}
                 <div className="p-4 bg-[#161616] border-t border-gray-800">
                    <div className="max-w-4xl mx-auto relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="询问关于 Unreal C++ 的问题..."
                            className="w-full bg-[#252525] text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-14 max-h-32 overflow-hidden shadow-inner placeholder-gray-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="absolute right-3 top-3 p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-600">AI 可能会犯错。请查阅虚幻引擎官方文档。</p>
                    </div>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;