# ⚙️ 구현 표준 및 개발 접근 방식

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**기반**: 사용자 플로우 기술 구현 (tech/user_flows_tech.md)

---

## 코딩 컨벤션

### TypeScript 컨벤션

**타입 정의**:
```typescript
// 타입은 PascalCase
interface User {
  id: string
  email: string
  nickname: string
}

// 유니온 타입은 명확하게
type Platform = 'spotify' | 'youtube' | 'apple' | 'melon'

// 제네릭은 명확한 이름 사용
function fetchData<T extends Record<string, unknown>>(
  url: string
): Promise<T>
```

**함수 정의**:
```typescript
// 화살표 함수 사용 (일관성)
const fetchUser = async (id: string): Promise<User> => {
  // ...
}

// 명확한 매개변수 타입
function updateLetter(
  id: string,
  data: Partial<Letter>
): Promise<Letter>
```

**에러 처리**:
```typescript
// 커스텀 에러 클래스
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// 에러는 항상 throw
if (!user) {
  throw new APIError('User not found', 404, 'USER_NOT_FOUND')
}
```

---

### React 컨벤션

**컴포넌트 구조**:
```typescript
// 컴포넌트는 PascalCase
export function LetterCard({ letter }: { letter: Letter }) {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false)
  
  // 2. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 3. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 4. Render
  return (
    <div>
      {/* ... */}
    </div>
  )
}
```

**Props 타입**:
```typescript
// Props는 interface로 정의
interface LetterCardProps {
  letter: Letter
  onDelete?: (id: string) => void
  className?: string
}

export function LetterCard({ letter, onDelete, className }: LetterCardProps) {
  // ...
}
```

**커스텀 훅**:
```typescript
// 커스텀 훅은 use로 시작
export function useLetter(id: string) {
  const [letter, setLetter] = useState<Letter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // ...
  }, [id])
  
  return { letter, isLoading }
}
```

---

### 파일 구조 컨벤션

**디렉토리 구조**:
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 라우트 그룹
│   ├── api/               # API Routes
│   └── [dynamic]/         # 동적 라우트
│
├── components/             # 재사용 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── letter/            # 도메인별 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
│
├── lib/                    # 유틸리티 및 설정
│   ├── supabase/          # Supabase 클라이언트
│   ├── api/               # 외부 API 클라이언트
│   └── utils/             # 유틸리티 함수
│
├── hooks/                  # Custom Hooks
├── stores/                 # Zustand 스토어
└── types/                  # TypeScript 타입 정의
```

**파일 명명**:
- 컴포넌트: `PascalCase.tsx` (예: `LetterCard.tsx`)
- 유틸리티: `camelCase.ts` (예: `formatDate.ts`)
- 훅: `camelCase.ts` (예: `useLetter.ts`)
- 타입: `camelCase.ts` (예: `letter.ts`)

---

## 테스트 전략

### 테스트 피라미드

```
        /\
       /  \      E2E Tests (최소)
      /____\
     /      \    Integration Tests (중간)
    /________\
   /          \  Unit Tests (많음)
  /____________\
```

### Unit Tests

**테스트 대상**:
- 유틸리티 함수
- 커스텀 훅
- 비즈니스 로직

**예시**:
```typescript
// lib/utils/trackMatching.test.ts
import { matchTrack } from './trackMatching'

describe('matchTrack', () => {
  it('should match exact track', () => {
    const target = { title: 'Song', artist: 'Artist' }
    const tracks = [
      { title: 'Song', artist: 'Artist', platform: 'spotify' }
    ]
    
    const result = matchTrack(target, tracks)
    
    expect(result).toEqual(tracks[0])
  })
})
```

### Integration Tests

**테스트 대상**:
- API Routes
- 데이터베이스 쿼리
- 외부 API 통합

**예시**:
```typescript
// app/api/music/search/route.test.ts
import { GET } from './route'

describe('GET /api/music/search', () => {
  it('should return search results', async () => {
    const request = new Request('http://localhost/api/music/search?q=song')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.tracks).toBeDefined()
  })
})
```

### E2E Tests (Phase 2)

**테스트 대상**:
- 주요 사용자 플로우
- 크로스 브라우저 테스트

**도구**: Playwright

---

## 코드 리뷰 프로세스

### 리뷰 체크리스트

**기능성**:
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스를 처리하는가?
- [ ] 에러 처리가 적절한가?

**코드 품질**:
- [ ] 타입 안정성이 보장되는가?
- [ ] 함수가 단일 책임을 가지는가?
- [ ] 변수명이 명확한가?

**성능**:
- [ ] 불필요한 리렌더링이 없는가?
- [ ] 쿼리가 최적화되었는가?
- [ ] 이미지가 최적화되었는가?

**보안**:
- [ ] SQL Injection 방지되었는가?
- [ ] XSS 방지되었는가?
- [ ] 인증/인가가 적절한가?

**접근성**:
- [ ] 키보드 네비게이션이 가능한가?
- [ ] 스크린 리더를 지원하는가?
- [ ] 색상 대비가 충분한가?

---

## Git 워크플로우

### 브랜치 전략

**main**: 프로덕션 배포
**develop**: 개발 통합
**feature/**: 기능 개발
**fix/**: 버그 수정
**hotfix/**: 긴급 수정

### 커밋 메시지 컨벤션

```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드 설정 등

