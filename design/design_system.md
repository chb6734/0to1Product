# 🎨 FAN:STAGE 디자인 시스템 가이드

**작성자**: Maya Designer  
**작성 일시**: 2024년  
**기반**: PRD 분석 (conversations/phase3_designer/designer_analysis_1.md)

---

## 디자인 철학

### 핵심 원칙

1. **사용자 중심**: 모든 디자인 결정은 사용자의 목표 달성을 돕는다
2. **감성적 연결**: 음악을 "선물"로 전달하는 따뜻한 경험
3. **플랫폼 중립성**: 모든 플랫폼을 동등하게 존중
4. **단순성**: 불필요한 요소 제거, 명확한 정보 계층
5. **일관성**: 확장 가능하고 예측 가능한 디자인 언어

---

## 1. 브랜드 아이덴티티

### 브랜드 비전

**"음악으로 모인 사람들이, 음악으로 살아갈 수 있도록"**

### 브랜드 톤 & 매너

**톤**:
- 따뜻하고 친근함
- 진정성 있고 솔직함
- 감성적이지만 과하지 않음
- 전문적이지만 거리감 없음

**매너**:
- 사용자를 친구처럼 대함
- 음악에 대한 열정 공유
- 감사와 존중 표현
- 긍정적이고 격려하는 톤

### 브랜드 키워드

- **Connection** (연결)
- **Emotion** (감성)
- **Freedom** (자유)
- **Warmth** (따뜻함)
- **Music** (음악)

---

## 2. 컬러 시스템

### 컬러 철학

음악의 감성과 에너지를 표현하면서도, 사용자가 편안하게 느낄 수 있는 컬러 팔레트를 구축했습니다.

### Primary Colors (메인 컬러)

**Primary 500** - 메인 브랜드 컬러
- **Hex**: `#6366F1` (Indigo)
- **RGB**: `rgb(99, 102, 241)`
- **사용**: 주요 CTA 버튼, 브랜드 요소, 강조
- **의미**: 신뢰, 창의성, 음악의 깊이

**Primary 600** - 호버 상태
- **Hex**: `#4F46E5`
- **RGB**: `rgb(79, 70, 229)`

**Primary 400** - 라이트 버전
- **Hex**: `#818CF8`
- **RGB**: `rgb(129, 140, 248)`

**Primary 50** - 배경
- **Hex**: `#EEF2FF`
- **RGB**: `rgb(238, 242, 255)`

### Secondary Colors (보조 컬러)

**Secondary 500** - 보조 브랜드 컬러
- **Hex**: `#EC4899` (Pink)
- **RGB**: `rgb(236, 72, 153)`
- **사용**: 감성적 요소, 편지 카드, 특별한 이벤트
- **의미**: 따뜻함, 감성, 연결

**Secondary 600** - 호버 상태
- **Hex**: `#DB2777`
- **RGB**: `rgb(219, 39, 119)`

**Secondary 400** - 라이트 버전
- **Hex**: `#F472B6`
- **RGB**: `rgb(244, 114, 182)`

**Secondary 50** - 배경
- **Hex**: `#FDF2F8`
- **RGB**: `rgb(253, 242, 248)`

### Accent Colors (강조 컬러)

**Accent 500** - 강조 컬러
- **Hex**: `#F59E0B` (Amber)
- **RGB**: `rgb(245, 158, 11)`
- **사용**: 알림, 중요 정보, 특별한 기능
- **의미**: 에너지, 주목, 음악의 리듬

### Neutral Colors (중립 컬러)

**Gray Scale**:
- **Gray 900**: `#111827` - 텍스트 (Primary)
- **Gray 800**: `#1F2937` - 텍스트 (Secondary)
- **Gray 700**: `#374151` - 텍스트 (Tertiary)
- **Gray 600**: `#4B5563` - 텍스트 (Disabled)
- **Gray 500**: `#6B7280` - 보더, 구분선
- **Gray 400**: `#9CA3AF` - 플레이스홀더
- **Gray 300**: `#D1D5DB` - 보더 (Light)
- **Gray 200**: `#E5E7EB` - 배경 (Light)
- **Gray 100**: `#F3F4F6` - 배경 (Lighter)
- **Gray 50**: `#F9FAFB` - 배경 (Lightest)

### Semantic Colors (의미론적 컬러)

**Success** (성공):
- **500**: `#10B981` (Green)
- **50**: `#ECFDF5`
- **사용**: 저장 완료, 성공 메시지

**Error** (에러):
- **500**: `#EF4444` (Red)
- **50**: `#FEF2F2`
- **사용**: 에러 메시지, 삭제 버튼

