export interface Snippet {
  id: string;
  title: string;
  lang: string;
  file: string;
  desc: string;
  category: string;
  content?: string;
  diagram?: string;
}

export const SNIPPETS_DATA: Snippet[] = [
  {
    id: 'kafka',
    title: 'Kafka Distributed Consumer',
    lang: 'Java',
    file: 'Kafka_Distributed_Consumer.java',
    desc: '분산 아키텍처에서 데이터 유실 및 중복을 방지하기 위해 중복 제거(Idempotency) 테이블과 트랜잭션을 연동한 Exactly-Once Consumer 패턴. 장애 복구를 위한 지수 백오프 기반 재시도(Retry with Exponential Backoff) 및 DLQ(Dead Letter Queue) 자동 전송 파이프라인 설계.',
    category: '분산 처리',
    diagram: `
sequenceDiagram
    autonumber
    participant Producer as Kafka Producer
    participant Broker as Kafka Cluster (Topics)
    participant ConsumerGroup as Consumer Group Coor.
    participant Consumer as Distributed Consumer (Pod)
    participant DB as Enterprise DB (MySQL/PgSQL)
    participant DLQ as Dead Letter Queue (DLQ Topic)
    
    Producer->>Broker: Produce Message with IdempotentKey
    Broker->>ConsumerGroup: Group Rebalancing & Heartbeat
    ConsumerGroup-->>Consumer: Assign Partition
    Consumer->>Broker: Fetch Messages (Batch)
    
    activate Consumer
    Note over Consumer: Deduplication Check via Redis/DB
    
    alt Unique Message (Success Flow)
        Consumer->>DB: Start DB Transaction
        Consumer->>DB: Write Business Data & Deduplication Key
        Consumer->>DB: Commit Transaction
        Consumer->>Broker: Commit Offset (Acks All)
    else Duplicate Message (Skipped Flow)
        Note over Consumer: Duplicate Detected
        Consumer->>Broker: Commit Offset (Immediate)
    end
    
    alt Exception Occurred (Failure Flow)
        Note over Consumer: Process Failure (Retry Exhausted)
        Consumer->>DLQ: Route to DLQ Topic (dlq.invoice.process)
        Consumer->>Broker: Commit Offset (Acks Failed Msg)
    end
    deactivate Consumer
    `
  },
  {
    id: 'csrf',
    title: 'CSRF Security Filter',
    lang: 'Java',
    file: 'CSRF_Security_Filter.java',
    desc: 'Stateless 인증(JWT) 환경에서 CSRF 공격을 효과적으로 차단하기 위한 Double Submit Cookie 패턴 구현체. SameSite=Strict 및 Secure 속성을 적용한 쿠키 정책과 암호화 토큰 비교, 그리고 토큰 고정 공격을 우회하기 위한 세션 회전(Token Rotation) 메커니즘 제공.',
    category: '보안',
    diagram: `
sequenceDiagram
    autonumber
    participant Browser as Client Browser
    participant Filter as CsrfSecurityFilter
    participant Controller as Application Controller
    
    Note over Browser, Filter: Phase 1: Handshake & Token Issue
    Browser->>Filter: GET Request (First Visit)
    Filter->>Filter: Generate Cryptographic CSRF Token
    Filter-->>Browser: Set-Cookie: XSRF-TOKEN (SameSite=Strict, Secure, HttpOnly=False)
    
    Note over Browser, Filter: Phase 2: State-Changing Request (POST/PUT/DELETE)
    Browser->>Browser: Read XSRF-TOKEN from Cookie via JS
    Browser->>Filter: AJAX Request + Header (X-CSRF-TOKEN: token_value)
    
    activate Filter
    Filter->>Filter: Extract Token from Cookie (Token A)
    Filter->>Filter: Extract Token from Header (Token B)
    
    alt Token A == Token B (Valid Request)
        Filter->>Filter: Rotate Token (Generate New Token)
        Filter->>Controller: Dispatch to Controller
        Controller-->>Browser: 200 OK Response (With Rotated Cookie)
    else Token Mismatch or Missing (Malicious/Forged)
        Filter-->>Browser: 403 Forbidden Response (Access Denied)
    end
    deactivate Filter
    `
  },
  {
    id: 'enc',
    title: 'RSA/AES Hybrid Encryption',
    lang: 'Java',
    file: 'Hybrid_Encryption_Provider.java',
    desc: '대용량 페이로드의 고속 암호화를 위한 AES-256 대칭 키와, 이를 안전하게 교환하기 위한 RSA-2048 비대칭 키 기반의 하이브리드 암호화 아키텍처. 개인정보 및 민감 데이터를 안전하게 가로채기 방지(Eavesdropping)하고, ISMS-P 규정을 완벽하게 만족하는 암호화 프로바이더.',
    category: '보안',
    diagram: `
graph TD
    subgraph Client ["Client (Payload Origin)"]
        RawData["Raw JSON Payload"]
        GenKey["Generate Random AES-256 Key (One-time)"]
        AESEnc["AES-256 Encryption Engine"]
        RSAEnc["RSA-2048 Public Key Encryption"]
    end

    subgraph Channel ["Transit Network (Encrypted Stream)"]
        EncPayload["Encrypted Payload (Base64)"]
        EncAESKey["Encrypted AES Key (Base64)"]
    end

    subgraph Server ["Server (Secure Decryptor)"]
        RSADec["RSA-2048 Private Key Decryption"]
        AESDec["AES-256 Decryption Engine"]
        Process["Secure Business Logic"]
        RSAPrivate[("RSA Private Key (HSM / KMS)")]
    end

    %% Client flow
    RawData -->|Plain Text| AESEnc
    GenKey -->|Symmetric Key| AESEnc
    GenKey -->|Symmetric Key| RSAEnc
    RSAEnc -->|Encrypt via Server PubKey| EncAESKey
    AESEnc -->|Symmetric Encrypt| EncPayload

    %% Transit
    EncPayload -->|Secure Transmit| AESDec
    EncAESKey -->|Secure Transmit| RSADec

    %% Server flow
    RSAPrivate -->|Retrieve Key| RSADec
    RSADec -->|Decrypt Key| AESDec
    AESDec -->|Decrypt Payload| Process
    `
  },
  {
    id: 'tcp',
    title: 'TCP Packet Parser',
    lang: 'Java',
    file: 'TCP_Packet_Parser.java',
    desc: '금융권의 대용량 호스트 인터페이스를 고속 처리하기 위한 오프힙(Off-Heap) 메모리 ByteBuffer 기반 파서. 고정 길이 전문 헤더의 길이 지시자를 파싱하여 가변 바디 데이터 바인딩을 최소화하고 GC 부하를 대폭 줄여 Microsecond 수준의 지연 시간을 만족하는 성능 지향적 파이프라인.',
    category: '통신',
    diagram: `
graph TD
    subgraph Pipeline ["High-Performance Packet Parsing Pipeline"]
        ByteStream[Incoming TCP Byte Stream]
        Buffer[Direct ByteBuffer - Off-heap]
        Header["Fixed Header Parser (80 Bytes)"]
        LengthCheck{Extract Content Length}
        BodyWait[Accumulate Remaining Body Bytes]
        BodyParser[Segmented Body Parser]
        CheckSum[Checksum Validation]
        POJO[POJO Mapping & Event Dispatch]
    end

    ByteStream -->|Socket Read| Buffer
    Buffer -->|Read Header| Header
    Header --> LengthCheck
    LengthCheck -->|Required Length| BodyWait
    BodyWait -->|Full Payload Ready| BodyParser
    BodyParser --> CheckSum
    CheckSum -->|Checksum Valid| POJO
    CheckSum -->|Checksum Mismatch| Error[Throw ParseException & Terminate]
    `
  },
  {
    id: 'migration',
    title: 'DB Migration Procedure',
    lang: 'SQL',
    file: 'DB_Migration_Procedure.sql',
    desc: '이기종 데이터베이스(Oracle to MariaDB) 마이그레이션 시, 레거시 계층 쿼리(CONNECT BY)를 ANSI 표준 Recursive CTE 구조로 변환하며, 개인정보 암호화(AES-256) 처리를 일괄 수행하는 고성능 무손실 벌크 마이그레이션 프로시저.',
    category: 'DB 설계',
    diagram: `
graph TD
    subgraph Source ["Legacy Oracle Database"]
        OracleOrg[(Oracle: CONNECT BY Organization Tree)]
        OraclePriv[(Plaintext Personal Data)]
    end

    subgraph Batch ["Bulk Migration Procedure Layer"]
        CTETra["SQL Translator: CONNECT BY to Recursive CTE"]
        ChunkProc["Cursor-based Chunk Processing (10,000 Rows/Batch)"]
        AESEnc["AES-256 DB Cryptographic Engine"]
        Failsafe["Error Handler (Savepoint & Rollback Log)"]
    end

    subgraph Destination ["Target MariaDB Database"]
        MariaOrg[(MariaDB: ANSI Recursive CTE Tree)]
        MariaSec[(AES-256 Encrypted Secure Data)]
    end

    OracleOrg --> CTETra
    CTETra --> ChunkProc
    ChunkProc --> MariaOrg

    OraclePriv --> AESEnc
    AESEnc --> ChunkProc
    ChunkProc -->|Encrypt & Insert| MariaSec
    ChunkProc -.->|Error Detected| Failsafe
    `
  },
  {
    id: 'hierarchy',
    title: 'Recursive Hierarchy SQL',
    lang: 'SQL',
    file: 'Complex_Hierarchy_Query.sql',
    desc: '대규모 인사 정보 조직도(Hierarchy Tree)를 단일 쿼리로 전체 경로와 정렬 우선순위(Sort Path)까지 추출하는 Recursive CTE 쿼리. 불필요한 서브쿼리를 최적화하여 윈도우 함수(Window Function)와 인덱스 스캔을 결합한 대용량 조직 트리 탐색 쿼리.',
    category: 'DB 설계',
    diagram: `
graph TD
    subgraph Tree ["Recursive CTE Execution Tree"]
        Base["Anchor Member: Root Node (Dept ID = Parent Dept ID)"]
        Recursive["Recursive Member: Join Dept Table with Previous Level"]
        Depth["Depth Calculation (depth = depth + 1)"]
        SortPath["Sort Path Generation (CONCAT(sort_path, dept_name))"]
        Result[("Consolidated Hierarchy ResultSet")]
    end

    Base --> Recursive
    Recursive --> Depth
    Depth --> SortPath
    SortPath -->|Loop until Dept ID is Leaf| Recursive
    SortPath -->|Final Union All| Result
    `
  },
];
