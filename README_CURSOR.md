# CEO-PM 협업 플로우: Cursor 서브에이전트 버전

이 프로젝트는 **Python 스크립트 없이** Cursor의 서브에이전트 기능만을 사용하여 CEO와 PM이 협업하는 시스템입니다.

## 🎯 핵심 차이점

### Python 버전 (기존)
- `main.py` 실행 → 자동으로 전체 플로우 실행
- LLM API 직접 호출
- 완전 자동화

### Cursor 서브에이전트 버전 (현재)
- Cursor 채팅에서 프롬프트 입력
- Cursor가 CEO/PM 역할 수행
- 단계별 제어 가능
- **Python 스크립트 불필요**

## 📁 파일 구조

```
FanStage/
├── .cursorrules          # 에이전트 설정 (중요!)
├── QUICKSTART.md        # 빠른 시작 가이드
├── WORKFLOW.md          # 상세 워크플로우
├── idea.md              # 아이디어 문서
├── personas/
│   ├── ceo.md          # CEO 페르소나
│   └── pm.md           # PM 페르소나
├── conversations/      # 대화 기록 (자동 생성)
└── prd/                 # PRD 및 실행 계획 (자동 생성)
```

## 🚀 빠른 시작

1. **Cursor 열기**: 프로젝트 폴더를 Cursor에서 엽니다

2. **프롬프트 입력**: Cursor 채팅에 다음을 붙여넣으세요:

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

3. **결과 확인**: `conversations/`와 `prd/` 디렉토리에서 생성된 파일들을 확인하세요

## 🔄 반복 프로세스

Cursor가 자동으로:
1. CEO 역할로 아이디어 검증
2. PM 역할로 실행 계획 수립
3. PM 역할로 PRD 작성
4. CEO 역할로 PRD 검토
5. 만족하지 않으면 PM이 개선 → 다시 검토
6. 만족할 때까지 반복

## 💡 장점

✅ **Python 불필요**: 스크립트 실행 없이 Cursor만으로 작동  
✅ **유연한 제어**: 각 단계를 개별적으로 실행 가능  
✅ **컨텍스트 유지**: Cursor가 이전 대화를 자동으로 기억  
✅ **파일 자동 생성**: 대화와 PRD가 자동으로 저장됨  

## 📚 더 알아보기

- `QUICKSTART.md` - 빠른 시작 가이드
- `WORKFLOW.md` - 상세한 워크플로우 설명
- `.cursorrules` - 에이전트 설정 및 규칙

---

**지금 바로 Cursor 채팅에 프롬프트를 붙여넣어 시작하세요!** 🚀

