import React, { useState } from 'react';
import { UNREAL_CURRICULUM } from '../constants';
import { Topic } from '../types';

interface TopicListProps {
  onSelectTopic: (topic: Topic) => void;
  activeTopicId: string | null;
}

const TopicList: React.FC<TopicListProps> = ({ onSelectTopic, activeTopicId }) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    // Default open all modules for visibility
    const defaults: Record<string, boolean> = {};
    UNREAL_CURRICULUM.modules.forEach(m => defaults[m.id] = true);
    return defaults;
  });

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border-r border-gray-800 w-full md:w-80 flex-shrink-0">
      <div className="p-4 border-b border-gray-800 bg-[#161616]">
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
            </svg>
            Unreal 大师之路
        </h1>
        <p className="text-xs text-gray-500 mt-1">C++ 初学者指南</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {UNREAL_CURRICULUM.modules.map((module) => (
          <div key={module.id} className="rounded-lg overflow-hidden border border-gray-800/50">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] transition-colors"
            >
              <span className="text-sm font-semibold text-gray-300">{module.title}</span>
              <span className={`transform transition-transform ${openModules[module.id] ? 'rotate-180' : ''}`}>
                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </button>
            
            {openModules[module.id] && (
              <div className="bg-[#0f0f0f] py-2">
                {module.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic)}
                    className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-all ${
                      activeTopicId === topic.id
                        ? 'border-blue-500 bg-blue-900/10 text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#151515]'
                    }`}
                  >
                    <div className="font-medium">{topic.title}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800 text-center">
        <a href="https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-5-1-documentation" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-blue-400 underline">
            UE5 官方文档
        </a>
      </div>
    </div>
  );
};

export default TopicList;