-- Complex Hierarchy & KPI Aggregation Query (Oracle/MySQL)
-- 금융감독원 조직도 트리 및 물류 KPI 집계 시 활용 가능한 계층형 쿼리 예시입니다.

-- 1. 재귀 쿼리(CTE)를 이용한 조직도 트리 구조 추출 (Oracle/PostgreSQL/MySQL 8.0+)
WITH RECURSIVE OrgHierarchy AS (
    -- Anchor member: 최상위 부서
    SELECT 
        dept_id, 
        dept_name, 
        parent_dept_id, 
        1 AS depth,
        CAST(dept_name AS CHAR(200)) AS path
    FROM DEPARTMENTS
    WHERE parent_dept_id IS NULL

    UNION ALL

    -- Recursive member: 하위 부서 연결
    SELECT 
        d.dept_id, 
        d.dept_name, 
        d.parent_dept_id, 
        oh.depth + 1,
        CONCAT(oh.path, ' > ', d.dept_name)
    FROM DEPARTMENTS d
    INNER JOIN OrgHierarchy oh ON d.parent_dept_id = oh.dept_id
)
SELECT * FROM OrgHierarchy ORDER BY path;

-- 2. 성능 최적화를 위한 조건부 집계 및 Index Hint 활용 예시 (Oracle)
SELECT /*+ INDEX(orders IDX_ORDERS_DATE) */
    region_id,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS completed_cnt,
    AVG(CASE WHEN status = 'COMPLETED' THEN lead_time END) AS avg_lead_time,
    SUM(total_amount) AS total_revenue
FROM ORDERS
WHERE order_date BETWEEN TO_DATE('2024-01-01', 'YYYY-MM-DD') AND TO_DATE('2024-12-31', 'YYYY-MM-DD')
GROUP BY region_id
HAVING SUM(total_amount) > 1000000;
