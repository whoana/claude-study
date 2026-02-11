# HANDOFF.md

## Goal

Supabase 기반 로그인 기능이 포함된 Next.js 데모 앱(`login-demo`)을 구축하고, 유닛 테스트와 브라우저 E2E 테스트까지 완료하는 것.

## Current Progress

### 프로젝트 생성 및 설정 완료
- `login-demo/` 디렉토리에 Next.js 16 + TypeScript + Tailwind CSS 프로젝트 생성 (npm)
- `.env.local`에 Supabase 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)
- `CLAUDE.md` 생성 완료

### Supabase 클라이언트 설정 완료
- `src/lib/supabase/client.ts` — 브라우저(Client Component)용
- `src/lib/supabase/server.ts` — Server Component / Route Handler용
- `src/lib/supabase/middleware.ts` — 세션 갱신 로직
- `src/middleware.ts` — Next.js 미들웨어 (인증 토큰 자동 갱신)

### 로그인 API 완료
- `src/app/api/auth/login/route.ts` — POST 엔드포인트
- 요청: `{ id: string, password: string }`
- Supabase `users` 테이블에서 id로 조회 후 password 비교
- 성공: `{ success: true, message: "로그인성공" }` (200)
- 실패: `{ success: false, message: "아이디 또는 비밀번호가 틀렸습니다." }` (401)

### 로그인 페이지 UI 완료
- `src/app/login/page.tsx` — Client Component
- 아이디/비밀번호 입력 + 로그인 버튼
- 성공 시 초록색, 실패 시 빨간색 메시지 표시
- Playwright 테스트용 `data-testid` 속성 추가 (`username-input`, `password-input`, `login-button`, `message`)

### 테스트 완료
- Jest 유닛 테스트: `__tests__/api/auth/login.test.ts` — 3개 케이스 모두 통과 (성공, 비밀번호 불일치, 미존재 사용자)
- 브라우저 E2E 테스트: Chrome에서 `whoana/whoana` 로그인 성공 확인

### Git 커밋 완료
- 커밋: `2f76fe5` — "Add login-demo Next.js project with Supabase auth" (master 브랜치)
- 아직 push하지 않음 (origin보다 1커밋 앞서 있음)

## What Worked

- Supabase `users` 테이블 구조: `id(text PK)`, `name`, `password`, `created_at`, `email`
- 테스트 계정: `whoana/whoana` (DB에 존재 확인됨)
- `@supabase/ssr` + `@supabase/supabase-js` 패키지 조합으로 서버/클라이언트 클라이언트 설정
- Jest + ts-jest로 API route 유닛 테스트 (Supabase 클라이언트 mock 처리)

## What Didn't Work

- **RLS 정책 미설정 문제**: `users` 테이블에 RLS가 활성화되어 있었으나 SELECT 정책이 없어서 publishable key(anon 역할)로 조회 시 데이터 반환이 차단됨
  - **해결**: `allow_select_for_login` 정책 추가 (`CREATE POLICY ... FOR SELECT USING (true)`)
  - **주의**: 현재 `USING(true)`로 모든 행 읽기 허용 상태 — 운영 환경에서는 보안 강화 필요

- Next.js 16에서 `middleware.ts` 사용 시 deprecated 경고 발생 (`"proxy" convention 사용 권장`) — 기능에는 영향 없음

## Next Steps

- [ ] 비밀번호 해싱 적용 (bcrypt 등) — 현재 평문 비교 중
- [ ] Playwright E2E 테스트 코드 작성 (`data-testid` 속성 이미 준비됨)
- [ ] `middleware.ts` → `proxy.ts` 마이그레이션 (Next.js 16 권장 방식)
- [ ] 로그인 성공 후 리다이렉트 로직 추가
- [ ] 로그아웃 기능 구현
- [ ] `service_role` 키 사용 또는 RLS 정책 강화 (password 컬럼 보안)
- [ ] Git push to origin
