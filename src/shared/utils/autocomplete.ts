/**
 * 곡 검색 자동완성 유틸리티
 *
 * 목적: 검색어를 기반으로 자동완성 제안 생성
 * 기능:
 * - 2글자 이상부터 자동완성 시작
 * - 최대 5개까지 제안 표시
 * - 제목과 아티스트명에서 검색
 */

export interface Track {
  title: string;
  artist: string;
}

/**
 * 곡 검색 자동완성 제안 생성
 *
 * @param query 검색어
 * @param tracks 전체 곡 목록
 * @returns 자동완성 제안 목록 (최대 5개)
 */
export function generateAutocompleteSuggestions(
  query: string,
  tracks: Track[]
): string[] {
  // 2글자 미만이면 빈 배열 반환
  if (query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  // 제목과 아티스트명에서 검색
  for (const track of tracks) {
    const titleLower = track.title.toLowerCase();
    const artistLower = track.artist.toLowerCase();

    // 제목이 검색어로 시작하는 경우
    if (titleLower.startsWith(lowerQuery)) {
      suggestions.add(track.title);
      if (suggestions.size >= 5) break;
    }

    // 아티스트명이 검색어로 시작하는 경우
    if (artistLower.startsWith(lowerQuery)) {
      suggestions.add(track.artist);
      if (suggestions.size >= 5) break;
    }
  }

  return Array.from(suggestions).slice(0, 5);
}

