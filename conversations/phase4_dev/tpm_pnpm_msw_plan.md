# TPM: pnpm 전환 및 MSW 기반 Mock 시스템 구축 계획

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**작업 내용**: npm → pnpm 전환 및 BE 없이 동작하는 Mock 시스템 구축

---

## 작업 목표

1. **npm → pnpm 전환**
   - package.json 업데이트
   - pnpm-workspace.yaml 생성 (필요시)
   - .npmrc 설정

2. **MSW 기반 Mock 시스템 구축**
   - MSW 브라우저 설정
   - MSW Node 설정 (테스트용)
   - Mock API 핸들러 작성
   - Mock 데이터 생성

3. **FE만으로 모든 플로우 실행 가능**
   - 실제 API 호출 없이 동작
   - Mock 데이터로 모든 시나리오 테스트 가능

4. **테스트 환경 개선**
   - 테스트에서도 MSW 사용
   - 실제 API 없이 테스트 실행 가능

---

## 기술 스택 업데이트

### 패키지 매니저: pnpm

**선정 근거**:
- ✅ **디스크 공간 절약**: 심볼릭 링크로 중복 제거
- ✅ **빠른 설치**: 병렬 설치 및 캐싱
- ✅ **엄격한 의존성 관리**: phantom dependencies 방지
- ✅ **모노레포 지원**: workspace 기능 우수

---

## MSW 설정 계획

### 1. MSW 설치
```bash
pnpm add -D msw
```

### 2. 브라우저 설정
- `src/mocks/browser.ts` - 브라우저용 MSW 설정
- `public/mockServiceWorker.js` - Service Worker 파일

### 3. Node 설정 (테스트)
- `src/mocks/server.ts` - Node용 MSW 설정
- `vitest.config.ts`에 MSW 설정 통합

---

## Mock API 엔드포인트

### 인증 관련
- `POST /api/auth/login/google` - Google 로그인
- `POST /api/auth/login/kakao` - Kakao 로그인
- `POST /api/auth/login/apple` - Apple 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/user` - 사용자 정보 조회
- `PUT /api/auth/profile` - 프로필 수정

### 편지 관련
- `GET /api/letters` - 편지 목록 조회
- `POST /api/letters` - 편지 생성
- `GET /api/letters/:id` - 편지 상세 조회
- `DELETE /api/letters/:id` - 편지 삭제

### 곡 검색 관련
- `GET /api/music/search` - 곡 검색
- `GET /api/music/tracks/:id` - 곡 상세 정보

### 플랫폼 연동 관련
- `POST /api/platform/spotify/connect` - Spotify 연동
- `POST /api/platform/youtube/connect` - YouTube 연동
- `POST /api/platform/apple/connect` - Apple Music 연동
- `POST /api/platform/:platform/save` - 플레이리스트 저장

---

## Mock 데이터 구조

### 사용자 데이터
```typescript
interface MockUser {
  id: string
  email: string
  nickname: string
  profileImage?: string
  createdAt: string
}
```

### 편지 데이터
```typescript
interface MockLetter {
  id: string
  senderId: string
  recipientEmail?: string
  message: string
  tracks: MockTrack[]
  shareToken: string
  createdAt: string
}
```

### 곡 데이터
```typescript
interface MockTrack {
  id: string
  title: string
  artist: string
  albumCover: string
  platform: 'spotify' | 'youtube' | 'apple'
  platformTrackId: string
}
```

---

## 구현 단계

### Phase 1: pnpm 전환
1. package.json 업데이트
2. pnpm-lock.yaml 생성
3. .npmrc 설정

### Phase 2: MSW 설정
1. MSW 설치
2. 브라우저 설정
3. Node 설정

### Phase 3: Mock 데이터 생성
1. Mock 데이터 타입 정의
2. Mock 데이터 생성 함수 작성
3. 샘플 데이터 생성

### Phase 4: API 핸들러 작성
1. 인증 API 핸들러
2. 편지 API 핸들러
3. 곡 검색 API 핸들러
4. 플랫폼 연동 API 핸들러

### Phase 5: FE 코드 통합
1. MSW 초기화 코드 추가
2. API 호출 코드 수정 (필요시)
3. 환경 변수 설정

### Phase 6: 테스트 통합
1. 테스트에서 MSW 사용
2. Mock 데이터로 테스트 실행
3. 테스트 커버리지 확인

---

## 다음 단계

FE Engineer와 FE TEST와 협업하여 구현을 시작하겠습니다.

---

**작업 완료**: TPM이 pnpm 전환 및 MSW 기반 Mock 시스템 구축 계획 수립 완료  
**다음 작업**: FE Engineer가 pnpm 전환 및 MSW 설정 시작

