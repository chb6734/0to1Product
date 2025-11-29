/**
 * 데모 모드 유틸리티
 * 
 * 목적: 데모 모드 관련 로컬 스토리지 관리
 * 기능:
 * - 데모 모드 활성화/비활성화
 * - 데모 모드 편지 데이터 저장/로드
 * - 데모 모드에서 로그인 전환 시 데이터 마이그레이션
 */

export interface DemoLetterData {
  tracks: Array<{ id: string; title: string; artist: string }>
  message: string
  isPrivate: boolean
}

const DEMO_MODE_KEY = 'demo_mode'
const DEMO_LETTER_DATA_KEY = 'demo_letter_data'

/**
 * 데모 모드 활성화 여부 확인
 */
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DEMO_MODE_KEY) === 'true'
}

/**
 * 데모 모드 활성화
 */
export function enableDemoMode(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEMO_MODE_KEY, 'true')
}

/**
 * 데모 모드 비활성화
 */
export function disableDemoMode(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(DEMO_MODE_KEY)
}

/**
 * 데모 모드 편지 데이터 저장
 */
export function saveDemoLetter(data: DemoLetterData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEMO_LETTER_DATA_KEY, JSON.stringify(data))
}

/**
 * 데모 모드 편지 데이터 로드
 */
export function loadDemoLetter(): DemoLetterData | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(DEMO_LETTER_DATA_KEY)
  return data ? JSON.parse(data) : null
}

/**
 * 데모 모드 편지 데이터 삭제
 */
export function clearDemoLetter(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(DEMO_LETTER_DATA_KEY)
}

/**
 * 데모 모드에서 로그인 전환 시 데이터 마이그레이션
 */
export async function migrateDemoLetterToServer(
  createLetterFn: (data: DemoLetterData) => Promise<{ id: string }>
): Promise<void> {
  const demoData = loadDemoLetter()
  if (!demoData) {
    return
  }

  try {
    await createLetterFn(demoData)
    clearDemoLetter()
    disableDemoMode()
  } catch (error) {
    // 마이그레이션 실패 시 데이터 보존
    throw error
  }
}

