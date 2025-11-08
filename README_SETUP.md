# 🚀 FAN:STAGE 프로젝트 실행 가이드

## 빠른 시작

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정
\`\`\`bash
# .env.local 파일 생성
cp .env.local.example .env.local
\`\`\`

`.env.local` 파일을 열어서 Supabase 설정을 입력하세요:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 3. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## Supabase 설정 방법

1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. Settings > API에서 URL과 anon key 복사
4. `.env.local`에 붙여넣기

---

## 문제 해결

- **포트 충돌**: `PORT=3001 npm run dev`
- **환경 변수 오류**: `.env.local` 파일 확인
- **의존성 오류**: `rm -rf node_modules && npm install`

자세한 내용은 `SETUP.md` 참고
