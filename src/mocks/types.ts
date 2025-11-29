/**
 * Mock 데이터 타입 정의
 * 
 * 목적: MSW Mock API에서 사용할 데이터 타입 정의
 */
export interface MockUser {
  id: string
  email: string
  nickname?: string  // 선택적 필드로 변경 (신규 사용자는 닉네임 없음)
  profileImage?: string
  defaultPlatform?: 'spotify' | 'apple' | 'youtube' | 'melon' | null  // 기본 플랫폼 설정
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
  imageUrl?: string
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

