# TPM 코드 리뷰 및 기술 검수 보고서

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**작업 내용**: FE Engineer가 구현한 코드의 기술적 검수

---

## 검수 범위

- 아키텍처 설계 문서 (`docs/architecture.md`)
- 구현된 훅 (`useAuth.ts`, `useLetter.ts`)
- 테스트 코드 (`useAuth.test.ts`, `useLetter.test.ts`)

---

## 아키텍처 검수

### ✅ 긍정적인 부분

1. **FSD 패턴 적용**
   - 도메인별 모듈화가 잘 되어 있음
   - `domains/auth`, `domains/letter` 구조가 명확함
   - 확장 가능한 구조

2. **상태 관리 전략**
   - Zustand 사용이 적절함
   - 로컬 상태와 전역 상태의 분리가 명확함

3. **에러 메시지 상수화**
   - `shared/constants/errorMessages.ts`로 일관성 유지
   - frontend-rules.md의 "Relating Magic Numbers to Logic" 원칙 준수

---

### ⚠️ 개선 제안

#### 1. Supabase 클라이언트 싱글톤 패턴

**현재 구현**:
```typescript
// src/shared/lib/supabase.ts
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
```

**문제점**:
- 매번 새로운 클라이언트를 생성하여 비효율적
- 서버 컴포넌트와 클라이언트 컴포넌트에서 다른 방식으로 사용해야 함

**개선 제안**:
```typescript
// 서버용 클라이언트 (싱글톤)
let serverClient: SupabaseClient | null = null

export function createServerClient() {
  if (serverClient) return serverClient
  
  serverClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  })
  
  return serverClient
}

// 클라이언트용 클라이언트 (컨텍스트 기반)
export function createBrowserClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
```

**우선순위**: Medium

---

#### 2. API 호출 로직 분리

**현재 구현**:
- `useLetter.ts`에서 직접 `fetch` 호출
- API 로직이 훅에 혼재

**개선 제안**:
```typescript
// src/shared/lib/api/letter.ts
export const letterAPI = {
  create: async (data: LetterData): Promise<Letter> => {
    const response = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(LETTER_ERROR_MESSAGES.CREATION_FAILED)
    }
    
    return response.json()
  }
}

// useLetter.ts에서 사용
const createLetter = useCallback(async () => {
  if (letter.tracks.length < MIN_TRACKS_COUNT) {
    throw new Error(LETTER_ERROR_MESSAGES.NO_TRACKS)
  }
  
  return await letterAPI.create({
    tracks: letter.tracks,
    message: letter.message
  })
}, [letter])
```

**우선순위**: Medium

---

#### 3. 타입 정의 중앙화

**현재 구현**:
- 각 파일에 타입이 분산되어 있음

**개선 제안**:
```typescript
// src/shared/types/auth.ts
export interface User {
  id: string
  email: string
  nickname?: string
  profileImage?: string
}

export interface ProfileData {
  nickname?: string
  profileImage?: string
}

// src/shared/types/letter.ts
export interface Track {
  id: string
  title: string
  artist: string
  albumCover: string
  memo?: string
}

export interface Letter {
  tracks: Track[]
  message: string
}
```

**우선순위**: Low

---

## 코드 품질 검수

### frontend-rules.md 준수 확인

#### ✅ Readability
- ✅ Magic Numbers 명명: `MAX_MESSAGE_LENGTH`, `MIN_TRACKS_COUNT` 등
- ✅ 명확한 함수명: `addTrack`, `removeTrack`, `setMessage` 등
- ✅ 주석으로 목적 명시

#### ✅ Predictability
- ✅ 일관된 반환 타입
- ✅ 명확한 에러 메시지

#### ✅ Cohesion
- ✅ 도메인별 코드 조직
- ✅ 관련 로직 그룹화

#### ✅ Coupling
- ✅ Props Drilling 없음 (훅 사용)
- ⚠️ API 호출 로직 분리 필요 (개선 제안 2)

---

## 성능 검수

### ✅ 긍정적인 부분

1. **useCallback 사용**
   - 불필요한 리렌더링 방지
   - 성능 최적화 적절

2. **에러 메시지 상수화**
   - 런타임 오버헤드 없음

### ⚠️ 개선 제안

#### 1. 메모이제이션 고려

**현재 구현**:
```typescript
const addTrack = useCallback((track: Track) => {
  setLetter((prev) => ({
    ...prev,
    tracks: [...prev.tracks, track],
  }))
}, [])
```

**개선 제안**:
- 많은 곡 추가 시 성능 최적화 필요
- 가상 스크롤 적용 고려

---

## 보안 검수

### ✅ 긍정적인 부분

1. **에러 메시지 노출 제한**
   - 민감한 정보 노출 없음
   - 사용자 친화적인 메시지

2. **타입 안정성**
   - TypeScript로 타입 체크

### ⚠️ 개선 제안

#### 1. 입력 검증 강화

**현재 구현**:
- 클라이언트 측 검증만 있음

**개선 제안**:
- 서버 측 검증 추가 (Zod 스키마)
- SQL Injection 방지 (Supabase 자동 처리되지만 명시)

---

## 확장성 검수

### ✅ 긍정적인 부분

1. **FSD 아키텍처**
   - 도메인별 모듈화로 확장 용이

2. **에러 메시지 상수화**
   - 다국어 지원 준비 가능

### ⚠️ 개선 제안

#### 1. 국제화(i18n) 준비

**개선 제안**:
```typescript
// src/shared/constants/errorMessages.ts
export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: {
    ko: '로그인에 실패했습니다',
    en: 'Login failed'
  },
  // ...
} as const
```

**우선순위**: Low (Phase 2)

---

## 테스트 코드 검수

### ✅ 긍정적인 부분

1. **주석으로 목적 명시**
   - Given-When-Then 형식 준수
   - 테스트 시나리오 명확

2. **엣지 케이스 포함**
   - 중복 닉네임, 네트워크 오류 등

### ⚠️ 개선 제안

#### 1. Mock 개선

**현재 구현**:
- Supabase 클라이언트 Mock이 없음

**개선 제안**:
```typescript
// __mocks__/supabase.ts
export const createClient = vi.fn(() => ({
  auth: {
    signInWithOAuth: vi.fn(),
    getUser: vi.fn(),
    signOut: vi.fn()
  },
  from: vi.fn()
}))
```

**우선순위**: Medium

---

## 최종 평가

### 기술적 품질: 8.5/10

**강점**:
- ✅ 아키텍처 설계 우수
- ✅ frontend-rules.md 준수
- ✅ 타입 안정성
- ✅ 테스트 커버리지 높음

**개선 필요**:
- ⚠️ Supabase 클라이언트 최적화
- ⚠️ API 호출 로직 분리
- ⚠️ 타입 정의 중앙화

---

## 다음 단계

1. ✅ **FE Engineer가 개선 제안 반영**
2. ✅ **QA가 사용자 관점에서 검수**
3. ✅ **PM이 기능 요구사항 검증**

---

**작업 완료**: TPM이 코드 리뷰 및 기술 검수 완료  
**결과**: ✅ 전반적으로 우수한 품질, 일부 개선 제안  
**다음 작업**: QA가 사용자 관점에서 검수 시작

