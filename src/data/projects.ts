export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  period: string;
  client: string;
  role: string;
  description: string;
  tags: string[];
  achievements: string[];
  architecture: string[];
  architectureDiagram?: string;
  techStack: Record<string, string[]>;
  problemSolving: {
    title: string;
    issue: string;
    solution: string;
    impact?: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 'ngff-qms',
    title: 'NGFF QMS / IMS',
    subtitle: 'LX 판토스 차세대 글로벌 물류 품질 관리 시스템',
    category: 'Logistics · Architecture · Cloud',
    period: '2023.06 - 2024.05',
    client: 'LX 판토스 (LX Pantos)',
    role: 'Backend Lead · System Architect',
    description: '글로벌 물류 품질 관리를 위한 차세대 시스템(NGFF QMS)의 설계 및 구축을 리딩했습니다. Kafka 중심의 비동기 이벤트 아키텍처와 GCP 클라우드 인프라를 결합하여 시스템 간 결합도를 낮추고 데이터 정합성을 극대화한 프로젝트입니다.',
    tags: ['Java 11', 'Spring Boot', 'Kafka', 'GCP', 'MySQL', 'Redis', 'Docker', 'Nginx'],
    achievements: [
      'Kafka 기반 비동기 이벤트 드리븐 아키텍처(EDA) 설계 및 구축 → 시스템 결합도 획기적 개선',
      'SAP ERP 연동 대용량 데이터 파이프라인 구축 및 멱등성(Idempotency) 보장 로직 설계',
      'GCP 기반 고가용성(HA) 인프라 아키텍처 설계 (Cloud SQL 이중화, Nginx Proxy)',
      'Docker 컨테이너 기반 개발-운영 환경 표준화 및 Jenkins CI/CD 자동화 구축',
      'RAG 기반 LLM 챗봇 서비스를 실무 시스템에 성공적으로 통합하여 데이터 활용성 증대',
      'Redis 세션 스토어 도입을 통한 SSO 통합 인증 및 DB 조회 부하 최적화',
    ],
    architecture: ['Nginx Reverse Proxy', 'GCP (Cloud SQL, Redis)', 'Kafka / Zookeeper', 'Spring Boot (Docker)', 'WebSquare UI', 'SAP ERP Integration'],
    architectureDiagram: \
graph TD
    subgraph "External Systems"
        SAP[SAP ERP System]
    end
    subgraph "GCP Infrastructure"
        Nginx[Nginx Reverse Proxy]
        subgraph "Application Layer"
            API[API Server - Spring Boot]
            UI[UI Server - WebSquare]
        end
        subgraph "Messaging & Cache"
            Kafka[Apache Kafka]
            Redis[Redis Session/Cache]
        end
        subgraph "Data Layer"
            MySQL[(Cloud SQL - MySQL)]
            BQ[(BigQuery / Cloud Storage)]
        end
    end

    SAP -- "Events" --> Kafka
    Kafka -- "Subscribe" --> API
    Nginx -- "/api" --> API
    Nginx -- "/ui" --> UI
    API <--> Redis
    API <--> MySQL
    MySQL -- "Sync" --> BQ
    \,
    techStack: {
      'Backend': ['Java 11', 'Spring Boot 2.5.x', 'JPA'],
      'Infrastructure': ['GCP', 'Docker', 'Nginx', 'Jenkins'],
      'Messaging': ['Apache Kafka', 'Zookeeper'],
      'Database': ['MySQL (Cloud SQL)', 'Redis', 'BigQuery'],
    },
    problemSolving: [
      {
        title: '비동기 데이터 연동 시 정합성 및 유실 문제 해결',
        issue: 'SAP 등 외부 시스템과의 대량 데이터 연동 시 타겟 시스템 장애로 인한 메시지 유실 및 처리 지연 발생',
        solution: 'Kafka 메시지 큐와 재처리 메커니즘(Retry Logic)을 도입하고, 소비자(Consumer) 측에 멱등성 처리 로직을 적용하여 중복 방지 및 유실 제로 달성',
        impact: '시스템 안정성 강화 및 데이터 정합성 100% 확보'
      },
      {
        title: '환경 불일치로 인한 배포 오류 원천 차단',
        issue: '로컬 개발 환경과 실제 운영 환경(GCP) 간의 설정 차이로 인한 런타임 오류 빈번 발생',
        solution: '전 모듈 Docker 컨테이너화 및 환경 변수(ConfigMap/Secret) 기반 관리 체계 구축',
        impact: '배포 성공률 100% 달성 및 환경 구축 시간 70% 단축'
      }
    ]
  },
  {
    id: 'ngff-qms',
    title: 'NGFF-QMS / IMS',
    subtitle: '차세대 물류 품질/보험 통합 관리 시스템',
    category: 'Logistics · ERP',
    period: '2022.05 - 현재',
    client: 'LX Pantos',
    role: 'Backend Lead · DB Architect',
    description: 'LX Pantos의 차세대 프레이트 포워딩 프로젝트(NGFF) 내 품질관리 시스템(QMS)과 보험클레임 관리 시스템(IMS)을 설계·개발·운영한 프로젝트입니다. 대용량 물류 전표 데이터를 실시간 처리하고, SAP ERP 연동 및 KPI 대시보드 시각화를 통해 현업의 데이터 기반 의사결정을 지원했습니다.',
    tags: ['Java', 'Spring', 'Kafka', 'Redis', 'GCP', 'MySQL', 'Docker', 'Git', 'Jenkins', 'FusionCharts'],
    achievements: [
      'Apache Kafka 기반 SAP ERP 실시간 이벤트 스트리밍 파이프라인 설계 및 구축',
      'Docker Compose 기반 로컬 개발 환경 표준화 및 MSA 구조 검토',
      'Redis Cluster 기반 분산 세션(SSO) 관리로 무중단 고가용성 확보',
      'MySQL 사용자 정의 함수 + 복잡한 집계 쿼리로 KPI 대시보드 데이터 파이프라인 구축',
      'FusionCharts 연동 실시간 동적 그래프 구현 (주/월별 품질 지표 시각화)',
      'RSA + AES-256 하이브리드 암복호화 프로세스 설계 → ISMS-P 정기 심사 합격 기여',
      '다중 조인 병목 쿼리 실행계획(Explain Plan) 분석 → CTE(Common Table Expression) 도입으로 가독성 및 유지보수성 향상',
      '이기종 시스템 간 인터페이스 시 발생하는 문자열 화이트스페이스 및 인코딩 데이터 정합성 오류 해결',
    ],
    architecture: ['Client (WebSquare5)', 'Nginx (Reverse Proxy)', 'LENA 1.3 WAS', 'Spring + MyBatis', 'Apache Kafka (Event Streaming)', 'Redis Cluster (Session/Cache)', 'MySQL (Primary)', 'SAP ERP (External)', 'Jenkins (CI/CD)', 'GCP Infrastructure'],
    architectureDiagram: `
graph TD
    subgraph "Frontend Layer"
        UI[WebSquare5 / FusionCharts]
    end
    subgraph "Infrastructure Layer"
        Nginx[Nginx Reverse Proxy]
        LENA[LENA WAS / Spring Boot]
    end
    subgraph "Data & Messaging"
        Kafka{Apache Kafka}
        Redis[(Redis Cluster)]
        DB[(MySQL 8.0)]
    end
    subgraph "External Systems"
        SAP[SAP ERP]
    end
    UI <--> Nginx
    Nginx <--> LENA
    LENA <--> Redis
    LENA <--> Kafka
    Kafka <--> SAP
    LENA <--> DB
    `,
    techStack: {
      'Backend': ['Java', 'Spring Boot', 'MyBatis', 'MSA', 'LENA 1.3'],
      'Infrastructure': ['GCP', 'Linux CentOS', 'Docker', 'Kafka', 'Redis', 'Nginx', 'Jenkins'],
      'Database': ['MySQL (Function/Procedure)', 'SAP HANA (ERP)'],
      'Frontend': ['WebSquare5', 'FusionCharts', 'HTML5', 'CSS3'],
      'Security': ['RSA / AES-256', 'ISMS-P Compliance', 'Git'],
    },
    problemSolving: [
      {
        title: '이기종 시스템 연동 시 대용량 헤더 처리 이슈 해결',
        issue: '타 시스템으로부터 웹 전표(Invoice) 데이터를 인터페이스로 수신 시, 대용량 데이터 전송으로 인해 HTTP Header Size 초과 오류 발생',
        solution: 'WAS(LENA) 및 서버 설정을 통한 HttpHeaderSize 최적화 및 패킷 슬라이싱 전략 검토',
        impact: '인터페이스 성공률 100% 달성 및 데이터 수신 안정성 확보'
      },
      {
        title: '복잡한 다중 조인 쿼리 최적화 및 가독성 개선',
        issue: '엑셀 익스포트 및 대시보드 집계 시 다중 조인으로 인한 쿼리 성능 저하 및 유지보수 어려움 발생',
        solution: 'CTE(Common Table Expression)를 활용한 쿼리 논리 계층화 및 실행계획 기반 인덱스 튜닝',
        impact: '조회 성능 개선 및 복잡한 비즈니스 로직의 SQL 유지보수 생산성 향상'
      }
    ]
  },
  {
    id: 'fss-video',
    title: 'FSS 영상회의 시스템',
    subtitle: '금융감독원 사내 실시간 화상회의 솔루션',
    category: 'Real-time · Security',
    period: '2021.10 - 2022.04',
    client: '금융감독원 (FSS)',
    role: 'Full-Stack Developer · Reverse Engineer',
    description: '금융감독원 사내 화상회의 솔루션(세하컴즈 BODA)을 소스코드 없이 역공학으로 분석하여 커스터마이징하고, WebRTC 기반 실시간 영상/음성 스트리밍 시스템을 구축·안정화한 프로젝트입니다.',
    tags: ['Java', 'WebRTC', 'WebSocket', 'Oracle', 'Docker', 'Git'],
    achievements: [
      'Docker 기반 미디어 서버 환경 구성 및 컨테이너화',
      '소스코드 없는 패키지(JAR/WAR) 역공학(Reverse Engineering) → 핵심 비즈니스 로직 역추적 성공',
      'WebRTC + WebSocket 기반 다중 접속 실시간 영상/음성 스트리밍 최적화',
      'HTML5 Canvas API 기반 화이트보드 판서 기능 고도화 및 객체 동기화',
      '클라이언트 간 화이트보드 액션 좌표/객체 데이터 실시간 동기화 아키텍처 구현',
      '벤더사 의존성 탈피 → 사용자 만족도 극대화',
    ],
    architecture: ['Client (WebRTC/Canvas)', 'WebSocket Server', 'Media Server', 'Docker Container', 'Oracle 11c', 'Unix Server'],
    architectureDiagram: `
graph LR
    subgraph "Client Side"
        UserA[User A]
        UserB[User B]
    end
    subgraph "Server Side"
        Signaling[Signaling / WebSocket]
        Media[Media Server / WebRTC]
        DB[(Oracle 11c)]
    end
    UserA <--> Signaling
    UserB <--> Signaling
    UserA -- WebRTC Stream --- Media
    UserB -- WebRTC Stream --- Media
    Signaling <--> DB
    `,
    techStack: {
      'Backend': ['Java', 'Spring', 'WebSocket'],
      'Real-time': ['WebRTC', 'STUN/TURN'],
      'DevOps': ['Docker', 'Git', 'GitHub'],
      'Infrastructure': ['Unix Server', 'Oracle 11c'],
    },
    problemSolving: [
      {
        title: '소스코드 부재 상황에서의 로직 수정',
        issue: '기존 벤더사의 소스코드 인계 없이 특정 비즈니스 로직(회의실 권한 체크) 수정이 필요한 상황',
        solution: 'Bytecode Manipulation 및 역컴파일링을 통한 로직 분석, AspectJ(AOP)를 활용한 런타임 코드 주입',
        impact: '벤더사 기술 지원 없이 독자적인 시스템 고도화 성공'
      },
      {
        title: '화이트보드 대량 객체 동기화 지연 해결',
        issue: '수천 개의 선(Line) 객체 동기화 시 WebSocket 메시지 폭증으로 인한 렌더링 지연 발생',
        solution: 'Canvas 객체 데이터 압축 알고리즘 적용 및 프레임 드랍 방지를 위한 Throttling 최적화',
        impact: '동시 접속 50인 기준 판서 지연 시간 500ms → 50ms 미만 단축'
      }
    ]
  },
  {
    id: 'fss-messenger',
    title: 'FSS 메신저 고도화',
    subtitle: '금융감독원 차세대 통합 메신저 구축',
    category: 'Communication · Infrastructure',
    period: '2021.03 - 2021.09',
    client: '금융감독원 (FSS)',
    role: 'Backend Developer · DB Migration Architect',
    description: '네이트온(NateOn) 기반 노후 메신저를 신규 엔진(이지닉스 FFS)으로 전면 교체하고, 이기종 DB 간 무손실 암호화 마이그레이션, SSO/MFA 통합 인증, 인프라 3중화를 수행한 프로젝트입니다.',
    tags: ['Java', 'Spring', 'MariaDB', 'MySQL', 'Docker', 'Git'],
    achievements: [
      'Oracle ERP 인사 데이터 → MySQL 이기종 DB 간 계층형 조직도 트리 구조 마이그레이션 프로시저 설계',
      'MS-SQL 평문 대화내역 → MariaDB 암호화 전환: 100% 무손실 일괄 마이그레이션',
      'Docker 기반 메신저 엔진 배포 및 운영 자동화',
      'RTF ↔ HTML 포맷 변환 충돌 해결: 커스텀 파싱 엔진 자체 구현 → 메시지 유실률 0%',
      '인프라 3중화(Dev, Ops, DR) 아키텍처 구축 → 무중단 서비스',
      'SSO/MFA 통합 인증 체계 구축 → 비인가 접근 원천 차단',
    ],
    architecture: ['Client (Desktop App)', 'Docker Container', 'Spring WAS', 'WebSocket', 'MariaDB', 'MySQL', 'Oracle DB'],
    architectureDiagram: `
graph TD
    Client[Desktop / Mobile App]
    subgraph "Application Cluster"
        WAS1[FFS Engine 1]
        WAS2[FFS Engine 2]
    end
    subgraph "Database Tier"
        Maria[(MariaDB Cluster)]
        MySQL[(MySQL)]
        Oracle[(Legacy Oracle)]
    end
    Client <--> WAS1
    Client <--> WAS2
    WAS1 <--> Maria
    WAS1 <--> MySQL
    Maria <--> Oracle
    `,
    techStack: {
      'Backend': ['Java', 'Spring', 'MSA'],
      'Database': ['MariaDB', 'MySQL', 'MS-SQL', 'Oracle'],
      'DevOps': ['Docker', 'Git', 'GitHub'],
      'Security': ['SSO', 'MFA', 'AES-256'],
    },
    problemSolving: [
      {
        title: '이기종 DB 간 계층형 조직도 데이터 마이그레이션 및 정합성 확보',
        issue: '기존 Oracle ERP 인사 데이터를 MySQL 환경으로 이관 시, 복잡한 계층형 조직도 트리 구조를 유지하면서 정합성 있는 마이그레이션이 필요함',
        solution: 'WITH RECURSIVE (Recursive CTE) 기반의 계층 조회 쿼리 구현 및 인사 정보 동기화용 Stored Procedure 개발',
        impact: '조직도 트리 구조 데이터 무결성 확보 및 마이그레이션 자동화 체계 구축'
      },
      {
        title: '대량의 평문 대화 로그 실시간 암호화 이관',
        issue: '수천만 건의 기존 평문 대화 데이터를 서비스 중단 없이 AES-256으로 암호화하여 이관해야 함',
        solution: '다중 스레드 기반의 배치 마이그레이션 툴 자체 개발 및 트랜잭션 분리 처리',
        impact: '3,000만 건 데이터 6시간 내 100% 무손실 이관 성공'
      }
    ]
  },
  {
    id: 'fss-safety',
    title: 'FSS 통합 안전관리 시스템',
    subtitle: '금융감독원 사내 안전 및 시설 관리 고도화',
    category: 'Enterprise · Security',
    period: '2022.05 - 2023.05',
    client: '금융감독원 (FSS)',
    role: 'Backend Developer · UI/UX Optimizer',
    description: '금융감독원 내 시설 안전 관리 및 임직원 안전 수칙 준수 여부를 모니터링하고 관리하는 시스템의 운영 및 고도화를 담당했습니다. 레거시 UI 플랫폼을 개선하고 데이터 정합성을 확보하여 행정 업무 효율을 높였습니다.',
    tags: ['Java', 'Spring', 'Oracle', 'MiPlatform', 'SVN'],
    achievements: [
      'MiPlatform 기반 레거시 UI를 분석하여 사용자 편의성 중심의 인터페이스 고도화',
      'Oracle 기반 대용량 시설 관리 데이터 조회 성능 최적화 및 인덱스 튜닝',
      '사내 인사 시스템 연동을 통한 권한 관리 자동화 및 보안 정책 강화',
      '유지보수 효율을 위한 백엔드 로직 리팩토링 및 공통 모듈화 수행',
    ],
    architecture: ['Client (MiPlatform)', 'Spring Framework', 'Oracle 11c DB', 'Unix Server'],
    architectureDiagram: `
graph TD
    UI[MiPlatform Client]
    WAS[Spring WAS]
    DB[(Oracle 11c)]
    UI <--> WAS
    WAS <--> DB
    `,
    techStack: {
      'Backend': ['Java', 'Spring'],
      'Database': ['Oracle'],
      'Frontend': ['MiPlatform'],
      'DevOps': ['SVN'],
    },
    problemSolving: [
      {
        title: '레거시 플랫폼의 데이터 렌더링 지연 해결',
        issue: '시설물 전수 조사 데이터 조회 시 MiPlatform 그리드 렌더링 속도 저하 발생',
        solution: '데이터 페이징 처리 최적화 및 서버 사이드 정렬/필터링 로직 강화',
        impact: '데이터 로딩 속도 50% 개선 및 사용자 업무 만족도 향상'
      }
    ]
  },
  {
    id: 'lxp-voc',
    title: 'LX Pantos VOC',
    subtitle: '글로벌 고객의 소리(VOC) 수집 및 관리 시스템',
    category: 'Cloud · Customer Service',
    period: '2020.10 - 2021.02',
    client: 'LX Pantos',
    role: 'Full-Stack Developer',
    description: 'LX Pantos 홈페이지 내 고객의 소리(VOC) 페이지를 개발하고 안정화 및 운영·유지보수를 수행한 프로젝트입니다. 외부망에서 수집되는 개인정보의 안전한 내부망 전송 보안 아키텍처를 설계했습니다.',
    tags: ['Java', 'Spring', 'GCP', 'MySQL', 'Docker', 'Git'],
    achievements: [
      'GCP 기반 클라우드 네이티브 VOC 수집 파이프라인 구축',
      'Docker 컨테이너를 활용한 외부망 VOC 수집 서버 보안 격리',
      '외부→내부망 개인정보 이관 보안 아키텍처 설계',
      'RSA/AES-256 하이브리드 암복호화 적용',
    ],
    architecture: ['External Web', 'GCP Infrastructure', 'Docker Container', 'Spring Boot', 'MySQL', 'Internal Network'],
    architectureDiagram: `
graph LR
    subgraph "External (GCP)"
        Web[Public VOC Page]
        Proxy[Security Gateway]
    end
    subgraph "Internal Network"
        App[VOC Management System]
        DB[(MySQL)]
    end
    Web --> Proxy
    Proxy -- Hybrid Encryption --- App
    App <--> DB
    `,
    techStack: {
      'Backend': ['Java', 'Spring Boot'],
      'Infrastructure': ['GCP', 'Docker', 'Linux'],
      'Database': ['MySQL', 'Oracle'],
      'Security': ['RSA / AES-256', 'ISMS-P'],
    },
    problemSolving: [
      {
        title: '외부망 데이터 수집 보안 위협 방어',
        issue: '공개형 VOC 수집 페이지를 통한 SQL Injection 및 XSS 공격 시도 빈번',
        solution: 'Spring Security 기반의 필터링 강화 및 데이터 파라미터 유효성 검사 로직 표준화',
        impact: '보안 취약점 점검 결과 "최상" 등급 유지'
      }
    ]
  }
];
