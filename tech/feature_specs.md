# ⚙️ 기능별 기술 명세

**작성자**: Alex TPM  
**작성 일시**: 2024년  
**기반**: 시스템 아키텍처 (tech/architecture.md), PRD v2

---

## P0: 핵심 기능 기술 명세

### 2.1 사용자 인증 및 프로필

#### 기술 구현

**인증 플로우**:
```
1. 사용자가 소셜 로그인 버튼 클릭
   → Supabase Auth의 signInWithOAuth() 호출
   
2. OAuth 제공자로 리다이렉트
   → Google/Kakao/Apple OAuth 페이지
   
3. 사용자 권한 승인
   → OAuth 제공자가 콜백 URL로 리다이렉트
   
4. Supabase가 JWT 토큰 발급
   → 클라이언트에 토큰 저장 (httpOnly cookie)
   
5. 사용자 프로필 생성/업데이트
   → users 테이블에 레코드 생성 또는 업데이트
```

**구현 세부사항**:

**Frontend** (`app/(auth)/login/page.tsx`):
```typescript
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  
  const handleLogin = async (provider: 'google' | 'kakao' | 'apple') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }
  
  // ...
}
```

**콜백 처리** (`app/(auth)/callback/route.ts`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  return NextResponse.redirect(new URL('/onboarding', request.url))
}
```

**프로필 설정** (`app/onboarding/page.tsx`):
```typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClient()
  
  const handleSubmit = async () => {
    // 1. 프로필 이미지 업로드 (선택)
    let imageUrl = null
    if (profileImage) {
      const { data } = await supabase.storage
        .from('profiles')
        .upload(`${user.id}/${profileImage.name}`, profileImage)
      imageUrl = data?.path
    }
    
    // 2. 사용자 프로필 업데이트
    const { error } = await supabase
      .from('users')
      .update({ nickname, profile_image_url: imageUrl })
      .eq('id', user.id)
    
    if (!error) {
      router.push('/')
    }
  }
  
  // ...
}
```

**성능 최적화**:
- 프로필 이미지: Next.js Image 컴포넌트로 최적화
- 로딩 상태: 스켈레톤 UI
- 에러 처리: 사용자 친화적 에러 메시지

---

### 2.2 음악 편지 생성

#### 기술 구현

**곡 검색 플로우**:
```
1. 사용자가 검색어 입력
   → debounce 300ms로 API 호출 최적화
   
2. API Route에서 여러 플랫폼 동시 검색
   → Promise.all()로 병렬 처리
   
3. 검색 결과 통합 및 정렬
   → 제목/아티스트 매칭 점수로 정렬
   
4. 클라이언트에 결과 반환
   → 캐싱 (5분 TTL)
```

**구현 세부사항**:

**검색 API** (`app/api/music/search/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { searchSpotify } from '@/lib/api/spotify'
import { searchYouTube } from '@/lib/api/youtube'
import { searchApple } from '@/lib/api/apple'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')
  const platform = searchParams.get('platform') // 'all' | 'spotify' | 'youtube' | 'apple'
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }
  
  // 병렬 검색
  const searches = []
  if (platform === 'all' || platform === 'spotify') {
    searches.push(searchSpotify(query))
  }
  if (platform === 'all' || platform === 'youtube') {
    searches.push(searchYouTube(query))
  }
  if (platform === 'all' || platform === 'apple') {
    searches.push(searchApple(query))
  }
  
  const results = await Promise.allSettled(searches)
  
  // 결과 통합
  const tracks = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => b.matchScore - a.matchScore) // 매칭 점수로 정렬
  
  return NextResponse.json({ tracks })
}
```

**편지 생성 플로우**:
```
1. 사용자가 곡 추가
   → 로컬 상태에 저장 (Zustand)
   
2. 실시간 자동 저장
   → debounce 1초로 Supabase에 저장
   → 충돌 처리: 마지막 저장 우선
   
3. 메시지 작성
   → React Hook Form으로 폼 관리
   → AI 메시지 생성 (선택적, OpenAI API)
   
4. 편지 완성
   → share_token 생성 (UUID)
   → letters 테이블에 저장
   → letter_tracks 테이블에 저장
