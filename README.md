# CEO-PM 협업 플로우: Cursor 서브에이전트 버전

CEO와 PM 페르소나가 Cursor의 서브에이전트 기능을 사용하여 아이디어를 검증하고 PRD를 생성하는 시스템입니다.

## 🎯 특징

- **Python 스크립트 불필요**: Cursor만으로 작동
- **CEO 에이전트**: Elon-style 비전가로 아이디어 검증 및 전략 제시
- **PM 에이전트**: Athena PM으로 실행 계획 수립 및 PRD 작성
- **자동 파일 생성**: 대화와 산출물이 자동으로 저장
- **반복 개선**: CEO와 PM이 만족할 때까지 자동으로 반복

## 📁 프로젝트 구조

```
FanStage/
├── .cursorrules          # 에이전트 설정
├── QUICKSTART.md        # 빠른 시작 가이드
├── WORKFLOW.md          # 상세 워크플로우
├── README_CURSOR.md     # Cursor 버전 설명
├── CURSOR_GUIDE.md      # 간단한 사용 가이드
├── idea.md              # 아이디어 문서
├── personas/
│   ├── ceo.md          # CEO 페르소나
│   └── pm.md           # PM 페르소나
├── conversations/      # 대화 기록 저장 (자동 생성)
└── prd/                 # PRD 및 실행 계획 저장 (자동 생성)
```

## 🚀 빠른 시작

### 1단계: Cursor에서 프로젝트 열기

프로젝트 폴더를 Cursor에서 엽니다.

### 2단계: 프롬프트 입력

Cursor 채팅에 다음 프롬프트를 붙여넣으세요:

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

### 3단계: 결과 확인

- `conversations/` 디렉토리에서 대화 기록 확인
- `prd/` 디렉토리에서 PRD 및 실행 계획 확인

## 🔄 플로우 설명

1. **아이디어 검증**: CEO가 `idea.md`를 First Principles로 검토
2. **실행 계획 수립**: PM이 CEO 피드백을 바탕으로 실행 계획 작성
3. **PRD 생성**: PM이 실행 계획을 바탕으로 상세 PRD 작성
4. **PRD 검토**: CEO가 PRD를 검토하고 만족도 평가 (40점 만점)
5. **반복 개선**: 만족하지 않으면 (35점 미만) PM이 개선 → CEO 재검토
6. **완료**: CEO가 승인할 때까지 (35점 이상) 반복

## 📝 출력 파일

### 대화 기록
- 위치: `conversations/`
- 예시: `ceo_review_1.md`, `ceo_prd_review_1.md`

### PRD 및 실행 계획
- 위치: `prd/`
- 예시: `execution_plan_v1.md`, `prd_v1.md`, `prd_v2.md`

## 💡 장점

✅ **Python 불필요**: 스크립트 실행 없이 Cursor만으로 작동  
✅ **LLM API 불필요**: Cursor가 내장 LLM 사용  
✅ **유연한 제어**: 각 단계를 개별적으로 실행 가능  
✅ **컨텍스트 유지**: Cursor가 이전 대화를 자동으로 기억  
✅ **파일 자동 생성**: 대화와 PRD가 자동으로 저장됨  

## 📚 더 알아보기

- `QUICKSTART.md` - 빠른 시작 가이드
- `WORKFLOW.md` - 상세한 워크플로우 설명
- `README_CURSOR.md` - Cursor 버전 상세 설명
- `CURSOR_GUIDE.md` - 간단한 사용 가이드
- `.cursorrules` - 에이전트 설정 및 규칙

## 🔧 커스터마이징

### 페르소나 수정
`personas/ceo.md`와 `personas/pm.md` 파일을 수정하여 에이전트의 성격과 사고방식을 변경할 수 있습니다.

### 워크플로우 수정
`WORKFLOW.md`를 참고하여 각 단계를 개별적으로 실행하거나 커스터마이징할 수 있습니다.

## 📌 주의사항

1. **Cursor 필요**: 이 프로젝트는 Cursor 에디터에서만 작동합니다
2. **파일 덮어쓰기**: 같은 이름의 파일이 있으면 덮어쓰기됩니다. Git 히스토리를 확인하세요
3. **반복 횟수**: 기본적으로 CEO가 만족할 때까지 반복하지만, 필요시 수동으로 중단 가능

---

**지금 바로 Cursor 채팅에 프롬프트를 붙여넣어 시작하세요!** 🚀
