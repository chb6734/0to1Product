/**
 * 데모 모드 플로우 E2E 테스트
 *
 * 목적: 사용자 시나리오 v2 - 시나리오 1.1, 2.1, 2.2 검증
 * 시나리오:
 * - 로그인 없이 서비스 체험하기
 * - 데모 모드로 편지 만들기
 * - 데모 모드에서 영구 저장하기
 *
 * 기반: PRD v4 - 데모 모드 P0 기능
 */

import { test, expect } from "@playwright/test";

test.describe("Demo Mode Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  /**
   * 테스트: 로그인 없이 서비스 체험하기
   * 시나리오: 사용자가 서비스를 먼저 체험해보고 싶다
   * Given: 사용자가 랜딩 페이지에 있음
   * When: "로그인 없이 체험하기" 버튼을 클릭함
   * Then: 편지 생성 페이지로 이동함 (데모 모드)
   * And: 상단에 "데모 모드" 배지가 표시됨
   */
  test("should enter demo mode from landing page", async ({ page }) => {
    // Given: 랜딩 페이지에 있음
    await expect(page.getByText(/어떤 플랫폼이든/i)).toBeVisible();

    // When: "로그인 없이 체험하기" 버튼 클릭
    const demoButton = page.getByRole("button", {
      name: /로그인 없이 체험하기/i,
    });
    await demoButton.click();

    // Then: 편지 생성 페이지로 이동
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByText(/데모 모드/i)).toBeVisible();
  });

  /**
   * 테스트: 데모 모드로 편지 만들기
   * 시나리오: 사용자가 로그인 없이 편지를 만들어보고 싶다
   * Given: 사용자가 데모 모드로 편지 생성 페이지에 있음
   * When: 곡을 검색하고 추가함
   * And: 메시지를 작성함
   * And: "완료 및 공유" 버튼을 클릭함
   * Then: 완성 모달이 표시됨
   * And: "임시 링크 (24시간 후 만료)" 메시지가 표시됨
   */
  test("should create letter in demo mode", async ({ page }) => {
    // Given: 데모 모드로 편지 생성 페이지 진입
    await page.goto("/create?demo=true");
    await expect(page.getByText(/데모 모드/i)).toBeVisible();

    // When: 곡 검색 및 추가
    const searchInput = page.getByPlaceholder(/곡.*검색/i);
    await searchInput.fill("겨울 노래");

    // 검색 결과 대기 및 곡 추가
    await page.waitForTimeout(500); // 검색 API 호출 대기
    const addButton = page.getByRole("button", { name: /추가/i }).first();
    await addButton.click();

    // And: 메시지 작성
    const messageInput = page.getByPlaceholder(/메시지/i);
    await messageInput.fill(
      "요즘 날씨가 추워지면서 자꾸 듣게 되는 곡들이에요."
    );

    // And: "완료 및 공유" 버튼 클릭
    const completeButton = page.getByRole("button", { name: /완료.*공유/i });
    await completeButton.click();

    // Then: 완성 모달 표시
    await expect(page.getByText(/편지가 완성되었습니다/i)).toBeVisible();
    await expect(page.getByText(/임시 링크.*24시간/i)).toBeVisible();
  });

  /**
   * 테스트: 데모 모드에서 영구 저장하기
   * 시나리오: 사용자가 데모 모드로 만든 편지를 영구적으로 저장하고 싶다
   * Given: 데모 모드로 편지를 생성 완료함
   * When: "영구 저장하려면 로그인하기" 버튼을 클릭함
   * Then: 로그인 페이지로 이동함
   * And: 로그인 완료 후 보관함으로 이동함
   * And: 편지가 보관함에 저장되어 있음
   */
  test("should migrate demo letter to server on login", async ({ page }) => {
    // Given: 데모 모드로 편지 생성 완료
    await page.goto("/create?demo=true");

    const searchInput = page.getByPlaceholder(/곡.*검색/i);
    await searchInput.fill("Song");
    await page.waitForTimeout(500);

    const addButton = page.getByRole("button", { name: /추가/i }).first();
    await addButton.click();

    const messageInput = page.getByPlaceholder(/메시지/i);
    await messageInput.fill("마이그레이션 테스트");

    const completeButton = page.getByRole("button", { name: /완료.*공유/i });
    await completeButton.click();

    await expect(page.getByText(/편지가 완성되었습니다/i)).toBeVisible();

    // When: "영구 저장하려면 로그인하기" 버튼 클릭
    const loginButton = page.getByRole("button", {
      name: /영구 저장.*로그인/i,
    });
    await loginButton.click();

    // Then: 로그인 페이지로 이동
    await expect(page).toHaveURL(/\/login/);

    // 로그인 완료 (MSW로 모킹)
    const googleLoginButton = page.getByRole("button", {
      name: /Google 계정으로 계속하기/i,
    });
    await googleLoginButton.click();

    // 로그인 완료 후 온보딩 또는 보관함으로 이동 확인
    await page.waitForTimeout(1000);

    // 온보딩이 필요한 경우 온보딩 페이지로 이동
    if (page.url().includes("/onboarding")) {
      const nicknameInput = page.getByPlaceholder(/닉네임/i);
      await nicknameInput.fill("테스트 사용자");

      const startButton = page.getByRole("button", { name: /시작하기/i });
      await startButton.click();
    }

    // 보관함에서 편지 확인
    await expect(page).toHaveURL(/\/inbox/);
    await expect(page.getByText(/마이그레이션 테스트/i)).toBeVisible();
  });
});
