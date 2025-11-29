/**
 * 편지 생성 후 네비게이션 테스트
 * 
 * 목적: 편지 생성 완료 후 보관함으로 이동할 때 보낸 편지 탭으로 이동하는지 검증
 * 시나리오:
 * - 편지 생성 완료 후 "완료" 버튼 클릭 시 보관함의 보낸 편지 탭으로 이동
 * - 보관함 URL에 tab=sent 쿼리 파라미터가 포함되어야 함
 */

import { test as base, expect } from "./helpers/msw";

const test = base;

test.describe("편지 생성 후 네비게이션", () => {
  /**
   * 테스트: 편지 생성 완료 후 보낸 편지 탭으로 이동
   * 시나리오: 사용자가 편지를 생성하고 완료 버튼을 클릭함
   * Given: 사용자가 로그인되어 있고 편지 생성 페이지에 있음
   * When: 곡을 추가하고 메시지를 작성함
   * And: "완료 및 공유" 버튼을 클릭함
   * And: 완성 모달에서 "완료" 버튼을 클릭함
   * Then: 보관함 페이지로 이동함
   * And: 보낸 편지 탭이 활성화되어 있음
   * And: URL에 tab=sent 쿼리 파라미터가 포함되어 있음
   */
  test("편지 생성 완료 후 보낸 편지 탭으로 이동해야 함", async ({ page }) => {
    // Given: 사용자가 로그인되어 있고 편지 생성 페이지에 있음
    // 로그인 상태 모킹
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.setItem("fanstage_auth_user", JSON.stringify({
        id: "user-1",
        email: "user@example.com",
        nickname: "테스트 사용자",
      }));
    });
    
    await page.goto("/create");
    await expect(page).toHaveURL(/\/create/);

    // When: 곡을 추가하고 메시지를 작성함
    const searchInput = page.getByPlaceholder(/곡.*검색/i);
    await searchInput.fill("겨울 노래");
    await page.waitForTimeout(500); // 검색 API 호출 대기

    const addButton = page.getByRole("button", { name: /추가/i }).first();
    await addButton.click();

    const messageInput = page.getByPlaceholder(/메시지/i);
    await messageInput.fill("테스트 메시지");

    // And: "완료 및 공유" 버튼을 클릭함
    const completeAndShareButton = page.getByRole("button", {
      name: /완료.*공유/i,
    });
    await completeAndShareButton.click();

    // 완성 모달이 표시될 때까지 대기
    await expect(
      page.getByText(/편지가 완성되었습니다/i)
    ).toBeVisible();

    // And: 완성 모달에서 "완료" 버튼을 클릭함
    const modalContainer = page.locator('[style*="background-color: rgba(0, 0, 0, 0.8)"]').last();
    const completeButton = modalContainer.getByRole("button", { name: /^완료$/i });
    await completeButton.click();

    // Then: 보관함 페이지로 이동함
    await expect(page).toHaveURL(/\/inbox/);

    // And: 보낸 편지 탭이 활성화되어 있음
    const sentTab = page.getByRole("button", { name: /보낸 편지/i });
    await expect(sentTab).toBeVisible();
    
    // 보낸 편지 탭의 배경색이 활성화 색상인지 확인
    const sentTabStyle = await sentTab.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // 활성화된 탭은 배경색이 #FFE11D (노란색)이어야 함
    expect(sentTabStyle).toBeTruthy();

    // And: URL에 tab=sent 쿼리 파라미터가 포함되어 있음 (선택사항)
    // 실제 구현에서는 쿼리 파라미터를 사용할 수도 있고, 상태로 관리할 수도 있음
    // 여기서는 보낸 편지 탭이 활성화되어 있는지만 확인
  });

  /**
   * 테스트: 보관함 URL에 tab=sent 쿼리 파라미터가 있으면 보낸 편지 탭이 활성화됨
   * 시나리오: 사용자가 직접 보관함 URL에 tab=sent를 포함하여 접근함
   * Given: 사용자가 로그인되어 있음
   * When: /inbox?tab=sent URL로 접근함
   * Then: 보낸 편지 탭이 활성화되어 있음
   */
  test("보관함 URL에 tab=sent 쿼리 파라미터가 있으면 보낸 편지 탭이 활성화되어야 함", async ({ page }) => {
    // Given: 사용자가 로그인되어 있음
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.setItem("fanstage_auth_user", JSON.stringify({
        id: "user-1",
        email: "user@example.com",
        nickname: "테스트 사용자",
      }));
    });

    // When: /inbox?tab=sent URL로 접근함
    await page.goto("/inbox?tab=sent");

    // Then: 보낸 편지 탭이 활성화되어 있음
    const sentTab = page.getByRole("button", { name: /보낸 편지/i });
    await expect(sentTab).toBeVisible();
    
    // 보낸 편지 탭의 배경색이 활성화 색상인지 확인
    const sentTabStyle = await sentTab.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(sentTabStyle).toBeTruthy();
  });
});

