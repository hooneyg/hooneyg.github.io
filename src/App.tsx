import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Code2, Network, ShieldCheck, Database, Terminal, Globe, Briefcase, GraduationCap, Server, Layers, Cpu, Share2, Layout } from 'lucide-react';
import { PROJECTS } from './data/projects';
import type { Project } from './data/projects';
import { SNIPPETS_DATA } from './data/snippets';
import type { Snippet } from './data/snippets';
import ProjectModal from './components/ProjectModal';
import CodeModal from './components/CodeModal';
import TechIcon from './components/TechIcon';

const ICON_MAP: Record<string, React.ReactNode> = {
  'ngff-qms': <Database size={280} />,
  'fss-video': <Network size={280} />,
  'fss-messenger': <ShieldCheck size={280} />,
  'lxp-voc': <Globe size={280} />,
};

const TECH_CATEGORIES = [
  {
    title: 'Languages & Backend',
    description: 'Java 기반 대규모 백엔드 및 C++/Python을 활용한 고성능 모듈 개발 가능',
    skills: ['Java', 'C++', 'Python', 'Spring', 'SpringBoot'],
    icon: <Cpu size={24} />
  },
  {
    title: 'Database & Persistence',
    description: '복잡한 RDBMS 설계 및 Redis를 활용한 인메모리 데이터 최적화',
    skills: ['Oracle', 'PostgreSQL', 'MySQL', 'MariaDB', 'MSSQL', 'Redis'],
    icon: <Database size={24} />
  },
  {
    title: 'Middleware & Infra',
    description: '대규모 트랜잭션 메시징(Kafka) 및 엔터프라이즈 미들웨어(Jeus/Jennifer) 운영/분석',
    skills: ['Kafka', 'Nginx', 'GCP', 'Docker', 'Jeus', 'Jennifer'],
    icon: <Server size={24} />
  },
  {
    title: 'Web Frontend',
    description: 'React, Next.js 등 모던 프레임워크 및 기업용 UI 솔루션 구축',
    skills: ['React', 'NextJS', 'HTML5', 'CSS3', 'JSP', 'WebSquare5', 'Nexacro', 'MiPlatform'],
    icon: <Layout size={24} />
  },
  {
    title: 'Real-time & Network',
    description: '실시간 양방향 통신(WebSocket/WebRTC) 및 백엔드 연동 통신망 설계',
    skills: ['WebSocket', 'WebRTC', 'Supabase'],
    icon: <Globe size={24} />
  },
  {
    title: 'DevOps & Collaboration',
    description: 'SVN/Git 기반 형상 관리 및 Jenkins 배포 파이프라인 구축',
    skills: ['Jenkins', 'SVN', 'Git', 'GitHub', 'GitLab'],
    icon: <Share2 size={24} />
  }
];

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>(SNIPPETS_DATA);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      const updated = await Promise.all(SNIPPETS_DATA.map(async (s) => {
        try {
          const res = await fetch(`/data/snippets/${s.file}`);
          const text = await res.text();
          return { ...s, content: text };
        } catch { return s; }
      }));
      setSnippets(updated);
    };
    fetchSnippets();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-emerald-500/30 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-dark/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-emerald-500/20">H</div>
            <span className="font-black text-lg tracking-tighter">HOONEY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
            <a href="#tech" className="hover:text-emerald-400 transition-colors">Tech Stack</a>
            <a href="#code" className="hover:text-emerald-400 transition-colors">Insights</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-28 px-6 max-w-7xl mx-auto text-center">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest mb-10 uppercase">
            Finance · Logistics · Infrastructure Architect
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-12 tracking-tighter">
            Complexity to <br />
            <span className="text-gradient">Architecture.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-14 leading-relaxed max-w-3xl mx-auto font-medium">
            코드 너머의 <strong className="text-white">도메인 로직</strong>을 장악하는 현장 밀착형 문제 해결사.<br />
            금융과 물류 도메인의 복잡한 비즈니스를 견고한 시스템 아키텍처로 풀어냅니다.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#projects" className="px-10 py-5 bg-emerald-500 text-dark font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.2)]">
              프로젝트 보기
            </a>
            <a href="#code" className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl hover:bg-white/10 transition-all">
              기술 인사이트 확인
            </a>
          </div>
        </motion.div>
      </section>

      {/* Career Summary */}
      <div className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: '실무 경력', value: '4년 6개월+', icon: <Briefcase size={20} /> },
            { label: '주요 프로젝트', value: '4개 시스템', icon: <Database size={20} /> },
            { label: '보안 인증', value: 'ISMS-P 통과', icon: <ShieldCheck size={20} /> },
            { label: '학력', value: '컴퓨터과학 졸업', icon: <GraduationCap size={20} /> },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="text-emerald-400 bg-emerald-400/10 p-3 rounded-2xl">{s.icon}</div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Project Highlights.</h2>
          <p className="text-gray-500 text-lg font-medium">각 프로젝트를 클릭하여 <span className="text-emerald-400">시스템 아키텍처</span>와 이슈 해결 사례를 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -8 }} onClick={() => setSelectedProject(p)} className="group cursor-pointer">
              <div className="h-[420px] rounded-[40px] bg-[#0e0e11] border border-white/5 overflow-hidden relative p-12 flex flex-col justify-end transition-all group-hover:border-emerald-500/30 shadow-2xl">
                <div className="absolute top-10 right-10 text-white/5 group-hover:text-emerald-500/10 transition-all duration-700 group-hover:scale-110">
                  {ICON_MAP[p.id] || <Database size={280} />}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.category}</span>
                    <span className="text-[10px] text-gray-700 font-bold">{p.period}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium line-clamp-2 leading-relaxed">{p.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-2 group-hover:gap-4 transition-all">
                      Architecture & Problem Solving <ChevronRight size={16} />
                    </span>
                    <div className="flex gap-2">
                      {p.tags.slice(0, 4).map(t => (
                        <div key={t} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shadow-lg overflow-hidden shrink-0">
                          <TechIcon name={t} showLabel={false} size={16} variant="simple" />
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack - Categorized Refactoring */}
      <section id="tech" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5 bg-white/[0.01]">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Full Spectrum Stack.</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">단순한 지식을 넘어 실무에서 성과를 낸 핵심 역량 카테고리입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {TECH_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-10 bg-[#0e0e11] border border-white/10 rounded-[40px] space-y-8 hover:border-emerald-500/30 transition-all shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Category {String(idx + 1).padStart(2, '0')}</div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{cat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{cat.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {cat.skills.map((skill) => (
                  <TechIcon key={skill} name={skill} size={24} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Improved Specialty Section */}
        <div className="relative p-12 bg-gradient-to-br from-white/5 to-transparent rounded-[48px] border border-white/10 overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers size={200} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Specialized Tech</h4>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Tools & Methodologies</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                메인 스택 외에도 시스템 인프라 아키텍처링, 보안 표준(ISMS-P), 엔터프라이즈 레거시 연동 등 폭넓은 도구 활용 및 방법론 적용이 가능합니다.
              </p>
            </div>
            <div className="lg:col-span-2 flex flex-wrap gap-3">
              {['MyBatis', 'FusionCharts', 'LENA', 'Jeus', 'Jennifer', 'TCP/IP', 'ISMS-P', 'Clean Architecture', 'Microservices'].map(tool => (
                <span key={tool} className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-gray-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-default">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Insights (Formerly Snippets) */}
      <section id="code" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
            <Code2 size={32} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Engineering Insights.</h2>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            단순 코더를 넘어, <span className="text-white">성능 최적화와 보안</span>에 대한 깊은 고민의 흔적들입니다.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {snippets.map((s) => (
            <motion.div key={s.id} whileHover={{ y: -8 }} onClick={() => setSelectedSnippet(s)}
              className="p-10 bg-[#0e0e11] border border-white/10 rounded-[40px] cursor-pointer hover:border-emerald-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <ChevronRight size={40} className="text-emerald-400" />
              </div>
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">{s.category}</span>
                  <span className="px-3 py-1 bg-white/5 text-gray-500 rounded-full text-[10px] font-black">{s.lang}</span>
                </div>
                <Terminal className="text-gray-800 group-hover:text-emerald-400 transition-colors" size={24} />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight group-hover:text-emerald-400 transition-colors">{s.title}</h4>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm">{s.desc}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                  <Code2 size={16} className="text-gray-600 group-hover:text-emerald-400" />
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  Examine Architecture
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Beyond<br />Technology.</h2>
            <p className="text-gray-400 text-xl leading-relaxed font-medium">
              10여 년간 신학과 철학 원서를 탐구하며 갈고닦은 <strong className="text-white">체계적 사고력</strong>은,
              복잡한 버그의 근본 원인을 분석하고 최적의 아키텍처를 설계하는 <strong className="text-white">구조적 논리력</strong>으로 발현됩니다.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg font-medium">
              에러 로그에만 의존하지 않고 직접 현업 부서를 방문하여 사용자 PC 환경을 전수 조사하고,
              쉬는 날 물류 센터에 나가 분류부터 상하차까지 프로세스를 직접 체험합니다.
              이것이 저의 <strong className="text-white">'현장 밀착형 문제 해결'</strong>입니다.
            </p>
            <div className="grid grid-cols-1 gap-6 pt-10 border-t border-white/5">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Education & Growth</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-white font-bold">한국방송통신대학교 <span className="text-gray-500 font-medium ml-2">컴퓨터과학과 (학사 졸업)</span></p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">2023.03 - 2025.08</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-white font-bold">가톨릭대학교 대학원 <span className="text-gray-500 font-medium ml-2">신학과 (석사 수료)</span></p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">2016.03 - 2018.08</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 shrink-0" />
                  <div>
                    <p className="text-white font-bold">수원가톨릭대학교 <span className="text-gray-500 font-medium ml-2">신학과 (학사 졸업)</span></p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">2011.03 - 2016.02</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
            <div className="relative bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[60px] p-1">
              <div className="bg-[#0e0e11] rounded-[59px] p-12 text-center space-y-8 border border-white/5">
                <div className="w-32 h-32 mx-auto relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img 
                    src="/profile.jpg" 
                    alt="Hooney" 
                    className="w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight">곽경훈 (Hooney)</h3>
                  <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Infrastructure Architect</p>
                </div>
                <p className="text-gray-400 font-medium leading-relaxed">금융 · 물류 도메인 경험 기반<br />인프라 아키텍처 설계 및 성능 최적화 전문</p>
                <div className="space-y-3 text-sm text-gray-500 font-medium">
                  <p className="flex items-center justify-center gap-2">📧 <span className="text-white">admin@hooneyz.com</span></p>
                  <p className="flex items-center justify-center gap-2">📍 <span className="text-white">서울 영등포구</span></p>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                  <a href="mailto:admin@hooneyz.com" className="w-full py-5 bg-emerald-500 text-dark font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
                    Get in Touch
                  </a>
                  <a href="https://github.com/hooneyg" target="_blank" className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {selectedSnippet && <CodeModal snippet={selectedSnippet} onClose={() => setSelectedSnippet(null)} />}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 px-6 text-center text-gray-700 text-[11px] font-black uppercase tracking-[0.4em] border-t border-white/5">
        <p>© 2026 Hooney. Built with Logic & Architecture.</p>
      </footer>
    </div>
  );
};

export default App;
