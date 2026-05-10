import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X, Copy, Check, Network, Code2 } from 'lucide-react';
import type { Snippet } from '../data/snippets';
import Mermaid from './Mermaid';

interface Props {
  snippet: Snippet;
  onClose: () => void;
}

const CodeModal: React.FC<Props> = ({ snippet, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'diagram'>(snippet.diagram ? 'diagram' : 'code');

  const handleCopy = () => {
    if (snippet.content) {
      navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0e0e11] border border-white/10 rounded-[32px] w-full max-w-5xl flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
              <Terminal size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black uppercase tracking-widest">{snippet.category}</span>
                <span className="text-[10px] text-gray-600 font-bold uppercase">{snippet.file}</span>
              </div>
              <h3 className="font-black text-2xl tracking-tight text-white">{snippet.title}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {snippet.diagram && (
                <button 
                  onClick={() => setActiveTab('diagram')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'diagram' ? 'bg-emerald-500 text-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Network size={14} /> Architecture
                </button>
              )}
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'code' ? 'bg-emerald-500 text-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <Code2 size={14} /> Source Code
              </button>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              <button onClick={handleCopy} className="p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-emerald-400 transition-all group relative">
                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Copy Code</span>
              </button>
              <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 md:p-12 bg-dark/50">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'diagram' && snippet.diagram ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                  <p className="text-gray-400 leading-relaxed text-lg font-medium mb-2">Technical Rationale</p>
                  <p className="text-gray-500 italic">{snippet.desc}</p>
                </div>
                <Mermaid chart={snippet.diagram} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-full" />
                <pre className="font-mono text-[14px] text-gray-400 leading-relaxed overflow-x-auto custom-scrollbar whitespace-pre-wrap">
                  {snippet.content || '// Loading source code...'}
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodeModal;
