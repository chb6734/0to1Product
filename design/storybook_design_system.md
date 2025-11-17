# 🎨 FAN:STAGE 디자인 시스템 (Storybook)

**작성자**: Maya Designer  
**작성 일시**: 2024년  
**기반**: 구현된 컴포넌트 (`src/shared/components`, `src/domains/letter/components`)

---

## 📚 Storybook 개요

FAN:STAGE 디자인 시스템은 Storybook을 통해 문서화되고 관리됩니다.  
모든 컴포넌트는 Storybook에서 독립적으로 개발, 테스트, 문서화할 수 있습니다.

### Storybook 실행 방법

```bash
# 개발 모드로 실행
pnpm run storybook

# 정적 빌드
pnpm run build-storybook
```

### Storybook 접근

- 개발 서버: http://localhost:6006
- 정적 빌드: `storybook-static/index.html`

---

## 🎨 컴포넌트 카탈로그

### UI 컴포넌트 (`Design System/UI`)

#### Button
- **위치**: `src/shared/components/ui/Button.tsx`
- **용도**: 액션 버튼
- **Variants**: `primary`, `secondary`, `outline`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **States**: `default`, `loading`, `disabled`
- **Story**: `Button.stories.tsx`

#### Card
- **위치**: `src/shared/components/ui/Card.tsx`
- **용도**: 콘텐츠 컨테이너
- **Variants**: `default`, `clickable`
- **Story**: `Card.stories.tsx`

#### Input
- **위치**: `src/shared/components/ui/Input.tsx`
- **용도**: 텍스트 입력 필드
- **Features**: 라벨, 에러 메시지, 타입 지원
- **Story**: `Input.stories.tsx`

#### Icon
- **위치**: `src/shared/components/ui/Icon.tsx`
- **용도**: 아이콘 표시
- **Icons**: `music`, `play`, `heart`, `search`, `plus`, `arrow-back`, `link`, `qr-code`, `copy`, `check`
- **Customizable**: `size`, `color`, `className`
- **Story**: `Icon.stories.tsx`

#### ProfileAvatar
- **위치**: `src/shared/components/ui/ProfileAvatar.tsx`
- **용도**: 프로필 아바타 (일반)
- **Style**: 노란색 배경 (`#FFE11D`)
- **Sizes**: `sm`, `md`, `lg`
- **Story**: `ProfileAvatar.stories.tsx`

#### ProfileAvatarGradient
- **위치**: `src/shared/components/ui/ProfileAvatarGradient.tsx`
- **용도**: 프로필 아바타 (그라데이션)
- **Style**: 노란색 → 시안색 그라데이션 (`#FFE11D` → `#2ADFFF`)
- **Sizes**: `sm`, `md`, `lg`
- **Story**: `ProfileAvatarGradient.stories.tsx`

#### EmptyState
- **위치**: `src/shared/components/ui/EmptyState.tsx`
- **용도**: 빈 상태 표시
- **Icons**: `music`, `letter`
- **Story**: `EmptyState.stories.tsx`

### Layout 컴포넌트 (`Design System/Layout`)

#### Header
- **위치**: `src/shared/components/layout/Header.tsx`
- **용도**: 공통 헤더 네비게이션
- **Features**: 
  - 활성 네비게이션 표시 (`activeNav`)
  - 편지 만들기 버튼 (`showCreateButton`)
  - 프로필 아바타 (`showProfile`)
- **Story**: `Header.stories.tsx`

### Domain 컴포넌트 (`Design System/Domain`)

#### LetterCard
- **위치**: `src/domains/letter/components/LetterCard.tsx`
- **용도**: 편지 카드 표시
- **Use Cases**: 
  - 받은 편지 (`received`)
  - 보낸 편지 (`sent`)
  - 둘러보기 (`discover`)
- **Features**: 
  - 보낸 사람/받는 사람 정보
  - 편지 제목/메시지
  - 통계 (곡 개수, 재생 횟수, 좋아요 개수)
  - 클릭 가능
