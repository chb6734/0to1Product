# ⚙️ 기술 스택 선정 및 근거

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**기반**: PRD v2 분석 (conversations/phase2_tpm/tpm_analysis_1.md)

---

## 기술 스택 선정 프로세스

PRD의 기술 요구사항을 분석하고, 각 기술 스택 옵션을 비교하여 최종 선정했습니다.

### 선정 기준

1. **확장성**: 10배 성장을 고려한 선택
2. **팀 역량**: 풀스택 개발자 1명이 구현 가능
3. **비용 효율성**: 초기 비용 최소화
4. **생태계 성숙도**: 검증된 기술, 풍부한 문서
5. **유지보수성**: 장기적 유지보수 가능

---

## Frontend 기술 스택

### Framework: Next.js 14 (App Router)

#### 선정 근거

**장점**:
- ✅ **서버 컴포넌트**: 성능 최적화, SEO 친화적
- ✅ **자동 코드 스플리팅**: 초기 로딩 시간 단축
- ✅ **API Routes**: 백엔드 API와 통합 용이
- ✅ **Vercel 배포**: 원클릭 배포, 자동 스케일링
- ✅ **TypeScript 지원**: 타입 안정성
- ✅ **검증된 생태계**: 대규모 커뮤니티, 풍부한 문서

**트레이드오프**:
- ⚠️ 학습 곡선: React Server Components 개념 이해 필요
- ⚠️ 복잡도: App Router는 Pages Router보다 복잡

**대안 비교**:
- **Remix**: 좋은 선택이지만 생태계가 작음
- **SvelteKit**: 빠르지만 TypeScript 지원이 약함
- **Astro**: 정적 사이트에 최적화되어 있으나 동적 기능 부족

**결론**: ✅ **Next.js 14 선정** - 확장성, 생태계, 배포 편의성 모두 우수

---

### Language: TypeScript

#### 선정 근거

**장점**:
- ✅ **타입 안정성**: 런타임 에러 감소
- ✅ **개발 생산성**: IDE 자동완성, 리팩토링 용이
- ✅ **팀 협업**: 코드 가독성 향상
- ✅ **유지보수성**: 6개월 후에도 코드 이해 가능

**트레이드오프**:
- ⚠️ 초기 설정 시간: 타입 정의 필요
- ⚠️ 컴파일 시간: 개발 속도 약간 저하

**결론**: ✅ **TypeScript 선정** - 장기적 유지보수성 우선

---

### Styling: Tailwind CSS

#### 선정 근거

**장점**:
- ✅ **빠른 개발**: 유틸리티 클래스로 빠른 스타일링
- ✅ **번들 크기 최적화**: 사용한 클래스만 포함
- ✅ **일관성**: 디자인 시스템 구축 용이
- ✅ **반응형**: 모바일 우선 설계 용이

**트레이드오프**:
- ⚠️ 학습 곡선: 유틸리티 클래스 패턴 이해 필요
- ⚠️ HTML 가독성: 클래스명이 길어질 수 있음

**대안 비교**:
- **CSS Modules**: 스타일 격리 좋지만 개발 속도 느림
- **Styled Components**: 런타임 오버헤드
- **Emotion**: 번들 크기 증가

**결론**: ✅ **Tailwind CSS 선정** - 개발 속도와 일관성 우선

---

### UI Components: shadcn/ui

#### 선정 근거

**장점**:
- ✅ **커스터마이징 가능**: 코드를 복사하여 수정 가능
- ✅ **접근성**: 기본적으로 접근성 고려
- ✅ **Tailwind 기반**: Tailwind와 완벽 통합
- ✅ **TypeScript**: 타입 안정성
- ✅ **Radix UI 기반**: 접근성 우수

**트레이드오프**:
- ⚠️ 초기 설정: 컴포넌트를 프로젝트로 복사 필요
- ⚠️ 유지보수: 업데이트 시 수동 병합 필요

**대안 비교**:
- **Tailwind UI**: 유료, 커스터마이징 제한
- **MUI**: 번들 크기 큼, 디자인 커스터마이징 어려움
- **Chakra UI**: 좋지만 Tailwind와 통합 어려움

**결론**: ✅ **shadcn/ui 선정** - 커스터마이징과 접근성 우수

---

### State Management: Zustand

#### 선정 근거

**장점**:
- ✅ **가벼움**: 번들 크기 작음 (~1KB)
- ✅ **간단함**: 보일러플레이트 최소화
- ✅ **TypeScript 지원**: 타입 안정성
- ✅ **성능**: 불필요한 리렌더링 방지
- ✅ **학습 곡선 낮음**: 직관적인 API

**트레이드오프**:
- ⚠️ 생태계: Redux보다 작음
- ⚠️ 복잡한 상태: 매우 복잡한 상태 관리에는 부족할 수 있음

**대안 비교**:
- **Redux Toolkit**: 좋지만 보일러플레이트 많음
- **Jotai**: 좋지만 생태계 작음
- **React Context**: 간단하지만 성능 이슈 가능

