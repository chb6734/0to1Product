/**
 * 데모 모드 유틸리티 테스트
 * 
 * 목적: 데모 모드 관련 로컬 스토리지 관리 기능 검증
 * 시나리오:
 * - 데모 모드 활성화/비활성화
 * - 데모 모드 편지 데이터 저장/로드
 * - 데모 모드에서 로그인 전환 시 데이터 마이그레이션
 * 
 * 기반: PRD v4 - 데모 모드 P0 기능
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isDemoMode,
  enableDemoMode,
  disableDemoMode,
  saveDemoLetter,
  loadDemoLetter,
  clearDemoLetter,
  migrateDemoLetterToServer,
} from '../demoMode'

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('demoMode', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  /**
   * 테스트: 데모 모드 활성화
   * 시나리오: 사용자가 "로그인 없이 체험하기"를 클릭함
   * Given: 데모 모드가 비활성화된 상태
   * When: 데모 모드를 활성화함
   * Then: 로컬 스토리지에 demo_mode 플래그가 저장됨
   */
  it('should enable demo mode', () => {
    enableDemoMode()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('demo_mode', 'true')
    expect(isDemoMode()).toBe(true)
  })

  /**
   * 테스트: 데모 모드 비활성화
   * 시나리오: 사용자가 로그인하여 데모 모드를 종료함
   * Given: 데모 모드가 활성화된 상태
   * When: 데모 모드를 비활성화함
   * Then: 로컬 스토리지에서 demo_mode 플래그가 제거됨
   */
  it('should disable demo mode', () => {
    enableDemoMode()
    expect(isDemoMode()).toBe(true)

    disableDemoMode()

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('demo_mode')
    expect(isDemoMode()).toBe(false)
  })

  /**
   * 테스트: 데모 모드 상태 확인
   * 시나리오: 현재 데모 모드 상태를 확인함
   * Given: 데모 모드가 활성화되지 않은 상태
   * When: 데모 모드 상태를 확인함
   * Then: false를 반환함
   */
  it('should return false when demo mode is not enabled', () => {
    expect(isDemoMode()).toBe(false)
  })

  /**
   * 테스트: 데모 모드 편지 데이터 저장
   * 시나리오: 사용자가 데모 모드로 편지를 생성함
   * Given: 데모 모드가 활성화된 상태
   * When: 편지 데이터를 저장함
   * Then: 로컬 스토리지에 편지 데이터가 저장됨
   */
  it('should save demo letter data', () => {
    enableDemoMode()

    const letterData = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
        { id: '2', title: 'Song 2', artist: 'Artist 2' },
      ],
      message: '테스트 메시지',
      isPrivate: true,
    }

    saveDemoLetter(letterData)

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'demo_letter_data',
      JSON.stringify(letterData)
    )
  })

  /**
   * 테스트: 데모 모드 편지 데이터 로드
   * 시나리오: 사용자가 이전에 만든 데모 편지를 다시 불러옴
   * Given: 로컬 스토리지에 데모 편지 데이터가 저장되어 있음
   * When: 데모 편지 데이터를 로드함
   * Then: 저장된 편지 데이터가 반환됨
   */
  it('should load demo letter data', () => {
    const letterData = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
      ],
      message: '테스트 메시지',
      isPrivate: true,
    }

    localStorageMock.setItem('demo_letter_data', JSON.stringify(letterData))

    const loadedData = loadDemoLetter()

    expect(loadedData).toEqual(letterData)
  })

  /**
   * 테스트: 데모 모드 편지 데이터가 없을 때
   * 시나리오: 저장된 데모 편지가 없음
   * Given: 로컬 스토리지에 데모 편지 데이터가 없음
   * When: 데모 편지 데이터를 로드함
   * Then: null을 반환함
   */
  it('should return null when demo letter data does not exist', () => {
    const loadedData = loadDemoLetter()

    expect(loadedData).toBeNull()
  })

  /**
   * 테스트: 데모 모드 편지 데이터 삭제
   * 시나리오: 사용자가 데모 편지를 삭제함
   * Given: 로컬 스토리지에 데모 편지 데이터가 저장되어 있음
   * When: 데모 편지 데이터를 삭제함
   * Then: 로컬 스토리지에서 데이터가 제거됨
   */
  it('should clear demo letter data', () => {
    const letterData = {
      tracks: [],
      message: '테스트',
      isPrivate: true,
    }

    saveDemoLetter(letterData)
    clearDemoLetter()

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('demo_letter_data')
    expect(loadDemoLetter()).toBeNull()
  })

  /**
   * 테스트: 데모 모드에서 로그인 전환 시 데이터 마이그레이션
   * 시나리오: 사용자가 데모 모드로 만든 편지를 로그인 후 영구 저장함
   * Given: 데모 모드로 편지를 생성함
   * When: 로그인 후 데이터를 마이그레이션함
   * Then: 서버로 편지 데이터가 전송되고 로컬 스토리지가 정리됨
   */
  it('should migrate demo letter to server', async () => {
    enableDemoMode()

    const letterData = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
      ],
      message: '마이그레이션 테스트',
      isPrivate: true,
    }

    saveDemoLetter(letterData)

    // API 호출 모킹
    const mockCreateLetter = vi.fn().mockResolvedValue({ id: 'letter-123' })

    await migrateDemoLetterToServer(mockCreateLetter)

    expect(mockCreateLetter).toHaveBeenCalledWith(letterData)
    expect(loadDemoLetter()).toBeNull()
    expect(isDemoMode()).toBe(false)
  })

  /**
   * 테스트: 마이그레이션 실패 시 데이터 보존
   * 시나리오: 서버로 마이그레이션 중 오류 발생
   * Given: 데모 모드로 편지를 생성함
   * When: 마이그레이션 중 네트워크 오류 발생
   * Then: 로컬 스토리지 데이터가 보존되고 데모 모드도 유지됨
   */
  it('should preserve demo letter data on migration failure', async () => {
    enableDemoMode()

    const letterData = {
      tracks: [{ id: '1', title: 'Song 1', artist: 'Artist 1' }],
      message: '마이그레이션 실패 테스트',
      isPrivate: true,
    }

    saveDemoLetter(letterData)

    const mockCreateLetter = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(migrateDemoLetterToServer(mockCreateLetter)).rejects.toThrow()

    expect(loadDemoLetter()).toEqual(letterData)
    expect(isDemoMode()).toBe(true)
  })
})