- **Story**: `LetterCard.stories.tsx`

---

## 🎨 디자인 토큰

### 컬러

#### Primary Colors
- **Yellow**: `#FFE11D` - 주요 액션, 강조
- **Cyan**: `#2ADFFF` - 보조 액션, 그라데이션

#### Background Colors
- **Dark**: `#0A0A0A` - 메인 배경
- **Card Dark**: `#121212` - 카드 배경
- **Input Dark**: `#1A1A1A` - 입력 필드 배경
- **Header Dark**: `rgba(18, 18, 18, 0.8)` - 헤더 배경 (반투명)

#### Text Colors
- **White**: `#FFFFFF` - 주요 텍스트
- **Gray Light**: `#99A1AF` - 보조 텍스트
- **Gray Dark**: `#6A7282` - 비활성 텍스트

#### Border Colors
- **Subtle**: `rgba(255, 255, 255, 0.05)` - 기본 보더
- **Medium**: `rgba(255, 255, 255, 0.1)` - 강조 보더

### 타이포그래피

#### Font Sizes
- **xs**: `0.75rem` (12px)
- **sm**: `0.875rem` (14px)
- **base**: `1rem` (16px)
- **lg**: `1.125rem` (18px)
- **xl**: `1.25rem` (20px)
- **2xl**: `1.5rem` (24px)
- **3xl**: `1.875rem` (30px)
- **5xl**: `3rem` (48px)

#### Font Weights
- **normal**: `400`
- **medium**: `500`
- **semibold**: `600`
- **bold**: `700`

### Spacing

#### Padding
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)

#### Gap
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)

### Border Radius

- **sm**: `0.25rem` (4px)
- **md**: `0.5rem` (8px)
- **lg**: `0.75rem` (12px)
- **xl**: `1rem` (16px)
- **2xl**: `1.5rem` (24px)
- **full**: `9999px` (원형)

---

## 📖 Storybook 사용 가이드

### 컴포넌트 개발 워크플로우

1. **컴포넌트 개발**
   - `src/shared/components/ui/` 또는 `src/domains/{domain}/components/`에 컴포넌트 작성

2. **Story 작성**
   - 컴포넌트 파일과 같은 디렉토리에 `{ComponentName}.stories.tsx` 작성
   - 다양한 variant와 state를 보여주는 Story 작성

3. **Storybook에서 확인**
   - `pnpm run storybook` 실행
   - 브라우저에서 컴포넌트 확인 및 테스트

4. **문서화**
   - Story의 `parameters.docs.description`에 컴포넌트 설명 추가
   - `argTypes`에 Props 설명 추가

### Story 작성 예시

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Design System/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '버튼 컴포넌트 설명',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: '버튼 스타일',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '버튼',
  },
};
```

---

## 🔍 컴포넌트 검증 체크리스트

각 컴포넌트는 다음 항목을 확인해야 합니다:

- ✅ **Props 타입 정의**: TypeScript 타입이 명확히 정의되어 있는가?
- ✅ **기본값 제공**: Optional props에 기본값이 제공되는가?
- ✅ **접근성**: ARIA 속성이 적절히 사용되는가?
- ✅ **반응형**: 다양한 화면 크기에서 정상 동작하는가?
- ✅ **상태 관리**: 로딩, 에러, 비활성화 상태가 적절히 처리되는가?
- ✅ **스타일 일관성**: 디자인 시스템의 컬러, 타이포그래피, 스페이싱을 준수하는가?

---

## 📚 참고 자료

- [Storybook 공식 문서](https://storybook.js.org/)
- [디자인 시스템 가이드](./design_system.md)
- [화면 명세](./screen_specs.md)
- [아키텍처 문서](../docs/architecture.md)

---

**Maya Designer**  
"Storybook을 통해 디자인 시스템을 체계적으로 관리하고, 컴포넌트의 재사용성과 일관성을 보장합니다."

