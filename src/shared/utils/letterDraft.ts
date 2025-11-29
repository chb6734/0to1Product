/**
 * 편지 임시 저장 유틸리티
 * 
 * 목적: 편지 작성 중 임시 저장 및 복구 기능 제공
 * 기능:
 * - 편지 데이터 임시 저장 (localStorage)
 * - 임시 저장 데이터 복구
 * - 임시 저장 데이터 삭제
 */

const DRAFT_STORAGE_KEY = 'fanstage_letter_draft'

export interface LetterDraft {
  tracks: Array<{ id: string; title: string; artist: string }>
  message: string
  savedAt: string
}

export const letterDraftUtils = {
  /**
   * 편지 임시 저장
   * 
   * @param draft 편지 데이터
   */
  saveDraft(draft: Omit<LetterDraft, 'savedAt'>): void {
    if (typeof window === 'undefined') return
    
    const draftWithTimestamp: LetterDraft = {
      ...draft,
      savedAt: new Date().toISOString(),
    }
    
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftWithTimestamp))
  },

  /**
   * 임시 저장된 편지 복구
   * 
   * @returns 임시 저장된 편지 데이터 또는 null
   */
  loadDraft(): LetterDraft | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!stored) return null
      
      return JSON.parse(stored) as LetterDraft
    } catch (error) {
      console.error('[letterDraft] 복구 실패:', error)
      return null
    }
  },

  /**
   * 임시 저장 데이터 삭제
   */
  clearDraft(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  },

  /**
   * 임시 저장 데이터 존재 여부 확인
   * 
   * @returns 임시 저장 데이터가 있으면 true
   */
  hasDraft(): boolean {
    if (typeof window === 'undefined') return false
    
    return localStorage.getItem(DRAFT_STORAGE_KEY) !== null
  },
}