**Warning** (경고):
- **500**: `#F59E0B` (Amber)
- **50**: `#FFFBEB`
- **사용**: 경고 메시지, 주의 사항

**Info** (정보):
- **500**: `#3B82F6` (Blue)
- **50**: `#EFF6FF`
- **사용**: 정보 메시지, 도움말

### 다크 모드 컬러 팔레트

**Background**:
- **900**: `#0F172A` - 메인 배경
- **800**: `#1E293B` - 카드 배경
- **700**: `#334155` - 호버 상태

**Text**:
- **100**: `#F1F5F9` - Primary 텍스트
- **200**: `#E2E8F0` - Secondary 텍스트
- **300**: `#CBD5E1` - Tertiary 텍스트

**Primary (다크 모드)**:
- **500**: `#818CF8` - 더 밝은 Indigo
- **600**: `#6366F1` - 기본 Indigo

**Secondary (다크 모드)**:
- **500**: `#F472B6` - 더 밝은 Pink
- **600**: `#EC4899` - 기본 Pink

---

## 3. 타이포그래피

### 폰트 패밀리 선정

**Primary Font**: Pretendard (한글 최적화)
- **근거**: 한글 가독성 우수, 웹폰트 지원, 무료
- **대체**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

**Monospace Font**: "SF Mono", Monaco, "Cascadia Code", monospace
- **사용**: 코드, 기술적 정보

### 폰트 스케일 시스템

**Heading 1** (H1):
- **Size**: 36px (2.25rem)
- **Line Height**: 44px (2.75rem)
- **Weight**: 700 (Bold)
- **Letter Spacing**: -0.02em
- **사용**: 페이지 타이틀, 주요 헤드라인

**Heading 2** (H2):
- **Size**: 30px (1.875rem)
- **Line Height**: 38px (2.375rem)
- **Weight**: 700 (Bold)
- **Letter Spacing**: -0.02em
- **사용**: 섹션 타이틀

**Heading 3** (H3):
- **Size**: 24px (1.5rem)
- **Line Height**: 32px (2rem)
- **Weight**: 600 (Semibold)
- **Letter Spacing**: -0.01em
- **사용**: 서브 섹션 타이틀

**Heading 4** (H4):
- **Size**: 20px (1.25rem)
- **Line Height**: 28px (1.75rem)
- **Weight**: 600 (Semibold)
- **사용**: 카드 타이틀

**Body Large**:
- **Size**: 18px (1.125rem)
- **Line Height**: 28px (1.75rem)
- **Weight**: 400 (Regular)
- **사용**: 중요 본문

**Body** (기본):
- **Size**: 16px (1rem)
- **Line Height**: 24px (1.5rem)
- **Weight**: 400 (Regular)
- **사용**: 일반 본문

**Body Small**:
- **Size**: 14px (0.875rem)
- **Line Height**: 20px (1.25rem)
- **Weight**: 400 (Regular)
- **사용**: 보조 텍스트

**Caption**:
- **Size**: 12px (0.75rem)
- **Line Height**: 16px (1rem)
- **Weight**: 400 (Regular)
- **사용**: 캡션, 라벨

### 폰트 웨이트

- **100**: Thin (사용 안 함)
- **200**: Extra Light (사용 안 함)
- **300**: Light (사용 안 함)
- **400**: Regular (본문)
- **500**: Medium (강조)
- **600**: Semibold (서브 헤딩)
- **700**: Bold (헤딩)
- **800**: Extra Bold (사용 안 함)
- **900**: Black (사용 안 함)

### 반응형 타이포그래피

**Mobile (< 768px)**:
- H1: 28px → 36px
- H2: 24px → 30px
- H3: 20px → 24px
- Body: 16px (고정)

**Tablet (768px - 1024px)**:
- H1: 32px → 36px
- H2: 28px → 30px
- H3: 22px → 24px

**Desktop (> 1024px)**:
- H1: 36px
- H2: 30px
- H3: 24px

---

## 4. 컴포넌트 라이브러리

### 버튼 (Button)

**Primary Button**:
- **배경**: Primary 500 (`#6366F1`)
- **텍스트**: White
- **호버**: Primary 600
- **활성**: Primary 700
- **비활성**: Gray 300, 텍스트 Gray 500
- **패딩**: 12px 24px
- **보더 반경**: 8px
- **폰트**: Body, Weight 500

**Secondary Button**:
- **배경**: Transparent
- **텍스트**: Primary 500
- **보더**: 1px solid Primary 500
- **호버**: Primary 50 배경
- **패딩**: 12px 24px
- **보더 반경**: 8px

