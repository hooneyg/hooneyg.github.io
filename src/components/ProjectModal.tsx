import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Zap, Workflow, Database, Network, Layout, Share2, Calendar, User, Building2 } from 'lucide-react';
import type { Project } from '../data/projects';
import TechIcon from './TechIcon';
import Mermaid from './Mermaid';

interface Props {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-xl"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
      className="bg-[#0e0e11] border border-white/10 rounded-[40px] w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] custom-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Visual */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-emerald-500/20 via-blue-600/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
        >
          <X size={20} />
        </button>
        
        <div className="absolute bottom-10 left-10 md:left-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-500 text-dark text-[10px] font-black rounded-full uppercase tracking-widest">{project.category}</span>
            <span className="text-white/60 text-xs font-bold flex items-center gap-2"><Calendar size={14} /> {project.period}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{project.title}</h2>
        </div>
      </div>

      <div className="p-10 md:p-16 space-y-20">
        {/* Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <Layout size={20} /> Project Overview
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed font-medium">{project.description}</p>
            </div>

            {/* Architecture Diagram Section */}
            {project.architectureDiagram && (
              <div className="space-y-8 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <Network className="text-emerald-400" size={24} /> System Architecture
                  </h3>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Mermaid Architecture</span>
                </div>
                <Mermaid chart={project.architectureDiagram} />
              </div>
            )}
          </div>

          {/* Right Sidebar: Meta & Tech */}
          <div className="space-y-10">
            <section className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 size={16} className="text-gray-500" />
                  <span className="text-gray-500 w-20">Client</span>
                  <span className="text-white font-bold">{project.client}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-gray-500" />
                  <span className="text-gray-500 w-20">Role</span>
                  <span className="text-white font-bold">{project.role}</span>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Technology Stack</h4>
              <div className="grid grid-cols-4 gap-4">
                {project.tags.map((tech) => (
                  <TechIcon key={tech} name={tech} size={20} showLabel={false} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10 border-t border-white/5">
          {/* Achievements */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Zap className="text-emerald-400" size={24} /> 핵심 성과 ({project.achievements.length}건)
            </h3>
            <div className="space-y-4">
              {project.achievements.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-black shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Solving */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Workflow className="text-emerald-400" size={24} /> 이슈 해결 사례 ({project.problemSolving.length}건)
            </h3>
            <div className="space-y-6">
              {project.problemSolving.map((ps, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 hover:border-blue-500/30 transition-all">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {ps.title}
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Issue</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{ps.issue}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Solution</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{ps.solution}</p>
                    </div>
                  </div>
                  {ps.impact && (
                    <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 inline-block">
                      <span className="text-blue-300 text-xs font-bold tracking-tight">Impact: {ps.impact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="h-10 bg-[#0e0e11]" />
    </motion.div>
  </motion.div>
);

export default ProjectModal;
