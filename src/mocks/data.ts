/**
 * Mock 데이터 생성 함수
 * 
 * 목적: 테스트 및 개발용 Mock 데이터 생성
 */
import { MockUser, MockTrack, MockLetter, MockPlaylist } from './types'

// 샘플 사용자 데이터
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'user1@example.com',
    nickname: '음악러버',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'user2@example.com',
    nickname: '플레이리스트마스터',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    createdAt: '2024-01-02T00:00:00Z',
  },
]

// 샘플 곡 데이터
export const mockTracks: MockTrack[] = [
  {
    id: 'track-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    platform: 'spotify',
    platformTrackId: 'spotify:track:0VjIjW4GlU5UT31H5q5X',
    duration: 200000,
  },
  {
    id: 'track-2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    platform: 'spotify',
    platformTrackId: 'spotify:track:7qiZfU4dY1lWllzX7mP',
    duration: 233000,
  },
  {
    id: 'track-3',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
    platform: 'spotify',
    platformTrackId: 'spotify:track:6UelLqGlWMcVH1E5c4H7lY',
    duration: 174000,
  },
  {
    id: 'track-4',
    title: 'Dynamite',
    artist: 'BTS',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b3c1bde',
    platform: 'spotify',
    platformTrackId: 'spotify:track:4saklk6nie3yiGePpBwUoc',
    duration: 199000,
  },
  {
    id: 'track-5',
    title: 'Levitating',
    artist: 'Dua Lipa',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4ede2074708f8748',
    platform: 'spotify',
    platformTrackId: 'spotify:track:463CkQjx2Zk1yXoBuierM9',
    duration: 203000,
  },
]

// 샘플 편지 데이터 (동적으로 수정 가능하도록 let 사용)
export let mockLetters: MockLetter[] = [
  {
    id: 'letter-1',
    senderId: 'user-1',
    sender: mockUsers[0],
    recipientEmail: 'friend@example.com',
    message: '생일 축하해! 이 곡들을 들으면서 행복한 하루 보내길 바라!',
    tracks: [mockTracks[0], mockTracks[1]],
    shareToken: 'share-token-1',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'letter-2',
    senderId: 'user-2',
    sender: mockUsers[1],
    recipientEmail: 'colleague@example.com',
    message: '오늘 하루 힘들었을 것 같아서 위로의 플레이리스트를 만들어봤어.',
    tracks: [mockTracks[2]],
    shareToken: 'share-token-2',
    createdAt: '2024-01-11T15:30:00Z',
    updatedAt: '2024-01-11T15:30:00Z',
  },
]

// Mock 데이터 생성 헬퍼 함수
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: `user-${Date.now()}`,
    email: `user${Date.now()}@example.com`,
    nickname: `User${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockTrack(overrides?: Partial<MockTrack>): MockTrack {
  return {
    id: `track-${Date.now()}`,
    title: 'Mock Track',
    artist: 'Mock Artist',
    albumCover: 'https://via.placeholder.com/300',
    platform: 'spotify',
    platformTrackId: `spotify:track:${Date.now()}`,
    ...overrides,
  }
}

export function createMockLetter(overrides?: Partial<MockLetter>): MockLetter {
  return {
    id: `letter-${Date.now()}`,
    senderId: 'user-1',
    message: '',
    tracks: [],
    shareToken: `share-token-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

