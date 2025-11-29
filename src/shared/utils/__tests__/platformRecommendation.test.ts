/**
 * 플랫폼 자동 선택 고도화 테스트
 * 
 * 목적: 플랫폼 자동 추천 기능 검증
 * 시나리오:
 * - 곡별 플랫폼 자동 감지
 * - 사용자 이전 선택 패턴 학습
 * - 스마트 플랫폼 추천
 */

import { describe, it, expect, beforeEach } from 'vitest'

type Platform = 'spotify' | 'apple' | 'youtube' | 'melon'

interface Track {
  id: string
  title: string
  artist: string
  platform: Platform
}

interface Letter {
  tracks: Track[]
}

interface UserPlatformHistory {
  platform: Platform
  count: number
}

/**
 * 편지의 곡들에서 가장 많이 사용된 플랫폼 추천
 * 
 * @param letter 편지 데이터
 * @returns 추천 플랫폼 또는 null
 */
function recommendPlatformFromTracks(letter: Letter): Platform | null {
  if (letter.tracks.length === 0) return null

  const platformCounts: Record<Platform, number> = {
    spotify: 0,
    apple: 0,
    youtube: 0,
    melon: 0,
  }

  // 각 곡의 플랫폼 카운트
  for (const track of letter.tracks) {
    platformCounts[track.platform] = (platformCounts[track.platform] || 0) + 1
  }

  // 가장 많이 사용된 플랫폼 찾기
  let maxCount = 0
  let recommendedPlatform: Platform | null = null

  for (const [platform, count] of Object.entries(platformCounts) as [Platform, number][]) {
    if (count > maxCount) {
      maxCount = count
      recommendedPlatform = platform
    }
  }

  return recommendedPlatform
}

/**
 * 사용자 이전 선택 패턴 기반 플랫폼 추천
 * 
 * @param history 사용자 플랫폼 선택 이력
 * @param defaultPlatform 기본 플랫폼
 * @returns 추천 플랫폼
 */
function recommendPlatformFromHistory(
  history: UserPlatformHistory[],
  defaultPlatform: Platform | null
): Platform | null {
  if (history.length === 0) {
    return defaultPlatform
  }

  // 가장 많이 선택한 플랫폼 찾기
  const sorted = [...history].sort((a, b) => b.count - a.count)
  return sorted[0].platform
}

/**
 * 스마트 플랫폼 추천 (곡 분석 + 사용자 이력)
 * 
 * @param letter 편지 데이터
 * @param history 사용자 플랫폼 선택 이력
 * @param defaultPlatform 기본 플랫폼
 * @returns 추천 플랫폼
 */
function recommendSmartPlatform(
  letter: Letter,
  history: UserPlatformHistory[],
  defaultPlatform: Platform | null
): Platform {
  // 1. 편지의 곡들이 모두 특정 플랫폼에 있는지 확인
  const trackPlatform = recommendPlatformFromTracks(letter)
  if (trackPlatform && letter.tracks.every((track) => track.platform === trackPlatform)) {
    return trackPlatform
  }

  // 2. 사용자 이전 선택 패턴 확인
  const historyPlatform = recommendPlatformFromHistory(history, defaultPlatform)
  if (historyPlatform) {
    return historyPlatform
  }

  // 3. 기본 플랫폼 사용
  return defaultPlatform || 'spotify'
}