**Ghost Button**:
- **배경**: Transparent
- **텍스트**: Gray 700
- **호버**: Gray 100 배경
- **패딩**: 12px 24px
- **보더 반경**: 8px

**Icon Button**:
- **크기**: 40px × 40px (정사각형)
- **패딩**: 8px
- **보더 반경**: 8px
- **아이콘 크기**: 20px

### 입력 필드 (Input)

**Text Input**:
- **높이**: 44px
- **패딩**: 12px 16px
- **보더**: 1px solid Gray 300
- **보더 반경**: 8px
- **폰트**: Body (16px)
- **포커스**: 보더 Primary 500, 그림자
- **에러**: 보더 Error 500
- **비활성**: 배경 Gray 100, 텍스트 Gray 500

**Textarea**:
- **최소 높이**: 100px
- **패딩**: 12px 16px
- **보더**: 1px solid Gray 300
- **보더 반경**: 8px
- **리사이즈**: Vertical only

**Select**:
- **높이**: 44px
- **패딩**: 12px 16px
- **보더**: 1px solid Gray 300
- **보더 반경**: 8px
- **드롭다운 아이콘**: 오른쪽에 표시

### 카드 컴포넌트 (Card)

**기본 카드**:
- **배경**: White (다크 모드: Gray 800)
- **보더**: 1px solid Gray 200 (다크 모드: Gray 700)
- **보더 반경**: 12px
- **패딩**: 24px
- **그림자**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **호버**: 그림자 증가

**편지 카드**:
- **배경**: White (다크 모드: Gray 800)
- **보더**: 2px solid Primary 100 (다크 모드: Primary 900)
- **보더 반경**: 16px
- **패딩**: 32px
- **그림자**: 0 4px 12px rgba(99, 102, 241, 0.1)
- **특별**: 편지 느낌의 디자인

### 네비게이션 컴포넌트

**상단 네비게이션**:
- **높이**: 64px
- **배경**: White (다크 모드: Gray 900)
- **보더**: 하단 1px solid Gray 200
- **패딩**: 0 24px
- **로고**: 왼쪽
- **메뉴**: 오른쪽

**하단 네비게이션** (모바일):
- **높이**: 64px
- **배경**: White (다크 모드: Gray 900)
- **보더**: 상단 1px solid Gray 200
- **아이콘**: 24px
- **라벨**: Caption (12px)

### 모달 및 다이얼로그

**모달 오버레이**:
- **배경**: rgba(0, 0, 0, 0.5)
- **애니메이션**: Fade in/out

**모달 컨텐츠**:
- **배경**: White (다크 모드: Gray 800)
- **보더 반경**: 16px
- **패딩**: 24px
- **최대 너비**: 480px
- **애니메이션**: Slide up + Fade

**다이얼로그 헤더**:
- **패딩**: 24px 24px 16px
- **보더**: 하단 1px solid Gray 200

**다이얼로그 푸터**:
- **패딩**: 16px 24px 24px
- **보더**: 상단 1px solid Gray 200
- **버튼**: 오른쪽 정렬

### 로딩 인디케이터

**스피너**:
- **크기**: 24px × 24px
- **컬러**: Primary 500
- **애니메이션**: 회전 (1s linear infinite)

**스켈레톤 UI**:
- **배경**: Gray 200 (다크 모드: Gray 700)
- **애니메이션**: Shimmer (1.5s ease-in-out infinite)
- **보더 반경**: 8px

**프로그레스 바**:
- **높이**: 4px
- **배경**: Gray 200
- **프로그레스**: Primary 500
- **애니메이션**: 부드러운 진행

### 에러 메시지

**인라인 에러**:
- **컬러**: Error 500
- **폰트**: Body Small (14px)
- **아이콘**: 16px, 왼쪽에 표시
- **마진**: 상단 4px

**토스트 에러**:
- **배경**: Error 500
- **텍스트**: White
- **보더 반경**: 8px
- **패딩**: 12px 16px
- **그림자**: 0 4px 12px rgba(239, 68, 68, 0.3)
- **애니메이션**: Slide in from top

---

## 5. 스페이싱 시스템

### 간격 시스템 (8px 기반)

- **1**: 4px (0.25rem) - 매우 작은 간격
- **2**: 8px (0.5rem) - 작은 간격
- **3**: 12px (0.75rem) - 작은-중간 간격
- **4**: 16px (1rem) - 기본 간격
- **5**: 20px (1.25rem) - 중간 간격
- **6**: 24px (1.5rem) - 큰 간격
- **8**: 32px (2rem) - 매우 큰 간격
- **10**: 40px (2.5rem) - 섹션 간격
- **12**: 48px (3rem) - 큰 섹션 간격
- **16**: 64px (4rem) - 페이지 간격

