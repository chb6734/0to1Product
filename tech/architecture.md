# ⚙️ 시스템 아키텍처 설계

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**기반**: 기술 스택 선정 (tech/tech_stack.md), PRD v2

---

## 아키텍처 원칙

1. **서버리스 우선**: 인프라 관리 최소화, 자동 스케일링
2. **마이크로서비스 준비**: 향후 확장 가능한 구조
3. **API First**: 명확한 API 계약
4. **Fail Fast**: 빠른 실패와 복구
5. **Observability**: 모든 레이어에서 모니터링 가능

---

## 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Web App    │  │  Mobile Web  │  │  Share Link │ │
│  │  (Next.js)   │  │   (PWA)      │  │  (Public)   │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Edge Layer (Vercel)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   CDN        │  │  Edge Cache  │  │  Analytics  │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Application Layer (Vercel)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js 14 (App Router)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │  Pages   │  │  API     │  │  Server     │ │  │
│  │  │  Router  │  │  Routes  │  │  Components │ │  │
│  │  └──────────┘  └──────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │  Spotify API │  │ YouTube API │
│  (Backend)   │  │              │  │              │
│              │  │              │  │              │
│ ┌──────────┐ │  │              │  │              │
│ │PostgreSQL│ │  │              │  │              │
│ │Database  │ │  │              │  │              │
│ └──────────┘ │  │              │  │              │
│              │  │              │  │              │
│ ┌──────────┐ │  │              │  │              │
│ │   Auth   │ │  │              │  │              │
│ └──────────┘ │  │              │  │              │
│              │  │              │  │              │
│ ┌──────────┐ │  │              │  │              │
│ │ Storage  │ │  │              │  │              │
│ └──────────┘ │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ▼
┌──────────────┐
│ Apple Music  │
│  MusicKit JS │
└──────────────┘
```

---

## 컴포넌트 아키텍처

### Frontend 컴포넌트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트
│   │   ├── login/
│   │   └── callback/
│   ├── (main)/             # 메인 앱 라우트
│   │   ├── create/         # 편지 생성
│   │   ├── inbox/          # 받은 편지
│   │   └── sent/           # 보낸 편지
│   ├── letter/[id]/        # 편지 열람 (공개)
│   └── api/                # API Routes
│       ├── search/         # 곡 검색
│       ├── save/           # 플레이리스트 저장
│       └── webhook/        # 웹훅
│
├── components/             # 재사용 컴포넌트
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── letter/            # 편지 관련 컴포넌트
│   ├── music/             # 음악 관련 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
│
├── lib/                    # 유틸리티 및 설정
│   ├── supabase/          # Supabase 클라이언트
│   ├── api/               # 외부 API 클라이언트
│   │   ├── spotify.ts
│   │   ├── youtube.ts
│   │   └── apple.ts
│   ├── utils/             # 유틸리티 함수
│   └── constants/         # 상수
│
├── hooks/                  # Custom Hooks
│   ├── useAuth.ts
│   ├── useLetter.ts
│   └── useMusicSearch.ts
│
└── stores/                 # Zustand 스토어
    ├── authStore.ts
    ├── letterStore.ts
    └── musicStore.ts
```

---

## 데이터 모델 설계

### 데이터베이스 스키마

#### users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### letters 테이블
```sql
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_email TEXT,
  message TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL, -- 공개 링크용 토큰
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_letters_sender_id ON letters(sender_id);
CREATE INDEX idx_letters_share_token ON letters(share_token);
CREATE INDEX idx_letters_created_at ON letters(created_at DESC);
```

#### letter_tracks 테이블
```sql
CREATE TABLE letter_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  letter_id UUID REFERENCES letters(id) ON DELETE CASCADE,
  track_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_cover_url TEXT,
  platform TEXT NOT NULL, -- 'spotify', 'youtube', 'apple', 'melon'
  platform_track_id TEXT, -- 플랫폼별 트랙 ID
  memo TEXT, -- 곡별 메모
  order_index INTEGER NOT NULL, -- 플레이리스트 순서
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_letter_tracks_letter_id ON letter_tracks(letter_id);
CREATE INDEX idx_letter_tracks_order ON letter_tracks(letter_id, order_index);
```

#### user_platform_tokens 테이블
```sql
CREATE TABLE user_platform_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'spotify', 'youtube', 'apple'
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

CREATE INDEX idx_user_platform_tokens_user_id ON user_platform_tokens(user_id);
```

#### letter_views 테이블 (분석용)
```sql
CREATE TABLE letter_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  letter_id UUID REFERENCES letters(id) ON DELETE CASCADE,
  viewer_email TEXT, -- 로그인하지 않은 사용자도 추적
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_letter_views_letter_id ON letter_views(letter_id);
CREATE INDEX idx_letter_views_viewed_at ON letter_views(viewed_at DESC);
```

---

## API 설계

### RESTful API 엔드포인트

