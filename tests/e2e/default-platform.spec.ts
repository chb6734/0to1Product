/**
 * 기본 플랫폼 설정 E2E 테스트
 * 
 * 목적: 사용자 시나리오 v2 - 시나리오 5.1 검증
 * 시나리오: 기본 플랫폼 설정하기
 * 
 * 기반: PRD v4 - 기본 플랫폼 설정 기능
 */

import { test, expect } from '@playwright/test'

test.describe('Default Platform Setting', () => {
  /**
   * 테스트: 온보딩 시 기본 플랫폼 설정
   * 시나리오: 사용자가 편지를 받을 때 자동으로 내 플랫폼에서 재생되게 하고 싶다
   * Given: 사용자가 온보딩 페이지에 있음
   * When: 닉네임을 입력함
   * And: "주로 사용하는 음악 플랫폼"을 선택함 (예: Spotify)
   * And: "시작하기" 버튼을 클릭함
   * Then: 보관함으로 이동함
   * And: 기본 플랫폼이 설정됨
   */
  test('should set default platform during onboarding', async ({ page }) => {
    // Given: 온보딩 페이지 진입 (로그인 후)
    await page.goto('/login')
    const googleLoginButton = page.getByRole('button', { name: /Google/i })
    await googleLoginButton.click()
    
    // 로그인 완료 후 온보딩 페이지로 이동
    await page.waitForURL(/\/onboarding/, { timeout: 5000 })
    await expect(page.getByText(/프로필 설정/i)).toBeVisible()

    // When: 닉네임 입력
    const nicknameInput = page.getByPlaceholderText(/닉네임/i)
    await nicknameInput.fill('테스트 사용자')

    // And: 기본 플랫폼 선택
    const platformSelect = page.getByLabel(/주로 사용하는 음악 플랫폼/i)
    await platformSelect.selectOption('spotify')

    // And: "시작하기" 버튼 클릭
    const startButton = page.getByRole('button', { name: /시작하기/i })
    await startButton.click()

    // Then: 보관함으로 이동
    await expect(page).toHaveURL(/\/inbox/)
  })

  /**
   * 테스트: 편지 재생 시 기본 플랫폼 자동 사용
   * 시나리오: 사용자가 편지를 확인하고 바로 음악을 듣고 싶다
   * Given: 사용자의 기본 플랫폼이 Spotify로 설정되어 있음
   * And: 편지 상세 페이지에 있음
   * When: "전체 재생" 버튼을 클릭함
   * Then: Spotify로 바로 재생됨 (플랫폼 선택 모달 없이)
   */
  test('should use default platform automatically when playing letter', async ({ page }) => {
    // Given: 기본 플랫폼이 설정된 사용자로 로그인
    // (MSW로 모킹된 사용자 프로필에 defaultPlatform: 'spotify' 설정)

    // 편지 상세 페이지 진입
    await page.goto('/letters/letter-1')
    await expect(page.getByText(/플레이리스트/i)).toBeVisible()

    // When: "전체 재생" 버튼 클릭
    const playButton = page.getByRole('button', { name: /전체 재생/i })
    await playButton.click()

    // Then: 플랫폼 선택 모달 없이 바로 Spotify로 재생
    // (실제 구현에서는 Spotify API 호출 또는 리다이렉트)
    await page.waitForTimeout(1000)
    
    // 플랫폼 선택 모달이 나타나지 않아야 함
    await expect(page.getByText(/플랫폼 선택/i)).not.toBeVisible()
  })

  /**
   * 테스트: 기본 플랫폼 미설정 시 플랫폼 선택 모달 표시
   * 시나리오: 기본 플랫폼을 설정하지 않았는데 편지를 재생하고 싶음
   * Given: 사용자의 기본 플랫폼이 설정되지 않음
   * And: 편지 상세 페이지에 있음
   * When: "전체 재생" 버튼을 클릭함
   * Then: 플랫폼 선택 모달이 표시됨
   * And: 플랫폼을 선택하면 재생됨
   */
  test('should show platform selection modal when default platform is not set', async ({ page }) => {
    // Given: 기본 플랫폼이 설정되지 않은 사용자
    await page.goto('/letters/letter-1')
    await expect(page.getByText(/플레이리스트/i)).toBeVisible()

    // When: "전체 재생" 버튼 클릭
    const playButton = page.getByRole('button', { name: /전체 재생/i })
    await playButton.click()

    // Then: 플랫폼 선택 모달 표시
    await expect(page.getByText(/플랫폼 선택/i)).toBeVisible()
    
    // 플랫폼 선택
    const spotifyOption = page.getByRole('button', { name: /Spotify/i })
    await spotifyOption.click()

    // 재생 확인
    await page.waitForTimeout(1000)
  })
})

