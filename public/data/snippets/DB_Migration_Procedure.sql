-- =====================================================
-- 이기종 DB 간 ERP HR 데이터 무손실 마이그레이션 프로시저
-- =====================================================
-- Oracle(사내 ERP) → MariaDB(메신저) 간 인사/발령 데이터를
-- 결손 없이 이관하는 데이터 마이그레이션 프로시저입니다.
--
-- 핵심 포인트:
-- 1. 재귀 CTE로 복잡한 다단계 조직 구조 트리 모델링
-- 2. UPSERT(INSERT ON DUPLICATE KEY UPDATE)로 멱등성 보장
-- 3. 마이그레이션 감사 로그(Audit Trail) 기록
-- 4. 에러 발생 시 트랜잭션 롤백 및 알림
--
-- @author  Hooney
-- @project FSS Messenger Migration (NateOn → Eginix FFS)
-- =====================================================

DELIMITER $$

CREATE PROCEDURE sp_sync_erp_organization(
    IN p_sync_date DATE,
    IN p_full_sync BOOLEAN
)
BEGIN
    DECLARE v_inserted INT DEFAULT 0;
    DECLARE v_updated  INT DEFAULT 0;
    DECLARE v_deleted  INT DEFAULT 0;
    DECLARE v_error_msg VARCHAR(500);

    -- 에러 핸들러: 예외 발생 시 롤백 후 감사 로그 기록
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_msg = MESSAGE_TEXT;
        ROLLBACK;
        INSERT INTO migration_audit_log (sync_date, status, error_message, created_at)
        VALUES (p_sync_date, 'FAILED', v_error_msg, NOW());
    END;

    START TRANSACTION;

    -- ============================================
    -- STEP 1: 조직도 계층 구조 동기화
    -- 재귀 CTE로 Oracle ERP의 다단계 조직을 트리로 변환
    -- ============================================
    INSERT INTO departments (dept_id, dept_name, parent_dept_id, depth, full_path, sort_order)
    WITH RECURSIVE org_tree AS (
        -- Anchor: 최상위 조직 (금융감독원장)
        SELECT
            e.dept_id,
            e.dept_name,
            NULL AS parent_dept_id,
            1 AS depth,
            CAST(e.dept_name AS CHAR(500)) AS full_path,
            CAST(LPAD(e.sort_seq, 4, '0') AS CHAR(200)) AS sort_key
        FROM erp_departments_staging e
        WHERE e.parent_dept_id IS NULL
          AND e.is_active = 'Y'

        UNION ALL

        -- Recursive: 하위 부서 연결
        SELECT
            e.dept_id,
            e.dept_name,
            e.parent_dept_id,
            t.depth + 1,
            CONCAT(t.full_path, ' > ', e.dept_name),
            CONCAT(t.sort_key, '-', LPAD(e.sort_seq, 4, '0'))
        FROM erp_departments_staging e
        INNER JOIN org_tree t ON e.parent_dept_id = t.dept_id
        WHERE e.is_active = 'Y'
    )
    SELECT dept_id, dept_name, parent_dept_id, depth, full_path,
           ROW_NUMBER() OVER (ORDER BY sort_key) AS sort_order
    FROM org_tree
    ON DUPLICATE KEY UPDATE
        dept_name     = VALUES(dept_name),
        parent_dept_id = VALUES(parent_dept_id),
        depth          = VALUES(depth),
        full_path      = VALUES(full_path),
        sort_order     = VALUES(sort_order),
        updated_at     = NOW();

    SET v_inserted = ROW_COUNT();

    -- ============================================
    -- STEP 2: 인사 데이터 동기화
    -- AS-IS(MS-SQL 평문) → TO-BE(MariaDB 암호화)
    -- ============================================
    INSERT INTO users (
        user_id, user_name, dept_id, position_code,
        email_enc, phone_enc, status, sync_date
    )
    SELECT
        s.emp_no,
        s.emp_name,
        s.dept_id,
        s.position_cd,
        -- AES-256 암호화 적용 (평문 → 암호문 일괄 전환)
        HEX(AES_ENCRYPT(s.email, @encryption_key)),
        HEX(AES_ENCRYPT(s.phone, @encryption_key)),
        CASE
            WHEN s.resign_date IS NOT NULL THEN 'INACTIVE'
            WHEN s.leave_start IS NOT NULL
                 AND s.leave_start <= CURDATE()
                 AND (s.leave_end IS NULL OR s.leave_end >= CURDATE())
            THEN 'ON_LEAVE'
            ELSE 'ACTIVE'
        END,
        p_sync_date
    FROM erp_employees_staging s
    WHERE (p_full_sync = TRUE OR s.last_modified >= p_sync_date)
    ON DUPLICATE KEY UPDATE
        user_name     = VALUES(user_name),
        dept_id       = VALUES(dept_id),
        position_code = VALUES(position_code),
        email_enc     = VALUES(email_enc),
        phone_enc     = VALUES(phone_enc),
        status        = VALUES(status),
        sync_date     = VALUES(sync_date),
        updated_at    = NOW();

    SET v_updated = ROW_COUNT();

    -- ============================================
    -- STEP 3: 퇴직자 비활성화 (Soft Delete)
    -- ============================================
    UPDATE users u
    SET u.status = 'RESIGNED', u.updated_at = NOW()
    WHERE u.user_id NOT IN (
        SELECT emp_no FROM erp_employees_staging WHERE resign_date IS NULL
    )
    AND u.status != 'RESIGNED';

    SET v_deleted = ROW_COUNT();

    -- ============================================
    -- STEP 4: 마이그레이션 감사 로그 기록
    -- ============================================
    INSERT INTO migration_audit_log (
        sync_date, status, inserted_count, updated_count,
        deleted_count, is_full_sync, created_at
    ) VALUES (
        p_sync_date, 'SUCCESS', v_inserted, v_updated,
        v_deleted, p_full_sync, NOW()
    );

    COMMIT;
END$$

DELIMITER;

-- =====================================================
-- 마이그레이션 감사 로그 테이블 DDL
-- =====================================================
CREATE TABLE IF NOT EXISTS migration_audit_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sync_date DATE NOT NULL,
    status ENUM(
        'SUCCESS',
        'FAILED',
        'PARTIAL'
    ) NOT NULL,
    inserted_count INT DEFAULT 0,
    updated_count INT DEFAULT 0,
    deleted_count INT DEFAULT 0,
    is_full_sync BOOLEAN DEFAULT FALSE,
    error_message VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sync_date (sync_date),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '이기종 DB 마이그레이션 감사 로그';