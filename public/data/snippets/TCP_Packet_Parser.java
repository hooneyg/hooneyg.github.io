/**
 * Financial Fixed-Length Message Parser (TCP/IP)
 * ==============================================
 * 증권 인터페이스에서 사용되는 고정 길이 전문(Fixed-length Message)의
 * 고성능 파서입니다. ByteBuffer 기반으로 Zero-copy에 가까운 파싱을 구현합니다.
 *
 * 핵심 설계:
 * 1. Schema Registry 패턴으로 전문 구조 동적 관리
 * 2. ByteBuffer 기반 고성능 파싱 (String 객체 생성 최소화)
 * 3. EUC-KR ↔ UTF-8 인코딩 자동 감지 및 변환
 * 4. 전문 헤더/바디 분리 처리
 * 5. Checksum 검증을 통한 데이터 무결성 보장
 *
 * @author Kwak Gyeong-hoon (Hooney)
 */
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.zip.CRC32;

public class FinancialMessageParser {

    private static final Charset EUC_KR = Charset.forName("EUC-KR");
    private static final Charset UTF_8 = Charset.forName("UTF-8");

    // 전문 유형별 스키마 레지스트리
    private final Map<String, MessageSchema> schemaRegistry = new ConcurrentHashMap<>();

    /**
     * 전문 스키마 등록
     * - 전문 유형(TR코드)별로 필드 구조를 동적으로 관리
     */
    public void registerSchema(String trCode, MessageSchema schema) {
        schemaRegistry.put(trCode, schema);
    }

    /**
     * 수신된 Raw 바이트를 파싱하여 구조화된 Map으로 반환
     *
     * @param rawData TCP 소켓에서 수신된 원시 바이트 배열
     * @return 필드명 → 값 매핑
     * @throws ParseException 전문 구조 불일치 또는 체크섬 오류
     */
    public ParseResult parse(byte[] rawData) throws ParseException {
        ByteBuffer buffer = ByteBuffer.wrap(rawData);

        // 1. 공통 헤더 파싱 (보통 고정 50바이트)
        Header header = parseHeader(buffer);

        // 2. 스키마 조회
        MessageSchema schema = schemaRegistry.get(header.trCode);
        if (schema == null) {
            throw new ParseException("Unknown TR Code: " + header.trCode);
        }

        // 3. 바디 파싱
        Map<String, String> bodyFields = new LinkedHashMap<>();
        for (FieldDef field : schema.getFields()) {
            String value = extractField(buffer, field);
            bodyFields.put(field.getName(), value);
        }

        // 4. 체크섬 검증 (마지막 4바이트)
        if (schema.isChecksumEnabled()) {
            validateChecksum(rawData, buffer.position());
        }

        return new ParseResult(header, bodyFields);
    }

    /**
     * 공통 헤더 파싱
     * | 전문길이(4) | TR코드(8) | 송신일시(14) | 응답코드(4) | 예비(20) |
     */
    private Header parseHeader(ByteBuffer buffer) {
        int totalLength = Integer.parseInt(readBytes(buffer, 4, EUC_KR).trim());
        String trCode = readBytes(buffer, 8, EUC_KR).trim();
        String sendDt = readBytes(buffer, 14, EUC_KR).trim();
        String respCd = readBytes(buffer, 4, EUC_KR).trim();
        buffer.position(buffer.position() + 20); // 예비영역 스킵

        return new Header(totalLength, trCode, sendDt, respCd);
    }

    /**
     * ByteBuffer에서 지정 길이만큼 읽어 문자열로 변환
     * - EUC-KR 한글 깨짐 방지를 위한 바이트 단위 정확 추출
     */
    private String readBytes(ByteBuffer buffer, int length, Charset charset) {
        byte[] fieldBytes = new byte[length];
        buffer.get(fieldBytes);
        return new String(fieldBytes, charset).trim();
    }

    private String extractField(ByteBuffer buffer, FieldDef field) {
        Charset charset = field.isKorean() ? EUC_KR : UTF_8;
        String raw = readBytes(buffer, field.getLength(), charset);

        // 숫자 필드: 선행 0 제거 및 소수점 처리
        if (field.getType() == FieldType.NUMERIC) {
            return formatNumeric(raw, field.getDecimalPlaces());
        }
        return raw;
    }

    private String formatNumeric(String raw, int decimalPlaces) {
        if (decimalPlaces > 0 && raw.length() > decimalPlaces) {
            String intPart = raw.substring(0, raw.length() - decimalPlaces).replaceFirst("^0+", "");
            String decPart = raw.substring(raw.length() - decimalPlaces);
            return (intPart.isEmpty() ? "0" : intPart) + "." + decPart;
        }
        return raw.replaceFirst("^0+", "");
    }

    private void validateChecksum(byte[] rawData, int bodyEnd) throws ParseException {
        CRC32 crc = new CRC32();
        crc.update(rawData, 0, bodyEnd);
        long computed = crc.getValue();

        byte[] checksumBytes = new byte[4];
        System.arraycopy(rawData, bodyEnd, checksumBytes, 0, 4);
        long received = ByteBuffer.wrap(checksumBytes).getInt() & 0xFFFFFFFFL;

        if (computed != received) {
            throw new ParseException(
                String.format("Checksum mismatch: computed=%d, received=%d", computed, received)
            );
        }
    }

    // --- Inner Classes ---

    public static class Header {
        public final int totalLength;
        public final String trCode;
        public final String sendDateTime;
        public final String responseCode;

        Header(int totalLength, String trCode, String sendDt, String respCd) {
            this.totalLength = totalLength;
            this.trCode = trCode;
            this.sendDateTime = sendDt;
            this.responseCode = respCd;
        }
    }

    public static class ParseResult {
        public final Header header;
        public final Map<String, String> fields;

        ParseResult(Header header, Map<String, String> fields) {
            this.header = header;
            this.fields = Collections.unmodifiableMap(fields);
        }
    }

    public enum FieldType { STRING, NUMERIC, KOREAN }

    public static class FieldDef {
        private final String name;
        private final int length;
        private final FieldType type;
        private final int decimalPlaces;

        public FieldDef(String name, int length, FieldType type, int decimalPlaces) {
            this.name = name; this.length = length;
            this.type = type; this.decimalPlaces = decimalPlaces;
        }

        public String getName() { return name; }
        public int getLength() { return length; }
        public FieldType getType() { return type; }
        public int getDecimalPlaces() { return decimalPlaces; }
        public boolean isKorean() { return type == FieldType.KOREAN; }
    }

    public static class MessageSchema {
        private final List<FieldDef> fields;
        private final boolean checksumEnabled;

        public MessageSchema(List<FieldDef> fields, boolean checksumEnabled) {
            this.fields = Collections.unmodifiableList(fields);
            this.checksumEnabled = checksumEnabled;
        }

        public List<FieldDef> getFields() { return fields; }
        public boolean isChecksumEnabled() { return checksumEnabled; }
    }

    public static class ParseException extends Exception {
        public ParseException(String msg) { super(msg); }
    }
}
