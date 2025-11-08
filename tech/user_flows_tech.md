# ⚙️ 사용자 플로우의 기술적 구현

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**기반**: 기능별 기술 명세 (tech/feature_specs.md), PRD v2

---

## 주요 사용자 플로우 기술 구현

### 플로우 1: 사용자 가입 및 온보딩

#### 기술적 구현

**상태 관리**:
```typescript
// stores/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading })
}))
```

**플로우 구현**:
```
1. 로그인 페이지 (/login)
   → 소셜 로그인 버튼 클릭
   → Supabase Auth signInWithOAuth()
   → 로딩 상태: 스켈레톤 UI
   
2. OAuth 콜백 (/auth/callback)
   → 코드 교환
   → JWT 토큰 저장
   → 사용자 정보 조회
   → 온보딩 여부 확인
   
3. 온보딩 페이지 (/onboarding)
   → 닉네임 입력 (필수)
   → 프로필 이미지 업로드 (선택)
   → React Hook Form으로 폼 관리
   → 유효성 검사
   
4. 메인 페이지 (/)
   → 사용자 정보 로드
   → 편지 목록 로드
```

**에러 핸들링**:
- 네트워크 오류: 재시도 버튼 제공
- 인증 오류: 명확한 에러 메시지
- 유효성 검사: 실시간 피드백

**로딩 상태**:
- 스켈레톤 UI로 로딩 표시
- 최소 200ms 표시 (깜빡임 방지)

---

### 플로우 2: 편지 생성

#### 기술적 구현

**상태 관리**:
```typescript
// stores/letterStore.ts
import { create } from 'zustand'

interface LetterState {
  tracks: Track[]
  message: string
  recipientEmail: string
  isSaving: boolean
  addTrack: (track: Track) => void
  removeTrack: (index: number) => void
  reorderTracks: (fromIndex: number, toIndex: number) => void
  setMessage: (message: string) => void
  setRecipientEmail: (email: string) => void
  saveLetter: () => Promise<void>
}

export const useLetterStore = create<LetterState>((set, get) => ({
  tracks: [],
  message: '',
  recipientEmail: '',
  isSaving: false,
  
  addTrack: (track) => {
    set({ tracks: [...get().tracks, track] })
    get().autoSave()
  },
  
  removeTrack: (index) => {
    set({ tracks: get().tracks.filter((_, i) => i !== index) })
    get().autoSave()
  },
  
  reorderTracks: (fromIndex, toIndex) => {
    const tracks = [...get().tracks]
    const [removed] = tracks.splice(fromIndex, 1)
    tracks.splice(toIndex, 0, removed)
    set({ tracks })
    get().autoSave()
  },
  
  autoSave: debounce(async () => {
    // 자동 저장 로직
  }, 1000),
  
  saveLetter: async () => {
    set({ isSaving: true })
    try {
      // 편지 저장 API 호출
    } finally {
      set({ isSaving: false })
    }
  }
}))
```

**플로우 구현**:
```
1. 편지 생성 페이지 (/create)
   → 빈 상태: "곡을 검색해 추가하세요" 안내
   → 검색 바: debounce 300ms
   
2. 곡 검색
   → API 호출: /api/music/search?q={query}
   → 로딩: 스켈레톤 UI
   → 결과 표시: 카드 형태
   → 클릭 시 추가: 애니메이션 효과
   
3. 플레이리스트 편집
   → 곡 목록: 드래그 앤 드롭 (react-beautiful-dnd)
   → 곡 삭제: 스와이프 제스처 (모바일)
   → 곡 메모: 인라인 편집
   → 자동 저장: debounce 1초
   
4. 메시지 작성
   → 텍스트 입력: React Hook Form
   → AI 생성: 버튼 클릭 시 API 호출
   → 미리보기: 실시간 업데이트
   
5. 편지 완성
   → 유효성 검사: 최소 1곡, 메시지 필수
   → 저장: API 호출
   → 성공: 공유 링크 표시
   → 에러: 재시도 버튼
```

**에러 핸들링**:
- 검색 실패: "다시 시도해주세요" 메시지
- 저장 실패: 자동 재시도 (최대 3회)
- 네트워크 오류: 오프라인 모드 (로컬 스토리지)

