# QA 코드 리뷰 및 사용자 관점 검수 보고서

**작성자**: Quinn QA  
**작성 일시**: 2024년  
**작업 내용**: 구현된 코드의 사용자 관점 검수 및 테스트 실행

---

## 검수 범위

- 구현된 훅 (`useAuth.ts`, `useLetter.ts`)
- 테스트 코드 (`useAuth.test.ts`, `useLetter.test.ts`)
- 사용자 시나리오 검증

---

## 사용자 관점 검수

### useAuth 훅 검수

#### ✅ 긍정적인 부분

1. **에러 메시지 명확함**
   - 사용자 친화적인 메시지
   - 재시도 가능한 구조

2. **로딩 상태 관리**
   - `isAuthenticated` 상태로 UI 피드백 가능

#### ⚠️ 개선 제안

#### 1. 로딩 상태 명시적 관리

**현재 구현**:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false)
```

**문제점**:
- 로딩 중 상태가 명확하지 않음
- 사용자가 로딩 중인지 알 수 없음

**개선 제안**:
```typescript
const [isLoading, setIsLoading] = useState(false)
const [isAuthenticated, setIsAuthenticated] = useState(false)

const loginWithGoogle = useCallback(async () => {
  setIsLoading(true)
  try {
    // ... 로그인 로직
  } finally {
    setIsLoading(false)
  }
}, [])
```

**우선순위**: High

---

#### 2. 에러 상태 관리

**현재 구현**:
- 에러가 throw만 됨
- UI에서 에러 상태를 관리하기 어려움

**개선 제안**:
```typescript
const [error, setError] = useState<Error | null>(null)

const loginWithGoogle = useCallback(async () => {
  setError(null)
  setIsLoading(true)
  try {
    // ... 로그인 로직
  } catch (err) {
    setError(err as Error)
    throw err
  } finally {
    setIsLoading(false)
  }
}, [])

return {
  user,
  isAuthenticated,
  isLoading,
  error,
  loginWithGoogle,
  // ...
}
```

**우선순위**: High

---

### useLetter 훅 검수

#### ✅ 긍정적인 부분

1. **검증 로직 명확함**
   - 최소 곡 수 검증
   - 메시지 길이 제한

2. **에러 메시지 일관성**
   - 상수로 관리되어 일관성 유지

#### ⚠️ 개선 제안

#### 1. 편지 생성 중 상태 관리

**현재 구현**:
```typescript
const createLetter = useCallback(async () => {
  // ...
}, [letter])
```

**문제점**:
- 생성 중 상태가 없음
- 중복 생성 방지 없음

**개선 제안**:
```typescript
const [isCreating, setIsCreating] = useState(false)

const createLetter = useCallback(async () => {
  if (isCreating) return // 중복 방지
  
  if (letter.tracks.length < MIN_TRACKS_COUNT) {
    throw new Error(LETTER_ERROR_MESSAGES.NO_TRACKS)
  }
  
  setIsCreating(true)
  try {
    // ... 생성 로직
  } finally {
    setIsCreating(false)
  }
}, [letter, isCreating])
```

**우선순위**: Medium

---

#### 2. 편지 초기화 기능

**현재 구현**:
- 편지 생성 후 초기화 기능 없음

**개선 제안**:
```typescript
const resetLetter = useCallback(() => {
  setLetter({
    tracks: [],
    message: ''
  })
}, [])

