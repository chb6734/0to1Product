/**
 * MSW API 핸들러
 * 
 * 목적: 모든 API 엔드포인트에 대한 Mock 핸들러 정의
 */
import { http, HttpResponse, delay } from 'msw'
import { mockUsers, mockTracks, mockLetters, createMockUser, createMockTrack, createMockLetter } from './data'
import type { MockUser, MockTrack, MockLetter } from './types'

// 인증 관련 핸들러
const authHandlers = [
  // Google 로그인
  http.post('/api/auth/login/google', async ({ request }) => {
    console.log('[MSW] Google 로그인 핸들러 호출됨')
    await delay(500)
    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'network') {
      return HttpResponse.error()
    }
    // 신규 사용자는 닉네임이 없음 (온보딩 필요)
    const user = createMockUser({
      email: 'google@example.com',
      nickname: undefined, // 신규 사용자는 닉네임 없음
    })
    console.log('[MSW] 생성된 사용자:', user)
    console.log('[MSW] 닉네임 존재 여부:', !!user.nickname, 'nickname 값:', user.nickname)
    console.log('[MSW] user.nickname === undefined:', user.nickname === undefined)
    // JSON.stringify는 undefined 속성을 제거하므로, nickname이 undefined면
    // 명시적으로 null로 설정하거나, 또는 nickname 속성을 제외한 객체를 반환
    // 하지만 useAuth에서 data.user.nickname이 없으면 undefined로 처리되므로
    // nickname 속성을 제외한 객체를 반환하는 것이 더 정확함
    const { nickname, ...userWithoutNickname } = user
    const responseUser = nickname === undefined 
      ? userWithoutNickname // nickname 속성 제외
      : user
    console.log('[MSW] 응답 user 객체:', responseUser)
    console.log('[MSW] 응답 user에 nickname 속성 존재:', 'nickname' in responseUser)
    return HttpResponse.json({ user: responseUser, token: 'mock-jwt-token' })
  }),

  // Kakao 로그인
  http.post('/api/auth/login/kakao', async ({ request }) => {
    console.log('[MSW] Kakao 로그인 핸들러 호출됨')
    await delay(500)
    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'network') {
      return HttpResponse.error()
    }
    // 신규 사용자는 닉네임이 없음 (온보딩 필요)
    const user = createMockUser({
      email: 'kakao@example.com',
      nickname: undefined, // 신규 사용자는 닉네임 없음
    })
    console.log('[MSW] 생성된 사용자:', user)
    console.log('[MSW] 닉네임 존재 여부:', !!user.nickname, 'nickname 값:', user.nickname)
    const { nickname, ...userWithoutNickname } = user
    const responseUser = nickname === undefined 
      ? userWithoutNickname // nickname 속성 제외
      : user
    return HttpResponse.json({ user: responseUser, token: 'mock-jwt-token' })
  }),

  // Apple 로그인
  http.post('/api/auth/login/apple', async ({ request }) => {
    console.log('[MSW] Apple 로그인 핸들러 호출됨')
    await delay(500)
    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'network') {
      return HttpResponse.error()
    }
    // 신규 사용자는 닉네임이 없음 (온보딩 필요)
    const user = createMockUser({
      email: 'apple@example.com',
      nickname: undefined, // 신규 사용자는 닉네임 없음
    })
    console.log('[MSW] 생성된 사용자:', user)
    console.log('[MSW] 닉네임 존재 여부:', !!user.nickname, 'nickname 값:', user.nickname)
    const { nickname, ...userWithoutNickname } = user
    const responseUser = nickname === undefined 
      ? userWithoutNickname // nickname 속성 제외
      : user
    return HttpResponse.json({ user: responseUser, token: 'mock-jwt-token' })
  }),

  // 로그아웃
  http.post('/api/auth/logout', async () => {
    await delay(200)
    return HttpResponse.json({ success: true })
  }),

  // 사용자 정보 조회
  http.get('/api/auth/user', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'unauthorized') {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ user: mockUsers[0] })
  }),

  // 프로필 업데이트 (nickname, profileImage, defaultPlatform 모두 처리)
  http.put('/api/auth/profile', async ({ request }) => {
    await delay(400)
    const body = await request.json() as { 
      nickname?: string
      profileImage?: string
      defaultPlatform?: string 
    }
    
    // 중복 닉네임 체크
    if (body.nickname === 'duplicate') {
      return HttpResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 409 })
    }
    
    // 현재 사용자 정보 가져오기 (localStorage에서 가져온다고 가정)
    const currentUser = mockUsers[0]
    
    const updatedUser = {
      ...currentUser,
      nickname: body.nickname !== undefined ? body.nickname : currentUser.nickname,
      profileImage: body.profileImage !== undefined ? body.profileImage : currentUser.profileImage,
      defaultPlatform: body.defaultPlatform !== undefined ? (body.defaultPlatform as 'spotify' | 'apple' | 'youtube' | 'melon' | null) : currentUser.defaultPlatform,
      updatedAt: new Date().toISOString(),
    }
    
    // mockUsers 업데이트 (실제로는 DB 업데이트)
    if (mockUsers[0]) {
      mockUsers[0] = updatedUser as typeof mockUsers[0]
    }
    
    return HttpResponse.json({ user: updatedUser })
  }),
]