### 그리드 시스템

**컨테이너**:
- **최대 너비**: 1280px
- **패딩**: 24px (모바일), 32px (데스크톱)

**그리드**:
- **컬럼**: 12 컬럼
- **간격**: 24px (Gutter)
- **브레이크포인트**: Mobile (1 컬럼), Tablet (2-3 컬럼), Desktop (3-4 컬럼)

### 레이아웃 패턴

**카드 그리드**:
- **모바일**: 1 컬럼
- **태블릿**: 2 컬럼
- **데스크톱**: 3-4 컬럼
- **간격**: 24px

**리스트 레이아웃**:
- **간격**: 16px (항목 간)
- **패딩**: 16px (항목 내부)

---

## 6. 아이콘 시스템

### 아이콘 스타일

**Outline 스타일** (기본):
- **선 두께**: 1.5px
- **사용**: 일반 아이콘

**Filled 스타일**:
- **사용**: 활성 상태, 강조

### 아이콘 크기 시스템

- **XS**: 12px - 매우 작은 아이콘
- **SM**: 16px - 작은 아이콘
- **MD**: 20px - 기본 아이콘
- **LG**: 24px - 큰 아이콘
- **XL**: 32px - 매우 큰 아이콘

### 커스텀 아이콘 가이드

**음악 관련 아이콘**:
- 음표, 플레이, 일시정지, 다음, 이전
- 플레이리스트, 하트, 공유

**플랫폼 아이콘**:
- Spotify, YouTube Music, Apple Music, 멜론
- 각 플랫폼의 공식 브랜드 컬러 사용

**편지 관련 아이콘**:
- 편지, 보낸 편지, 받은 편지, 별표

---

## 7. 그림자 시스템

### 그림자 레벨

**Level 1** (가벼운 그림자):
- `0 1px 2px rgba(0, 0, 0, 0.05)`
- **사용**: 카드, 버튼

**Level 2** (기본 그림자):
- `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **사용**: 호버 상태, 모달

**Level 3** (강한 그림자):
- `0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)`
- **사용**: 드롭다운, 팝오버

**Level 4** (매우 강한 그림자):
- `0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)`
- **사용**: 모달, 다이얼로그

---

## 8. 보더 반경 시스템

- **None**: 0px - 직각
- **SM**: 4px - 작은 보더 반경
- **MD**: 8px - 기본 보더 반경
- **LG**: 12px - 큰 보더 반경
- **XL**: 16px - 매우 큰 보더 반경
- **Full**: 9999px - 완전한 원형

---

## 9. 애니메이션 및 전환

### 전환 시간

- **Fast**: 150ms - 빠른 전환
- **Normal**: 200ms - 기본 전환
- **Slow**: 300ms - 느린 전환

### 이징 함수

- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)` - 시작 느리게
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` - 끝 느리게
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` - 시작과 끝 느리게

### 애니메이션 패턴

**Fade In/Out**:
- Opacity: 0 → 1
- Duration: 200ms
- Easing: Ease Out

**Slide Up**:
- Transform: translateY(10px) → translateY(0)
- Opacity: 0 → 1
- Duration: 300ms
- Easing: Ease Out

**Scale**:
- Transform: scale(0.95) → scale(1)
- Duration: 200ms
- Easing: Ease Out

---

## 10. 다크 모드 지원

### 다크 모드 컬러 매핑

**배경**:
- White → Gray 900
- Gray 50 → Gray 800
- Gray 100 → Gray 700

**텍스트**:
- Gray 900 → Gray 100
- Gray 800 → Gray 200
- Gray 700 → Gray 300

**보더**:
- Gray 200 → Gray 700
- Gray 300 → Gray 600

### 다크 모드 전환

- **전환 시간**: 300ms
- **이징**: Ease In Out
- **토글**: 상단 네비게이션 또는 설정

---

## 다음 단계

이 디자인 시스템을 바탕으로 다음을 수행하겠습니다:

1. 사용자 플로우 디자인
2. 화면별 디자인 명세
3. 인터랙션 가이드
4. 반응형 디자인 전략
5. 접근성 가이드라인

---

**Maya Designer**  
"확장 가능하고 일관된 디자인 시스템을 구축했습니다. 이 시스템은 사용자 경험을 향상시키고, 개발 효율성을 높이며, 브랜드 아이덴티티를 강화합니다."