**로딩 상태**:
- 검색: 스켈레톤 UI
- 저장: 버튼에 로딩 스피너
- 자동 저장: 토스트 알림

---

### 플로우 3: 편지 열람 및 플레이리스트 저장

#### 기술적 구현

**플로우 구현**:
```
1. 편지 링크 클릭 (/letter/[token])
   → 공개 페이지: 인증 불필요
   → 편지 정보 로드: Server Component
   → 조회 기록 저장: 백그라운드
   
2. 편지 표시
   → 카드 형태: 반응형 레이아웃
   → 곡 목록: 플레이리스트 형태
   → 메타데이터: 보낸 사람, 날짜
   
3. 플레이리스트 저장
   → "내 플랫폼에 저장" 버튼 클릭
   → 플랫폼 선택 모달
   → 연동 여부 확인
   → 미연동 시: OAuth 플로우 시작
   → 연동 완료: 플레이리스트 저장
   
4. 저장 완료
   → 성공 메시지: 토스트 알림
   → 플랫폼 링크: 새 탭에서 열기
   → 에러: 재시도 버튼
```

**에러 핸들링**:
- 편지 없음: 404 페이지
- 저장 실패: 명확한 에러 메시지
- 매칭 실패: 대안 곡 제시

**로딩 상태**:
- 편지 로드: 스켈레톤 UI
- 저장 중: 버튼에 로딩 스피너
- 매칭 중: 진행 표시기

---

### 플로우 4: 편지 보관함

#### 기술적 구현

**플로우 구현**:
```
1. 보관함 페이지 (/inbox, /sent)
   → 페이지네이션: 20개씩
   → 무한 스크롤: Intersection Observer
   → 필터: 날짜, 검색어
   
2. 편지 목록
   → 카드 형태: 그리드 레이아웃
   → 미리보기: 메시지 일부, 곡 수
   → 클릭: 편지 상세 페이지
   
3. 검색
   → 실시간 검색: debounce 300ms
   → 하이라이트: 검색어 강조
   → 결과 없음: "검색 결과가 없습니다"
```

**성능 최적화**:
- 가상화: react-window (많은 항목)
- 이미지 지연 로딩: Intersection Observer
- 캐싱: 편지 목록 5분 TTL

---

## 상태 관리 전략

### 전역 상태 (Zustand)
- 사용자 인증 정보
- 편지 생성 상태
- 플랫폼 연동 상태

### 서버 상태 (React Query - Phase 2 고려)
- 편지 목록
- 검색 결과
- 사용자 프로필

### 로컬 상태 (useState)
- 폼 입력
- UI 상태 (모달 열림/닫힘)
- 임시 데이터

---

## 에러 핸들링 전략

### 클라이언트 에러
```typescript
// lib/utils/errorHandler.ts
export function handleError(error: Error) {
  if (error instanceof NetworkError) {
    // 네트워크 오류: 재시도 버튼
    return { type: 'network', message: '네트워크 오류가 발생했습니다.' }
  }
  
  if (error instanceof APIError) {
    // API 오류: 명확한 메시지
    return { type: 'api', message: error.message }
  }
  
  // 기타 오류: 일반 메시지
  return { type: 'unknown', message: '오류가 발생했습니다.' }
}
```

### 서버 에러
- 로깅: Vercel Logs
- 알림: 에러 발생 시 알림
- 재시도: Exponential backoff

---

## 로딩 상태 전략

### 스켈레톤 UI
- 페이지 로드: 전체 스켈레톤
- 리스트 로드: 아이템별 스켈레톤
- 이미지 로드: 이미지 스켈레톤

### 로딩 스피너
- 버튼 액션: 버튼 내부 스피너
- 전체 로드: 전체 화면 스피너
- 인라인 로드: 인라인 스피너

### 최소 표시 시간
- 최소 200ms: 깜빡임 방지
- 최대 5초: 타임아웃 처리

---

## 다음 단계

이 사용자 플로우 구현 방안을 바탕으로 다음을 수행하겠습니다:

1. 개발 표준 및 접근 방식 수립

---

**Alex TPM**  
"각 사용자 플로우의 기술적 구현 방안을 상세히 설계했습니다. 다음 단계로 개발 표준을 수립하겠습니다."

