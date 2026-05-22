'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Code2, Network, ShieldCheck, Database,
  Terminal, Globe, Briefcase, GraduationCap, Server, Layers, Cpu, Share2, Layout
} from 'lucide-react';
import Link from 'next/link';

import { projects as PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { SNIPPETS_DATA } from '../data/snippets';
import type { Snippet } from '../data/snippets';

import { labs as LABS_DATA } from '../data/labs';
import type { Lab } from '../data/labs';

import ProjectModal from '../components/ProjectModal';
import CodeModal from '../components/CodeModal';
import LabModal from '../components/LabModal';
import TechIcon from '../components/TechIcon';

import styles from './page.module.css';
import cardStyles from '../components/card.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  'ngff-qms': <Database size={280} />,
  'ngff-qms-ims': <Database size={280} />,
  'fss-video': <Network size={280} />,
  'fss-messenger': <ShieldCheck size={280} />,
  'lxp-voc': <Globe size={280} />,
};

// MASTER_LABS is now loaded from src/data/labs.ts

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
    skills: ['Oracle', 'PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'Redis'],
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

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
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
    <div className={styles.container}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoSymbol}>H</div>
            <span className={styles.logoText}>HOONEY</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#labs" className={styles.navLink}>Master Labs</a>
            <a href="#projects" className={styles.navLink}>Projects</a>
            <a href="#tech" className={styles.navLink}>Tech Stack</a>
            <a href="#code" className={styles.navLink}>Insights</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <div className={styles.heroBadge}>
            Finance · Logistics · Infrastructure Architect
          </div>
          <h1 className={styles.heroTitle}>
            Complexity to <br />
            <span className="textGradient">Architecture.</span>
          </h1>
          <p className={styles.heroDesc}>
            코드 너머의 <strong style={{ color: '#ffffff' }}>도메인 로직</strong>을 장악하는 현장 밀착형 문제 해결사.<br />
            금융과 물류 도메인의 복잡한 비즈니스를 견고한 시스템 아키텍처로 풀어냅니다.
          </p>
          <div className={styles.heroButtons}>
            <a href="#labs" className={styles.btnPrimary}>
              마스터 랩 둘러보기
            </a>
            <a href="#projects" className={styles.btnSecondary}>
              프로젝트 보기
            </a>
          </div>
        </motion.div>
      </section>

      {/* Career Summary */}
      <div className={styles.careerSection}>
        <div className={styles.careerGrid}>
          {[
            { label: '실무 경력', value: '4년 6개월+', icon: <Briefcase size={20} /> },
            { label: '주요 프로젝트', value: '4개 시스템', icon: <Database size={20} /> },
            { label: '보안 인증', value: 'ISMS-P 통과', icon: <ShieldCheck size={20} /> },
            { label: '학력', value: '컴퓨터과학 졸업', icon: <GraduationCap size={20} /> },
          ].map((s, i) => (
            <div key={i} className={styles.careerItem}>
              <div className={styles.careerIcon}>{s.icon}</div>
              <p className={styles.careerValue}>{s.value}</p>
              <p className={styles.careerLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutLeftTitle}>Beyond<br />Technology.</h2>
            <p className={styles.aboutLeftDesc1}>
              10여 년간 신학과 철학 원서를 탐구하며 갈고닦은 <strong style={{ color: '#ffffff' }}>체계적 사고력</strong>은,
              복잡한 버그의 근본 원인을 분석하고 최적의 아키텍처를 설계하는 <strong style={{ color: '#ffffff' }}>구조적 논리력</strong>으로 발현됩니다.
            </p>
            <p className={styles.aboutLeftDesc2}>
              에러 로그에만 의존하지 않고 직접 현업 부서를 방문하여 사용자 PC 환경을 전수 조사하고,
              쉬는 날 물류 센터에 나가 분류부터 상하차까지 프로세스를 직접 체험합니다.
              이것이 저의 <strong style={{ color: '#ffffff' }}>'현장 밀착형 문제 해결'</strong>입니다.
            </p>
            <div className={styles.educationWrapper}>
              <h4 className={styles.educationHeader}>Education & Growth</h4>
              <div className={styles.educationList}>
                <div className={styles.educationItem}>
                  <div className={`${styles.educationIndicator} ${styles.educationIndicatorEmerald}`} />
                  <div>
                    <p className={styles.educationTitle}>한국방송통신대학교 <span className={styles.educationSubtitle}>컴퓨터과학과 (학사 졸업)</span></p>
                    <p className={styles.educationPeriod}>2023.03 - 2025.08</p>
                  </div>
                </div>
                <div className={styles.educationItem}>
                  <div className={`${styles.educationIndicator} ${styles.educationIndicatorBlue}`} />
                  <div>
                    <p className={styles.educationTitle}>가톨릭대학교 대학원 <span className={styles.educationSubtitle}>신학과 (석사과정 중퇴)</span></p>
                    <p className={styles.educationPeriod}>2016.03 - 2018.08</p>
                  </div>
                </div>
                <div className={styles.educationItem}>
                  <div className={`${styles.educationIndicator} ${styles.educationIndicatorGray}`} />
                  <div>
                    <p className={styles.educationTitle}>수원가톨릭대학교 <span className={styles.educationSubtitle}>신학과 (학사 졸업)</span></p>
                    <p className={styles.educationPeriod}>2011.03 - 2016.02</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.aboutRight}>
            <div className={styles.aboutRightBg} />
            <div className={styles.aboutRightWrapper}>
              <div className={styles.aboutCard}>
                <div className={styles.profileImgContainer}>
                  <div className={styles.profileImgBg} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/profile.jpg"
                    alt="Hooney"
                    className={styles.profileImg}
                  />
                </div>
                <div className={styles.profileInfo}>
                  <h3 className={styles.profileName}>곽경훈 (Hooney)</h3>
                  <p className={styles.profileRole}>Infrastructure Architect</p>
                </div>
                <p className={styles.profileBio}>금융 · 물류 도메인 경험 기반<br />인프라 아키텍처 설계 및 성능 최적화 전문</p>
                <div className={styles.profileMeta}>
                  <p>📧 <span className={styles.profileMetaVal}>admin@hooneyz.com</span></p>
                  <p>📍 <span className={styles.profileMetaVal}>서울 영등포구</span></p>
                </div>
                <div className={styles.profileActions}>
                  <a href="mailto:admin@hooneyz.com" className={styles.btnPrimary} style={{ width: '100%' }}>
                    Mail to Hooney
                  </a>
                  <a href="https://github.com/hooneyg" target="_blank" className={styles.btnSecondary} style={{ width: '100%' }} rel="noreferrer">
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Labs Section */}
      <section id="labs" className={styles.labsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Master Labs.</h2>
          <p className={styles.sectionDesc}>6대 마스터 랩의 핵심 아키텍처와 기술 요약을 바로 확인해 보세요.</p>
        </div>
        <div className={styles.labsGrid}>
          {LABS_DATA.map((lab) => (
            <div
              key={lab.id}
              onClick={() => setSelectedLab(lab)}
              className={cardStyles.card}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <div>
                <h3 className={cardStyles.title}>{lab.title}</h3>
                <p className={cardStyles.subtitle}>{lab.subtitle}</p>
              </div>
              <div className={cardStyles.tagContainer}>
                {lab.tags.map((tag) => (
                  <div key={tag} className={cardStyles.tag}>
                    <TechIcon name={tag} showLabel={false} size={12} variant="simple" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Project Highlights.</h2>
          <p className={styles.sectionDesc}>각 프로젝트를 클릭하여 <span style={{ color: '#10b981' }}>시스템 아키텍처</span>와 이슈 해결 사례를 확인하세요.</p>
        </div>
        <div className={styles.projectsGrid}>
          {PROJECTS.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -8 }} onClick={() => setSelectedProject(p)} className={styles.projectCard}>
              <div className={styles.projectCardInner}>
                <div className={styles.projectCardIcon}>
                  {ICON_MAP[p.id] || <Database size={280} />}
                </div>
                <div>
                  <div className={styles.projectCardMeta}>
                    <span className={styles.projectCardBadge}>{p.category}</span>
                    <span className={styles.projectCardPeriod}>{p.period}</span>
                  </div>
                  <h3 className={styles.projectCardTitle}>{p.title}</h3>
                  <p className={styles.projectCardDesc}>{p.subtitle}</p>
                  <div className={styles.projectCardTags} style={{ marginBottom: '1.25rem' }}>
                    {p.tags.slice(0, 3).map(t => (
                      <div key={t} className={styles.projectCardTag}>
                        <TechIcon name={t} showLabel={false} size={12} variant="simple" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.projectCardBottom}>
                    <span className={styles.projectCardLink}>
                      Architecture & Problem Solving <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={styles.techSection}>
        <div className={styles.sectionHeader} style={{ textAlign: 'center' }}>
          <h2 className={styles.sectionTitle}>Full Spectrum Stack.</h2>
          <p className={styles.sectionDesc}>단순한 지식을 넘어 실무에서 성과를 낸 핵심 역량 카테고리입니다.</p>
        </div>

        <div className={styles.techGrid}>
          {TECH_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={styles.techCard}
            >
              <div className={styles.techCardTop}>
                <div className={styles.techCardIcon}>
                  {cat.icon}
                </div>
                <div className={styles.techCardCatNum}>Category {String(idx + 1).padStart(2, '0')}</div>
              </div>
              <div>
                <h3 className={styles.techCardTitle}>{cat.title}</h3>
                <p className={styles.techCardDesc}>{cat.description}</p>
              </div>
              <div className={styles.techCardSkills}>
                {cat.skills.map((skill) => (
                  <TechIcon key={skill} name={skill} size={24} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Specialty Section */}
        <div className={styles.specialtyCard}>
          <div className={styles.specialtyIcon}>
            <Layers size={200} color="white" />
          </div>
          <div className={styles.specialtyGrid}>
            <div>
              <h4 className={styles.specialtyBadgeHeader}>Specialized Tech</h4>
              <h3 className={styles.specialtyTitle}>Tools & Methodologies</h3>
              <p className={styles.specialtyDesc}>
                메인 스택 외에도 시스템 인프라 아키텍처링, 보안 표준(ISMS-P), 엔터프라이즈 레거시 연동 등 폭넓은 도구 활용 및 방법론 적용이 가능합니다.
              </p>
            </div>
            <div className={styles.specialtyList}>
              {['MyBatis', 'FusionCharts', 'LENA', 'TCP/IP', 'ISMS-P', 'Clean Architecture', 'MSA'].map(tool => (
                <span key={tool} className={styles.specialtyBadge}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Insights Section */}
      <section id="code" className={styles.insightsSection}>
        <div className={styles.sectionHeader} style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emerald-400)',
            margin: '0 auto 2rem auto',
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.1)'
          }}>
            <Code2 size={32} />
          </div>
          <h2 className={styles.sectionTitle}>Engineering Insights.</h2>
          <p className={styles.sectionDesc}>
            단순 코더를 넘어, <span style={{ color: '#ffffff' }}>성능 최적화와 보안</span>에 대한 깊은 고민의 흔적들입니다.
          </p>
        </div>
        <div className={styles.insightsGrid}>
          {snippets.map((s) => (
            <motion.div key={s.id} whileHover={{ y: -8 }} onClick={() => setSelectedSnippet(s)}
              className={styles.insightCard}>
              <div className={styles.insightCardArrow}>
                <ChevronRight size={40} className="text-emerald-400" />
              </div>
              <div className={styles.insightCardHeader}>
                <div className={styles.insightCardBadges}>
                  <span className={styles.insightCardCategory}>{s.category}</span>
                  <span className={styles.insightCardLang}>{s.lang}</span>
                </div>
                <Terminal className={styles.insightCardIcon} size={24} />
              </div>
              <h4 className={styles.insightCardTitle}>{s.title}</h4>
              <p className={styles.insightCardDesc}>{s.desc}</p>
              <div className={styles.insightCardBottom}>
                <div className={styles.insightCardActionIcon}>
                  <Code2 size={16} />
                </div>
                <span className={styles.insightCardActionLabel}>
                  Examine Architecture
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {selectedLab && <LabModal lab={selectedLab} onClose={() => setSelectedLab(null)} />}
        {selectedSnippet && <CodeModal snippet={selectedSnippet} onClose={() => setSelectedSnippet(null)} />}
      </AnimatePresence>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Hooney. Built with Logic & Architecture.</p>
      </footer>
    </div>
  );
}
