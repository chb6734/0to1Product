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
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { mockTracks } from '@/mocks/data'

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
    const track = mockTracks[0]

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

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.addTrack(mockTracks[1])
    })

    expect(result.current.letter.tracks).toHaveLength(2)

    act(() => {
      result.current.removeTrack(mockTracks[0].id)
    })

    expect(result.current.letter.tracks).toHaveLength(1)
    expect(result.current.letter.tracks[0].id).toBe(mockTracks[1].id)
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

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.addTrack(mockTracks[1])
      result.current.addTrack(mockTracks[2])
    })

    expect(result.current.letter.tracks[0].id).toBe(mockTracks[0].id)

    act(() => {
      result.current.reorderTracks(0, 2)
    })

    expect(result.current.letter.tracks[0].id).toBe(mockTracks[1].id)
    expect(result.current.letter.tracks[2].id).toBe(mockTracks[0].id)
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
    const memo = '이 곡이 가장 좋아하는 곡이야'

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.addTrackMemo(mockTracks[0].id, memo)
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
   * 테스트: 편지 생성 성공
   * 시나리오: 사용자가 곡과 메시지를 추가하여 편지를 생성함
   * Given: 편지에 최소 1곡과 메시지가 있음
   * When: 편지 생성을 시도함
   * Then: 편지가 생성되고 ID가 반환됨
   */
  it('should create letter with tracks and message', async () => {
    const { result } = renderHook(() => useLetter())

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.setMessage('생일 축하해!')
    })

    await waitFor(async () => {
      const letterId = await result.current.createLetter()
      expect(letterId).toBeDefined()
    })
  })

  /**
   * 테스트: 편지 생성 네트워크 오류 처리
   * 시나리오: 편지 생성 중 네트워크 오류 발생
   * Given: 편지에 곡과 메시지가 있음
   * When: 네트워크 오류가 발생함
   * Then: 에러가 발생하고 편지 데이터는 유지됨
   */
  it('should handle network error during letter creation', async () => {
    // 네트워크 오류 시뮬레이션
    server.use(
      http.post('/api/letters', async () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(() => useLetter())

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.setMessage('network-error')
    })

    await expect(
      result.current.createLetter()
    ).rejects.toThrow()

    // 편지 데이터는 유지되어야 함
    expect(result.current.letter.tracks).toHaveLength(1)
  })

  /**
   * 테스트: 편지 초기화
   * 시나리오: 사용자가 편지를 초기화함
   * Given: 편지에 곡과 메시지가 있음
   * When: 편지를 초기화함
   * Then: 편지가 빈 상태로 돌아감
   */
  it('should reset letter', () => {
    const { result } = renderHook(() => useLetter())

    act(() => {
      result.current.addTrack(mockTracks[0])
      result.current.setMessage('테스트 메시지')
    })

    expect(result.current.letter.tracks).toHaveLength(1)
    expect(result.current.letter.message).toBe('테스트 메시지')

    act(() => {
      result.current.resetLetter()
    })

    expect(result.current.letter.tracks).toHaveLength(0)
    expect(result.current.letter.message).toBe('')
  })
})