#### 인증 API
```
POST   /api/auth/login          # 소셜 로그인 시작
GET    /api/auth/callback        # 소셜 로그인 콜백
POST   /api/auth/logout          # 로그아웃
GET    /api/auth/me              # 현재 사용자 정보
```

#### 편지 API
```
POST   /api/letters              # 편지 생성
GET    /api/letters/:id          # 편지 조회 (인증 필요)
GET    /api/letters/public/:token # 공개 편지 조회 (인증 불필요)
GET    /api/letters/inbox        # 받은 편지 목록
GET    /api/letters/sent         # 보낸 편지 목록
PUT    /api/letters/:id          # 편지 수정
DELETE /api/letters/:id          # 편지 삭제
```

#### 음악 검색 API
```
GET    /api/music/search         # 곡 검색 (쿼리 파라미터: q, platform)
GET    /api/music/track/:id      # 트랙 상세 정보
```

#### 플랫폼 연동 API
```
POST   /api/platforms/connect    # 플랫폼 연동 시작
GET    /api/platforms/callback    # 플랫폼 연동 콜백
POST   /api/platforms/save       # 플레이리스트 저장
GET    /api/platforms/status     # 연동 상태 확인
```

---

## 보안 아키텍처

### 인증 및 인가

1. **소셜 로그인 (Supabase Auth)**
   - OAuth 2.0 플로우
   - JWT 토큰 기반 인증
   - 토큰 자동 갱신

2. **Row Level Security (RLS)**
   - Supabase RLS 정책으로 데이터 접근 제어
   - 사용자는 자신의 데이터만 접근 가능
   - 공개 편지는 토큰 기반 접근

3. **API 보안**
   - 환경 변수로 API 키 관리
   - Rate Limiting (Vercel Edge Config)
   - CORS 설정

### 데이터 보안

1. **암호화**
   - 전송 중: HTTPS (TLS 1.3)
   - 저장 중: Supabase 자동 암호화
   - 민감 정보: 환경 변수로 관리

2. **프라이버시**
   - 편지 링크: 랜덤 토큰 사용
   - 사용자 이메일: 해시화 고려 (Phase 2)

---

## 성능 최적화 전략

### Frontend 최적화

1. **코드 스플리팅**
   - 라우트별 코드 스플리팅 (자동)
   - 동적 임포트로 컴포넌트 지연 로딩
   - 이미지 최적화 (Next.js Image)

2. **캐싱 전략**
   - 정적 자산: CDN 캐싱 (1년)
   - API 응답: Edge Cache (5분)
   - 검색 결과: 클라이언트 캐싱 (5분)

3. **렌더링 최적화**
   - Server Components로 서버 렌더링
   - Client Components는 필요한 곳만
   - React.memo로 불필요한 리렌더링 방지

### Backend 최적화

1. **데이터베이스 최적화**
   - 인덱싱 전략 (위 스키마 참조)
   - 쿼리 최적화 (JOIN, 페이지네이션)
   - 연결 풀링 (Supabase 자동)

2. **API 최적화**
   - 배치 요청으로 API 호출 감소
   - 캐싱으로 중복 요청 방지
   - 병렬 요청으로 응답 시간 단축

---

## 모니터링 및 로깅

### 모니터링 전략

1. **성능 모니터링**
   - Vercel Analytics: 페이지 로딩 시간
   - Supabase Dashboard: 쿼리 성능
   - Custom Metrics: API 응답 시간

2. **에러 모니터링**
   - Vercel Logs: 서버 에러
   - Client-side: Sentry (Phase 2)
   - 사용자 피드백 폼

3. **비즈니스 메트릭**
   - 편지 생성 수
   - 플레이리스트 저장 성공률
   - 사용자 활성도

---

## 확장성 고려사항

### 수평 확장

- **Frontend**: Vercel 자동 스케일링
- **Backend**: Supabase 자동 스케일링
- **Database**: Supabase Read Replicas (필요 시)

### 수직 확장

- **Database**: 인덱싱으로 성능 유지
- **API**: 캐싱으로 부하 감소
- **CDN**: 전 세계 엣지 네트워크

### 10배 성장 시나리오

**현재 (1,000명)**:
- Vercel Hobby: 충분
- Supabase Free: 충분

**10배 성장 (10,000명)**:
- Vercel Pro: $20/월
- Supabase Pro: $25/월
- API 할당량 관리: 사용자별 키 전략

**결론**: ✅ **10배 성장 가능** - 비용 증가 최소화

---

## 다음 단계

이 아키텍처를 바탕으로 다음을 수행하겠습니다:

1. 기능별 기술 명세 작성
2. 사용자 플로우의 기술적 구현 방안 제시
3. 개발 표준 및 접근 방식 수립

---

**Alex TPM**  
"이 아키텍처는 확장 가능하고, 성능이 우수하며, 유지보수가 용이합니다. 다음 단계로 기능별 기술 명세를 작성하겠습니다."

