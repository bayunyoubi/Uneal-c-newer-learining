import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split by code blocks (```)
  // Regex captures the language optionally: ```cpp ... ```
  const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);

  return (
    <div className="text-gray-300 leading-relaxed space-y-4">
      {parts.map((part, index) => {
        // If index % 3 === 0, it's normal text
        // If index % 3 === 1, it's the language identifier (e.g., 'cpp')
        // If index % 3 === 2, it's the code content
        
        if (index % 3 === 0) {
            // Normal text processing: split by newlines for paragraphs
            // Check if empty to avoid empty divs
            if (!part.trim()) return null;
            
            // Basic bold processing for **text**
            const paragraphs = part.split('\n\n');
            return (
                <div key={index} className="space-y-3">
                    {paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="whitespace-pre-wrap">
                            {p.split(/(\*\*.*?\*\*)/).map((segment, sIdx) => {
                                if (segment.startsWith('**') && segment.endsWith('**')) {
                                    return <strong key={sIdx} className="text-white font-semibold">{segment.slice(2, -2)}</strong>;
                                }
                                return segment;
                            })}
                        </p>
                    ))}
                </div>
            );
        } else if (index % 3 === 1) {
            // This is the language tag, we skip rendering it directly, handled in next block
            return null;
        } else {
            // This is the code block
            const language = parts[index - 1] || 'text';
            return (
                <div key={index} className="relative group rounded-lg overflow-hidden my-4 border border-gray-700 bg-[#1e1e1e] shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
                        <div className="flex space-x-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="font-mono text-sm text-blue-300">
                            <code>{part.trim()}</code>
                        </pre>
                    </div>
                </div>
            );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;