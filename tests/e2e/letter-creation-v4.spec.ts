/**
 * 편지 생성 플로우 E2E 테스트 (PRD v4)
 * 
 * 목적: 사용자 시나리오 v2 - 시나리오 3.1 검증
 * 시나리오: 기본 편지 생성 (간소화)
 * 
 * 기반: PRD v4 - 편지 생성 플로우 단순화
 */

import { test, expect } from '@playwright/test'

test.describe('편지 생성 플로우 v4', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 가정 (MSW로 모킹)
    await page.goto('/')
    // 로그인 프로세스는 MSW로 처리됨
  })

  /**
   * 테스트: 기본 편지 생성 (간소화된 플로우)
   * 시나리오: 사용자가 빠르게 편지를 만들고 싶다
   * Given: 사용자가 로그인되어 있고 편지 생성 페이지에 있음
   * When: 곡을 검색하고 추가함 (3곡)
   * And: 메시지를 작성함
   * And: "완료 및 공유" 버튼을 클릭함
   * Then: 완성 모달이 표시됨
   * And: 링크 복사 및 QR 코드가 표시됨
   * And: "완료" 버튼 클릭 시 보관함으로 이동함
   */
  test('간소화된 플로우로 편지 생성', async ({ page }) => {
    // Given: 편지 생성 페이지 진입
    await page.goto('/create')
    await expect(page.getByText(/음악 편지 만들기/i)).toBeVisible()

    // When: 곡 검색 및 추가 (3곡)
    const searchInput = page.getByPlaceholder(/곡.*검색/i)
    await searchInput.fill('겨울 노래')
    await page.waitForTimeout(500)

    // 첫 번째 곡 추가
    const addButtons = page.getByRole('button', { name: /추가/i })
    await addButtons.first().click()
    await page.waitForTimeout(300)

    // 두 번째 곡 추가
    await searchInput.fill('크리스마스')
    await page.waitForTimeout(500)
    await addButtons.first().click()
    await page.waitForTimeout(300)

    // 세 번째 곡 추가
    await searchInput.fill('눈')
    await page.waitForTimeout(500)
    await addButtons.first().click()

    // And: 메시지 작성
    const messageInput = page.getByPlaceholder(/메시지/i)
    await messageInput.fill('요즘 날씨가 추워지면서 자꾸 듣게 되는 곡들이에요. 추운 겨울밤, 창밖을 보며 들으면 정말 좋아요.')

    // And: "완료 및 공유" 버튼 클릭
    const completeButton = page.getByRole('button', { name: /완료.*공유/i })
    await completeButton.click()

    // Then: 완성 모달 표시
    await expect(page.getByText(/편지가 완성되었습니다/i)).toBeVisible()
    await expect(page.getByText(/링크.*복사/i)).toBeVisible()
    await expect(page.getByText(/QR 코드/i)).toBeVisible()

    // 완료 버튼 클릭 (완성 모달의 완료 버튼)
    await expect(page.getByText(/편지가 완성되었습니다/i)).toBeVisible();
    const modalContainer = page.locator('.fixed.inset-0').filter({ hasText: /편지가 완성되었습니다/i });
    const finishButton = modalContainer.getByRole('button', { name: /^완료$/i });
    await finishButton.click();

    // 보관함으로 이동 확인
    await expect(page).toHaveURL(/\/inbox/)
  })

  /**
   * 테스트: 완성 모달에서 링크 복사
   * 시나리오: 사용자가 완성 모달에서 링크를 복사함
   * Given: 편지가 완성되어 완성 모달이 표시됨
   * When: 링크 복사 버튼을 클릭함
   * Then: 링크가 클립보드에 복사됨
   * And: "링크가 복사되었습니다" 토스트 메시지가 표시됨
   */
  test('완성 모달에서 링크 복사', async ({ page }) => {
    await page.goto('/create')

    // 편지 생성 완료 (간소화)
    const searchInput = page.getByPlaceholder(/곡.*검색/i)
    await searchInput.fill('Song')
    await page.waitForTimeout(500)
    
    const addButton = page.getByRole('button', { name: /추가/i }).first()
    await addButton.click()

    const messageInput = page.getByPlaceholder(/메시지/i)
    await messageInput.fill('링크 복사 테스트')

    const completeButton = page.getByRole('button', { name: /완료.*공유/i })
    await completeButton.click()

    await expect(page.getByText(/편지가 완성되었습니다/i)).toBeVisible()

    // When: 링크 복사 버튼 클릭
    const copyButton = page.getByRole('button', { name: /복사/i })
    await copyButton.click()

    // Then: 토스트 메시지 확인
    await expect(page.getByText(/링크가 복사되었습니다/i)).toBeVisible()

    // 클립보드 확인
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('fanstage.com')
  })
})

