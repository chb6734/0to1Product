# 개발 플로우 시작 가이드

@fe_engineer.md @fe_test.md @qa.md @pm.md @tpm.md @designer.md @prd/prd_v2.md @tech/tech_stack.md @design/design_system.md @frontend-rules.md

## Phase 4: 개발 및 테스트 플로우

### 시작 전 준비사항

1. ✅ PRD v2 승인 완료
2. ✅ 기술 스택 선정 완료
3. ✅ 디자인 시스템 구축 완료
4. ✅ 사용자 플로우 디자인 완료

---

## 단계별 플로우

### Step 1: PM이 유저 시나리오 작성

**PM의 작업**:
- 각 기능별 상세 유저 시나리오 작성
- Given-When-Then 형식 사용
- 엣지 케이스 포함

**출력**:
- `user_scenarios/feature_*.md` - 기능별 유저 시나리오

**대화 기록**:
- `conversations/phase4_dev/pm_user_scenarios_*.md`

---

### Step 2: FE TEST가 테스트 시나리오 작성

**FE TEST의 작업**:
- PM의 유저 시나리오 분석
- 테스트 시나리오 작성
- 테스트 케이스 정의

**출력**:
- `tests/scenarios/feature_*.md` - 테스트 시나리오

**대화 기록**:
- `conversations/phase4_dev/fe_test_scenarios_*.md`

---

### Step 3: FE TEST가 단위 테스트 작성 (RED)

**FE TEST의 작업**:
- 단위 테스트 작성 (실패하는 테스트)
- 테스트가 실패하는지 확인
- FE Engineer에게 테스트 요구사항 전달

**출력**:
- `src/**/__tests__/*.test.ts` - 단위 테스트 코드

**대화 기록**:
- `conversations/phase4_dev/fe_test_red_*.md`

---

### Step 4: FE Engineer가 아키텍처 설계

**FE Engineer의 작업**:
- 프로젝트 아키텍처 선정 (FSD, Atomic Design 등)
- 컴포넌트 구조 설계
- 상태 관리 전략 수립
- frontend-rules.md 준수 계획

**출력**:
- `docs/architecture.md` - 프론트엔드 아키텍처 문서
- `docs/component_structure.md` - 컴포넌트 구조 문서

**대화 기록**:
- `conversations/phase4_dev/fe_engineer_architecture_*.md`

---

### Step 5: FE Engineer가 기능 개발 (GREEN)

**FE Engineer의 작업**:
- FE TEST의 테스트 요구사항 확인
- TPM의 기술 스택 확인
- Designer의 디자인 명세 확인
- 기능 개발 (테스트 통과하도록)
- frontend-rules.md 준수

**출력**:
- `src/**/*.tsx` - 컴포넌트 코드
- `src/**/*.ts` - 유틸리티 코드

**대화 기록**:
- `conversations/phase4_dev/fe_engineer_development_*.md`

---

### Step 6: FE TEST가 테스트 실행 및 확인

**FE TEST의 작업**:
- 테스트 실행
- 테스트 통과 확인
- 실패한 테스트 분석
- FE Engineer에게 피드백

**출력**:
- 테스트 실행 결과
- 테스트 커버리지 리포트

**대화 기록**:
- `conversations/phase4_dev/fe_test_green_*.md`

---

### Step 7: FE Engineer가 리팩토링 (REFACTOR)

**FE Engineer의 작업**:
- 코드 품질 개선
- frontend-rules.md 준수
- 테스트는 계속 통과해야 함

**출력**:
- 리팩토링된 코드

**대화 기록**:
- `conversations/phase4_dev/fe_engineer_refactor_*.md`

---

### Step 8: FE TEST가 통합 테스트 작성

**FE TEST의 작업**:
- 사용자 플로우 기반 통합 테스트 작성
- 컴포넌트 간 상호작용 테스트
- API 통합 테스트

**출력**:
- `src/**/__tests__/*.integration.test.ts` - 통합 테스트 코드

**대화 기록**:
- `conversations/phase4_dev/fe_test_integration_*.md`

---

### Step 9: QA가 테스트 검수

**QA의 작업**:
- FE TEST의 테스트 시나리오 검수
- 테스트 커버리지 확인
- 실제 사용자 관점에서 테스트 수행
- 엣지 케이스 확인

**출력**:
- `qa/reports/test_review_*.md` - 테스트 검수 보고서

**대화 기록**:
- `conversations/phase4_dev/qa_test_review_*.md`

---

### Step 10: QA가 실제 사용자 관점에서 검증

**QA의 작업**:
- 실제 사용자처럼 제품 사용
- 사용성 테스트
- 탐색적 테스트
- 버그 발견 및 재현

**출력**:
- `qa/reports/bug_reports_*.md` - 버그 리포트

**대화 기록**:
- `conversations/phase4_dev/qa_user_testing_*.md`

---

### Step 11: FE Engineer가 버그 수정

**FE Engineer의 작업**:
- QA의 버그 리포트 확인
- 버그 재현
- 버그 수정
- 테스트 추가 (필요 시)

**출력**:
- 수정된 코드

**대화 기록**:
- `conversations/phase4_dev/fe_engineer_bugfix_*.md`

---

### Step 12: QA가 회귀 테스트 수행

**QA의 작업**:
- 기존 기능 테스트
- 새로운 버그 확인
- 품질 기준 확인

