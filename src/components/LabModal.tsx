import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Zap, Network, Github, Layout } from 'lucide-react';
import type { Lab } from '../data/labs';
import TechIcon from './TechIcon';
import Mermaid from './MermaidWrapper';
import styles from './lab-modal.module.css';

interface Props {
  lab: Lab;
  onClose: () => void;
}

const LabModal: React.FC<Props> = ({ lab, onClose }) => {
  useEffect(() => {
    // 모달이 열리면 body 스크롤 고정
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
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          <div className={styles.headerTitleWrapper}>
            <div className={styles.headerMeta}>
              <span className={styles.categoryBadge}>Master Lab</span>
            </div>
            <h2 className={styles.mainTitle}>{lab.title}</h2>
          </div>
        </div>

        {/* Body Content */}
        <div className={styles.bodyContent}>
          {/* Overview Grid */}
          <div className={styles.overviewGrid}>
            <div className={styles.leftCol}>
              <div className={styles.overviewSection}>
                <h3 className={styles.sectionTitle}>
                  <Layout size={20} /> Research Focus & Subtitle
                </h3>
                <p className={styles.overviewDesc}>{lab.subtitle}</p>
              </div>

              {/* Architecture Diagram Section */}
              {lab.architectureDiagram && (
                <div className={styles.architectureSection}>
                  <div className={styles.architectureHeader}>
                    <h3 className={styles.architectureTitle}>
                      <Network className={styles.emeraldIcon} size={24} /> System Architecture
                    </h3>
                    <span className={styles.architectureBadge}>Mermaid Diagram</span>
                  </div>
                  <Mermaid chart={lab.architectureDiagram} />
                </div>
              )}
            </div>

            {/* Right Sidebar: GitHub Link & Core Tags */}
            <div className={styles.rightSidebar}>
              <section className={styles.githubBlock}>
                <h4 className={styles.githubTitle}>
                  <Github size={16} /> Repository Connection
                </h4>
                <a 
                  href={lab.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.btnGithub}
                >
                  GitHub Repository <Github size={18} />
                </a>
              </section>

              <section className={styles.techSection}>
                <h4 className={styles.techSectionTitle}>Core Technologies</h4>
                <div className={styles.techGrid}>
                  {lab.tags.map((tag) => (
                    <TechIcon key={tag} name={tag} size={20} showLabel={false} />
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Key Achievements & Points */}
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>
              <Zap className={styles.emeraldIcon} size={24} /> 핵심 기술 검증 & 연구 결과
            </h3>
            <div className={styles.keypointsList}>
              {lab.keypoints.map((point, i) => {
                // Keypoint 형식이 "Title: Description" 형태인 경우가 있으므로 첫 콜론(:) 기준으로 타이틀에 볼드 처리
                const colonIdx = point.indexOf(':');
                if (colonIdx > -1) {
                  const title = point.substring(0, colonIdx);
                  const desc = point.substring(colonIdx + 1);
                  return (
                    <div key={i} className={styles.keypointItem}>
                      <div className={styles.keypointNum}>{i + 1}</div>
                      <p className={styles.keypointText}>
                        <strong style={{ color: '#ffffff' }}>{title}</strong>:{desc}
                      </p>
                    </div>
                  );
                }
                return (
                  <div key={i} className={styles.keypointItem}>
                    <div className={styles.keypointNum}>{i + 1}</div>
                    <p className={styles.keypointText}>{point}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LabModal;
