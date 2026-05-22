"use client";

import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { Network, AlertTriangle } from 'lucide-react';
import styles from './mermaid.module.css';

// ────────────────────────────────────────────
// 모듈 레벨 초기화 플래그 (mermaid.initialize()를 최초 1회만 실행)
// ────────────────────────────────────────────
let isMermaidInitialized = false;

function ensureMermaidInit() {
  if (isMermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, Pretendard, system-ui, -apple-system, "Segoe UI", sans-serif',
    themeVariables: {
      primaryColor: '#10b981',
      primaryTextColor: '#f3f4f6',
      primaryBorderColor: '#10b981',
      lineColor: '#334155',
      secondaryColor: '#3b82f6',
      tertiaryColor: '#1e293b',
      // 추가 세부 테마 변수
      nodeBorder: '#10b981',
      mainBkg: '#1e293b',
      nodeTextColor: '#f3f4f6',
      edgeLabelBackground: '#16161a',
      clusterBkg: 'rgba(255, 255, 255, 0.03)',
      clusterBorder: 'rgba(255, 255, 255, 0.08)',
      titleColor: '#d1d5db',
      fontFamily: 'Inter, Pretendard, system-ui, -apple-system, "Segoe UI", sans-serif',
    },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: 'basis',
    },
    sequence: {
      useMaxWidth: false,
      mirrorActors: true,
      actorFontFamily: 'Inter, Pretendard, system-ui, -apple-system, sans-serif',
      noteFontFamily: 'Inter, Pretendard, system-ui, -apple-system, sans-serif',
      messageFontFamily: 'Inter, Pretendard, system-ui, -apple-system, sans-serif',
    },
  });
  isMermaidInitialized = true;
}

// ────────────────────────────────────────────
// 렌더 ID 카운터 (고유 ID 생성)
// ────────────────────────────────────────────
let renderCounter = 0;

interface MermaidProps {
  chart: string;
}

