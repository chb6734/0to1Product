# 프론트엔드 아키텍처 설계

**작성자**: Sam FE Engineer  
**작성 일시**: 2024년  
**기반**: TPM 기술 스택 (`tech/tech_stack.md`), Designer 디자인 시스템 (`design/design_system.md`)

---

## 아키텍처 패턴 선정

### 선정: Feature-Sliced Design (FSD)

**선정 근거**:
- ✅ **확장성**: 기능별로 모듈화되어 10배 성장에도 대응 가능
- ✅ **명확한 구조**: 도메인별로 코드가 분리되어 이해하기 쉬움
- ✅ **재사용성**: 공통 컴포넌트와 도메인 컴포넌트가 명확히 분리
- ✅ **팀 협업**: 기능별로 작업 분리 가능
- ✅ **유지보수성**: 기능 삭제 시 해당 도메인만 제거하면 됨

**대안 비교**:
- **Atomic Design**: 컴포넌트 중심이지만 비즈니스 로직 분리가 약함
- **Domain-Driven Design**: 백엔드 중심, 프론트엔드에 과함
- **MVC**: 프론트엔드에 부적합

**결론**: ✅ **FSD 선정** - 확장성과 유지보수성 모두 우수

---

## 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/                   # 메인 라우트 그룹
│   │   ├── create/
│   │   ├── inbox/
│   │   └── sent/
│   ├── layout.tsx
│   └── page.tsx
│
├── domains/                      # 도메인별 모듈 (FSD)
│   ├── auth/                     # 인증 도메인
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProfileEditForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   └── auth.ts
│   │   └── __tests__/
│   │       └── useAuth.test.ts
│   │
│   ├── letter/                    # 편지 도메인
│   │   ├── components/
│   │   │   ├── LetterCard.tsx    # 편지 카드 컴포넌트 (재사용 가능)
│   │   │   ├── LetterCreateForm.tsx
│   │   │   ├── TrackSearch.tsx
│   │   │   ├── TrackList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── LetterPreview.tsx
│   │   ├── hooks/
│   │   │   └── useLetter.ts
│   │   ├── utils/
│   │   │   └── letter.ts
│   │   └── __tests__/
│   │       └── useLetter.test.ts
│   │
│   └── platform/                 # 플랫폼 연동 도메인
│       ├── components/
│       │   └── PlatformSelector.tsx
│       ├── hooks/
│       │   └── usePlatform.ts
│       └── utils/
│           └── platform.ts
│
├── shared/                       # 공통 모듈
│   ├── components/               # 공통 컴포넌트
│   │   ├── ui/                   # UI 컴포넌트
│   │   │   ├── Button.tsx        # 버튼 컴포넌트
│   │   │   ├── Card.tsx          # 카드 컴포넌트
│   │   │   ├── Input.tsx         # 입력 컴포넌트
│   │   │   ├── Icon.tsx          # 아이콘 컴포넌트 (재사용 가능)
│   │   │   ├── ProfileAvatar.tsx # 프로필 아바타 (일반)
│   │   │   ├── ProfileAvatarGradient.tsx # 프로필 아바타 (그라데이션)
│   │   │   └── EmptyState.tsx   # 빈 상태 컴포넌트
│   │   └── layout/               # 레이아웃 컴포넌트
│   │       └── Header.tsx        # 공통 헤더 (재사용 가능)
│   ├── hooks/                     # 공통 훅
│   │   └── useDebounce.ts
│   ├── utils/                     # 공통 유틸리티
│   │   └── format.ts
│   └── lib/                       # 라이브러리 설정
│       ├── supabase.ts
│       └── api.ts
│
└── stores/                       # 전역 상태 관리 (Zustand)
    ├── authStore.ts
    └── letterStore.ts
```

---

## 상태 관리 전략

### 전역 상태: Zustand

**선정 근거**:
- ✅ **간단함**: Redux보다 설정이 간단
- ✅ **TypeScript 지원**: 타입 안정성 우수
- ✅ **번들 크기**: 작은 번들 크기
- ✅ **성능**: 필요한 부분만 리렌더링

**사용 범위**:
- 사용자 인증 상태 (`authStore`)
- 편지 생성 상태 (`letterStore`)

### 로컬 상태: React useState

**사용 범위**:
- 컴포넌트 내부 UI 상태
- 폼 입력 상태
- 모달 열림/닫힘 상태

### 서버 상태: React Query (TanStack Query)

**선정 근거**:
- ✅ **캐싱**: 자동 캐싱 및 리프레시
- ✅ **로딩 상태**: 자동 로딩/에러 상태 관리
- ✅ **백그라운드 업데이트**: 자동 백그라운드 리프레시

**사용 범위**:
- API 호출
- 곡 검색
- 편지 목록 조회

---

## 컴포넌트 구조 설계

### 컴포넌트 계층 구조

```
Page Component (App Router)
  └── Feature Component (도메인 컴포넌트)
      └── UI Component (공통 컴포넌트)
          └── shadcn/ui Component
