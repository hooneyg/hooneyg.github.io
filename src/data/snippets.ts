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
    desc: 'Exactly-Once Semantics, DLQ 패턴, Consumer Group 리밸런싱 처리가 포함된 분산 메시지 컨슈머.',
    category: '분산 처리',
    diagram: `
sequenceDiagram
    participant Producer
    participant Kafka as Kafka Cluster
    participant Consumer as Distributed Consumer
    participant DB as MySQL/PostgreSQL
    participant DLQ as Dead Letter Queue
    
    Producer->>Kafka: Message with Idempotent Key
    Kafka->>Consumer: Pull Message
    alt Success
        Consumer->>DB: Atomic Transaction
        Consumer->>Kafka: Offset Commit
    else Failure (Retry Limit Exceeded)
        Consumer->>DLQ: Send to Error Topic
        Consumer->>Kafka: Offset Commit
    end
    `
  },
  {
    id: 'csrf',
    title: 'CSRF Security Filter',
    lang: 'Java',
    file: 'CSRF_Security_Filter.java',
    desc: 'Double Submit Cookie + SameSite 정책 기반 금융권 CSRF 방어 필터. 토큰 회전(Rotation) 포함.',
    category: '보안',
    diagram: `
sequenceDiagram
    participant Browser
    participant Server
    
    Browser->>Server: Initial Request
    Server-->>Browser: Set CSRF Cookie (SameSite=Strict)
    Browser->>Server: POST/PUT Request + Custom Header (X-CSRF-TOKEN)
    Server->>Server: Compare Cookie Value vs Header Value
    alt Match
        Server-->>Browser: 200 OK
    else Mismatch
        Server-->>Browser: 403 Forbidden
    end
    `
  },
  {
    id: 'enc',
    title: 'RSA/AES Hybrid Encryption',
    lang: 'Java',
    file: 'Hybrid_Encryption_Provider.java',
    desc: 'ISMS-P 인증 기준 충족 하이브리드 암복호화 프로토콜. 전송 구간 + 저장 구간 이중 암호화.',
    category: '보안',
    diagram: `
graph TD
    subgraph "Key Exchange (RSA)"
        ClientK[Client Generator]
        ServerK[Server Public Key]
        SessionK[Generated Session Key - AES]
    end
    subgraph "Data Transfer (AES)"
        Data[Payload]
        EncData[Encrypted Payload]
    end
    ClientK -->|Encrypt Session Key| ServerK
    SessionK -->|Symmetric Encrypt| Data
    Data --> EncData
    `
  },
  {
    id: 'tcp',
    title: 'TCP Packet Parser',
    lang: 'Java',
    file: 'TCP_Packet_Parser.java',
    desc: '증권 인터페이스 고정 길이 전문의 ByteBuffer 기반 고성능 파싱 로직.',
    category: '통신',
    diagram: `
graph LR
    ByteStream[TCP Byte Stream] --> Buffer[ByteBuffer Pool]
    Buffer --> Header[Fixed Header Parser]
    Header --> Length[Body Length Calculation]
    Length --> Body[Segmented Body Parser]
    Body --> POJO[Business Object]
    `
  },
  {
    id: 'migration',
    title: 'DB Migration Procedure',
    lang: 'SQL',
    file: 'DB_Migration_Procedure.sql',
    desc: 'Oracle → MariaDB 이기종 DB 간 재귀 CTE 조직도 트리 + 무손실 암호화 마이그레이션 프로시저.',
    category: 'DB 설계',
    diagram: `
graph TD
    Oracle[(Oracle: CONNECT BY)] --> Parser[SQL Translation Layer]
    Parser --> Maria[(MariaDB: Recursive CTE)]
    Maria --> Encrypt[AES-256 Encryption Batch]
    Encrypt --> Final[(Secure Database)]
    `
  },
  {
    id: 'hierarchy',
    title: 'Recursive Hierarchy SQL',
    lang: 'SQL',
    file: 'Complex_Hierarchy_Query.sql',
    desc: '재귀 CTE 기반 계층형 조직도 트리 구조 + 대용량 조건부 집계 최적화 쿼리.',
    category: 'DB 설계',
    diagram: `
graph BT
    Emp[Employee Node] --> Manager[Direct Manager]
    Manager --> Director[Director]
    Director --> CEO[CEO]
    CEO --> Root[Root Node]
    `
  },
];
