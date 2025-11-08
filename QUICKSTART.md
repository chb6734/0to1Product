# 🚀 CEO-PM 협업 플로우 시작하기

이 프로젝트는 Cursor의 서브에이전트 기능을 사용하여 CEO와 PM이 자동으로 협업하는 시스템입니다.

## 📋 사전 준비

1. **Cursor 설치**: 최신 버전의 Cursor가 설치되어 있어야 합니다
2. **파일 확인**: 다음 파일들이 존재하는지 확인하세요
   - `idea.md` - 검증할 아이디어
   - `personas/ceo.md` - CEO 페르소나
   - `personas/pm.md` - PM 페르소나
   - `.cursorrules` - 에이전트 설정

## 🎯 사용 방법

### 방법 1: 전체 자동 플로우 (가장 간단)

Cursor 채팅에 다음을 복사해서 붙여넣으세요:

```
@ceo.md @pm.md @idea.md

CEO-PM 협업 플로우를 실행하세요:

1. CEO가 idea.md를 First Principles로 검증하고 conversations/ceo_review_1.md에 저장
2. PM이 CEO 검토 결과를 바탕으로 실행 계획을 수립하고 prd/execution_plan_v1.md에 저장
3. PM이 실행 계획을 바탕으로 상세 PRD를 작성하고 prd/prd_v1.md에 저장
4. CEO가 PRD를 검토하고 만족도 점수(총 40점 만점)를 평가하여 conversations/ceo_prd_review_1.md에 저장

CEO가 만족하지 않으면 (총점 35점 미만):
5. PM이 CEO 피드백을 반영하여 PRD를 개선하고 prd/prd_v2.md에 저장
6. CEO가 개선된 PRD를 다시 검토하여 conversations/ceo_prd_review_2.md에 저장

이 과정을 CEO가 승인할 때까지 (총점 35점 이상) 반복하세요.

각 단계마다:
- 대화를 conversations/ 디렉토리에 저장
- PRD를 prd/ 디렉토리에 버전별 저장
- 변경사항을 Git에 커밋하세요
```

### 방법 2: 단계별 실행

더 세밀한 제어가 필요하면 `WORKFLOW.md`를 참고하여 각 단계를 개별적으로 실행하세요.

## 📁 생성되는 파일

플로우 실행 후 다음 파일들이 생성됩니다:

- `conversations/ceo_review_1.md` - CEO의 아이디어 검토
- `prd/execution_plan_v1.md` - PM의 실행 계획
- `prd/prd_v1.md` - PM의 PRD 초안
- `conversations/ceo_prd_review_1.md` - CEO의 PRD 검토
- `prd/prd_v2.md` - 개선된 PRD (필요 시)
- ... (반복)

## 🔄 반복 프로세스

```
CEO 검증 → PM 실행계획 → PM PRD 작성 → CEO PRD 검토
                                              ↓
                                    만족? (35점 이상?)
                                              ↓
                                    아니오 → PM 개선 → CEO 재검토
                                              ↓
                                    예 → 완료! ✅
```

## 💡 팁

1. **컨텍스트 유지**: 각 단계에서 이전 파일들을 `@`로 참조하세요
2. **버전 관리**: PRD는 항상 버전 번호를 포함하세요
3. **Git 커밋**: 각 산출물 생성 후 Cursor에게 커밋을 요청하세요

## 📚 더 자세한 내용

- `WORKFLOW.md` - 상세한 워크플로우 가이드
- `.cursorrules` - 에이전트 설정 및 규칙
- `personas/` - CEO와 PM의 페르소나 정의

---

**시작하려면 위의 프롬프트를 Cursor 채팅에 붙여넣으세요!** 🚀

