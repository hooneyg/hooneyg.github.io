export interface Lab {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  githubUrl: string;
  keypoints: string[];
  architectureDiagram?: string;
}

export const labs: Lab[] = [
  {
    id: 'infra-master-lab',
    title: 'Infra Master Lab',
    subtitle: 'Ansible 기반 보안 강화 및 가상 클러스터 오케스트레이션 자동화',
    tags: ['Ansible', 'Kubernetes', 'Ubuntu', 'Security'],
    githubUrl: 'https://github.com/hooneyg/infra-master-lab',
    keypoints: [
      'Hexagonal Payment Domain: 결제 도메인을 외부 결제사, DB, 웹 프레임워크로부터 분리하여 비즈니스 논리의 독립성 보장',
      'Zero Trust Edge Network: Cloudflare Tunnel 기반 outbound 연결과 Nginx 보안 헤더 주입으로 인바운드 노출 포트 없이 안전한 트래픽 제어',
      'Terraform + Ansible IaC Pipeline: Terraform으로 인프라를 프로비저닝하고 Ansible로 OS 및 Docker 설정 구성을 자동화하여 반복 가능성 확보',
      'Kubernetes Operations Blueprint: 롤링 업데이트와 Liveness/Readiness 탐침 설정을 포함한 실무 지향적 오케스트레이션 가이드라인 수립'
    ],
    architectureDiagram: `graph TB
    subgraph Client ["External Traffic"]
        User["End User / App"]
    end

    subgraph EdgeProxy ["Zero Trust Edge Proxy"]
        CF["Cloudflare Edge / WAF"]
        Tunnel["Cloudflared Outbound Tunnel"]
        Nginx["Nginx Reverse Proxy"]
        CF --> Tunnel --> Nginx
    end

    subgraph ServiceMesh ["Microservice Ecosystem"]
        Gateway["Spring Cloud Gateway"]
        Config["Config Server"]

        subgraph BusinessService ["Payment Domain"]
            InPort["ProcessPaymentUseCase"]
            Domain["Payment Domain Model"]
            OutPort["PaymentGatewayPort"]
            InPort --> Domain --> OutPort
        end
    end

    subgraph ExternalAdapter ["External Adapters"]
        PG["Toss / Stripe Adapter"]
    end

    User -->|"HTTPS"| CF
    Nginx --> Gateway
    Gateway --> InPort
    OutPort -.-> PG
    Gateway -.-> Config`
  },
  {
    id: 'security-auth-core',
    title: 'Security Auth Core',
    subtitle: 'Spring Security 기반 정교한 JWT 인증 및 권한 관리 인프라',
    tags: ['SpringBoot', 'SpringSecurity', 'JWT', 'Java'],
    githubUrl: 'https://github.com/hooneyg/security-auth-core',
    keypoints: [
      'JWT Authentication System: Access Token과 Redis 기반 Refresh Token 관리로 서버 측 무효화 및 로그아웃 블랙리스트(Blacklist) 지원',
      'Refresh Token Rotation (RTR): 토큰 재발급 요청 시 기존 Refresh Token을 즉시 폐기하고 한 쌍을 새롭게 발급하여 재사용 공격(Replay Attack) 원천 차단',
      'Hybrid Encryption: RSA-2048 비대칭키로 대칭키를 안전하게 교환하고 실제 본문은 AES-256-GCM 알고리즘으로 초고속 암복호화 수행',
      'Spring Security 6.x Integration: Stateless API 환경에 대응하는 CORS 및 CSRF 세부 정책 설계와 역할 기반 접근 제어(RBAC) 전역 필터 적용'
    ],
    architectureDiagram: `graph TB
    subgraph "Client Layer"
        Client["Browser / Mobile Client"]
    end

    subgraph "Spring Security Filter Chain"
        CorsFilter["CORS Filter"]
        JwtFilter["JWT Authentication Filter"]
        AuthFilter["Authorization Filter"]
    end

    subgraph "Authentication Core"
        AuthController["Auth Controller"]
        JwtProvider["JWT Token Provider"]
    end

    subgraph "Encryption Module"
        CryptoService["Hybrid Crypto Service"]
        RSA["RSA-2048 Key Exchange"]
        AES["AES-256-GCM Data Encryption"]
    end

    subgraph "Token Store"
        RefreshRepo["Refresh Token Repository"]
        Blacklist["Token Blacklist"]
    end

    Client -->|"Request + Bearer Token"| CorsFilter
    CorsFilter --> JwtFilter
    JwtFilter -->|"Validate JWT"| JwtProvider
    JwtFilter -->|"Check Blacklist"| Blacklist
    JwtFilter --> AuthFilter
    AuthFilter -->|"RBAC Check"| AuthController

    AuthController -->|"Issue Tokens"| JwtProvider
    AuthController -->|"Store Refresh Token"| RefreshRepo
    AuthController -->|"Encrypt Sensitive Payload"| CryptoService

    CryptoService --> RSA
    CryptoService --> AES`
  },
  {
    id: 'ai-agent-brain-lab',
    title: 'AI Agent Brain Lab',
    subtitle: 'Semantic Search 및 인공지능 에이전트 다차원 브레인 코어',
    tags: ['Python', 'OpenAI', 'VectorDB', 'FastAPI'],
    githubUrl: 'https://github.com/hooneyg/ai-agent-brain-lab',
    keypoints: [
      'Java/Python Hybrid Agent Architecture: API 진입점 및 예외 복구(Fallback)는 Spring Boot 오케스트레이터가 담당하고, AI 추론 및 RAG 검색은 FastAPI 코어 서버가 분리 처리',
      'ReAct Reasoning Engine: Reason(추론)과 Act(실행) 루프를 통해 문제 분석 후 적합한 인프라 조치 도구(Tool)를 에이전트 스스로 선택 및 런타임 실행하도록 설계',
      'Context-aware RAG Retrieval: HuggingFace 로컬 임베딩 및 ChromaDB 벡터 저장소를 사용하여 시스템 가이드와 트러블슈팅 지식을 활용한 고신뢰성 답변 생성',
      'Provider-agnostic LLM Gateway: OpenRouter 호환 API 어댑터를 구축하여 환경 변수 변경만으로 손쉽게 백엔드 LLM 모델 전환 및 이중화 대비'
    ],
    architectureDiagram: `graph TD
    User["User / Developer"] <--> Orchestrator["Spring Boot Orchestrator"]
    Orchestrator <--> API["FastAPI Agent Server"]

    subgraph "Agent Brain Core"
        API <--> Agent["ReAct Agent Engine"]
        Agent <--> RAG["RAG Retrieval Engine"]
        Agent <--> Tools["Infrastructure Tools"]
    end

    subgraph "Knowledge & LLM"
        RAG --> VectorDB[("ChromaDB")]
        VectorDB --> Embedding["HuggingFace Embedding"]
        Agent --> LLM["OpenRouter-compatible LLM"]
    end

    subgraph "External Targets"
        Tools --> Infra["infra-master-lab"]
        Infra --> K8S["Kubernetes"]
        Infra --> Ansible["Ansible Playbooks"]
    end`
  },
  {
    id: 'database-master-lab',
    title: 'Database Master Lab',
    subtitle: '고성능 분산 데이터베이스 이중화 및 샤딩 튜닝 테스트베드',
    tags: ['PostgreSQL', 'MySQL', 'Database', 'Replication'],
    githubUrl: 'https://github.com/hooneyg/database-master-lab',
    keypoints: [
      'DTO Boundary Separation: API 진입점부터 데이터 입출력 스펙을 엔티티(Entity) 클래스와 완전히 분리하여 도메인 오염을 차단하고 입력 검증 경계 확립',
      'Multi-access Data Strategy: JPA/QueryDSL(생산성), MyBatis(복잡 SQL 및 통계), JdbcTemplate(대용량 배치)의 특성을 고려하여 업무 상황별 최적의 도구를 조합해 활용하는 표준 제시',
      'Query Optimization: N+1 문제 방어용 Fetch Join 설계, 10,000건의 Bulk Insert 최적화(saveAll 3.5초 vs batchUpdate 0.15초), offset 대신 Cursor 기반 대용량 페이징 적용',
      'Concurrency Defense: 다중 스레드 동시 수정 상황에서의 Lost Update를 방지하기 위해 @Version 낙관적 락(Optimistic Lock)을 적용하고 분산 충돌 방어 기법 검증'
    ],
    architectureDiagram: `graph TB
    subgraph "Client Layer"
        Client["Browser / Mobile App"]
    end

    subgraph "Presentation & Business"
        Controller["RestController / DTO Validation"]
        Service["Service Layer / Transaction Boundary"]
    end

    subgraph "Data Access Strategy"
        JPA["Spring Data JPA + QueryDSL"]
        MyBatis["MyBatis Mapper"]
        JDBC["JdbcTemplate Batch"]
    end

    subgraph "Persistence Layer"
        H2[("H2 In-memory")]
        PG[("PostgreSQL Optional")]
    end

    Client --> Controller
    Controller --> Service
    Service -->|"ORM Mode"| JPA
    Service -->|"SQL Mode"| MyBatis
    Service -->|"Batch Mode"| JDBC
    JPA --> H2
    MyBatis --> H2
    JDBC --> H2
    JPA -.-> PG
    MyBatis -.-> PG
    JDBC -.-> PG`
  },
  {
    id: 'event-streaming-lab',
    title: 'Event Streaming Lab',
    subtitle: 'Kafka 기반 이벤트 드리븐 분산 아키텍처 및 스트림 프로세싱',
    tags: ['Kafka', 'SpringBoot', 'Docker', 'EventDriven'],
    githubUrl: 'https://github.com/hooneyg/event-streaming-lab',
    keypoints: [
      'Transactional Outbox Pattern: 비즈니스 주문 저장과 아웃박스 이벤트 적재를 단일 DB 로컬 트랜잭션으로 묶어 DB와 메시지 큐 간의 발행 원자성(Atomicity) 보장',
      'Idempotent Consumer: 이미 소비 완료한 이벤트 ID를 기록하는 이력 테이블을 활용하여, 네트워크 재전송에 의한 중복 유입 상황에서도 비즈니스 로직 중복 처리를 완벽하게 차단',
      'Enterprise Reliability Tuning: acks=all 및 Idempotent Producer 설정을 통해 카프카 브로커 일시 장애 등 다양한 예외 상황에서도 유실과 중복 없는 신뢰성 있는 이벤트 전파 보장',
      'Testcontainers Integration: Mock 환경이 아닌 실제 컨테이너화된 Kafka 및 MySQL을 테스트 런타임에 구동하여 분산 환경 하에서의 예외 상황 E2E 흐름 검증'
    ],
    architectureDiagram: `sequenceDiagram
    autonumber
    participant OS as OrderService
    participant DB as MySQL Order & Outbox
    participant Relay as OutboxEventRelay
    participant Kafka as Apache Kafka
    participant Consumer as Idempotent Consumer

    OS->>DB: Save order and outbox event in one transaction
    DB-->>OS: Commit
    loop scheduled relay
        Relay->>DB: Find INIT events
        Relay->>Kafka: Publish event
        Kafka-->>Relay: Ack
        Relay->>DB: Mark PUBLISHED
    end
    Kafka->>Consumer: Deliver event
    Consumer->>DB: Check processed_events
    Consumer->>Consumer: Execute business logic once
    Consumer->>DB: Save processed event id`
  },
  {
    id: 'realtime-comm-lab',
    title: 'Realtime Comm Lab',
    subtitle: 'WebSocket 및 WebRTC 기반 실시간 초저지연 양방향 통신 허브',
    tags: ['WebSocket', 'WebRTC', 'React', 'TypeScript'],
    githubUrl: 'https://github.com/hooneyg/realtime-comm-lab',
    keypoints: [
      'Redis Pub/Sub scale-out: 다중 애플리케이션 노드 분산 환경에서 특정 서버 세션 경계를 넘어 Redis 채널을 통해 실시간 대화방 메시지를 상호 동기화 및 전역 브로드캐스트 구현',
      'JWT Handshake Interceptor: HTTP 필터와 분리된 웹소켓 전용 STOMP Interceptor를 구현하여 웹소켓 최초 연결(CONNECT) 단계에서 토큰 검증 및 비인가 접근 제어',
      'WebRTC P2P Signaling: SDP Offer/Answer 및 ICE Candidate 정보를 중계하는 시그널링 통신 프로토콜을 구축하여, 대용량 실시간 미디어 스트림은 서버 부하 없이 P2P로 직접 교환 유도',
      'Glassmorphism Live Tester: JWT 자동 생성기 및 페이로드 템플릿, Fira Code 스타일 로그 터미널을 갖춘 실시간 양방향 통신 모니터링 시뮬레이터 대시보드 내장'
    ],
    architectureDiagram: `sequenceDiagram
    autonumber
    actor C1 as Client A
    participant N1 as Node 1
    participant Redis as Redis Pub/Sub
    participant N2 as Node 2
    actor C2 as Client B

    C1->>N1: CONNECT /ws-chat with JWT
    C2->>N2: CONNECT /ws-chat with JWT
    C1->>N1: SEND /app/chat/message
    N1->>Redis: PUBLISH message to room topic
    Redis-->>N2: SUBSCRIBE broadcast message
    N2->>C2: MESSAGE /topic/chat/room/{id}`
  }
];
