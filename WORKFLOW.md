# CEO-PM 협업 플로우 가이드 (Cursor 서브에이전트 사용)

이 문서는 Cursor의 서브에이전트 기능을 사용하여 CEO와 PM이 자동으로 협업하는 방법을 안내합니다.

## 🎯 사용 방법

### 방법 1: 단계별 수동 트리거 (권장)

각 단계마다 Cursor에 프롬프트를 입력하여 에이전트를 호출합니다.

#### Step 1: CEO가 아이디어 검증

Cursor에 다음 프롬프트 입력:

```
@ceo.md @idea.md

당신은 Elon CEO입니다. idea.md를 First Principles로 검증하고 다음을 포함한 검토 보고서를 작성하세요:

1. 비전 검증: 이 아이디어가 5년 뒤에도 유효한 구조인가?
2. 기술적 타당성: 핵심 기술적 도전과제는 무엇인가?
3. 시장 확장성: 이 프로덕트가 산업의 방향을 바꿀 수 있는가?
4. 리스크 분석: 남들이 피한 영역에서의 기회는 무엇인가?
5. 개선 제안: 10배 더 빠르고 저렴하게 만들 수 있는 방법은?

검토 결과를 conversations/ceo_review_1.md에 저장하세요.
```

#### Step 2: PM이 실행 계획 수립

```
@pm.md @conversations/ceo_review_1.md @idea.md

당신은 Athena PM입니다. CEO의 검토 결과를 바탕으로 실행 계획을 수립하세요:

1. 문제 정의: CEO 비전을 정량화 가능한 목표로 번역
2. 핵심 가설: 검증해야 할 가설 3-5개
3. MVP 범위: 최소 기능 세트 정의
4. KPI 설정: 3개월 내 검증 가능한 핵심 지표
5. 리스크 분석: 기술적/시장적 리스크와 완화 방안
6. 실행 단계: 단계별 마일스톤

실행 계획을 prd/execution_plan_v1.md에 저장하세요.
```

#### Step 3: PM이 PRD 작성

```
@pm.md @prd/execution_plan_v1.md @conversations/ceo_review_1.md

당신은 Athena PM입니다. 실행 계획을 바탕으로 상세한 PRD를 작성하세요.

PRD에는 다음을 포함해야 합니다:
1. 제품 개요
2. 기능 명세 (P0/P1/P2 우선순위)
3. 기술 요구사항
4. 사용자 경험
5. 성공 지표 (KPI)
6. 리스크 및 대응
7. 일정 및 마일스톤

PRD를 prd/prd_v1.md에 저장하세요.
```

#### Step 4: CEO가 PRD 검토

```
@ceo.md @prd/prd_v1.md @conversations/ceo_review_1.md

당신은 Elon CEO입니다. PRD를 검토하고 다음 관점에서 평가하세요:

1. 이 기능이 산업의 규칙을 바꿀 수 있는가?
2. 스케일할 때 병목이 생길 부분은 무엇인가?
3. 핵심 레버리지 포인트는 무엇인가?
4. 사용자 변화를 설계할 수 있는가?
5. 이 구조로 10배 성장이 가능한가?

만족도 평가 (각 10점 만점):
- 비전 정렬도: ?
- 기술적 혁신도: ?
- 실행 가능성: ?
- 시장 임팩트: ?

총점이 35점 이상이면 승인, 그렇지 않으면 구체적인 개선 요청을 하세요.

검토 결과를 conversations/ceo_prd_review_1.md에 저장하세요.
```

#### Step 5: 반복 개선 (필요 시)

CEO가 승인하지 않으면:

```
@pm.md @conversations/ceo_prd_review_1.md @prd/prd_v1.md

당신은 Athena PM입니다. CEO의 피드백을 반영하여 PRD를 개선하세요.

1. CEO 피드백을 이해하고 요구사항 정리
2. 피드백을 반영한 수정 계획 제시
3. 실현 가능성과 리소스 관점에서 우선순위 제안

개선된 PRD를 prd/prd_v2.md에 저장하세요.
```

그리고 다시 Step 4로 돌아가서 CEO가 검토합니다.

---

### 방법 2: 자동화 워크플로우 프롬프트

한 번에 전체 플로우를 실행하려면:

```
@ceo.md @pm.md @idea.md

CEO-PM 협업 플로우를 실행하세요:

1. CEO가 idea.md를 검증 → conversations/ceo_review_1.md
2. PM이 실행 계획 수립 → prd/execution_plan_v1.md
3. PM이 PRD 작성 → prd/prd_v1.md
4. CEO가 PRD 검토 → conversations/ceo_prd_review_1.md

CEO가 만족하지 않으면 (총점 35점 미만):
5. PM이 PRD 개선 → prd/prd_v2.md
6. CEO가 다시 검토 → conversations/ceo_prd_review_2.md

이 과정을 CEO가 승인할 때까지 (총점 35점 이상) 반복하세요.

각 단계마다:
- 대화를 conversations/ 디렉토리에 저장
- PRD를 prd/ 디렉토리에 버전별 저장
- 변경사항을 Git에 커밋 (커밋 메시지: "🤖 [단계명] - [타임스탬프]")
```

---

## 📁 파일 구조

```
FanStage/
├── .cursorrules              # 에이전트 설정
├── WORKFLOW.md              # 이 파일
├── idea.md                  # 아이디어 문서
├── personas/
│   ├── ceo.md              # CEO 페르소나
│   └── pm.md               # PM 페르소나
├── conversations/          # 대화 기록
│   ├── ceo_review_1.md
│   ├── ceo_prd_review_1.md
│   └── ...
└── prd/                     # PRD 및 실행 계획
    ├── execution_plan_v1.md
    ├── prd_v1.md
    ├── prd_v2.md
    └── ...
```

---

## 🔄 반복 플로우

```
CEO 검증 → PM 실행계획 → PM PRD 작성 → CEO PRD 검토
                                              ↓
                                    만족? (35점 이상?)
                                              ↓
                                    아니오 → PM 개선 → CEO 재검토
                                              ↓
                                    예 → 완료!
```

---

## 💡 팁

1. **컨텍스트 유지**: 각 단계에서 이전 대화와 산출물을 `@`로 참조하세요
2. **버전 관리**: PRD는 항상 버전 번호를 포함하세요 (v1, v2, ...)
3. **Git 커밋**: 각 산출물 생성 후 수동으로 커밋하거나, Cursor에게 커밋을 요청하세요
4. **페르소나 유지**: 각 에이전트가 자신의 페르소나를 유지하도록 명시적으로 언급하세요

---

## 🚀 빠른 시작

가장 간단한 방법은 위의 "방법 2: 자동화 워크플로우 프롬프트"를 Cursor에 복사해서 붙여넣는 것입니다.

Cursor가 자동으로:

1. CEO와 PM을 순차적으로 호출
2. 각 단계의 결과를 적절한 파일에 저장
3. 만족할 때까지 반복

합니다.
