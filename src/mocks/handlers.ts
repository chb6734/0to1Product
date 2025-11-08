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
    return HttpResponse.json({ user, token: 'mock-jwt-token' })
  }),

  // Kakao 로그인
  http.post('/api/auth/login/kakao', async ({ request }) => {
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
    return HttpResponse.json({ user, token: 'mock-jwt-token' })
  }),

  // Apple 로그인
  http.post('/api/auth/login/apple', async ({ request }) => {
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
    return HttpResponse.json({ user, token: 'mock-jwt-token' })
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

  // 프로필 수정
  http.put('/api/auth/profile', async ({ request }) => {
    await delay(400)
    const body = await request.json() as Partial<MockUser>
    if (body.nickname === 'duplicate') {
      return HttpResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 409 })
    }
    const updatedUser = {
      ...mockUsers[0],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json({ user: updatedUser })
  }),
]

// 편지 관련 핸들러
const letterHandlers = [
  http.get('/api/letters', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    return HttpResponse.json({ letters: mockLetters })
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

