# PM-QA 협업: E2E 테스트 설정

**참여자**: Athena PM, Quinn QA  
**일시**: 2024년  
**목적**: feature_auth.md 기반 E2E 테스트 설정 및 검증

---

## 🧭 PM: E2E 테스트 요구사항 정의

**Athena PM**: 안녕하세요, Quinn. feature_auth.md의 유저 시나리오를 기반으로 E2E 테스트를 설정하고 싶습니다.

현재 상황:
- 사용자 인증 기능이 구현되어 있음
- Supabase OAuth 로그인 (Google/Kakao/Apple) 구현 완료
- 온보딩 플로우 구현 완료
- 실제 화면에서 동작이 정상인지 검증 필요

**요구사항**:
1. TC-AUTH-001: 신규 사용자 가입 (Google 소셜 로그인)
2. TC-AUTH-002: 신규 사용자 가입 (Kakao 소셜 로그인)
3. TC-AUTH-003: 신규 사용자 가입 (Apple 소셜 로그인)
4. TC-AUTH-004: 기존 사용자 로그인
5. TC-AUTH-E003: 닉네임 미입력 검증

**우선순위**: P0 기능부터 테스트

---

## 🔍 QA: E2E 테스트 전략 수립

**Quinn QA**: 네, 이해했습니다. 실제 사용자 관점에서 테스트를 수행하겠습니다.

**테스트 전략**:
1. **Playwright 설정**: Next.js 환경에 맞게 설정
2. **테스트 구조**: Given-When-Then 패턴으로 작성
3. **실제 OAuth 테스트**: 실제 Supabase OAuth 플로우 테스트 (또는 Mock)
4. **엣지 케이스**: 닉네임 검증, 에러 핸들링 등

**고려사항**:
- 실제 OAuth는 외부 서비스이므로 테스트 환경에서 Mock 처리 필요
- 또는 테스트용 Supabase 프로젝트 사용
- 페이지 요소 선택: data-testid 속성 추가 필요할 수 있음

**질문**: 
1. 실제 Supabase OAuth를 테스트할지, Mock을 사용할지?
2. 테스트용 Supabase 프로젝트가 준비되어 있나요?

---

## 🧭 PM: 테스트 환경 결정

**Athena PM**: 좋은 질문입니다. 

**결정**:
1. **개발 환경**: 실제 Supabase OAuth 사용 (테스트용 계정)
2. **CI/CD 환경**: Mock 또는 테스트용 Supabase 프로젝트
3. **페이지 요소**: data-testid 속성 추가 필요 (FE Engineer와 협의)

**우선순위**:
- 먼저 개발 환경에서 실제 OAuth 테스트
- 이후 Mock 방식도 고려

**다음 단계**:
1. Playwright 설정 확인 및 개선
2. E2E 테스트 파일 작성
3. 테스트 실행 및 버그 발견 시 FE Engineer와 협업

---

## 🔍 QA: Playwright 설정 및 테스트 작성 계획

**Quinn QA**: 알겠습니다. 다음 순서로 진행하겠습니다:

1. **Playwright 설정 확인**
   - playwright.config.ts 확인
   - Next.js 개발 서버 자동 시작 설정
   - 테스트 환경 변수 설정

2. **E2E 테스트 작성**
   - tests/e2e/auth.spec.ts 생성
   - TC-AUTH-001부터 순차적으로 작성
   - 실제 화면 요소 확인 및 테스트

3. **테스트 실행 및 검증**
   - 테스트 실행
   - 버그 발견 시 FE Engineer에게 리포트
   - 수정 후 재테스트

**예상 이슈**:
- OAuth 리다이렉트 처리
- 비동기 로딩 상태 대기
- 페이지 요소 선택자

---

## 📋 다음 액션 아이템

1. ✅ Playwright 설정 확인 및 개선
2. ✅ E2E 테스트 파일 작성 (auth.spec.ts)
3. ⏳ 테스트 실행 및 버그 리포트
4. ⏳ FE Engineer와 협업하여 버그 수정
5. ⏳ 재테스트 및 품질 확인

---

## 📝 참고 사항

- 테스트는 실제 사용자 관점에서 작성
- 모든 테스트 케이스는 feature_auth.md 기반
- 버그 발견 시 구체적인 재현 방법 포함
- 테스트 결과는 qa/reports/에 저장
