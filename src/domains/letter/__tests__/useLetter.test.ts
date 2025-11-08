/**
 * useLetter 훅 테스트
 * 
 * 목적: 편지 생성 및 관리 기능 검증
 * 시나리오:
 * - 곡 검색 및 추가
 * - 곡 삭제 및 순서 변경
 * - 메시지 작성
 * - 편지 생성
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useLetter } from '../hooks/useLetter'

describe('useLetter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 테스트: 곡 추가 기능
   * 시나리오: 사용자가 곡을 선택하면 편지에 추가되어야 함
   * Given: 빈 편지 상태
   * When: 곡을 추가함
   * Then: 편지에 곡이 포함되어야 함
   */
  it('should add track to letter', () => {
    const { result } = renderHook(() => useLetter())
    const track = { id: '1', title: 'Song', artist: 'Artist', albumCover: 'cover.jpg' }

    act(() => {
      result.current.addTrack(track)
    })

    expect(result.current.letter.tracks).toHaveLength(1)
    expect(result.current.letter.tracks[0]).toEqual(track)
  })

  /**
   * 테스트: 곡 삭제 기능
   * 시나리오: 사용자가 플레이리스트에서 곡을 삭제함
   * Given: 편지에 여러 곡이 있음
   * When: 특정 곡을 삭제함
   * Then: 곡이 플레이리스트에서 제거됨
   */
  it('should remove track from letter', () => {
    const { result } = renderHook(() => useLetter())
    const track1 = { id: '1', title: 'Song 1', artist: 'Artist 1', albumCover: 'cover1.jpg' }
    const track2 = { id: '2', title: 'Song 2', artist: 'Artist 2', albumCover: 'cover2.jpg' }

    act(() => {
      result.current.addTrack(track1)
      result.current.addTrack(track2)
    })

    expect(result.current.letter.tracks).toHaveLength(2)

    act(() => {
      result.current.removeTrack('1')
    })

    expect(result.current.letter.tracks).toHaveLength(1)
    expect(result.current.letter.tracks[0].id).toBe('2')
  })

  /**
   * 테스트: 곡 순서 변경
   * 시나리오: 사용자가 곡의 순서를 변경함
   * Given: 편지에 여러 곡이 있음
   * When: 곡을 드래그하여 순서를 변경함
   * Then: 곡의 순서가 변경됨
   */
  it('should reorder tracks', () => {
    const { result } = renderHook(() => useLetter())
    const track1 = { id: '1', title: 'Song 1', artist: 'Artist 1', albumCover: 'cover1.jpg' }
    const track2 = { id: '2', title: 'Song 2', artist: 'Artist 2', albumCover: 'cover2.jpg' }
    const track3 = { id: '3', title: 'Song 3', artist: 'Artist 3', albumCover: 'cover3.jpg' }

    act(() => {
      result.current.addTrack(track1)
      result.current.addTrack(track2)
      result.current.addTrack(track3)
    })

    expect(result.current.letter.tracks[0].id).toBe('1')

    act(() => {
      result.current.reorderTracks(0, 2)
    })

    expect(result.current.letter.tracks[0].id).toBe('2')
    expect(result.current.letter.tracks[2].id).toBe('1')
  })

  /**
   * 테스트: 메시지 작성
   * 시나리오: 사용자가 편지에 메시지를 작성함
   * Given: 편지 생성 화면에 있음
   * When: 메시지를 입력함
   * Then: 메시지가 편지에 저장됨
   */
  it('should set message', () => {
    const { result } = renderHook(() => useLetter())
    const message = '생일 축하해!'

    act(() => {
      result.current.setMessage(message)
    })

    expect(result.current.letter.message).toBe(message)
  })

  /**
   * 테스트: 메시지 글자 수 제한
   * 시나리오: 사용자가 500자를 초과하는 메시지를 입력함
   * Given: 사용자가 메시지를 작성함
   * When: 메시지가 500자를 초과함
   * Then: 입력이 차단되고 에러 메시지가 표시됨
   */
  it('should reject message over 500 characters', () => {
    const { result } = renderHook(() => useLetter())
    const longMessage = 'a'.repeat(501)

    act(() => {
      expect(() => {
        result.current.setMessage(longMessage)
      }).toThrow('최대 500자까지 입력 가능합니다')
    })
  })

  /**
   * 테스트: 곡에 메모 추가
   * 시나리오: 사용자가 특정 곡에 메모를 추가함
   * Given: 편지에 곡이 있음
   * When: 곡에 메모를 추가함
   * Then: 메모가 곡에 저장됨
   */
  it('should add memo to track', () => {
    const { result } = renderHook(() => useLetter())
    const track = { id: '1', title: 'Song', artist: 'Artist', albumCover: 'cover.jpg' }
    const memo = '이 곡이 가장 좋아하는 곡이야'

    act(() => {
      result.current.addTrack(track)
      result.current.addTrackMemo('1', memo)
    })

    expect(result.current.letter.tracks[0].memo).toBe(memo)
  })

  /**
   * 테스트: 곡 없이 편지 생성 시도
   * 시나리오: 사용자가 곡을 추가하지 않고 편지 생성을 시도함
   * Given: 편지에 곡이 없음
   * When: 편지 생성을 시도함
   * Then: 에러 메시지가 표시되고 편지가 생성되지 않음
   */
  it('should reject letter creation without tracks', async () => {
    const { result } = renderHook(() => useLetter())

    await expect(
      result.current.createLetter()
    ).rejects.toThrow('최소 1곡 이상 추가해주세요')
  })

  /**
   * 테스트: 편지 생성
   * 시나리오: 사용자가 곡과 메시지를 추가하여 편지를 생성함
   * Given: 편지에 최소 1곡과 메시지가 있음
   * When: 편지 생성을 시도함
   * Then: 편지가 생성되고 ID가 반환됨
   */
  it('should create letter with tracks and message', async () => {
    const { result } = renderHook(() => useLetter())
    const track = { id: '1', title: 'Song', artist: 'Artist', albumCover: 'cover.jpg' }

    act(() => {
      result.current.addTrack(track)
      result.current.setMessage('생일 축하해!')
    })

    await waitFor(async () => {
      const letterId = await result.current.createLetter()
      expect(letterId).toBeDefined()
    })
  })
})

