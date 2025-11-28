@ceo.md @pm.md @idea_madic.md

"시작"이라고 입력하면 CEO-PM 협업 플로우를 실행하세요:

1. CEO가 idea_madic.md를 First Principles로 검증하고 planning_madic/conversations/ceo_review_1.md에 저장
2. PM이 CEO 검토 결과를 바탕으로 실행 계획을 수립하고 planning_madic/prd/execution_plan_v1.md에 저장
3. PM이 실행 계획을 바탕으로 상세 PRD를 작성하고 planning_madic/prd/prd_v1.md에 저장
4. CEO가 PRD를 검토하고 만족도 점수(총 40점 만점)를 평가하여 planning_madic/conversations/ceo_prd_review_1.md에 저장

CEO가 만족하지 않으면 (총점 35점 미만): 5. PM이 CEO 피드백을 반영하여 PRD를 개선하고 planning_madic/prd/prd_v2.md에 저장 6. CEO가 개선된 PRD를 다시 검토하여 planning_madic/conversations/ceo_prd_review_2.md에 저장

이 과정을 CEO가 승인할 때까지 (총점 35점 이상) 반복하세요.

각 단계마다:

- 대화를 planning_madic/conversations/ 디렉토리에 저장
- PRD를 planning_madic/prd/ 디렉토리에 버전별 저장
- 변경사항을 Git에 커밋하세요