**예시**:
```
feat(letter): 편지 생성 기능 추가

- 곡 검색 및 추가 기능
- 메시지 작성 기능
- 자동 저장 기능

Closes #123
```

---

## 배포 프로세스

### 개발 환경

**로컬 개발**:
```bash
# 환경 변수 설정
cp .env.example .env.local

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**프리뷰 배포**:
- PR 생성 시 자동 배포
- Vercel Preview URL 생성
- 자동 테스트 실행

### 프로덕션 배포

**배포 단계**:
1. `main` 브랜치에 머지
2. Vercel 자동 배포 시작
3. 빌드 및 테스트 실행
4. 배포 완료 알림

**롤백 전략**:
- Vercel 이전 배포로 롤백
- 데이터베이스 마이그레이션 롤백 (필요 시)

---

## 모니터링 전략

### 성능 모니터링

**메트릭**:
- 페이지 로딩 시간
- API 응답 시간
- 에러율
- 사용자 활성도

**도구**:
- Vercel Analytics
- Supabase Dashboard
- Custom Metrics (Phase 2)

### 에러 모니터링

**로깅**:
- 서버 에러: Vercel Logs
- 클라이언트 에러: Console (Phase 2: Sentry)
- 사용자 피드백: 피드백 폼

**알림**:
- 에러 발생 시 Slack 알림 (Phase 2)
- 일일 에러 리포트 (Phase 2)

---

## 보안 표준

### 인증 및 인가

**인증**:
- JWT 토큰 사용
- 토큰 만료 시간: 1시간
- 리프레시 토큰: 7일

**인가**:
- Row Level Security (RLS) 사용
- API Route에서 사용자 검증
- 공개 리소스는 토큰 기반 접근

### 데이터 보안

**암호화**:
- 전송 중: HTTPS (TLS 1.3)
- 저장 중: Supabase 자동 암호화
- 민감 정보: 환경 변수로 관리

**입력 검증**:
- 클라이언트: React Hook Form
- 서버: Zod 스키마 검증
- SQL Injection: Supabase 자동 방지

---

## 성능 최적화 가이드라인

### Frontend 최적화

**코드 스플리팅**:
- 라우트별 자동 스플리팅
- 동적 임포트 사용
- 큰 라이브러리는 지연 로딩

**이미지 최적화**:
- Next.js Image 컴포넌트 사용
- WebP 포맷 사용
- 적절한 크기로 리사이징

**캐싱**:
- 정적 자산: CDN 캐싱
- API 응답: Edge Cache
- 검색 결과: 클라이언트 캐싱

### Backend 최적화

**데이터베이스**:
- 인덱싱 전략 준수
- 쿼리 최적화 (JOIN, 페이지네이션)
- 연결 풀링 활용

**API**:
- 배치 요청 사용
- 병렬 요청 활용
- 에러 핸들링 최적화

---

## 문서화 표준

### 코드 문서화

**함수 주석**:
```typescript
/**
 * 편지를 생성하고 저장합니다.
 * 
 * @param tracks - 편지에 포함될 곡 목록
 * @param message - 편지 메시지
 * @param recipientEmail - 수신자 이메일 (선택)
 * @returns 생성된 편지 정보
 * @throws {APIError} 저장 실패 시
 */
export async function createLetter(
  tracks: Track[],
  message: string,
  recipientEmail?: string
): Promise<Letter> {
  // ...
}
```

**컴포넌트 문서화**:
```typescript
/**
 * 편지 카드 컴포넌트
 * 
 * @example
 * ```tsx
 * <LetterCard 
 *   letter={letter} 
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function LetterCard({ letter, onDelete }: LetterCardProps) {
  // ...
}
```

### README 작성

**필수 섹션**:
- 프로젝트 개요
- 설치 및 실행 방법
- 환경 변수 설정
- 주요 기능 설명
- 기술 스택

---

## 개발 도구

### 필수 도구

**코드 포맷팅**:
- Prettier
- ESLint

**타입 체크**:
- TypeScript
- 타입 체크는 빌드 전 필수

**Git Hooks**:
- Husky
- lint-staged

### 설정 파일

**.prettierrc**:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**.eslintrc.json**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

---

## 다음 단계

이 개발 표준을 바탕으로 개발을 시작할 수 있습니다.

**체크리스트**:
- [ ] 프로젝트 초기 설정
- [ ] 환경 변수 설정
- [ ] 데이터베이스 스키마 생성
- [ ] 기본 컴포넌트 구조 생성
- [ ] 개발 서버 실행

---

**Alex TPM**  
"개발 표준과 접근 방식을 수립했습니다. 이제 개발을 시작할 준비가 되었습니다. 모든 표준을 준수하여 확장 가능하고 유지보수 가능한 코드를 작성하세요."

