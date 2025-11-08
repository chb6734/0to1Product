# FE Engineer: MSW 초기화 문제 해결

**작성자**: Sam FE Engineer  
**작성 일시**: 2024년  
**작업 내용**: MSW가 제대로 초기화되지 않아 404 에러 발생 문제 해결

---

## 문제 분석

### 발견된 문제
- 로그인 API 호출 시 404 에러 발생
- MSW 핸들러는 정의되어 있으나 동작하지 않음
- Service Worker가 제대로 등록되지 않았을 가능성

### 원인 분석
1. **MSW 초기화 타이밍 문제**
   - `MSWProvider`에서 비동기로 초기화하지만 완료를 기다리지 않음
   - 컴포넌트가 렌더링되기 전에 API 호출이 발생할 수 있음

2. **Service Worker 경로 문제**
   - Service Worker 파일 경로가 명시되지 않음
   - MSW가 Service Worker를 찾지 못할 수 있음

---

## 해결 방법

### 1. MSW 초기화 개선
- `init.ts`에서 Service Worker 경로 명시
- 초기화 완료 플래그 추가
- 초기화 로그 추가

### 2. MSWProvider 개선
- 초기화 완료 상태 관리
- MSW가 준비될 때까지 대기
- 에러 처리 개선

---

## 수정 사항

### `src/mocks/init.ts`
- Service Worker 경로 명시 (`/mockServiceWorker.js`)
- 초기화 완료 플래그 추가
- 초기화 로그 추가

### `src/components/MSWProvider.tsx`
- 초기화 완료 상태 관리 (`isReady`)
- MSW 준비될 때까지 대기
- 에러 처리 개선

---

## 테스트 방법

1. 개발 서버 재시작
2. 브라우저 콘솔에서 "✅ MSW Mock Service Worker 활성화됨" 메시지 확인
3. 로그인 버튼 클릭
4. Network 탭에서 `/api/auth/login/google` 요청이 MSW로 처리되는지 확인

---

**작업 완료**: FE Engineer가 MSW 초기화 문제 해결  
**다음 작업**: FE TEST가 테스트 실행 및 검증

