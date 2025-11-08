# 🎨 인터랙션 가이드

**작성자**: Maya Designer  
**작성 일시**: 2024년  
**기반**: 화면별 디자인 명세 (design/screen_specs.md), 디자인 시스템 (design/design_system.md)

---

## 인터랙션 디자인 원칙

1. **즉각적 피드백**: 모든 액션에 즉각적 시각적 피드백
2. **예측 가능성**: 일관된 인터랙션 패턴
3. **부드러움**: 자연스러운 애니메이션
4. **의미 있는 애니메이션**: 기능적 목적이 있는 애니메이션만 사용
5. **성능 우선**: 60fps 유지, 애니메이션 최적화

---

## 1. 애니메이션 및 전환

### 페이지 전환 애니메이션

**Fade Transition**:
- **Duration**: 200ms
- **Easing**: Ease Out
- **사용**: 페이지 간 전환
- **구현**: Next.js의 페이지 전환

**Slide Transition**:
- **Duration**: 300ms
- **Easing**: Ease Out
- **사용**: 모달 열림/닫힘
- **방향**: 아래에서 위로 (Slide Up)

**예시**:
```css
.page-transition {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

### 컴포넌트 등장 애니메이션

**Fade In**:
- **Duration**: 200ms
- **Delay**: Stagger (각 항목마다 50ms씩 증가)
- **사용**: 리스트 항목 등장

**Slide Up + Fade**:
- **Duration**: 300ms
- **Transform**: translateY(20px) → translateY(0)
- **Opacity**: 0 → 1
- **사용**: 카드 등장

**Scale + Fade**:
- **Duration**: 200ms
- **Transform**: scale(0.95) → scale(1)
- **Opacity**: 0 → 1
- **사용**: 모달 등장

**예시**:
```css
.card-enter {
  animation: slideUpFade 300ms ease-out;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 마이크로 인터랙션

#### 버튼 클릭

**Primary Button**:
- **Hover**: Scale (1.02), Primary 600 배경
- **Active**: Scale (0.98), Primary 700 배경
- **Duration**: 150ms

**Icon Button**:
- **Hover**: 배경 Gray 100, Scale (1.1)
- **Active**: 배경 Gray 200, Scale (0.95)
- **Duration**: 150ms

#### 입력 필드 포커스

**Focus**:
- **보더**: Gray 300 → Primary 500
- **그림자**: 0 0 0 3px rgba(99, 102, 241, 0.1)
- **Duration**: 200ms

**Blur**:
- **보더**: Primary 500 → Gray 300
- **그림자**: 제거
- **Duration**: 200ms

#### 곡 추가

**애니메이션**:
1. 검색 결과 클릭
2. Scale (1.1) → Scale (1) (200ms)
3. Fade Out (검색 결과에서)
4. Slide In (플레이리스트로) (300ms)
5. Scale (0.9) → Scale (1) (200ms)

**피드백**: "추가됨" 토스트 (2초)

---

### 로딩 애니메이션

#### 스피너

**기본 스피너**:
- **크기**: 24px × 24px
- **컬러**: Primary 500
- **애니메이션**: 회전 (1s linear infinite)
- **사용**: 버튼 내부, 인라인 로딩

**큰 스피너**:
- **크기**: 48px × 48px
- **컬러**: Primary 500
- **애니메이션**: 회전 (1s linear infinite)
- **사용**: 전체 화면 로딩

#### 스켈레톤 UI

**Shimmer 효과**:
- **배경**: Gray 200
- **애니메이션**: 좌우 이동 그라데이션
- **Duration**: 1.5s ease-in-out infinite
- **사용**: 콘텐츠 로딩 중

**예시**:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #F3F4F6 0%,
    #E5E7EB 50%,
    #F3F4F6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

#### 프로그레스 바

**진행 표시**:
- **높이**: 4px
- **배경**: Gray 200
- **프로그레스**: Primary 500
- **애니메이션**: 부드러운 진행
- **사용**: 저장 진행, 업로드 진행

---

## 2. 피드백 메커니즘

### 사용자 액션에 대한 시각적 피드백

#### 클릭 피드백

**버튼 클릭**:
- **Active 상태**: Scale (0.98), 배경색 변경
- **Duration**: 150ms
- **피드백**: 즉각적

**카드 클릭**:
- **Active 상태**: Scale (0.98), 그림자 증가
- **Duration**: 150ms
- **피드백**: 즉각적

#### 호버 피드백

**버튼 호버**:
- **배경색**: 밝기 증가 (brightness 1.1)
- **커서**: pointer
- **Duration**: 200ms

**카드 호버**:
- **그림자**: 증가
- **Transform**: translateY(-2px)
- **Duration**: 200ms

#### 드래그 피드백

**드래그 시작**:
- **투명도**: 0.8
- **그림자**: 증가
- **커서**: grabbing

**드래그 중**:
- **Transform**: 회전 (2deg)
- **피드백**: 실시간 위치 표시

---

### 성공/실패 상태 표시

#### 성공 상태

**토스트 성공**:
- **배경**: Success 500
- **텍스트**: White
- **아이콘**: 체크마크 (왼쪽)
- **애니메이션**: Slide in from top (300ms)
- **지속 시간**: 3초
- **위치**: 상단 중앙

**인라인 성공**:
- **아이콘**: 체크마크 (오른쪽)
- **컬러**: Success 500
- **위치**: 입력 필드 오른쪽

#### 실패 상태

**토스트 에러**:
- **배경**: Error 500
- **텍스트**: White
- **아이콘**: X 마크 (왼쪽)
- **애니메이션**: Slide in from top (300ms)
- **지속 시간**: 5초 (에러는 더 길게)
- **위치**: 상단 중앙
- **액션**: 재시도 버튼 포함

**인라인 에러**:
- **텍스트**: Error 500
- **아이콘**: 경고 아이콘 (왼쪽)
- **위치**: 입력 필드 아래
- **메시지**: 명확한 에러 설명

---

### 진행 상태 표시

#### 단계별 진행

**진행 표시기**:
- **형태**: 단계별 점 또는 바
- **활성**: Primary 500
- **완료**: Success 500
- **미완료**: Gray 300
- **애니메이션**: 활성 단계 강조

**예시**:
```
[●]────[●]────[○]
Step 1  Step 2  Step 3
```

#### 진행률 표시

**프로그레스 바**:
- **형태**: 수평 바
- **배경**: Gray 200
- **프로그레스**: Primary 500
- **퍼센트**: 텍스트 표시 (선택)
- **애니메이션**: 부드러운 진행

---

## 3. 제스처 인터랙션 (모바일)

### 스와이프 제스처

**곡 삭제**:
- **방향**: 좌우 스와이프
- **임계값**: 50% 이상 스와이프 시 삭제
- **피드백**: 삭제 버튼 표시, 색상 변경
- **취소**: 반대 방향 스와이프

**탭 전환**:
- **방향**: 좌우 스와이프
- **임계값**: 30% 이상 스와이프 시 전환
- **피드백**: 실시간 위치 표시
- **애니메이션**: 부드러운 슬라이드

### 드래그 앤 드롭

**플레이리스트 순서 변경**:
- **시작**: 길게 누르기 (Long Press)
- **피드백**: 햅틱 피드백 (iOS), 진동 (Android)
- **드래그**: 실시간 위치 표시
- **완료**: 놓기 시 애니메이션

### 핀치 투 줌

**이미지 확대**:
- **제스처**: 핀치 투 줌
- **범위**: 1x ~ 3x
- **피드백**: 실시간 확대/축소
- **리셋**: 더블 탭

---

## 4. 인터랙션 패턴

### 모달 열림/닫힘

**열림**:
- **오버레이**: Fade In (200ms)
- **모달**: Slide Up + Fade (300ms)
- **방향**: 아래에서 위로
- **이징**: Ease Out

**닫힘**:
- **오버레이**: Fade Out (200ms)
- **모달**: Slide Down + Fade (200ms)
- **방향**: 위에서 아래로
- **이징**: Ease In

**트리거**:
- 오버레이 클릭
- ESC 키
- 닫기 버튼

---

### 드롭다운 메뉴

**열림**:
- **애니메이션**: Fade In + Slide Down (200ms)
- **방향**: 위에서 아래로
- **위치**: 트리거 버튼 아래

**닫힘**:
- **애니메이션**: Fade Out + Slide Up (150ms)
- **트리거**: 외부 클릭, 메뉴 항목 선택

---

### 토스트 알림

**표시**:
- **애니메이션**: Slide in from top (300ms)
- **위치**: 상단 중앙
- **지속 시간**: 3초 (성공), 5초 (에러)
- **스택**: 여러 토스트는 세로로 스택

**제거**:
- **애니메이션**: Slide out to top (200ms)
- **트리거**: 시간 경과, 닫기 버튼 클릭

---

## 5. 성능 최적화

### 애니메이션 최적화

**GPU 가속**:
- **Transform**: translate, scale, rotate 사용
- **Opacity**: 변경 시 GPU 가속
- **Avoid**: width, height, top, left 변경

**예시**:
```css
/* 좋은 예 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* 나쁜 예 */
.element {
  left: 100px;
  width: 200px;
}
```

**Will-Change**:
- **사용**: 애니메이션이 시작되기 전에 설정
- **제거**: 애니메이션 완료 후 제거
- **주의**: 과도한 사용 지양

**예시**:
```css
.element {
  will-change: transform;
}

.element.animating {
  transform: translateX(100px);
}

.element.animated {
  will-change: auto;
}
```

---

### 프레임 레이트 유지

**목표**: 60fps 유지

**최적화 방법**:
- 복잡한 애니메이션은 GPU 가속 사용
- 불필요한 리플로우/리페인트 방지
- 애니메이션 시간 최소화 (300ms 이하)
- 많은 요소 애니메이션 시 Virtual Scrolling 사용

---

## 6. 접근성 고려사항

### 키보드 네비게이션

**포커스 인디케이터**:
- **스타일**: Primary 500 보더, 2px 두께
- **그림자**: 0 0 0 3px rgba(99, 102, 241, 0.2)
- **명확성**: 항상 명확하게 표시

**포커스 순서**:
- 논리적 순서 유지
- 스킵 링크 제공 (긴 네비게이션)
- 모달 내부 포커스 트랩

---

### 스크린 리더 지원

**ARIA 레이블**:
- 버튼: 명확한 라벨
- 아이콘 버튼: aria-label 제공
- 상태 변경: aria-live 영역 사용

**예시**:
```html
<button aria-label="편지 삭제">
  <TrashIcon />
</button>

<div aria-live="polite" aria-atomic="true">
  편지가 저장되었습니다.
</div>
```

---

### 애니메이션 제어

**Reduced Motion**:
- **미디어 쿼리**: `prefers-reduced-motion`
- **대응**: 애니메이션 비활성화 또는 단순화

**예시**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 다음 단계

이 인터랙션 가이드를 바탕으로 다음을 수행하겠습니다:

1. 반응형 디자인 전략 수립
2. 접근성 가이드라인 수립

---

**Maya Designer**  
"사용자 경험을 향상시키는 인터랙션 가이드를 작성했습니다. 모든 인터랙션이 즉각적 피드백을 제공하고, 일관된 패턴을 따르며, 성능이 최적화되었습니다."