```

### 컴포넌트 설계 원칙

1. **단일 책임 원칙**: 각 컴포넌트는 하나의 책임만 가짐
2. **Composition over Props Drilling**: Props Drilling 대신 Composition 사용
3. **컴포넌트 분리**: 조건부 렌더링이 복잡하면 별도 컴포넌트로 분리
4. **재사용성**: 공통 컴포넌트는 `shared/components`에 배치
5. **도메인 컴포넌트**: 도메인별 컴포넌트는 `domains/{domain}/components`에 배치

### 구현된 재사용 가능한 컴포넌트

#### Layout 컴포넌트
- **Header** (`shared/components/layout/Header.tsx`)
  - Props: `activeNav`, `showCreateButton`, `showProfile`
  - 사용처: 모든 페이지 (랜딩, 로그인, 온보딩, 편지 생성, 보관함, 둘러보기, 편지 상세)
  - 특징: 조건부 렌더링으로 다양한 상황에 대응

#### UI 컴포넌트
- **Icon** (`shared/components/ui/Icon.tsx`)
  - Props: `name`, `size`, `className`, `color`
  - 사용처: 모든 페이지
  - 특징: SVG 아이콘을 컴포넌트로 추상화하여 일관성 보장

- **ProfileAvatar** (`shared/components/ui/ProfileAvatar.tsx`)
  - Props: `initials`, `size`, `className`
  - 사용처: 편지 카드, 프로필 표시
  - 특징: 일반 아바타 (노란색 배경)

- **ProfileAvatarGradient** (`shared/components/ui/ProfileAvatarGradient.tsx`)
  - Props: `initials`, `size`, `className`
  - 사용처: 편지 상세, 프로필 표시
  - 특징: 그라데이션 아바타 (노란색 → 시안색)

- **EmptyState** (`shared/components/ui/EmptyState.tsx`)
  - Props: `icon`, `message`, `className`
  - 사용처: 빈 상태 표시 (보관함 등)
  - 특징: 일관된 빈 상태 UI

#### 도메인 컴포넌트
- **LetterCard** (`domains/letter/components/LetterCard.tsx`)
  - Props: `sender`, `recipient`, `senderInitials`, `recipientInitials`, `title`, `message`, `trackCount`, `playCount`, `likeCount`, `date`, `onClick`
  - 사용처: 보관함 (받은 편지/보낸 편지), 둘러보기
  - 특징: 받은 편지, 보낸 편지, 둘러보기에서 공통 사용 가능

---

## API 통신 전략

### API 클라이언트 구조

```typescript
// src/shared/lib/api.ts
export const api = {
  auth: {
    loginWithGoogle: () => Promise<User>,
    loginWithKakao: () => Promise<User>,
    loginWithApple: () => Promise<User>,
    logout: () => Promise<void>,
    updateProfile: (data: ProfileData) => Promise<User>,
  },
  letter: {
    searchTracks: (query: string) => Promise<Track[]>,
    createLetter: (data: LetterData) => Promise<Letter>,
    getLetter: (id: string) => Promise<Letter>,
  },
  platform: {
    saveToSpotify: (tracks: Track[]) => Promise<void>,
    saveToYouTube: (tracks: Track[]) => Promise<void>,
    saveToAppleMusic: (tracks: Track[]) => Promise<void>,
  },
}
```

### 에러 핸들링

- **네트워크 오류**: 재시도 버튼 제공
- **인증 오류**: 로그인 페이지로 리다이렉트
- **검증 오류**: 사용자에게 명확한 에러 메시지 표시

---

## 성능 최적화 전략

### 코드 스플리팅

- **라우트별 스플리팅**: Next.js App Router 자동 스플리팅
- **동적 임포트**: 큰 컴포넌트는 동적 임포트 사용

### 이미지 최적화

- **Next.js Image**: 자동 이미지 최적화
- **앨범 커버**: CDN 사용

### 번들 크기 최적화

- **Tree Shaking**: 사용하지 않는 코드 제거
- **의존성 최적화**: 필요한 라이브러리만 사용

---

## 접근성 전략

### WCAG 2.1 AA 준수

- **키보드 네비게이션**: 모든 인터랙티브 요소 키보드 접근 가능
- **스크린 리더 지원**: 적절한 ARIA 레이블 사용
- **색상 대비**: 최소 4.5:1 대비율 유지

---

## 개발 표준

### frontend-rules.md 준수

- ✅ **Readability**: Magic Numbers 명명, 구현 세부사항 추상화
- ✅ **Predictability**: 일관된 반환 타입, 숨겨진 로직 제거
- ✅ **Cohesion**: 기능/도메인별 코드 조직
- ✅ **Coupling**: Props Drilling 제거 (Composition 사용)

---

## 다음 단계

1. ✅ **컴포넌트 구조 상세 설계**
2. ✅ **기본 훅 구현** (테스트 통과하도록)
3. ✅ **공통 컴포넌트 구현**
4. ✅ **페이지 컴포넌트 구현**

---

**작업 완료**: FE Engineer가 아키텍처 설계 완료  
**다음 작업**: 컴포넌트 구조 상세 설계 및 기본 훅 구현 시작

