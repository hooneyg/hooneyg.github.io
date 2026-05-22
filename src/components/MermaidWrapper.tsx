"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicMermaid = dynamic(() => import('./Mermaid'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '120px',
        backgroundColor: '#111115',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4b5563',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}
    >
      Loading diagram module...
    </div>
  ),
});

interface Props {
  chart: string;
}

const MermaidWrapper: React.FC<Props> = ({ chart }) => {
  return <DynamicMermaid chart={chart} />;
};

export default MermaidWrapper;