**결론**: ✅ **Zustand 선정** - MVP에는 충분하며 확장 가능

---

### Form Handling: React Hook Form

#### 선정 근거

**장점**:
- ✅ **성능**: 불필요한 리렌더링 최소화
- ✅ **간단함**: 보일러플레이트 최소화
- ✅ **검증**: Zod와 통합 용이
- ✅ **TypeScript 지원**: 타입 안정성

**트레이드오프**:
- ⚠️ 학습 곡선: useForm 훅 패턴 이해 필요

**결론**: ✅ **React Hook Form 선정** - 성능과 개발 속도 우수

---

## Backend 기술 스택

### Database & Backend: Supabase

#### 선정 근거

**장점**:
- ✅ **PostgreSQL**: 강력한 관계형 데이터베이스
- ✅ **실시간 기능**: 편지 생성 중 자동 저장 가능
- ✅ **인증**: 소셜 로그인 내장
- ✅ **Storage**: 프로필 이미지 저장
- ✅ **Row Level Security**: 보안 정책 내장
- ✅ **무료 플랜**: 초기 비용 없음
- ✅ **자동 스케일링**: 사용자 증가 시 자동 확장

**트레이드오프**:
- ⚠️ 벤더 종속성: Supabase에 종속됨
- ⚠️ 제한사항: 무료 플랜에는 제한 있음 (하지만 MVP에는 충분)

**대안 비교**:
- **Firebase**: 좋지만 NoSQL, 쿼리 제한
- **AWS Amplify**: 복잡도 높음, 학습 곡선 높음
- **PlanetScale**: 좋지만 인증/스토리지 별도 필요

**결론**: ✅ **Supabase 선정** - MVP에 최적, 확장 가능

---

### API: Next.js API Routes

#### 선정 근거

**장점**:
- ✅ **통합**: 프론트엔드와 같은 프로젝트
- ✅ **서버리스**: Vercel에서 자동 스케일링
- ✅ **간단함**: Express 설정 불필요
- ✅ **타입 안정성**: TypeScript 지원

**트레이드오프**:
- ⚠️ 복잡한 로직: 매우 복잡한 API에는 부족할 수 있음
- ⚠️ Cold Start: 서버리스 함수의 콜드 스타트

**결론**: ✅ **Next.js API Routes 선정** - MVP에 충분하며 간단함

---

## External APIs

### Spotify: Spotify Web API

#### 선정 근거

**장점**:
- ✅ **완전 공개**: API 문서 완벽
- ✅ **OAuth 2.0**: 사용자별 인증 가능
- ✅ **플레이리스트 생성**: 직접 지원
- ✅ **무료**: 기본 할당량 충분

**구현 전략**:
- 사용자별 OAuth 토큰 획득
- 사용자 토큰으로 플레이리스트 생성
- 할당량 문제 해결

**결론**: ✅ **Spotify Web API 선정**

---

### YouTube Music: YouTube Data API v3

#### 선정 근거

**장점**:
- ✅ **공개 API**: 문서 완벽
- ✅ **OAuth 2.0**: 사용자별 인증 가능
- ✅ **검색 기능**: 곡 검색 지원

**주의사항**:
- ⚠️ 할당량: 일일 할당량 제한 (10,000 units/day)
- ⚠️ 플레이리스트 생성: 직접 지원하지 않음 (대안 필요)

**구현 전략**:
- 곡 검색은 YouTube Data API 사용
- 플레이리스트 생성은 YouTube Music 앱 딥링크 활용
- 또는 사용자 수동 저장 유도

**결론**: ✅ **YouTube Data API v3 선정** (제한적 사용)

---

### Apple Music: MusicKit JS

#### 선정 근거

**장점**:
- ✅ **공식 SDK**: Apple 공식 지원
- ✅ **플레이리스트 생성**: 직접 지원
- ✅ **무료**: 개발자 계정만 필요

**주의사항**:
- ⚠️ 플랫폼 제한: iOS/Safari에서만 작동
- ⚠️ 사용자 인증: Apple ID 로그인 필요

**구현 전략**:
- iOS/Safari에서만 Apple Music 연동 제공
- 다른 플랫폼에서는 안내 메시지

**결론**: ✅ **MusicKit JS 선정** (플랫폼 제한 있음)

---

### 멜론: 대안 전략

#### 문제
- 공식 API 부재
- 비공식 API는 법적 리스크

#### 대안 전략

**전략 1: 사용자 수동 입력 (MVP)**
- 곡 제목/아티스트명 입력
- 자동 매칭 시도 (다른 플랫폼에서)
- 매칭 실패 시 사용자에게 알림

**전략 2: 웹 스크래핑 (법적 검토 필요)**
- 멜론 웹사이트에서 곡 정보 추출
- 법적 리스크 존재
- Phase 2에서 검토

