# 컴포넌트 구조 설계

**작성자**: Sam FE Engineer  
**작성 일시**: 2024년  
**기반**: 아키텍처 설계 (`docs/architecture.md`), 디자인 시스템 (`design/design_system.md`)

---

## 컴포넌트 계층 구조

### 레벨 1: Page Components (App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx           # 로그인 페이지
│   └── signup/page.tsx          # 회원가입 페이지
├── (main)/
│   ├── create/page.tsx          # 편지 생성 페이지
│   ├── inbox/page.tsx           # 받은 편지 페이지
│   └── sent/page.tsx            # 보낸 편지 페이지
└── [letterId]/page.tsx          # 편지 열람 페이지 (동적 라우트)
```

### 레벨 2: Feature Components (도메인 컴포넌트)

```
domains/
├── auth/
│   └── components/
│       ├── LoginForm.tsx         # 로그인 폼
│       ├── SignupForm.tsx        # 회원가입 폼
│       └── ProfileEditForm.tsx   # 프로필 수정 폼
│
├── letter/
│   └── components/
│       ├── LetterCreateForm.tsx  # 편지 생성 폼
│       ├── TrackSearch.tsx       # 곡 검색 컴포넌트
│       ├── TrackList.tsx         # 곡 목록 컴포넌트
│       ├── MessageInput.tsx      # 메시지 입력 컴포넌트
│       └── LetterPreview.tsx     # 편지 미리보기 컴포넌트
│
└── platform/
    └── components/
        └── PlatformSelector.tsx  # 플랫폼 선택 컴포넌트
```

### 레벨 3: UI Components (공통 컴포넌트)

```
shared/
└── components/
    ├── ui/                       # shadcn/ui 컴포넌트
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── card.tsx
    │   ├── modal.tsx
    │   └── toast.tsx
    └── layout/
        ├── Header.tsx
        └── Footer.tsx
```

---

## 주요 컴포넌트 설계

### 1. LoginForm 컴포넌트

**책임**:
- 소셜 로그인 버튼 표시
- 로그인 상태 관리
- 에러 처리

**Props**:
```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}
```

**구조**:
```
LoginForm
  ├── SocialLoginButton (Google)
  ├── SocialLoginButton (Kakao)
  └── SocialLoginButton (Apple)
```

---

### 2. LetterCreateForm 컴포넌트

**책임**:
- 편지 생성 전체 플로우 관리
- 곡 검색 및 추가
- 메시지 작성
- 편지 미리보기

**Props**:
```typescript
interface LetterCreateFormProps {
  onSubmit?: (letter: Letter) => void
}
```

**구조**:
```
LetterCreateForm
  ├── TrackSearch
  ├── TrackList
  ├── MessageInput
  └── LetterPreview
```

**상태 관리**:
- `useLetter` 훅 사용
- Zustand store와 연동

---

### 3. TrackSearch 컴포넌트

**책임**:
- 곡 검색 입력
- 검색 결과 표시
- 곡 선택 및 추가

**Props**:
```typescript
interface TrackSearchProps {
  onTrackSelect: (track: Track) => void
  onSearch: (query: string) => Promise<Track[]>
}
```

**구조**:
```
TrackSearch
  ├── Input (검색어 입력)
  └── TrackSearchResults
      └── TrackItem (검색 결과 아이템)
```

**성능 최적화**:
- Debounce 적용 (300ms)
- 가상 스크롤 (많은 결과 시)

---

### 4. TrackList 컴포넌트

**책임**:
- 추가된 곡 목록 표시
- 곡 삭제
- 곡 순서 변경 (드래그 앤 드롭)

**Props**:
```typescript
interface TrackListProps {
  tracks: Track[]
  onRemove: (trackId: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onAddMemo?: (trackId: string, memo: string) => void
}
```

**구조**:
```
TrackList
  └── TrackItem[]
      ├── AlbumCover
      ├── TrackInfo
      ├── MemoButton
      └── RemoveButton
```

---

### 5. MessageInput 컴포넌트

**책임**:
- 메시지 입력
- AI 메시지 생성
- 글자 수 제한 (500자)

**Props**:
```typescript
interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onAIGenerate?: (situation: string) => Promise<string>
}
```

**구조**:
```
MessageInput
  ├── Textarea
  ├── CharacterCount
  └── AIGenerateButton
```

---

## 컴포넌트 설계 원칙

### 1. Composition over Props Drilling

**나쁜 예** (Props Drilling):
```typescript
<LetterCreateForm
  trackSearchQuery={query}
  onTrackSearchChange={setQuery}
  tracks={tracks}
  onTrackAdd={addTrack}
  onTrackRemove={removeTrack}
  message={message}
  onMessageChange={setMessage}
/>
```

**좋은 예** (Composition):
```typescript
<LetterCreateForm>
  <TrackSearch onTrackSelect={handleTrackSelect} />
  <TrackList tracks={tracks} />
  <MessageInput value={message} onChange={setMessage} />
</LetterCreateForm>
```

---

### 2. 조건부 렌더링 분리

**나쁜 예**:
```typescript
function SubmitButton() {
  const isViewer = useRole() === 'viewer'
  return (
    <button disabled={isViewer}>
      {isViewer ? '제출 불가' : '제출'}
    </button>
  )
}
```

**좋은 예**:
```typescript
function SubmitButton() {
  const isViewer = useRole() === 'viewer'
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />
}
```

---

### 3. Magic Numbers 명명

**나쁜 예**:
```typescript
await delay(300)
```

**좋은 예**:
```typescript
const ANIMATION_DELAY_MS = 300
await delay(ANIMATION_DELAY_MS)
```

---

## 상태 관리 전략

### 도메인별 상태 관리

**인증 도메인**:
- `useAuth` 훅: 인증 상태 관리
- `authStore` (Zustand): 전역 인증 상태

**편지 도메인**:
- `useLetter` 훅: 편지 생성 상태 관리
- `letterStore` (Zustand): 전역 편지 상태

**플랫폼 도메인**:
- `usePlatform` 훅: 플랫폼 연동 상태 관리

---

## 다음 단계

1. ✅ **기본 훅 구현** (테스트 통과하도록)
2. ✅ **공통 컴포넌트 구현**
3. ✅ **도메인 컴포넌트 구현**
4. ✅ **페이지 컴포넌트 구현**

---

**작업 완료**: FE Engineer가 컴포넌트 구조 설계 완료  
**다음 작업**: 기본 훅 구현 시작 (테스트 통과하도록)

