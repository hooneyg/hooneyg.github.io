import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X, Copy, Check, Network, Code2 } from 'lucide-react';
import type { Snippet } from '../data/snippets';
import Mermaid from './MermaidWrapper';
import styles from './code-modal.module.css';



interface Props {
  snippet: Snippet;
  onClose: () => void;
}

const CodeModal: React.FC<Props> = ({ snippet, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'diagram'>(snippet.diagram ? 'diagram' : 'code');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleCopy = () => {
    if (snippet.content) {
      navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={styles.absoluteCloseButton} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <Terminal size={28} />
            </div>
            <div>
              <div className={styles.headerMeta}>
                <span className={styles.categoryBadge}>{snippet.category}</span>
                <span className={styles.fileLabel}>{snippet.file}</span>
              </div>
              <h3 className={styles.title}>{snippet.title}</h3>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.tabWrapper}>
              {snippet.diagram && (
                <button 
                  onClick={() => setActiveTab('diagram')}
                  className={`${styles.tabButton} ${activeTab === 'diagram' ? styles.tabButtonActive : styles.tabButtonInactive}`}
                >
                  <Network size={14} /> Architecture
                </button>
              )}
              <button 
                onClick={() => setActiveTab('code')}
                className={`${styles.tabButton} ${activeTab === 'code' ? styles.tabButtonActive : styles.tabButtonInactive}`}
              >
                <Code2 size={14} /> Source Code
              </button>
            </div>
            <div className={styles.actionWrapper}>
              <button onClick={handleCopy} className={styles.actionButton}>
                {copied ? <Check size={20} className={styles.emeraldIcon} /> : <Copy size={20} />}
                <span className={styles.tooltip}>Copy Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.contentWrapper}>
            {activeTab === 'diagram' && snippet.diagram ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.diagramRationale}>
                  <p className={styles.rationaleTitle}>Technical Rationale</p>
                  <p className={styles.rationaleText}>{snippet.desc}</p>
                </div>
                <Mermaid chart={snippet.diagram} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.codeContainer}
              >
                <div className={styles.codeIndicator} />
                <pre className={styles.codeText}>
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
