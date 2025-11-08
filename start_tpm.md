# TPM 기술 설계 플로우 시작

@tpm.md @pm.md @prd/prd_v2.md

TPM이 PRD v2를 분석하여 다음을 수행하세요:

1. **기술 스택 선정**
   - PRD의 기술 요구사항 분석
   - 각 기술 스택 옵션 비교 (장단점, 트레이드오프)
   - 최종 선정 및 근거 제시
   - tech/tech_stack.md에 저장

2. **기능별 기술 명세**
   - PRD의 각 기능을 기술적 구현 관점에서 상세화
   - API 설계, 데이터 모델, 상태 관리 등
   - tech/feature_specs.md에 저장

3. **사용자 플로우의 기술적 구현**
   - 각 사용자 플로우의 기술적 구현 방안 제시
   - 상태 관리, 에러 핸들링, 로딩 상태 등
   - tech/user_flows_tech.md에 저장

4. **구현 표준 및 개발 접근 방식**
   - 코딩 컨벤션, 테스트 전략, 코드 리뷰 프로세스
   - 배포 프로세스, 모니터링 전략
   - tech/implementation_standards.md에 저장

각 단계마다:
- 기술 문서를 tech/ 디렉토리에 저장
- **대화 기록을 conversations/phase2_tpm/ 디렉토리에 저장**
- PM과 CEO의 피드백을 받아 개선
- 변경사항을 Git에 커밋하세요

## 대화 저장 형식

각 대화는 다음 형식으로 저장하세요:
- `conversations/phase2_tpm/tpm_analysis_1.md` - TPM의 PRD 분석
- `conversations/phase2_tpm/pm_tpm_discussion_1.md` - PM과 TPM의 논의
- `conversations/phase2_tpm/tpm_tech_stack_review.md` - 기술 스택 검토
- `conversations/phase2_tpm/ceo_tpm_feedback.md` - CEO의 기술 설계 피드백