**출력**:
- `qa/reports/regression_test_*.md` - 회귀 테스트 보고서

**대화 기록**:
- `conversations/phase4_dev/qa_regression_*.md`

---

### Step 13: 품질 기준 달성 확인

**QA의 작업**:
- 기능적 요구사항 확인
- 비기능적 요구사항 확인
- 사용자 경험 확인
- 품질 기준 달성 보고서 작성

**출력**:
- `qa/reports/quality_gate_*.md` - 품질 기준 달성 보고서

**대화 기록**:
- `conversations/phase4_dev/qa_quality_gate_*.md`

---

## 협업 프로세스

### PM ↔ FE TEST
- PM이 유저 시나리오 작성
- FE TEST가 테스트 시나리오로 전환
- **대화 기록**: `conversations/phase4_dev/pm_fe_test_*.md`

### FE TEST ↔ FE Engineer
- FE TEST가 테스트 작성 (RED)
- FE Engineer가 기능 개발 (GREEN)
- FE Engineer가 리팩토링 (REFACTOR)
- **대화 기록**: `conversations/phase4_dev/fe_test_fe_engineer_*.md`

### FE Engineer ↔ TPM
- FE Engineer가 기술 스택 확인
- TPM이 기술적 제약사항 공유
- **대화 기록**: `conversations/phase4_dev/fe_engineer_tpm_*.md`

### FE Engineer ↔ Designer
- FE Engineer가 디자인 구현 가능성 확인
- Designer가 디자인 명세 보완
- **대화 기록**: `conversations/phase4_dev/fe_engineer_designer_*.md`

### QA ↔ FE TEST
- QA가 테스트 검수
- FE TEST가 테스트 보완
- **대화 기록**: `conversations/phase4_dev/qa_fe_test_*.md`

### QA ↔ FE Engineer
- QA가 버그 리포트
- FE Engineer가 버그 수정
- **대화 기록**: `conversations/phase4_dev/qa_fe_engineer_*.md`

---

## 출력 파일 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # 재사용 컴포넌트
├── domains/                # 도메인별 모듈 (FSD)
│   ├── letter/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── __tests__/
│   └── user/
├── lib/                    # 유틸리티 및 설정
├── hooks/                  # 공통 훅
└── stores/                 # Zustand 스토어

user_scenarios/             # PM의 유저 시나리오
├── feature_*.md

tests/
├── scenarios/              # FE TEST의 테스트 시나리오
│   └── feature_*.md
└── coverage/              # 테스트 커버리지 리포트

qa/
└── reports/               # QA 리포트
    ├── test_review_*.md
    ├── bug_reports_*.md
    └── quality_gate_*.md

docs/                      # 개발 문서
├── architecture.md
└── component_structure.md
```

---

## TDD 사이클

### RED (실패하는 테스트)
1. FE TEST가 테스트 작성
2. 테스트 실행 → 실패 확인
3. FE Engineer에게 테스트 요구사항 전달

### GREEN (테스트 통과)
1. FE Engineer가 최소한의 코드 작성
2. 테스트 실행 → 통과 확인
3. 기능이 동작하는지 확인

### REFACTOR (코드 개선)
1. FE Engineer가 코드 품질 개선
2. frontend-rules.md 준수
3. 테스트는 계속 통과해야 함

---

## 품질 기준

### 기능적 요구사항
- ✅ 모든 P0 기능이 정상 동작
- ✅ 유저 시나리오가 모두 통과
- ✅ 엣지 케이스 처리됨
- ✅ 에러 핸들링 적절함

### 비기능적 요구사항
- ✅ 성능: 페이지 로딩 2초 이하
- ✅ 접근성: WCAG 2.1 AA 준수
- ✅ 반응형: 모든 브레이크포인트에서 정상 동작
- ✅ 브라우저 호환성: Chrome, Safari, Firefox 지원

### 코드 품질
- ✅ frontend-rules.md 준수
- ✅ 테스트 커버리지 80% 이상
- ✅ 타입 안정성 (TypeScript)
- ✅ 린트 에러 없음

---

## 각 단계마다

- **대화 기록을 conversations/phase4_dev/ 디렉토리에 저장**
- **출력 파일을 적절한 디렉토리에 저장**
- **변경사항을 Git에 커밋**

---

## 시작 방법

1. **PM이 유저 시나리오 작성**
   ```
   @pm.md @prd/prd_v2.md
   
   PM이 각 기능별 유저 시나리오를 작성하세요.
   ```

2. **FE TEST가 테스트 시나리오 작성**
   ```
   @fe_test.md @user_scenarios/feature_*.md
   
   FE TEST가 유저 시나리오를 분석하여 테스트 시나리오를 작성하세요.
   ```

3. **FE TEST가 단위 테스트 작성 (RED)**
   ```
   @fe_test.md @tests/scenarios/feature_*.md
   
   FE TEST가 단위 테스트를 작성하세요. 반드시 RED(실패) 상태여야 합니다.
   ```

4. **FE Engineer가 개발 시작**
   ```
   @fe_engineer.md @fe_test.md @tpm.md @designer.md @frontend-rules.md
   
   FE Engineer가 아키텍처를 설계하고 기능을 개발하세요.
   ```

---

**시작**: PM이 유저 시나리오를 작성하는 것부터 시작하세요!

