/**
 * 플랫폼 자동 추천 유틸리티
 *
 * 목적: 편지 재생 시 최적의 플랫폼 자동 추천
 * 기능:
 * - 곡별 플랫폼 자동 감지
 * - 사용자 이전 선택 패턴 학습
 * - 스마트 플랫폼 추천
 */

export type Platform = "spotify" | "apple" | "youtube" | "melon";

export interface Track {
  id: string;
  title: string;
  artist: string;
  platform: Platform;
}

export interface Letter {
  tracks: Track[];
}

export interface UserPlatformHistory {
  platform: Platform;
  count: number;
}

/**
 * 편지의 곡들에서 가장 많이 사용된 플랫폼 추천
 *
 * @param letter 편지 데이터
 * @returns 추천 플랫폼 또는 null
 */
export function recommendPlatformFromTracks(letter: Letter): Platform | null {
  if (letter.tracks.length === 0) return null;

  const platformCounts: Record<Platform, number> = {
    spotify: 0,
    apple: 0,
    youtube: 0,
    melon: 0,
  };

  // 각 곡의 플랫폼 카운트
  for (const track of letter.tracks) {
    platformCounts[track.platform] = (platformCounts[track.platform] || 0) + 1;
  }

  // 가장 많이 사용된 플랫폼 찾기
  let maxCount = 0;
  let recommendedPlatform: Platform | null = null;

  for (const [platform, count] of Object.entries(platformCounts) as [
    Platform,
    number
  ][]) {
    if (count > maxCount) {
      maxCount = count;
      recommendedPlatform = platform;
    }
  }

  return recommendedPlatform;
}

/**
 * 사용자 이전 선택 패턴 기반 플랫폼 추천
 *
 * @param history 사용자 플랫폼 선택 이력
 * @param defaultPlatform 기본 플랫폼
 * @returns 추천 플랫폼
 */
export function recommendPlatformFromHistory(
  history: UserPlatformHistory[],
  defaultPlatform: Platform | null
): Platform | null {
  if (history.length === 0) {
    return defaultPlatform;
  }

  // 가장 많이 선택한 플랫폼 찾기
  const sorted = [...history].sort((a, b) => b.count - a.count);
  return sorted[0].platform;
}

/**
 * 스마트 플랫폼 추천 (곡 분석 + 사용자 이력)
 *
 * @param letter 편지 데이터
 * @param history 사용자 플랫폼 선택 이력
 * @param defaultPlatform 기본 플랫폼
 * @returns 추천 플랫폼
 */
export function recommendSmartPlatform(
  letter: Letter,
  history: UserPlatformHistory[],
  defaultPlatform: Platform | null
): Platform {
  // 1. 편지의 곡들이 모두 특정 플랫폼에 있는지 확인
  const trackPlatform = recommendPlatformFromTracks(letter);
  if (
    trackPlatform &&
    letter.tracks.every((track) => track.platform === trackPlatform)
  ) {
    return trackPlatform;
  }

  // 2. 사용자 이전 선택 패턴 확인
  const historyPlatform = recommendPlatformFromHistory(
    history,
    defaultPlatform
  );
  if (historyPlatform) {
    return historyPlatform;
  }

  // 3. 기본 플랫폼 사용
  return defaultPlatform || "spotify";
}

