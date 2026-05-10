import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  themeVariables: {
    primaryColor: '#10b981',
    primaryTextColor: '#fff',
    primaryBorderColor: '#10b981',
    lineColor: '#334155',
    secondaryColor: '#3b82f6',
    tertiaryColor: '#1e293b'
  }
});

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid bg-dark-lighter p-8 rounded-3xl border border-white/5 overflow-x-auto flex justify-center" ref={ref}>
      {chart}
    </div>
  );
};

export default Mermaid;