**전략 3: 파트너십 (장기)**
- 멜론과의 공식 파트너십 추진
- Phase 2 이후 검토

**결론**: ✅ **전략 1 (사용자 수동 입력)로 시작**

---

## 배포 및 인프라

### Hosting: Vercel

#### 선정 근거

**장점**:
- ✅ **Next.js 최적화**: Next.js 개발사가 만듦
- ✅ **자동 배포**: Git 푸시 시 자동 배포
- ✅ **CDN**: 전 세계 엣지 네트워크
- ✅ **무료 플랜**: 초기 비용 없음
- ✅ **서버리스**: 자동 스케일링
- ✅ **프리뷰 배포**: PR별 프리뷰 환경

**트레이드오프**:
- ⚠️ 벤더 종속성: Vercel에 종속됨
- ⚠️ 제한사항: 무료 플랜에는 제한 있음

**결론**: ✅ **Vercel 선정** - Next.js와 완벽 통합

---

### Monitoring: Vercel Analytics + Supabase Dashboard

#### 선정 근거

**장점**:
- ✅ **통합**: Vercel과 Supabase에 내장
- ✅ **무료**: 기본 모니터링 무료
- ✅ **실시간**: 실시간 메트릭 확인

**추가 고려사항**:
- Phase 2에서 Sentry 추가 고려 (에러 추적)

**결론**: ✅ **Vercel Analytics + Supabase Dashboard 선정**

---

## 기술 스택 요약

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes

### External APIs
- **Spotify**: Spotify Web API
- **YouTube Music**: YouTube Data API v3
- **Apple Music**: MusicKit JS
- **멜론**: 사용자 수동 입력 (MVP)

### 배포 및 인프라
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Supabase Dashboard

---

## 확장성 평가

### 10배 성장 시나리오 (1,000명 → 10,000명)

#### Frontend
- ✅ **Next.js**: 서버리스로 자동 스케일링
- ✅ **Vercel**: CDN으로 전 세계 배포
- ✅ **코드 스플리팅**: 번들 크기 최적화

#### Backend
- ✅ **Supabase**: 자동 스케일링
- ✅ **PostgreSQL**: 인덱싱으로 성능 유지
- ✅ **캐싱**: API 호출 최적화

#### External APIs
- ⚠️ **할당량 관리**: 사용자별 키 전략 필요
- ⚠️ **캐싱**: 검색 결과 캐싱 필수

**결론**: ✅ **10배 성장 가능** - API 할당량 관리만 주의하면 됨

---

## 비용 분석

### 초기 비용 (MVP)
- Vercel: 무료 (Hobby 플랜)
- Supabase: 무료 (Free 플랜)
- Spotify API: 무료
- YouTube API: 무료
- Apple Music: 무료
- **총: $0/월**

### 6개월 후 (사용자 10,000명)
- Vercel: $20/월 (Pro 플랜)
- Supabase: $25/월 (Pro 플랜)
- Spotify API: 무료 (사용자별 키)
- YouTube API: 무료 (할당량 내)
- Apple Music: 무료
- **총: $45/월 (약 60,000원)**

**결론**: ✅ **비용 효율적** - 초기 비용 없음, 확장 시에도 저렴

---

## 팀 역량 평가

### 개발자 1명이 구현 가능한가?

**가능한 이유**:
- ✅ 모든 기술 스택이 검증되고 문서화됨
- ✅ 풀스택 프레임워크 (Next.js)
- ✅ 백엔드 인프라 관리 불필요 (Supabase)
- ✅ 배포 자동화 (Vercel)

**주의사항**:
- ⚠️ 음악 API 통합: 복잡도 중간
- ⚠️ 멜론 대응: 추가 전략 필요

**결론**: ✅ **구현 가능** - 1개월 내 MVP 완성 가능

---

## 최종 결정

### 기술 스택 최종 선정

**Frontend Stack**:
```
Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── Zustand
└── React Hook Form
```

**Backend Stack**:
```
Supabase
├── PostgreSQL
├── Supabase Auth
├── Supabase Storage
└── Next.js API Routes
```

**External APIs**:
```
Spotify Web API (OAuth 2.0)
YouTube Data API v3 (OAuth 2.0)
Apple MusicKit JS
멜론 (사용자 수동 입력)
```

**Infrastructure**:
```
Vercel (Hosting + CDN)
Vercel Analytics (Monitoring)
Supabase Dashboard (Database Monitoring)
```

---

## 다음 단계

이 기술 스택을 바탕으로 다음을 수행하겠습니다:

1. 시스템 아키텍처 설계
2. 기능별 기술 명세 작성
3. 사용자 플로우의 기술적 구현 방안 제시
4. 개발 표준 및 접근 방식 수립

---

**Alex TPM**  
"이 기술 스택은 확장 가능하고, 비용 효율적이며, 팀이 구현할 수 있는 최적의 선택입니다. 다음 단계로 아키텍처를 설계하겠습니다."

