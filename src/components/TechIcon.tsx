import React from 'react';
import styles from './tech-icon.module.css';

interface TechIconProps {
  name: string;
  size?: number;
  label?: string;
  showLabel?: boolean;
  variant?: 'default' | 'simple';
}

const ICON_MAP: Record<string, { slug?: string; version?: string; customUrl?: string } | null> = {
  'java': { slug: 'java', version: 'original' },
  'c': { slug: 'cplusplus', version: 'plain' },
  'cplusplus': { slug: 'cplusplus', version: 'plain' },
  'python': { slug: 'python', version: 'original' },
  'spring': { slug: 'spring', version: 'original' },
  'springboot': { customUrl: 'https://cdn.worldvectorlogo.com/logos/spring-boot-1.svg' },
  'kafka': { slug: 'apachekafka', version: 'original' },
  'apachekafka': { slug: 'apachekafka', version: 'original' },
  'redis': { slug: 'redis', version: 'original' },
  'postgresql': { slug: 'postgresql', version: 'original' },
  'mysql': { slug: 'mysql', version: 'original' },
  'oracle': { customUrl: 'https://www.vhv.rs/dpng/d/453-4533338_oracle-logo-for-website-new-oracle-logo-png.png' },
  'mariadb': { slug: 'mariadb', version: 'original' },
  'docker': { slug: 'docker', version: 'original' },
  'dockercompose': { slug: 'docker', version: 'original' },
  'kubernetes': { slug: 'kubernetes', version: 'plain' },
  'gcp': { slug: 'googlecloud', version: 'original' },
  'googlecloud': { slug: 'googlecloud', version: 'original' },
  'git': { slug: 'git', version: 'original' },
  'github': { slug: 'github', version: 'original' },
  'gitlab': { slug: 'gitlab', version: 'original' },
  'svn': { slug: 'subversion', version: 'original' },
  'jenkins': { slug: 'jenkins', version: 'original' },
  'linux': { slug: 'linux', version: 'original' },
  'msa': { slug: 'kubernetes', version: 'plain' },
  'mssql': { slug: 'microsoftsqlserver', version: 'plain' },
  'microsoftsqlserver': { slug: 'microsoftsqlserver', version: 'plain' },
  'mybatis': { slug: 'mybatis', version: 'original' },
  'javascript': { slug: 'javascript', version: 'original' },
  'typescript': { slug: 'typescript', version: 'original' },
  'react': { slug: 'react', version: 'original' },
  'nodejs': { slug: 'nodejs', version: 'original' },
  'nextjs': { slug: 'nextjs', version: 'original' },
  'supabase': { slug: 'supabase', version: 'original' },
  'html5': { slug: 'html5', version: 'original' },
  'css3': { slug: 'css3', version: 'original' },
  
  // Custom Logos provided by User
  'websocket': { customUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/WebSocket_colored_logo.svg/960px-WebSocket_colored_logo.svg.png' },
  'webrtc': { customUrl: '/webrtc.png' },
  'nginx': { customUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-nginx-logo-icon-svg-download-png-3030173.png?f=webp' },
  'jennifer': { customUrl: 'https://avatars.githubusercontent.com/u/15087976?s=200&v=4' },

  // Custom fallback triggers (No logo available)
  'websquare': { customUrl: 'https://img1.daumcdn.net/thumb/C163x110@2x.fwebp.q85/?fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzcoMh%2FbtsAi5TYsyZ%2FAAAAAAAAAAAAAAAAAAAAANxvPf3UKhjBC21rTKZ7EJIn3vITzYOscBX2zG2xDjqQ%2Ftfile.svg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DRIzWtJjznMiJkZB%252BKU3yYArGuH4%253D' },
  'websquare5': { customUrl: 'https://img1.daumcdn.net/thumb/C163x110@2x.fwebp.q85/?fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzcoMh%2FbtsAi5TYsyZ%2FAAAAAAAAAAAAAAAAAAAAANxvPf3UKhjBC21rTKZ7EJIn3vITzYOscBX2zG2xDjqQ%2Ftfile.svg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3DRIzWtJjznMiJkZB%252BKU3yYArGuH4%253D' },
  'jeus': null,
  'nexacro': { customUrl: 'https://avatars.githubusercontent.com/u/32917911?v=4' },
  'jsp': { customUrl: 'https://png.pngtree.com/png-vector/20190411/ourmid/pngtree-jsp-file-document-icon-png-image_927521.jpg' },
  'fusioncharts': { customUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEiU2T4Fx5tts8gWTlcWM-RwBX-j-CpsAFfQ&s' },
  'ansible': { customUrl: '/ansible.png' },
  'ansiable': { customUrl: '/ansible.png' },
  'ubuntu': { customUrl: '/ubuntu.png' },
};

const TechIcon: React.FC<TechIconProps> = ({ name, size = 28, label, showLabel = true, variant = 'default' }) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const iconConfig = ICON_MAP[key];
  const isImageInvert = ['github', 'kafka', 'apachekafka'].includes(key);
  
  if (iconConfig === undefined || iconConfig === null) {
    if (variant === 'simple') {
      return (
        <span style={{ fontSize: '9px', fontWeight: 900, color: '#9ca3af', letterSpacing: '-0.05em', textAlign: 'center', lineHeight: 1 }}>
          {name.length <= 4 ? name.toUpperCase() : name.substring(0, 3).toUpperCase()}
        </span>
      );
    }
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <span className={styles.fallbackText}>
            {name.length <= 4 ? name.toUpperCase() : name.substring(0, 3).toUpperCase()}
          </span>
        </div>
        {showLabel && (
          <span className={styles.label}>
            {label || name}
          </span>
        )}
      </div>
    );
  }

  const iconUrl = iconConfig.customUrl || `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconConfig.slug}/${iconConfig.slug}-${iconConfig.version}.svg`;

  if (variant === 'simple') {
    return (
      <img 
        src={iconUrl} 
        alt={name}
        width={size}
        height={size}
        className={`${styles.img} ${isImageInvert ? styles.invert : ''}`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img 
          src={iconUrl} 
          alt={name}
          width={size}
          height={size}
          className={`${styles.img} ${isImageInvert ? styles.invert : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>
          {label || name}
        </span>
      )}
    </div>
  );
};

export default TechIcon;
export { TechIcon };