// 편지 관련 핸들러
const letterHandlers = [
  http.get('/api/letters', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') // 'received', 'sent', 또는 'discover'
    
    // 현재 사용자 정보 가져오기
    // 실제 환경에서는 요청 헤더나 쿠키에서 사용자 정보를 가져와야 함
    // MSW에서는 브라우저의 localStorage를 직접 접근할 수 없으므로
    // mockUsers[0]을 현재 사용자로 가정하거나, 요청 헤더에서 사용자 정보를 가져옴
    // 여기서는 편지 생성 시 senderId가 설정되므로, senderId로 필터링
    const currentUserId = mockUsers[0]?.id
    const currentUserEmail = mockUsers[0]?.email
    
    let filteredLetters = mockLetters
    
    if (type === 'sent') {
      // 보낸 편지: senderId가 현재 사용자 ID와 일치하는 편지만 표시
      filteredLetters = mockLetters.filter(letter => letter.senderId === currentUserId)
    } else if (type === 'received') {
      // 받은 편지: recipientEmail이 현재 사용자 이메일과 일치하는 편지만 표시
      // 받은 편지는 다른 사용자가 보낸 편지이므로, senderId가 현재 사용자와 다른 편지
      filteredLetters = mockLetters.filter(letter => 
        letter.recipientEmail === currentUserEmail && letter.senderId !== currentUserId
      )
    } else if (type === 'discover') {
      // 둘러보기: 공개된 편지 목록 (현재는 모든 편지, 향후 공개 설정된 편지만 필터링)
      // 현재 사용자가 보낸 편지는 제외하고, 다른 사용자가 보낸 편지만 표시
      filteredLetters = mockLetters.filter(letter => letter.senderId !== currentUserId)
    }
    
    return HttpResponse.json({ letters: filteredLetters })
  }),

  http.post('/api/letters', async ({ request }) => {
    await delay(800)
    const body = await request.json() as { tracks: MockTrack[]; message: string; recipientEmail?: string }
    if (!body.tracks || body.tracks.length === 0) {
      return HttpResponse.json({ error: '최소 1곡 이상 추가해주세요' }, { status: 400 })
    }
    if (body.message === 'network-error') {
      return HttpResponse.error()
    }
    const newLetter = createMockLetter({
      senderId: 'user-1',
      sender: mockUsers[0],
      recipientEmail: body.recipientEmail,
      message: body.message,
      tracks: body.tracks,
    })
    mockLetters.push(newLetter)
    return HttpResponse.json({ letter: newLetter, id: newLetter.id }, { status: 201 })
  }),

  http.get('/api/letters/:id', ({ params }) => {
    const letter = mockLetters.find(l => l.id === params.id)
    if (!letter) {
      return HttpResponse.json({ error: 'Letter not found' }, { status: 404 })
    }
    return HttpResponse.json({ letter })
  }),

  http.get('/api/letters/share/:token', ({ params }) => {
    const letter = mockLetters.find(l => l.shareToken === params.token)
    if (!letter) {
      return HttpResponse.json({ error: 'Letter not found' }, { status: 404 })
    }
    return HttpResponse.json({ letter })
  }),

  http.delete('/api/letters/:id', ({ params }) => {
    const index = mockLetters.findIndex(l => l.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Letter not found' }, { status: 404 })
    }
    mockLetters.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),
]

// 곡 검색 관련 핸들러
const musicHandlers = [
  http.get('/api/music/search', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''
    const platform = url.searchParams.get('platform') || 'all'
    if (query === 'network-error') {
      return HttpResponse.error()
    }
    if (query === 'search-failed') {
      return HttpResponse.json({ error: '검색에 실패했습니다' }, { status: 500 })
    }
    let filteredTracks = mockTracks
    if (query) {
      filteredTracks = mockTracks.filter(
        track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase())
      )
    }
    if (platform !== 'all') {
      filteredTracks = filteredTracks.filter(track => track.platform === platform)
    }
    return HttpResponse.json({ tracks: filteredTracks })
  }),

  http.get('/api/music/tracks/:id', ({ params }) => {
    const track = mockTracks.find(t => t.id === params.id)
    if (!track) {
      return HttpResponse.json({ error: 'Track not found' }, { status: 404 })
    }
    return HttpResponse.json({ track })
  }),
]

// 플랫폼 연동 관련 핸들러
const platformHandlers = [
  http.post('/api/platform/spotify/connect', async () => {
    await delay(1000)
    return HttpResponse.json({ success: true, platform: 'spotify', connected: true })
  }),

  http.post('/api/platform/youtube/connect', async () => {
    await delay(1000)
    return HttpResponse.json({ success: true, platform: 'youtube', connected: true })
  }),

  http.post('/api/platform/apple/connect', async () => {
    await delay(1000)
    return HttpResponse.json({ success: true, platform: 'apple', connected: true })
  }),

  http.post('/api/platform/:platform/save', async ({ params, request }) => {
    await delay(1500)
    const body = await request.json() as { tracks: MockTrack[]; playlistName: string }
    const platform = params.platform as string
    if (body.playlistName === 'save-failed') {
      return HttpResponse.json({ error: '플레이리스트 저장에 실패했습니다' }, { status: 500 })
    }
    return HttpResponse.json({
      success: true,
      platform,
      playlistId: `playlist-${Date.now()}`,
      playlistName: body.playlistName,
    })
  }),
]

export const handlers = [
  ...authHandlers,
  ...letterHandlers,
  ...musicHandlers,
  ...platformHandlers,
]