```

**구현 세부사항**:

**편지 생성 Hook** (`hooks/useLetter.ts`):
```typescript
import { useState, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { createClient } from '@/lib/supabase/client'

export function useLetter() {
  const [letter, setLetter] = useState({
    tracks: [] as Track[],
    message: '',
    recipientEmail: ''
  })
  const supabase = createClient()
  
  // 자동 저장 (debounce 1초)
  const autoSave = useDebouncedCallback(async (letterData: typeof letter) => {
    if (!letterData.tracks.length) return
    
    const { error } = await supabase
      .from('letters')
      .upsert({
        id: letterId,
        sender_id: userId,
        message: letterData.message,
        updated_at: new Date().toISOString()
      })
    
    if (!error) {
      // 트랙 저장
      await supabase
        .from('letter_tracks')
        .upsert(
          letterData.tracks.map((track, index) => ({
            letter_id: letterId,
            track_title: track.title,
            artist_name: track.artist,
            platform: track.platform,
            order_index: index
          }))
        )
    }
  }, 1000)
  
  const addTrack = useCallback((track: Track) => {
    const newLetter = { ...letter, tracks: [...letter.tracks, track] }
    setLetter(newLetter)
    autoSave(newLetter)
  }, [letter, autoSave])
  
  const removeTrack = useCallback((index: number) => {
    const newLetter = {
      ...letter,
      tracks: letter.tracks.filter((_, i) => i !== index)
    }
    setLetter(newLetter)
    autoSave(newLetter)
  }, [letter, autoSave])
  
  return { letter, addTrack, removeTrack, setLetter }
}
```

**AI 메시지 생성** (`app/api/ai/message/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  const { template, context } = await request.json()
  
  const prompt = `다음 상황에 맞는 음악 편지 메시지를 작성해주세요.
상황: ${template}
컨텍스트: ${context}
한국어로, 500자 이내로 작성해주세요.`
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200
  })
  
  return NextResponse.json({
    message: completion.choices[0].message.content
  })
}
```

**성능 최적화**:
- 검색 결과 캐싱: 5분 TTL
- 자동 저장 debounce: 1초
- 이미지 최적화: Next.js Image
- 코드 스플리팅: 동적 임포트

---

### 2.3 플랫폼 연동

#### 기술 구현

**플랫폼 연동 플로우**:
```
1. 사용자가 "플랫폼 연동" 클릭
   → 플랫폼 선택 (Spotify/YouTube/Apple Music)
   
2. OAuth 플로우 시작
   → 각 플랫폼의 OAuth 엔드포인트로 리다이렉트
   
3. 사용자 권한 승인
   → access_token, refresh_token 획득
   
4. 토큰 저장
   → user_platform_tokens 테이블에 저장
   → 암호화하여 저장 (환경 변수로 키 관리)