describe('플랫폼 자동 추천', () => {
  /**
   * 테스트: 곡별 플랫폼 자동 감지
   * 시나리오: 편지의 곡들이 대부분 특정 플랫폼에 있으면 해당 플랫폼 추천
   * Given: Spotify 곡 5개, Apple Music 곡 1개가 있는 편지
   * When: 플랫폼 추천 함수를 호출함
   * Then: Spotify가 추천됨
   */
  it('곡별 플랫폼 자동 감지', () => {
    const letter: Letter = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist', platform: 'spotify' },
        { id: '2', title: 'Song 2', artist: 'Artist', platform: 'spotify' },
        { id: '3', title: 'Song 3', artist: 'Artist', platform: 'spotify' },
        { id: '4', title: 'Song 4', artist: 'Artist', platform: 'spotify' },
        { id: '5', title: 'Song 5', artist: 'Artist', platform: 'spotify' },
        { id: '6', title: 'Song 6', artist: 'Artist', platform: 'apple' },
      ],
    }

    const recommended = recommendPlatformFromTracks(letter)

    expect(recommended).toBe('spotify')
  })

  /**
   * 테스트: 모든 곡이 같은 플랫폼일 때 해당 플랫폼 추천
   * 시나리오: 편지의 모든 곡이 Apple Music에 있으면 Apple Music 추천
   * Given: 모든 곡이 Apple Music인 편지
   * When: 플랫폼 추천 함수를 호출함
   * Then: Apple Music이 추천됨
   */
  it('모든 곡이 같은 플랫폼일 때 해당 플랫폼 추천', () => {
    const letter: Letter = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist', platform: 'apple' },
        { id: '2', title: 'Song 2', artist: 'Artist', platform: 'apple' },
      ],
    }

    const recommended = recommendPlatformFromTracks(letter)

    expect(recommended).toBe('apple')
  })

  /**
   * 테스트: 사용자 이전 선택 패턴 학습
   * 시나리오: 사용자가 이전에 Apple Music을 많이 선택했으면 Apple Music 추천
   * Given: 사용자가 Apple Music을 10번, Spotify를 5번 선택한 이력
   * When: 플랫폼 추천 함수를 호출함
   * Then: Apple Music이 추천됨
   */
  it('사용자 이전 선택 패턴 학습', () => {
    const history: UserPlatformHistory[] = [
      { platform: 'apple', count: 10 },
      { platform: 'spotify', count: 5 },
      { platform: 'youtube', count: 2 },
    ]

    const recommended = recommendPlatformFromHistory(history, null)

    expect(recommended).toBe('apple')
  })

  /**
   * 테스트: 사용자 이력이 없을 때 기본 플랫폼 사용
   * 시나리오: 사용자 선택 이력이 없으면 기본 플랫폼 사용
   * Given: 사용자 선택 이력이 없고 기본 플랫폼이 Spotify
   * When: 플랫폼 추천 함수를 호출함
   * Then: Spotify가 추천됨
   */
  it('사용자 이력이 없을 때 기본 플랫폼 사용', () => {
    const recommended = recommendPlatformFromHistory([], 'spotify')

    expect(recommended).toBe('spotify')
  })

  /**
   * 테스트: 스마트 플랫폼 추천 (곡 분석 우선)
   * 시나리오: 편지의 곡들이 모두 특정 플랫폼에 있으면 해당 플랫폼 추천
   * Given: 모든 곡이 YouTube Music인 편지, 사용자 기본 플랫폼은 Spotify
   * When: 스마트 추천 함수를 호출함
   * Then: YouTube Music이 추천됨 (곡 분석 우선)
   */
  it('스마트 플랫폼 추천 (곡 분석 우선)', () => {
    const letter: Letter = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist', platform: 'youtube' },
        { id: '2', title: 'Song 2', artist: 'Artist', platform: 'youtube' },
      ],
    }

    const history: UserPlatformHistory[] = [
      { platform: 'spotify', count: 10 },
    ]

    const recommended = recommendSmartPlatform(letter, history, 'spotify')

    expect(recommended).toBe('youtube')
  })

  /**
   * 테스트: 스마트 플랫폼 추천 (사용자 이력 우선)
   * 시나리오: 곡들이 여러 플랫폼에 분산되어 있으면 사용자 이력 기반 추천
   * Given: 곡들이 여러 플랫폼에 분산, 사용자가 Apple Music을 많이 선택
   * When: 스마트 추천 함수를 호출함
   * Then: Apple Music이 추천됨
   */
  it('스마트 플랫폼 추천 (사용자 이력 우선)', () => {
    const letter: Letter = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist', platform: 'spotify' },
        { id: '2', title: 'Song 2', artist: 'Artist', platform: 'apple' },
        { id: '3', title: 'Song 3', artist: 'Artist', platform: 'youtube' },
      ],
    }

    const history: UserPlatformHistory[] = [
      { platform: 'apple', count: 15 },
      { platform: 'spotify', count: 5 },
    ]

    const recommended = recommendSmartPlatform(letter, history, 'spotify')

    expect(recommended).toBe('apple')
  })

  /**
   * 테스트: 빈 편지일 때 기본 플랫폼 사용
   * 시나리오: 편지에 곡이 없으면 기본 플랫폼 사용
   * Given: 곡이 없는 편지
   * When: 플랫폼 추천 함수를 호출함
   * Then: null 반환 또는 기본 플랫폼 사용
   */
  it('빈 편지일 때 기본 플랫폼 사용', () => {
    const letter: Letter = {
      tracks: [],
    }

    const recommended = recommendPlatformFromTracks(letter)

    expect(recommended).toBeNull()
  })
})

