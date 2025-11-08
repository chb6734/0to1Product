# Designer 디자인 설계 플로우 시작

@designer.md @pm.md @tpm.md @prd/prd_v2.md

Designer가 PM과 TPM과 협업하여 다음을 수행하세요:

## 1. PRD 및 기술 아키텍처 분석

- PRD의 사용자 경험 요구사항 분석
- 기술 아키텍처의 제약사항 이해
- 사용자 플로우 최적화 기회 발견
- **대화 기록: conversations/phase3_designer/designer_analysis_1.md**

## 2. 디자인 시스템 구축

다음 요소들을 포함한 디자인 시스템을 구축하세요:

### 2.1 브랜드 아이덴티티
- 브랜드 컬러 (Primary, Secondary, Accent)
- 브랜드 톤 & 매너
- 로고 및 아이콘 스타일

### 2.2 컬러 시스템
- Primary Colors (메인 컬러)
- Secondary Colors (보조 컬러)
- Neutral Colors (중립 컬러)
- Semantic Colors (성공, 에러, 경고, 정보)
- 다크 모드 컬러 팔레트

### 2.3 타이포그래피
- 폰트 패밀리 선정 및 근거
- 폰트 스케일 시스템 (Heading, Body, Caption 등)
- 폰트 웨이트 및 행간
- 반응형 타이포그래피

### 2.4 컴포넌트 라이브러리
- 버튼 (Primary, Secondary, Ghost 등)
- 입력 필드 (Text, Textarea, Select 등)
- 카드 컴포넌트
- 네비게이션 컴포넌트
- 모달 및 다이얼로그
- 로딩 인디케이터
- 에러 메시지

### 2.5 스페이싱 시스템
- 그리드 시스템
- 간격 시스템 (4px 또는 8px 기반)
- 레이아웃 패턴

### 2.6 아이콘 시스템
- 아이콘 스타일 (Outline, Filled, etc.)
- 아이콘 크기 시스템
- 커스텀 아이콘 가이드

**출력**: `design/design_system.md`  
**대화 기록**: `conversations/phase3_designer/designer_design_system_discussion.md`

## 3. 사용자 플로우 디자인

PRD의 각 사용자 플로우를 최적화하여 디자인하세요:

### 3.1 플로우 다이어그램
- 사용자 여정 시각화
- 각 단계의 목적과 콘텐츠 정의
- 분기점 및 에러 처리

### 3.2 화면별 디자인 명세
- 레이아웃 구조
- 콘텐츠 계층 구조
- 인터랙션 요소 배치
- 상태별 디자인 (Default, Hover, Active, Disabled, Loading, Error)

**출력**: 
- `design/user_flows_design.md` - 사용자 플로우 디자인
- `design/screen_specs.md` - 화면별 디자인 명세

**대화 기록**: 
- `conversations/phase3_designer/pm_designer_flows_discussion.md` - PM과의 플로우 논의
- `conversations/phase3_designer/tpm_designer_flows_discussion.md` - TPM과의 기술적 구현 논의

## 4. 인터랙션 디자인

### 4.1 애니메이션 및 전환
- 페이지 전환 애니메이션
- 컴포넌트 등장 애니메이션
- 마이크로 인터랙션
- 로딩 애니메이션

### 4.2 피드백 메커니즘
- 사용자 액션에 대한 시각적 피드백
- 성공/실패 상태 표시
- 진행 상태 표시

**출력**: `design/interaction_guide.md`  
**대화 기록**: `conversations/phase3_designer/designer_interaction_discussion.md`

## 5. 반응형 디자인 전략

### 5.1 브레이크포인트 정의
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

### 5.2 모바일 우선 설계
- 터치 인터랙션 최적화
- 터치 타겟 크기 (최소 44px)
- 스와이프 제스처 활용

### 5.3 레이아웃 적응
- 각 브레이크포인트별 레이아웃
- 콘텐츠 우선순위 조정
- 네비게이션 패턴 변경

**출력**: `design/responsive_strategy.md`  
**대화 기록**: `conversations/phase3_designer/designer_responsive_discussion.md`

## 6. 접근성 가이드라인

- WCAG 2.1 AA 기준 준수
- 색상 대비 비율
- 키보드 네비게이션
- 스크린 리더 지원
- 포커스 인디케이터

**출력**: `design/accessibility_guide.md`  
**대화 기록**: `conversations/phase3_designer/designer_accessibility_discussion.md`

## 7. 디자인 트렌드 적용

현재 트렌드(2024-2025)를 브랜드 아이덴티티와 조화롭게 적용:
- Glassmorphism
- Neumorphism
- Bold Typography
- Micro-interactions
- Dark Mode
- 3D Elements

**대화 기록**: `conversations/phase3_designer/designer_trends_discussion.md`

## 협업 프로세스

### PM과의 협업
- 사용자 경험 관점에서 기능 우선순위 제안
- 사용자 플로우 최적화 제안
- A/B 테스트 설계
- **대화 기록**: `conversations/phase3_designer/pm_designer_discussion_*.md`

### TPM과의 협업
- 기술적 제약 내에서 최고의 UX 설계
- 컴포넌트 재사용성 고려
- 성능과 UX의 균형
- **대화 기록**: `conversations/phase3_designer/tpm_designer_discussion_*.md`

### 피드백 및 개선
- PM과 TPM의 피드백 수집
- 사용자 테스트 결과 반영
- 반복적 개선
- **대화 기록**: `conversations/phase3_designer/designer_feedback_*.md`

## 출력 파일 요약

각 단계마다 다음 파일에 저장하세요:

- `design/design_system.md` - 디자인 시스템 가이드
- `design/user_flows_design.md` - 사용자 플로우 디자인
- `design/screen_specs.md` - 화면별 디자인 명세
- `design/interaction_guide.md` - 인터랙션 가이드
- `design/responsive_strategy.md` - 반응형 디자인 전략
- `design/accessibility_guide.md` - 접근성 가이드라인

## 대화 저장 규칙

**모든 대화는 `conversations/phase3_designer/` 디렉토리에 저장하세요:**

- `designer_analysis_1.md` - Designer의 PRD/기술 아키텍처 분석
- `pm_designer_discussion_*.md` - PM과 Designer의 논의
- `tpm_designer_discussion_*.md` - TPM과 Designer의 논의
- `designer_design_system_discussion.md` - 디자인 시스템 논의
- `designer_feedback_*.md` - 피드백 및 개선 논의

각 파일 생성 후:
- **대화 기록을 conversations/phase3_designer/ 디렉토리에 저장**
- PM과 TPM의 피드백을 받아 개선
- 변경사항을 Git에 커밋하세요