```

**구현 세부사항**:

**Spotify 연동** (`lib/api/spotify.ts`):
```typescript
export async function connectSpotify(userId: string) {
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&` +
    `scope=playlist-modify-public playlist-modify-private&` +
    `state=${userId}`
  
  return authUrl
}

export async function savePlaylist(
  userId: string,
  tracks: Track[],
  playlistName: string
) {
  const supabase = createClient()
  
  // 사용자 토큰 조회
  const { data: tokenData } = await supabase
    .from('user_platform_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .eq('platform', 'spotify')
    .single()
  
  // 토큰 만료 확인 및 갱신
  let accessToken = tokenData.access_token
  if (new Date(tokenData.expires_at) < new Date()) {
    accessToken = await refreshSpotifyToken(tokenData.refresh_token)
  }
  
  // 플레이리스트 생성
  const playlist = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: playlistName,
      public: false
    })
  })
  
  const playlistData = await playlist.json()
  
  // 트랙 추가
  const trackUris = tracks
    .filter(t => t.platform === 'spotify')
    .map(t => `spotify:track:${t.platform_track_id}`)
  
  await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: trackUris })
  })
  
  return { success: true, playlistId: playlistData.id }
}
```

**곡 매칭 알고리즘** (`lib/utils/trackMatching.ts`):
```typescript
export function matchTrack(
  targetTrack: { title: string; artist: string },
  platformTracks: Track[]
): Track | null {
  // 1. 정확한 매칭
  const exactMatch = platformTracks.find(
    t => t.title.toLowerCase() === targetTrack.title.toLowerCase() &&
         t.artist.toLowerCase() === targetTrack.artist.toLowerCase()
  )
  if (exactMatch) return exactMatch
  
  // 2. 부분 매칭 (제목만)
  const titleMatch = platformTracks.find(
    t => t.title.toLowerCase().includes(targetTrack.title.toLowerCase())
  )
  if (titleMatch) return titleMatch
  
  // 3. 유사도 기반 매칭 (Levenshtein distance)
  const similarityScores = platformTracks.map(track => ({
    track,
    score: calculateSimilarity(targetTrack, track)
  }))
  
  similarityScores.sort((a, b) => b.score - a.score)
  
  // 유사도 80% 이상이면 매칭
  if (similarityScores[0].score >= 0.8) {
    return similarityScores[0].track
  }
  
  return null
}

function calculateSimilarity(
  track1: { title: string; artist: string },
  track2: Track
): number {
  const titleSimilarity = levenshteinDistance(
    track1.title.toLowerCase(),
    track2.title.toLowerCase()
  )
  const artistSimilarity = levenshteinDistance(
    track1.artist.toLowerCase(),
    track2.artist.toLowerCase()
  )
  
  return (titleSimilarity + artistSimilarity) / 2
}
```

**에러 핸들링**:
```typescript
export async function savePlaylistWithRetry(
  userId: string,
  tracks: Track[],
  playlistName: string,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await savePlaylist(userId, tracks, playlistName)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

---

### 2.4 편지 전송 및 수신

#### 기술 구현

**편지 전송 플로우**:
```
1. 사용자가 "전송하기" 클릭
   → share_token 생성 (UUID)
   → letters 테이블에 저장
   
2. 링크 생성
   → https://fanstage.com/letter/{share_token}
   
3. 이메일 전송 (선택)
   → Resend 또는 SendGrid 사용
   → 또는 링크 복사
```

**구현 세부사항**:

**편지 전송** (`app/api/letters/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { tracks, message, recipientEmail } = await request.json()
  
  // share_token 생성
  const shareToken = uuidv4()
  
  // 편지 저장
  const { data: letter, error } = await supabase
    .from('letters')
    .insert({
      sender_id: user.id,
      recipient_email: recipientEmail,
      message,
      share_token: shareToken
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // 트랙 저장
  await supabase
    .from('letter_tracks')
    .insert(
      tracks.map((track: Track, index: number) => ({
        letter_id: letter.id,
        track_title: track.title,
        artist_name: track.artist,
        platform: track.platform,
        platform_track_id: track.platformTrackId,
        order_index: index
      }))
    )
  
  // 이메일 전송 (선택)
  if (recipientEmail) {
    await sendEmail(recipientEmail, shareToken)
  }
  
  return NextResponse.json({
    letterId: letter.id,
    shareToken,
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/letter/${shareToken}`
  })
}
```

**편지 열람** (`app/letter/[token]/page.tsx`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function LetterPage({
  params
}: {
  params: { token: string }
}) {
  const supabase = createClient()
  
  // 편지 조회 (인증 불필요)
  const { data: letter, error } = await supabase
    .from('letters')
    .select(`
      *,
      letter_tracks (*),
      users!letters_sender_id_fkey (nickname, profile_image_url)
    `)
    .eq('share_token', params.token)
    .single()
  
  if (error || !letter) {
    notFound()
  }
  
  // 조회 기록 (분석용)
  await supabase
    .from('letter_views')
    .insert({
      letter_id: letter.id,
      viewer_email: null // 로그인하지 않은 사용자
    })
  
  return (
    <div>
      <h1>{letter.message}</h1>
      <p>From: {letter.users.nickname}</p>
      <ul>
        {letter.letter_tracks.map(track => (
          <li key={track.id}>
            {track.track_title} - {track.artist_name}
          </li>
        ))}
      </ul>
      <button onClick={() => saveToPlatform(letter.letter_tracks)}>
        내 플랫폼에 저장
      </button>
    </div>
  )
}
```

**편지 보관함** (`app/inbox/page.tsx`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

export default async function InboxPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 받은 편지 조회
  const { data: letters } = await supabase
    .from('letters')
    .select(`
      *,
      users!letters_sender_id_fkey (nickname, profile_image_url)
    `)
    .eq('recipient_email', user.email)
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <h1>받은 편지</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {letters?.map(letter => (
          <LetterCard key={letter.id} letter={letter} />
        ))}
      </Suspense>
    </div>
  )
}
```

---

## 성능 최적화 요약

### Frontend
- 코드 스플리팅: 라우트별, 컴포넌트별
- 이미지 최적화: Next.js Image
- 캐싱: 검색 결과 5분, 편지 목록 5분
- Debounce: 검색 300ms, 자동 저장 1초

### Backend
- 인덱싱: 모든 외래 키, 검색 필드
- 쿼리 최적화: JOIN 사용, 페이지네이션
- API 최적화: 병렬 요청, 배치 처리
- 에러 핸들링: Exponential backoff, Circuit breaker

---

## 다음 단계

이 기술 명세를 바탕으로 다음을 수행하겠습니다:

1. 사용자 플로우의 기술적 구현 방안 제시
2. 개발 표준 및 접근 방식 수립

---

**Alex TPM**  
"각 기능의 기술적 구현 방안을 상세히 명세했습니다. 다음 단계로 사용자 플로우의 기술적 구현을 설계하겠습니다."