type RenderState = 'loading' | 'rendered' | 'error';

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [state, setState] = useState<RenderState>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const reactId = useId();

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [svgSize, setSvgSize] = useState<{ width: number; height: number } | null>(null);

  // Reset zoom & pan when chart/state changes and normalize SVG attributes
  useEffect(() => {
    if (state === 'rendered' && containerRef.current) {
      const svgEl = containerRef.current.querySelector('svg');
      if (svgEl) {
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.maxWidth = 'none';
        svgEl.style.maxHeight = 'none';
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        let rafId1: number;
        let rafId2: number;

        const adjustSvgCanvas = () => {
          let svgWidth = 0;
          let svgHeight = 0;
          let viewBoxX = 0;
          let viewBoxY = 0;
          let hasBbox = false;

          try {
            // 실제 그래픽 엘리먼트들의 경계(BBox)를 실측
            const bbox = svgEl.getBBox();
            if (bbox && bbox.width > 0 && bbox.height > 0) {
              svgWidth = bbox.width;
              svgHeight = bbox.height;
              viewBoxX = bbox.x;
              viewBoxY = bbox.y;
              hasBbox = true;
            }
          } catch (e) {
            console.warn('[Mermaid] Failed to getBBox', e);
          }

          if (!hasBbox) {
            const viewBox = svgEl.getAttribute('viewBox');
            if (viewBox) {
              const parts = viewBox.split(/\s+/);
              if (parts.length === 4) {
                viewBoxX = parseFloat(parts[0]);
                viewBoxY = parseFloat(parts[1]);
                svgWidth = parseFloat(parts[2]);
                svgHeight = parseFloat(parts[3]);
              }
            }
          }

          if (!svgWidth || !svgHeight) {
            svgWidth = parseFloat(svgEl.getAttribute('width') || '800');
            svgHeight = parseFloat(svgEl.getAttribute('height') || '600');
          }

          // 폰트 크기 등으로 인한 잘림 방지를 위해 바운딩 박스 하단 및 우측에 넉넉한 여백(Padding) 강제 부여
          const paddingX = 40;
          const paddingY = 80; // 하단 짤림 완벽 차단

          const adjustedWidth = svgWidth + paddingX;
          const adjustedHeight = svgHeight + paddingY;
          const adjustedX = viewBoxX - (paddingX / 2);
          const adjustedY = viewBoxY - 10; // 상단 여백 약간

          // SVG 뷰박스 크기를 동적으로 확장하여 캔버스가 잘리는 현상을 물리적으로 방어
          svgEl.setAttribute('viewBox', `${adjustedX} ${adjustedY} ${adjustedWidth} ${adjustedHeight}`);
          svgEl.setAttribute('width', `${adjustedWidth}`);
          svgEl.setAttribute('height', `${adjustedHeight}`);

          // React 상태 업데이트
          setSvgSize({ width: adjustedWidth, height: adjustedHeight });
          setPan({ x: 0, y: 0 });
        };

        // 브라우저 렌더링 파이프라인(Reflow) 완료 후 계산하도록 RAF 2프레임 대기
        rafId1 = requestAnimationFrame(() => {
          rafId2 = requestAnimationFrame(adjustSvgCanvas);
        });

        return () => {
          cancelAnimationFrame(rafId1);
          if (rafId2) cancelAnimationFrame(rafId2);
        };
      }
    } else {
      setSvgSize(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [chart, state]);

  // ResizeObserver for responsive auto-fit of diagrams (with animation delay safety guard)
  useEffect(() => {
    const wrapper = svgWrapperRef.current;
    if (!wrapper || !svgSize || state !== 'rendered') return;

    const calculateFitZoom = () => {
      const wrapperWidth = wrapper.clientWidth || 800;
      const wrapperHeight = wrapper.clientHeight || 540;

      if (wrapperWidth === 0 || wrapperHeight === 0) return;

      const padding = 48; // 여백 확보
      const availableWidth = wrapperWidth - padding;
      const availableHeight = wrapperHeight - padding;

      const scaleX = availableWidth / svgSize.width;
      const scaleY = availableHeight / svgSize.height;

      let fitZoom = Math.min(scaleX, scaleY);
      fitZoom = Math.min(fitZoom, 1.0);
      fitZoom = Math.max(fitZoom, 0.10); // 대형 시퀀스 다이어그램도 다 볼 수 있도록 최소 줌 한계 확장

      setZoom(fitZoom);
    };

    // 1. 즉시 계산 수행
    calculateFitZoom();

    // 2. Framer Motion 모달 애니메이션(보통 200~300ms) 완료 시점을 타겟한 딜레이 보정
    const timer = setTimeout(() => {
      calculateFitZoom();
    }, 250);

    // 3. ResizeObserver를 통한 뷰포트 변경 대응
    const resizeObserver = new ResizeObserver(() => {
      calculateFitZoom();
    });

    resizeObserver.observe(wrapper);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [svgSize, state]);

  // Non-passive wheel event registration
  useEffect(() => {
    const wrapper = svgWrapperRef.current;
    if (!wrapper || state !== 'rendered') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom(prev => Math.min(Math.max(prev * scale, 0.10), 4));
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
    };
  }, [state]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.min(prev * 1.15, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.max(prev * 0.85, 0.10));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (svgSize && svgWrapperRef.current) {
      const wrapperWidth = svgWrapperRef.current.clientWidth || 800;
      const wrapperHeight = svgWrapperRef.current.clientHeight || 540;

      const padding = 48; // Consistent padding on reset
      const availableWidth = wrapperWidth - padding;
      const availableHeight = wrapperHeight - padding;

      const scaleX = availableWidth / svgSize.width;
      const scaleY = availableHeight / svgSize.height;

      let fitZoom = Math.min(scaleX, scaleY);
      fitZoom = Math.min(fitZoom, 1.0);
      fitZoom = Math.max(fitZoom, 0.10);

      setZoom(fitZoom);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(0.95);
      setPan({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (!chart || typeof chart !== 'string' || chart.trim().length === 0) {
      setState('error');
      setErrorMsg('Empty diagram definition');
      return;
    }

    let cancelled = false;

    const renderDiagram = async () => {
      setState('loading');

      try {
        if (typeof window !== 'undefined' && 'fonts' in document) {
          await document.fonts.ready;
        }

        ensureMermaidInit();

        const renderId = `mermaid-${reactId.replace(/:/g, '')}-${++renderCounter}`;
        const { svg } = await mermaid.render(renderId, chart.trim());

        if (!cancelled) {
          setSvgOutput(svg);
          setState('rendered');
          setErrorMsg('');
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Diagram rendering failed';
          setErrorMsg(msg);
          setState('error');
          console.warn('[Mermaid] Render error:', msg);
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  const diagramType = (() => {
    const trimmed = chart.trim().toLowerCase();
    if (trimmed.startsWith('sequencediagram')) return 'Sequence';
    if (trimmed.startsWith('graph') || trimmed.startsWith('flowchart')) return 'Flowchart';
    if (trimmed.startsWith('classDiagram')) return 'Class';
    if (trimmed.startsWith('stateDiagram')) return 'State';
    return 'Architecture';
  })();

  return (
    <div className={styles.wrapper}>
      {/* 미니 툴바 */}
      <div 
        className={styles.toolbar}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'relative',
          zIndex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '0.5rem',
          backgroundColor: '#111115'
        }}
      >
        <div 
          className={styles.toolbarLeft}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            className={`${styles.statusDot} ${
              state === 'rendered'
                ? styles.statusDotSuccess
                : state === 'loading'
                ? styles.statusDotLoading
                : styles.statusDotError
            }`}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              flexShrink: 0,
              backgroundColor: state === 'rendered' ? '#10b981' : state === 'loading' ? '#f59e0b' : '#ef4444',
            }}
          />
          <span 
            className={styles.toolbarLabel}
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {state === 'rendered' ? 'Rendered' : state === 'loading' ? 'Rendering...' : 'Error'}
          </span>
        </div>

        {/* Zoom Controls */}
        {state === 'rendered' && (
          <div 
            className={styles.zoomControls}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              padding: '0.2rem 0.5rem',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <span 
              className={styles.zoomHint}
              style={{
                fontSize: '9px',
                color: '#6b7280',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Wheel/Drag to Navigate
            </span>
            <div 
              className={styles.zoomDivider}
              style={{
                width: '1px',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
            />
            <button 
              onClick={handleZoomOut} 
              className={styles.zoomBtn} 
              title="Zoom Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '0.25rem',
              }}
            >
              -
            </button>
            <span 
              className={styles.zoomPercent}
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#d1d5db',
                minWidth: '32px',
                textAlign: 'center',
                fontFamily: 'monospace',
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn} 
              className={styles.zoomBtn} 
              title="Zoom In"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '0.25rem',
              }}
            >
              +
            </button>
            <button 
              onClick={handleReset} 
              className={styles.zoomResetBtn} 
              title="Reset Size"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '9px',
                fontWeight: 900,
                padding: '0.1rem 0.4rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        )}

        <span 
          className={styles.toolbarBadge}
          style={{
            fontSize: '9px',
            fontWeight: 800,
            color: '#4b5563',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.2rem 0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '0.25rem',
          }}
        >
          {diagramType} Diagram
        </span>
      </div>

      {/* 콘텐츠 영역: 상태별 분기 */}
      {state === 'loading' && (
        <div className={styles.loading}>
          <Network size={32} className={styles.loadingIcon} />
          <span className={styles.loadingText}>Rendering diagram...</span>
          <div className={styles.loadingBar} />
        </div>
      )}

      {state === 'error' && (
        <div className={styles.error}>
          <AlertTriangle size={28} className={styles.errorIcon} />
          <span className={styles.errorTitle}>Diagram Render Failed</span>
          <span className={styles.errorMessage}>{errorMsg}</span>
        </div>
      )}

      {state === 'rendered' && (
        <div
          ref={svgWrapperRef}
          className={`${styles.svgContainer} ${diagramType === 'Sequence' ? styles.sequenceSvg : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          <div
            ref={containerRef}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              width: svgSize ? `${svgSize.width}px` : '100%',
              height: svgSize ? `${svgSize.height}px` : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: svgOutput }}
          />
        </div>
      )}
    </div>
  );
};

export default Mermaid;
