import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Zap, Workflow, Database, Network, Layout, Calendar, User, Building2 } from 'lucide-react';
import type { Project } from '../data/projects';
import TechIcon from './TechIcon';
import Mermaid from './MermaidWrapper';
import styles from './project-modal.module.css';



interface Props {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header Visual */}
      <div className={styles.headerVisual}>
        <div className={styles.headerPattern} />
        <button 
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={20} />
        </button>
        
        <div className={styles.headerTitleWrapper}>
          <div className={styles.headerMeta}>
            <span className={styles.categoryBadge}>{project.category}</span>
            <span className={styles.periodText}>
              <Calendar size={14} /> {project.period}
            </span>
          </div>
          <h2 className={styles.mainTitle}>{project.title}</h2>
        </div>
      </div>

      <div className={styles.bodyContent}>
        {/* Overview Grid */}
        <div className={styles.overviewGrid}>
          <div className={styles.leftCol}>
            <div className={styles.overviewSection}>
              <h3 className={styles.sectionTitle}>
                <Layout size={20} /> Project Overview
              </h3>
              <p className={styles.overviewDesc}>{project.description}</p>
            </div>

            {/* Architecture Diagram Section */}
            {project.architectureDiagram && (
              <div className={styles.architectureSection}>
                <div className={styles.architectureHeader}>
                  <h3 className={styles.architectureTitle}>
                    <Network className={styles.emeraldIcon} size={24} /> System Architecture
                  </h3>
                  <span className={styles.architectureBadge}>Mermaid Architecture</span>
                </div>
                <Mermaid chart={project.architectureDiagram} />
              </div>
            )}
          </div>

          {/* Right Sidebar: Meta & Tech */}
          <div className={styles.rightSidebar}>
            <section className={styles.metaBlock}>
              <div className={styles.metaList}>
                <div className={styles.metaRow}>
                  <Building2 size={16} className="text-gray-500" />
                  <span className={styles.metaLabel}>Client</span>
                  <span className={styles.metaValue}>{project.client}</span>
                </div>
                <div className={styles.metaRow}>
                  <User size={16} className="text-gray-500" />
                  <span className={styles.metaLabel}>Role</span>
                  <span className={styles.metaValue}>{project.role}</span>
                </div>
              </div>
            </section>

            <section className={styles.techSection}>
              <h4 className={styles.techSectionTitle}>Technology Stack</h4>
              <div className={styles.techGrid}>
                {project.tags.map((tech) => (
                  <TechIcon key={tech} name={tech} size={20} showLabel={false} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className={styles.detailsGrid}>
          {/* Achievements */}
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>
              <Zap className={styles.emeraldIcon} size={24} /> 핵심 성과 ({project.achievements.length}건)
            </h3>
            <div className={styles.achieveList}>
              {project.achievements.map((item, i) => (
                <div key={i} className={styles.achieveItem}>
                  <div className={styles.achieveNum}>
                    {i + 1}
                  </div>
                  <p className={styles.achieveText}>{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Solving */}
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>
              <Workflow className={styles.emeraldIcon} size={24} /> 이슈 해결 사례 ({project.problemSolving.length}건)
            </h3>
            <div className={styles.problemList}>
              {project.problemSolving.map((ps, i) => (
                <div key={i} className={styles.problemItem}>
                  <h4 className={styles.problemTitle}>
                    <span className={styles.problemIndicator} /> {ps.title}
                  </h4>
                  <div className={styles.problemBoxWrapper}>
                    <div className={styles.issueBox}>
                      <p className={`${styles.boxLabel} ${styles.issueLabel}`}>Issue</p>
                      <p className={styles.boxText}>{ps.issue}</p>
                    </div>
                    <div className={styles.solutionBox}>
                      <p className={`${styles.boxLabel} ${styles.solutionLabel}`}>Solution</p>
                      <p className={styles.boxText}>{ps.solution}</p>
                    </div>
                  </div>
                  {ps.impact && (
                    <div className={styles.impactBadge}>
                      <span className={styles.impactText}>Impact: {ps.impact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