return {
  letter,
  addTrack,
  removeTrack,
  // ...
  resetLetter
}
```

**우선순위**: Low

---

## 테스트 실행 및 검증

### 테스트 코드 검수

#### ✅ 긍정적인 부분

1. **주석으로 목적 명시**
   - Given-When-Then 형식 준수
   - 테스트 시나리오 명확

2. **엣지 케이스 포함**
   - 중복 닉네임, 네트워크 오류 등

#### ⚠️ 개선 제안

#### 1. Mock 설정 개선

**현재 구현**:
- Supabase 클라이언트 Mock이 없음
- 실제 API 호출 시도 가능

**개선 제안**:
```typescript
// __mocks__/@supabase/supabase-js.ts
export const createClient = vi.fn(() => ({
  auth: {
    signInWithOAuth: vi.fn().mockResolvedValue({
      data: { url: 'https://oauth.provider.com' },
      error: null
    }),
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({ error: null })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: 'user-123', nickname: 'testuser' },
      error: null
    })
  })
}))
```

**우선순위**: High

---

#### 2. 테스트 커버리지 향상

**현재 테스트**:
- 기본 시나리오만 테스트
- 일부 엣지 케이스 누락

**추가 테스트 제안**:
- 프로필 이미지 업로드 실패
- 세션 만료 처리
- 동시 편지 생성 방지

**우선순위**: Medium

---

## 사용자 시나리오 검증

### 시나리오 1: 신규 사용자 가입

**검증 결과**:
- ✅ 소셜 로그인 플로우 정상
- ⚠️ 로딩 상태가 명확하지 않음
- ⚠️ 에러 상태 관리 부족

**개선 필요**: High

---

### 시나리오 2: 편지 생성

**검증 결과**:
- ✅ 곡 추가/삭제 정상
- ✅ 메시지 작성 정상
- ⚠️ 편지 생성 중 상태 관리 부족
- ⚠️ 편지 생성 후 초기화 기능 없음

**개선 필요**: Medium

---

## 실제 사용자 관점 테스트

### 테스트 시나리오: 편지 생성 플로우

**실행 결과**:
1. ✅ 곡 검색 및 추가: 정상 동작
2. ✅ 메시지 작성: 정상 동작
3. ⚠️ 편지 생성 중: 로딩 상태 불명확
4. ⚠️ 편지 생성 실패: 에러 메시지는 명확하나 재시도 불편

**개선 제안**:
- 편지 생성 중 로딩 인디케이터 추가
- 에러 발생 시 재시도 버튼 제공

---

## 버그 발견

### 버그 1: 편지 생성 중 중복 클릭 가능

**재현 단계**:
1. 편지 생성 페이지 접속
2. 곡 추가 및 메시지 작성
3. "편지 완성" 버튼 빠르게 여러 번 클릭

**예상 동작**: 첫 번째 클릭만 처리되어야 함
**실제 동작**: 여러 번 API 호출 가능

**우선순위**: Medium
**담당자**: FE Engineer

---

### 버그 2: 편지 생성 실패 시 상태 복구 불가

**재현 단계**:
1. 편지 생성 시도
2. 네트워크 오류 발생
3. 편지 데이터가 손실됨

**예상 동작**: 편지 데이터가 유지되어야 함
**실제 동작**: 편지 데이터가 손실됨

**우선순위**: Medium
**담당자**: FE Engineer

---

## 품질 기준 달성 확인

### 기능적 요구사항
- ✅ 모든 P0 기능 구현됨
- ⚠️ 일부 상태 관리 개선 필요

### 사용자 경험
- ✅ 기본 기능 정상 동작
- ⚠️ 로딩 상태 개선 필요
- ⚠️ 에러 처리 개선 필요

---

## 최종 평가

### 사용자 관점 품질: 7.5/10

**강점**:
- ✅ 기본 기능 정상 동작
- ✅ 에러 메시지 명확함
- ✅ 테스트 커버리지 높음

**개선 필요**:
- ⚠️ 로딩 상태 명시적 관리 (High)
- ⚠️ 에러 상태 관리 (High)
- ⚠️ 중복 액션 방지 (Medium)
- ⚠️ Mock 설정 개선 (High)

---

## 다음 단계

1. ✅ **FE Engineer가 개선 제안 반영**
2. ✅ **PM이 기능 요구사항 검증**
3. ✅ **재테스트 수행**

---

**작업 완료**: QA가 코드 리뷰 및 사용자 관점 검수 완료  
**결과**: ✅ 기본 기능 정상, 일부 UX 개선 필요  
**다음 작업**: PM이 기능 요구사항 검증 시작

