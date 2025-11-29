/**
 * 정렬/필터 유틸리티 테스트
 * 
 * 목적: 보관함 편지 정렬 및 필터 기능 검증
 * 시나리오:
 * - 날짜순 정렬 (최신순/오래된순)
 * - 곡 수순 정렬 (많은순/적은순)
 * - 재생 횟수순 정렬
 * - 이름/곡 제목 필터
 * - 날짜 범위 필터
 */

import { describe, it, expect } from 'vitest'

interface Letter {
  id: string
  message: string
  trackCount: number
  playCount: number
  date: string
  createdAt: string
  sender?: string
  recipient?: string
  tracks?: Array<{ title: string }>
}

type SortOption = 'date-desc' | 'date-asc' | 'tracks-desc' | 'tracks-asc' | 'plays-desc' | 'plays-asc'

interface FilterOptions {
  name?: string
  trackTitle?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * 편지 정렬 함수
 * 
 * @param letters 편지 목록
 * @param sortOption 정렬 옵션
 * @returns 정렬된 편지 목록
 */
function sortLetters(letters: Letter[], sortOption: SortOption): Letter[] {
  const sorted = [...letters]

  switch (sortOption) {
    case 'date-desc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime()
        const dateB = new Date(b.createdAt || b.date).getTime()
        return dateB - dateA
      })

    case 'date-asc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime()
        const dateB = new Date(b.createdAt || b.date).getTime()
        return dateA - dateB
      })

    case 'tracks-desc':
      return sorted.sort((a, b) => b.trackCount - a.trackCount)

    case 'tracks-asc':
      return sorted.sort((a, b) => a.trackCount - b.trackCount)

    case 'plays-desc':
      return sorted.sort((a, b) => b.playCount - a.playCount)

    case 'plays-asc':
      return sorted.sort((a, b) => a.playCount - b.playCount)

    default:
      return sorted
  }
}

/**
 * 편지 필터 함수
 * 
 * @param letters 편지 목록
 * @param filters 필터 옵션
 * @returns 필터링된 편지 목록
 */
function filterLetters(letters: Letter[], filters: FilterOptions): Letter[] {
  return letters.filter((letter) => {
    // 이름 필터
    if (filters.name) {
      const name = (letter.sender || letter.recipient || '').toLowerCase()
      if (!name.includes(filters.name.toLowerCase())) {
        return false
      }
    }

    // 곡 제목 필터
    if (filters.trackTitle) {
      const hasTrack = letter.tracks?.some((track) =>
        track.title.toLowerCase().includes(filters.trackTitle!.toLowerCase())
      )
      if (!hasTrack) {
        return false
      }
    }

    // 날짜 범위 필터
    if (filters.dateFrom || filters.dateTo) {
      const letterDate = new Date(letter.createdAt || letter.date).getTime()
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime()
        if (letterDate < fromDate) {
          return false
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime()
        if (letterDate > toDate) {
          return false
        }
      }
    }

    return true
  })
}

describe('편지 정렬', () => {
  const mockLetters: Letter[] = [
    {
      id: '1',
      message: '첫 번째 편지',
      trackCount: 3,
      playCount: 10,
      date: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      sender: '김철수',
    },
    {
      id: '2',
      message: '두 번째 편지',
      trackCount: 5,
      playCount: 5,
      date: '2024-01-03',
      createdAt: '2024-01-03T00:00:00Z',
      sender: '이영희',
    },
    {
      id: '3',
      message: '세 번째 편지',
      trackCount: 2,
      playCount: 15,
      date: '2024-01-02',
      createdAt: '2024-01-02T00:00:00Z',
      sender: '박민수',
    },
  ]

  /**
   * 테스트: 날짜순 정렬 (최신순)
   * 시나리오: 사용자가 최신순으로 정렬하면 가장 최근 편지가 먼저 표시됨
   * Given: 여러 편지가 있음
   * When: 날짜순 최신순으로 정렬함
   * Then: 가장 최근 편지가 첫 번째로 표시됨
   */
  it('날짜순 정렬 (최신순)', () => {
    const sorted = sortLetters(mockLetters, 'date-desc')

    expect(sorted[0].id).toBe('2') // 2024-01-03
    expect(sorted[1].id).toBe('3') // 2024-01-02
    expect(sorted[2].id).toBe('1') // 2024-01-01
  })

  /**
   * 테스트: 날짜순 정렬 (오래된순)
   * 시나리오: 사용자가 오래된순으로 정렬하면 가장 오래된 편지가 먼저 표시됨
   * Given: 여러 편지가 있음
   * When: 날짜순 오래된순으로 정렬함
   * Then: 가장 오래된 편지가 첫 번째로 표시됨
   */
  it('날짜순 정렬 (오래된순)', () => {
    const sorted = sortLetters(mockLetters, 'date-asc')

    expect(sorted[0].id).toBe('1') // 2024-01-01
    expect(sorted[1].id).toBe('3') // 2024-01-02
    expect(sorted[2].id).toBe('2') // 2024-01-03
  })

  /**
   * 테스트: 곡 수순 정렬 (많은순)
   * 시나리오: 사용자가 곡 수 많은순으로 정렬하면 곡이 많은 편지가 먼저 표시됨
   * Given: 여러 편지가 있음
   * When: 곡 수 많은순으로 정렬함
   * Then: 곡이 가장 많은 편지가 첫 번째로 표시됨
   */
  it('곡 수순 정렬 (많은순)', () => {
    const sorted = sortLetters(mockLetters, 'tracks-desc')

    expect(sorted[0].trackCount).toBe(5)
    expect(sorted[1].trackCount).toBe(3)
    expect(sorted[2].trackCount).toBe(2)
  })

  /**
   * 테스트: 재생 횟수순 정렬 (많은순)
   * 시나리오: 사용자가 재생 횟수 많은순으로 정렬하면 재생이 많은 편지가 먼저 표시됨
   * Given: 여러 편지가 있음
   * When: 재생 횟수 많은순으로 정렬함
   * Then: 재생이 가장 많은 편지가 첫 번째로 표시됨
   */
  it('재생 횟수순 정렬 (많은순)', () => {
    const sorted = sortLetters(mockLetters, 'plays-desc')

    expect(sorted[0].playCount).toBe(15)
    expect(sorted[1].playCount).toBe(10)
    expect(sorted[2].playCount).toBe(5)
  })
})

