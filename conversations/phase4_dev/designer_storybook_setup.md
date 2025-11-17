# 🎨 Designer: Storybook 기반 디자인 시스템 구축

**작성자**: Maya Designer  
**작성 일시**: 2024년  
**목적**: 현재 구현된 컴포넌트를 기반으로 Storybook 디자인 시스템 구축

---

## 📋 작업 개요

현재 구현된 컴포넌트들을 기반으로 Storybook을 설정하고, 각 컴포넌트에 대한 Story를 작성하여 디자인 시스템을 구축했습니다.

---

## 🛠️ 설치 및 설정

### Storybook 설치

```bash
pnpm add -D storybook@8.6.14 @storybook/nextjs@8.6.14 @storybook/react@8.6.14 \
  @storybook/addon-essentials@8.6.14 @storybook/addon-interactions@8.6.14 \
  @storybook/addon-links@8.6.14 @storybook/addon-docs@8.6.14 @storybook/blocks@8.6.14
```

### Storybook 설정 파일

#### `.storybook/main.ts`
- Next.js 프레임워크 설정
- Story 파일 경로 설정
- Addon 설정

#### `.storybook/preview.ts`
- 글로벌 스타일 적용 (`globals.css`)
- 다크 테마 배경 설정
- Next.js App Directory 지원

---

## 📚 작성된 Story

### UI 컴포넌트

1. **Button.stories.tsx**
   - Variants: Primary, Secondary, Outline, Ghost
   - Sizes: Small, Medium, Large
   - States: Loading, Disabled

2. **Card.stories.tsx**
   - Default, WithContent, Clickable

3. **Input.stories.tsx**
   - Default, WithLabel, WithError, Disabled

4. **Icon.stories.tsx**
   - 모든 아이콘 타입 (music, play, heart, search, plus, arrow-back, link, qr-code, copy, check)
   - Sizes, Colors 변형

5. **ProfileAvatar.stories.tsx**
   - Sizes: Small, Medium, Large
   - Examples

6. **ProfileAvatarGradient.stories.tsx**
   - Sizes: Small, Medium, Large
   - Examples

7. **EmptyState.stories.tsx**
   - MusicIcon, LetterIcon, CustomMessage

### Layout 컴포넌트

8. **Header.stories.tsx**
   - Landing, WithInboxActive, WithDiscoverActive
   - WithCreateButton, WithProfile

### Domain 컴포넌트

9. **LetterCard.stories.tsx**
   - ReceivedLetter, SentLetter, DiscoverLetter
   - Clickable, WithLongMessage

---

## 🎨 디자인 시스템 문서

`design/storybook_design_system.md` 파일에 다음 내용을 문서화했습니다:

1. **Storybook 개요**
   - 실행 방법
   - 접근 방법

2. **컴포넌트 카탈로그**
   - UI 컴포넌트 목록 및 설명
   - Layout 컴포넌트 목록 및 설명
   - Domain 컴포넌트 목록 및 설명

3. **디자인 토큰**
   - 컬러 팔레트
   - 타이포그래피
   - Spacing
   - Border Radius

4. **Storybook 사용 가이드**
   - 컴포넌트 개발 워크플로우
   - Story 작성 예시

5. **컴포넌트 검증 체크리스트**

---

## ✅ 완료된 작업

- ✅ Storybook 설치 및 설정
- ✅ 모든 컴포넌트에 대한 Story 작성
- ✅ 디자인 시스템 문서 작성
- ✅ package.json에 Storybook 스크립트 추가

---

## 📝 다음 단계

1. **TPM 검토**: 아키텍처 관점에서 Storybook 설정 검토
2. **PM 검토**: 제품 관점에서 디자인 시스템 검토
3. **QA 검토**: 품질 관점에서 컴포넌트 검증

---

**Maya Designer**  
"Storybook을 통해 디자인 시스템을 체계적으로 관리하고, 컴포넌트의 재사용성과 일관성을 보장합니다."

