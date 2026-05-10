
/**
 * Kafka Distributed Consumer with Exactly-Once Semantics
 * ======================================================
 * SAP ERP 실시간 연동 시 사용한 Kafka Consumer 구현체입니다.
 * - Exactly-Once 보장을 위한 수동 Offset 커밋 전략
 * - Consumer Group 기반 파티션 리밸런싱 처리
 * - Dead Letter Queue(DLQ) 패턴으로 장애 메시지 격리
 * 
 * @author Hooney
 * @project LX Pantos NGFF-QMS
 */
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KafkaDistributedConsumer {

    private static final int MAX_RETRY_COUNT = 3;
    private static final String DLQ_TOPIC = "ngff-qms.dlq";

    // 파티션별 오프셋 추적 (Exactly-Once 보장)
    private final Map<TopicPartition, Long> currentOffsets = new ConcurrentHashMap<>();

    /**
     * SAP ERP 변경 데이터 수신 리스너
     * - 수동 ACK 모드로 Exactly-Once Semantics 구현
     * - 트랜잭션 범위 내에서 DB 저장 후 Offset 커밋
     */
    @KafkaListener(topics = "sap-erp.order-changes", groupId = "ngff-qms-consumer-group", containerFactory = "kafkaManualAckListenerContainerFactory")
    @Transactional
    public void consumeOrderChange(ConsumerRecord<String, String> record,
            Acknowledgment acknowledgment) {
        String eventKey = record.key();
        String payload = record.value();

        try {
            // 1. 멱등성(Idempotency) 검증 - 중복 처리 방지
            if (isAlreadyProcessed(eventKey)) {
                acknowledgment.acknowledge();
                return;
            }

            // 2. SAP 전문 파싱 및 비즈니스 로직 실행
            OrderChangeEvent event = parseEvent(payload);
            processOrderChange(event);

            // 3. 처리 완료 후 수동 Offset 커밋
            trackOffset(record);
            acknowledgment.acknowledge();

        } catch (RetryableException e) {
            // 재시도 가능한 예외: 재시도 큐로 전달
            handleRetryableFailure(record, e);
        } catch (Exception e) {
            // 재시도 불가 예외: Dead Letter Queue로 격리
            publishToDeadLetterQueue(record, e);
            acknowledgment.acknowledge(); // DLQ 전송 후 커밋
        }
    }

    /**
     * Consumer Group 리밸런싱 핸들러
     * - 파티션 재할당 시 오프셋 정합성 보장
     */
    public static class RebalanceHandler implements ConsumerRebalanceListener {
        private final KafkaConsumer<String, String> consumer;
        private final Map<TopicPartition, Long> offsets;

        public RebalanceHandler(KafkaConsumer<String, String> consumer,
                Map<TopicPartition, Long> offsets) {
            this.consumer = consumer;
            this.offsets = offsets;
        }

        @Override
        public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
            // 리밸런싱 전: 현재까지 처리된 오프셋을 동기 커밋
            Map<TopicPartition, OffsetAndMetadata> commitOffsets = new HashMap<>();
            partitions.forEach(tp -> {
                Long offset = offsets.get(tp);
                if (offset != null) {
                    commitOffsets.put(tp, new OffsetAndMetadata(offset + 1));
                }
            });
            if (!commitOffsets.isEmpty()) {
                consumer.commitSync(commitOffsets);
            }
        }

        @Override
        public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
            // 리밸런싱 후: 새로 할당된 파티션의 커밋된 오프셋부터 소비 재개
            partitions.forEach(tp -> {
                OffsetAndMetadata committed = consumer.committed(tp);
                if (committed != null) {
                    consumer.seek(tp, committed.offset());
                }
            });
        }
    }

    /**
     * Batch Consumer 구성 예시
     * - 대용량 전표 데이터 일괄 처리 시 사용
     * - fetch.min.bytes, max.poll.records 튜닝으로 처리량 극대화
     */
    public Properties buildBatchConsumerConfig() {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka-broker-1:9092,kafka-broker-2:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "ngff-qms-batch-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        // 성능 튜닝 파라미터
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); // 수동 커밋
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500); // 배치 크기
        props.put(ConsumerConfig.FETCH_MIN_BYTES_CONFIG, 1024 * 50); // 최소 50KB
        props.put(ConsumerConfig.FETCH_MAX_WAIT_MS_CONFIG, 500); // 최대 대기
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 30000); // 세션 타임아웃
        props.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, 10000); // 하트비트

        return props;
    }

    // --- Private Helper Methods ---

    private void trackOffset(ConsumerRecord<String, String> record) {
        currentOffsets.put(
                new TopicPartition(record.topic(), record.partition()),
                record.offset());
    }

    private boolean isAlreadyProcessed(String eventKey) {
        /* Redis 기반 멱등성 체크 */ return false;
    }

    private OrderChangeEvent parseEvent(String payload) {
        /* JSON → DTO 변환 */ return new OrderChangeEvent();
    }

    private void processOrderChange(OrderChangeEvent event) {
        /* 비즈니스 로직 */ }

    private void handleRetryableFailure(ConsumerRecord<String, String> record, Exception e) {
        /* 재시도 */ }

    private void publishToDeadLetterQueue(ConsumerRecord<String, String> record, Exception e) {
        /* DLQ */ }

    // Inner classes
    private static class OrderChangeEvent {
    }

    private static class RetryableException extends RuntimeException {
        public RetryableException(String msg) {
            super(msg);
        }
    }
}
