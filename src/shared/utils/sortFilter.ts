/**
 * 정렬/필터 유틸리티
 *
 * 목적: 보관함 편지 정렬 및 필터 기능 제공
 * 기능:
 * - 날짜순, 곡 수순, 재생 횟수순 정렬
 * - 이름, 곡 제목, 날짜 범위 필터
 */

export interface Letter {
  id: string;
  message: string;
  trackCount: number;
  playCount: number;
  date: string;
  createdAt: string;
  sender?: string;
  recipient?: string;
  tracks?: Array<{ title: string }>;
}

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "tracks-desc"
  | "tracks-asc"
  | "plays-desc"
  | "plays-asc";

export interface FilterOptions {
  name?: string;
  trackTitle?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 편지 정렬 함수
 *
 * @param letters 편지 목록
 * @param sortOption 정렬 옵션
 * @returns 정렬된 편지 목록
 */
export function sortLetters(
  letters: Letter[],
  sortOption: SortOption
): Letter[] {
  const sorted = [...letters];

  switch (sortOption) {
    case "date-desc":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
      });

    case "date-asc":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateA - dateB;
      });

    case "tracks-desc":
      return sorted.sort((a, b) => b.trackCount - a.trackCount);

    case "tracks-asc":
      return sorted.sort((a, b) => a.trackCount - b.trackCount);

    case "plays-desc":
      return sorted.sort((a, b) => b.playCount - a.playCount);

    case "plays-asc":
      return sorted.sort((a, b) => a.playCount - b.playCount);

    default:
      return sorted;
  }
}

/**
 * 편지 필터 함수
 *
 * @param letters 편지 목록
 * @param filters 필터 옵션
 * @returns 필터링된 편지 목록
 */
export function filterLetters(
  letters: Letter[],
  filters: FilterOptions
): Letter[] {
  return letters.filter((letter) => {
    // 이름 필터
    if (filters.name) {
      const name = (letter.sender || letter.recipient || "").toLowerCase();
      if (!name.includes(filters.name.toLowerCase())) {
        return false;
      }
    }

    // 곡 제목 필터
    if (filters.trackTitle) {
      const hasTrack = letter.tracks?.some((track) =>
        track.title.toLowerCase().includes(filters.trackTitle!.toLowerCase())
      );
      if (!hasTrack) {
        return false;
      }
    }

    // 날짜 범위 필터
    if (filters.dateFrom || filters.dateTo) {
      const letterDate = new Date(letter.createdAt || letter.date).getTime();

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        if (letterDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime();
        if (letterDate > toDate) {
          return false;
        }
      }
    }

    return true;
  });
}

