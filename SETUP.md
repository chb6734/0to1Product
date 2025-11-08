# 프로젝트 실행 가이드

## 필수 사전 준비

### 1. Node.js 설치 확인
```bash
node --version  # v18 이상 필요
npm --version   # v9 이상 권장
```

### 2. Supabase 프로젝트 생성 (필수)
1. [Supabase](https://supabase.com)에서 계정 생성
2. 새 프로젝트 생성
3. 프로젝트 설정에서 URL과 Anon Key 복사

---

## 설치 및 실행

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# .env.local 파일을 열어서 실제 Supabase 값으로 변경
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3단계: 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 추가 명령어

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 테스트 실행
```bash
npm test              # 테스트 실행
npm run test:ui       # UI 모드로 테스트 실행
npm run test:coverage # 커버리지 리포트 생성
```

### 린트 실행
```bash
npm run lint
```

---

## 문제 해결

### 포트 3000이 이미 사용 중인 경우
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

### 환경 변수 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (NEXT_PUBLIC_ 접두사 필수)

### 의존성 설치 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 다음 단계

프로젝트가 실행되면:
1. 기본 페이지가 표시됩니다
2. `src/app/page.tsx`를 수정하여 UI를 개발할 수 있습니다
3. `src/domains/` 폴더의 훅들을 사용하여 기능을 구현할 수 있습니다

