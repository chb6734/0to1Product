/**
 * 편지 임시 저장 유틸리티 테스트
 * 
 * 목적: 편지 임시 저장 및 복구 기능 검증
 * 시나리오:
 * - 편지 데이터 임시 저장
 * - localStorage에서 복구
 * - 임시 저장 데이터 삭제
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { letterDraftUtils } from '../letterDraft'

describe('편지 임시 저장', () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  /**
   * 테스트: 편지 임시 저장
   * 시나리오: 사용자가 편지를 작성 중일 때 임시 저장됨
   * Given: 편지 데이터가 있음
   * When: 임시 저장 함수를 호출함
   * Then: localStorage에 저장됨
   */
  it('편지 임시 저장', () => {
    const draft = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
        { id: '2', title: 'Song 2', artist: 'Artist 2' },
      ],
      message: '테스트 메시지',
    }

    letterDraftUtils.saveDraft(draft)

    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    expect(stored).not.toBeNull()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.tracks).toHaveLength(2)
    expect(parsed.message).toBe('테스트 메시지')
    expect(parsed.savedAt).toBeDefined()
  })

  /**
   * 테스트: 임시 저장된 편지 복구
   * 시나리오: 사용자가 편지 생성 페이지로 돌아오면 이전 데이터가 복구됨
   * Given: localStorage에 임시 저장 데이터가 있음
   * When: 복구 함수를 호출함
   * Then: 저장된 데이터가 반환됨
   */
  it('임시 저장된 편지 복구', () => {
    const draft = {
      tracks: [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
      ],
      message: '복구 테스트',
    }

    letterDraftUtils.saveDraft(draft)
    const loaded = letterDraftUtils.loadDraft()

    expect(loaded).not.toBeNull()
    expect(loaded!.tracks).toHaveLength(1)
    expect(loaded!.message).toBe('복구 테스트')
  })

  /**
   * 테스트: 임시 저장 데이터 삭제
   * 시나리오: 편지 완성 후 임시 저장 데이터가 삭제됨
   * Given: localStorage에 임시 저장 데이터가 있음
   * When: 삭제 함수를 호출함
   * Then: localStorage에서 제거됨
   */
  it('임시 저장 데이터 삭제', () => {
    const draft = {
      tracks: [{ id: '1', title: 'Song', artist: 'Artist' }],
      message: '삭제 테스트',
    }

    letterDraftUtils.saveDraft(draft)
    expect(letterDraftUtils.hasDraft()).toBe(true)

    letterDraftUtils.clearDraft()
    expect(letterDraftUtils.hasDraft()).toBe(false)
    expect(letterDraftUtils.loadDraft()).toBeNull()
  })

  /**
   * 테스트: 임시 저장 데이터 없을 때 null 반환
   * 시나리오: 임시 저장 데이터가 없으면 복구 시 null 반환
   * Given: localStorage에 임시 저장 데이터가 없음
   * When: 복구 함수를 호출함
   * Then: null 반환
   */
  it('임시 저장 데이터 없을 때 null 반환', () => {
    const loaded = letterDraftUtils.loadDraft()
    
    expect(loaded).toBeNull()
  })

  /**
   * 테스트: 잘못된 JSON 데이터 처리
   * 시나리오: localStorage에 잘못된 데이터가 있으면 에러 없이 null 반환
   * Given: localStorage에 잘못된 JSON 데이터가 있음
   * When: 복구 함수를 호출함
   * Then: null 반환 (에러 발생하지 않음)
   */
  it('잘못된 JSON 데이터 처리', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, 'invalid json')
    
    const loaded = letterDraftUtils.loadDraft()
    
    expect(loaded).toBeNull()
  })
})

