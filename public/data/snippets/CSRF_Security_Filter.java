/**
 * Custom CSRF Protection Filter with Double Submit Cookie Pattern
 * ================================================================
 * Spring Security 기본 CSRF 토큰 방식을 확장하여,
 * 금융권 보안 요구사항에 맞는 Double Submit Cookie + SameSite 전략을 구현합니다.
 *
 * - Stateless 환경(JWT)에서도 동작하는 CSRF 방어
 * - AJAX 요청 시 X-CSRF-TOKEN 헤더 자동 검증
 * - 토큰 회전(Rotation) 정책으로 세션 고정 공격 방어
 *
 * @author Kwak Gyeong-hoon (Hooney)
 * @project FSS Internal Security Enhancement
 */
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

public class CsrfSecurityFilter implements Filter {

    private static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";
    private static final String CSRF_HEADER_NAME = "X-XSRF-TOKEN";
    private static final int TOKEN_BYTE_LENGTH = 32;
    private static final int TOKEN_TTL_SECONDS = 3600; // 1시간

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String method = httpRequest.getMethod().toUpperCase();

        // GET, HEAD, OPTIONS, TRACE는 안전한 메서드 → CSRF 검증 스킵
        if (isSafeMethod(method)) {
            // 토큰이 없으면 신규 발급
            ensureCsrfToken(httpRequest, httpResponse);
            chain.doFilter(request, response);
            return;
        }

        // POST, PUT, DELETE, PATCH → CSRF 토큰 검증 필수
        String cookieToken = extractTokenFromCookie(httpRequest);
        String headerToken = httpRequest.getHeader(CSRF_HEADER_NAME);

        // Form 기반 요청 시 hidden field에서도 추출
        if (headerToken == null) {
            headerToken = httpRequest.getParameter("_csrf");
        }

        if (cookieToken == null || headerToken == null || !cookieToken.equals(headerToken)) {
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpResponse.setContentType("application/json;charset=UTF-8");
            httpResponse.getWriter().write(
                "{\"error\":\"CSRF_VALIDATION_FAILED\",\"message\":\"유효하지 않은 CSRF 토큰입니다.\"}"
            );
            return;
        }

        // 검증 성공 후 토큰 회전(Rotation) → 재사용 공격 차단
        rotateToken(httpResponse);
        chain.doFilter(request, response);
    }

    /**
     * CSRF 토큰 발급 및 쿠키 설정
     * - HttpOnly=false: JavaScript에서 읽어 헤더에 포함해야 하므로
     * - SameSite=Strict: 외부 사이트에서의 쿠키 전송 차단
     * - Secure=true: HTTPS에서만 전송
     */
    private void ensureCsrfToken(HttpServletRequest request, HttpServletResponse response) {
        String existingToken = extractTokenFromCookie(request);
        if (existingToken == null) {
            String newToken = generateToken();
            setCsrfCookie(response, newToken);
        }
    }

    private void rotateToken(HttpServletResponse response) {
        String newToken = generateToken();
        setCsrfCookie(response, newToken);
    }

    private void setCsrfCookie(HttpServletResponse response, String token) {
        // SameSite 속성은 Set-Cookie 헤더에 직접 추가 (Servlet API 미지원)
        String cookieValue = String.format(
            "%s=%s; Max-Age=%d; Path=/; SameSite=Strict; Secure; HttpOnly=false",
            CSRF_COOKIE_NAME, token, TOKEN_TTL_SECONDS
        );
        response.addHeader("Set-Cookie", cookieValue);
    }

    private String generateToken() {
        byte[] tokenBytes = new byte[TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (CSRF_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private boolean isSafeMethod(String method) {
        return "GET".equals(method) || "HEAD".equals(method)
            || "OPTIONS".equals(method) || "TRACE".equals(method);
    }

    @Override public void init(FilterConfig config) {}
    @Override public void destroy() {}
}
