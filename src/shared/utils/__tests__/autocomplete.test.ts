/**
 * 곡 검색 자동완성 유틸리티 테스트
 * 
 * 목적: 곡 검색 자동완성 기능 검증
 * 시나리오:
 * - 검색어 입력 시 자동완성 제안 생성
 * - 2글자 이상부터 자동완성 시작
 * - 최대 5개까지 제안 표시
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateAutocompleteSuggestions } from '../autocomplete'

describe('곡 검색 자동완성', () => {
  const mockTracks = [
    { title: '겨울 노래', artist: '겨울 아티스트' },
    { title: '겨울밤', artist: '밤 아티스트' },
    { title: '겨울왕국', artist: '디즈니' },
    { title: '크리스마스 캐럴', artist: '크리스마스 아티스트' },
    { title: '눈의 꽃', artist: '눈 아티스트' },
    { title: 'Song', artist: 'Test Artist' },
  ]

  /**
   * 테스트: 2글자 이상 입력 시 자동완성 제안 생성
   * 시나리오: 사용자가 "겨울"을 입력하면 관련 제안이 표시됨
   * Given: 곡 목록이 있음
   * When: "겨울"을 입력함
   * Then: "겨울 노래", "겨울밤", "겨울왕국" 등 제안이 생성됨
   */
  it('2글자 이상 입력 시 자동완성 제안 생성', () => {
    const suggestions = generateAutocompleteSuggestions('겨울', mockTracks)
    
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions).toContain('겨울 노래')
    expect(suggestions).toContain('겨울밤')
    expect(suggestions).toContain('겨울왕국')
  })

  /**
   * 테스트: 1글자 입력 시 자동완성 미표시
   * 시나리오: 사용자가 "겨"를 입력하면 자동완성이 표시되지 않음
   * Given: 곡 목록이 있음
   * When: "겨"를 입력함 (1글자)
   * Then: 빈 배열 반환
   */
  it('1글자 입력 시 자동완성 미표시', () => {
    const suggestions = generateAutocompleteSuggestions('겨', mockTracks)
    
    expect(suggestions).toHaveLength(0)
  })

  /**
   * 테스트: 최대 5개까지 제안 표시
   * 시나리오: 검색어에 맞는 결과가 많아도 최대 5개만 표시됨
   * Given: 많은 곡 목록이 있음
   * When: 넓은 검색어를 입력함
   * Then: 최대 5개까지만 제안됨
   */
  it('최대 5개까지 제안 표시', () => {
    const manyTracks = Array.from({ length: 20 }, (_, i) => ({
      title: `겨울 노래 ${i}`,
      artist: '아티스트',
    }))
    
    const suggestions = generateAutocompleteSuggestions('겨울', manyTracks)
    
    expect(suggestions.length).toBeLessThanOrEqual(5)
  })

  /**
   * 테스트: 아티스트명으로도 자동완성 제안 생성
   * 시나리오: 사용자가 아티스트명을 입력하면 해당 아티스트명이 제안됨
   * Given: 곡 목록이 있음
   * When: "겨울 아"를 입력함
   * Then: "겨울 아티스트"가 제안됨
   */
  it('아티스트명으로도 자동완성 제안 생성', () => {
    const suggestions = generateAutocompleteSuggestions('겨울 아', mockTracks)
    
    expect(suggestions).toContain('겨울 아티스트')
  })

  /**
   * 테스트: 검색어가 없을 때 빈 배열 반환
   * 시나리오: 빈 검색어를 입력하면 자동완성이 표시되지 않음
   * Given: 곡 목록이 있음
   * When: 빈 문자열을 입력함
   * Then: 빈 배열 반환
   */
  it('검색어가 없을 때 빈 배열 반환', () => {
    const suggestions = generateAutocompleteSuggestions('', mockTracks)
    
    expect(suggestions).toHaveLength(0)
  })

  /**
   * 테스트: 대소문자 구분 없이 검색
   * 시나리오: 대문자로 입력해도 소문자 결과가 매칭됨
   * Given: 곡 목록이 있음
   * When: "겨울"을 대문자로 입력함
   * Then: 소문자 결과도 매칭됨
   */
  it('대소문자 구분 없이 검색', () => {
    const suggestions = generateAutocompleteSuggestions('SONG', mockTracks)
    
    expect(suggestions).toContain('Song')
  })
})

