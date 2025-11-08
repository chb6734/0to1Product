/**
 * Mock 데이터 타입 정의
 * 
 * 목적: MSW Mock API에서 사용할 데이터 타입 정의
 */
export interface MockUser {
  id: string
  email: string
  nickname: string
  profileImage?: string
  createdAt: string
}

export interface MockTrack {
  id: string
  title: string
  artist: string
  albumCover: string
  platform: 'spotify' | 'youtube' | 'apple'
  platformTrackId: string
  duration?: number
}

export interface MockLetter {
  id: string
  senderId: string
  sender?: MockUser
  recipientEmail?: string
  message: string
  tracks: MockTrack[]
  shareToken: string
  createdAt: string
  updatedAt: string
}

export interface MockPlaylist {
  id: string
  name: string
  platform: 'spotify' | 'youtube' | 'apple'
  platformPlaylistId: string
  tracks: MockTrack[]
  createdAt: string
}