describe('편지 필터', () => {
  const mockLetters: Letter[] = [
    {
      id: '1',
      message: '첫 번째 편지',
      trackCount: 3,
      playCount: 10,
      date: '2024-01-15',
      createdAt: '2024-01-15T00:00:00Z',
      sender: '김철수',
      tracks: [{ title: '겨울 노래' }, { title: '크리스마스' }],
    },
    {
      id: '2',
      message: '두 번째 편지',
      trackCount: 5,
      playCount: 5,
      date: '2024-01-20',
      createdAt: '2024-01-20T00:00:00Z',
      sender: '이영희',
      tracks: [{ title: '봄 노래' }, { title: '여름' }],
    },
    {
      id: '3',
      message: '세 번째 편지',
      trackCount: 2,
      playCount: 15,
      date: '2024-01-25',
      createdAt: '2024-01-25T00:00:00Z',
      recipient: '박민수',
      tracks: [{ title: '겨울 노래' }, { title: '눈' }],
    },
  ]

  /**
   * 테스트: 이름으로 필터링
   * 시나리오: 사용자가 보낸 사람 이름으로 필터링하면 해당 이름의 편지만 표시됨
   * Given: 여러 편지가 있음
   * When: "김철수"로 필터링함
   * Then: 김철수가 보낸 편지만 표시됨
   */
  it('이름으로 필터링', () => {
    const filtered = filterLetters(mockLetters, { name: '김철수' })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].sender).toBe('김철수')
  })

  /**
   * 테스트: 곡 제목으로 필터링
   * 시나리오: 사용자가 곡 제목으로 필터링하면 해당 곡이 포함된 편지만 표시됨
   * Given: 여러 편지가 있음
   * When: "겨울 노래"로 필터링함
   * Then: "겨울 노래"가 포함된 편지만 표시됨
   */
  it('곡 제목으로 필터링', () => {
    const filtered = filterLetters(mockLetters, { trackTitle: '겨울 노래' })

    expect(filtered).toHaveLength(2)
    expect(filtered.every((letter) =>
      letter.tracks?.some((track) => track.title.includes('겨울 노래'))
    )).toBe(true)
  })

  /**
   * 테스트: 날짜 범위로 필터링
   * 시나리오: 사용자가 날짜 범위를 설정하면 해당 기간의 편지만 표시됨
   * Given: 여러 편지가 있음
   * When: 2024-01-16 ~ 2024-01-24로 필터링함
   * Then: 해당 기간의 편지만 표시됨
   */
  it('날짜 범위로 필터링', () => {
    const filtered = filterLetters(mockLetters, {
      dateFrom: '2024-01-16',
      dateTo: '2024-01-24',
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('2')
  })

  /**
   * 테스트: 여러 필터 조합
   * 시나리오: 사용자가 여러 필터를 동시에 적용하면 모든 조건을 만족하는 편지만 표시됨
   * Given: 여러 편지가 있음
   * When: 이름과 곡 제목으로 필터링함
   * Then: 두 조건을 모두 만족하는 편지만 표시됨
   */
  it('여러 필터 조합', () => {
    const filtered = filterLetters(mockLetters, {
      name: '김철수',
      trackTitle: '겨울',
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].sender).toBe('김철수')
  })

  /**
   * 테스트: 필터 결과 없음
   * 시나리오: 필터 조건에 맞는 편지가 없으면 빈 배열 반환
   * Given: 여러 편지가 있음
   * When: 존재하지 않는 이름으로 필터링함
   * Then: 빈 배열 반환
   */
  it('필터 결과 없음', () => {
    const filtered = filterLetters(mockLetters, { name: '존재하지않는사람' })

    expect(filtered).toHaveLength(0)
  })
})

