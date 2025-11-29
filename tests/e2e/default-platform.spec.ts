/**
 * 기본 플랫폼 설정 E2E 테스트
 *
 * 목적: 사용자 시나리오 v2 - 시나리오 5.1 검증
 * 시나리오: 기본 플랫폼 설정하기
 *
 * 기반: PRD v4 - 기본 플랫폼 설정 기능
 */

import { test as base, expect } from "@playwright/test";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// MSW 서버 설정
const server = setupServer(
  // 프로필 업데이트 API Mock
  http.put("/api/auth/profile", async ({ request }) => {
    const body = (await request.json()) as {
      nickname?: string;
      profileImage?: string;
      defaultPlatform?: string | null;
    };
    
    // 요청 본문에 따라 사용자 데이터 생성
    const user = {
      id: "test-user-id",
      email: "test@example.com",
      nickname: body.nickname,
      profileImage: body.profileImage,
      defaultPlatform: body.defaultPlatform !== undefined ? body.defaultPlatform : undefined,
      createdAt: new Date().toISOString(),
    };
    
    return HttpResponse.json({ user });
  })
);

// MSW 서버 시작/종료
test.beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
});

test.afterEach(() => {
  server.resetHandlers();
});

test.afterAll(() => {
  server.close();
});

const test = base;

test.describe("Default Platform Setting", () => {
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
  test("should set default platform during onboarding", async ({ page }) => {
    // Given: 온보딩 페이지 진입 (로그인 후)
    // Mock 인증 상태 설정 (온보딩 필요 상태)
    await page.addInitScript(() => {
      localStorage.setItem(
        "fanstage_auth_user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          nickname: undefined, // 온보딩 필요
        })
      );
    });

    await page.goto("/onboarding");

    // 초기화 완료 대기
    await expect(
      page.getByRole("heading", { name: /프로필 설정/i })
    ).toBeVisible();

    // When: 닉네임 입력
    const nicknameInput = page.getByPlaceholder(/닉네임을 입력하세요/i);
    await nicknameInput.fill("테스트 사용자");

    // And: 기본 플랫폼 선택
    // label 텍스트로 찾고, 그 다음에 있는 select 요소 사용
    const platformLabel = page.getByText(/주로 사용하는 음악 플랫폼/i);
    await expect(platformLabel).toBeVisible();

    const platformSelect = page
      .locator("select")
      .filter({ hasText: /없음.*나중에 설정/i });
    await platformSelect.selectOption("spotify");

    // And: "시작하기" 버튼 클릭
    const startButton = page.getByRole("button", { name: /시작하기/i });
    await expect(startButton).toBeEnabled();

    // API 호출 완료 대기 (프로필 업데이트 + 기본 플랫폼 설정)
    // 두 개의 PUT 요청이 발생: updateProfile과 setDefaultPlatform
    const responsePromise1 = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/profile") &&
        response.request().method() === "PUT" &&
        response.request().postDataJSON()?.nickname === "테스트 사용자"
    );
    const responsePromise2 = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/profile") &&
        response.request().method() === "PUT" &&
        response.request().postDataJSON()?.defaultPlatform === "spotify"
    );

    await startButton.click();

    // 두 API 호출이 모두 완료될 때까지 대기
    const [response1, response2] = await Promise.all([
      responsePromise1,
      responsePromise2,
    ]);

    // 응답 확인
    expect(response1.ok()).toBeTruthy();
    expect(response2.ok()).toBeTruthy();

    // Then: 보관함으로 이동
    await expect(page).toHaveURL(/\/inbox/, { timeout: 10000 });
  });

  /**
   * 테스트: 편지 재생 시 기본 플랫폼 자동 사용
   * 시나리오: 사용자가 편지를 확인하고 바로 음악을 듣고 싶다
   * Given: 사용자의 기본 플랫폼이 Spotify로 설정되어 있음
   * And: 편지 상세 페이지에 있음
   * When: "전체 재생" 버튼을 클릭함
   * Then: Spotify로 바로 재생됨 (플랫폼 선택 모달 없이)
   */
  test("should use default platform automatically when playing letter", async ({
    page,
  }) => {
    // Given: 기본 플랫폼이 설정된 사용자로 로그인
    await page.addInitScript(() => {
      localStorage.setItem(
        "fanstage_auth_user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          nickname: "테스트 사용자",
          defaultPlatform: "spotify", // 기본 플랫폼 설정
        })
      );
    });

    // 편지 상세 페이지 진입
    await page.goto("/letters/letter-1");
    await expect(page.getByText(/플레이리스트/i)).toBeVisible();

    // When: "전체 재생" 버튼 클릭
    const playButton = page.getByRole("button", { name: /전체 재생/i });
    await playButton.click();

    // Then: 플랫폼 선택 모달 없이 바로 Spotify로 재생
    // (실제 구현에서는 Spotify API 호출 또는 리다이렉트)
    await page.waitForTimeout(1000);

    // 플랫폼 선택 모달이 나타나지 않아야 함
    await expect(page.getByText(/플랫폼 선택/i)).not.toBeVisible();
  });

  /**
   * 테스트: 기본 플랫폼 미설정 시 플랫폼 선택 모달 표시
   * 시나리오: 기본 플랫폼을 설정하지 않았는데 편지를 재생하고 싶음
   * Given: 사용자의 기본 플랫폼이 설정되지 않음
   * And: 편지 상세 페이지에 있음
   * When: "전체 재생" 버튼을 클릭함
   * Then: 플랫폼 선택 모달이 표시됨
   * And: 플랫폼을 선택하면 재생됨
   */
  test("should show platform selection modal when default platform is not set", async ({
    page,
  }) => {
    // Given: 기본 플랫폼이 설정되지 않은 사용자
    await page.addInitScript(() => {
      localStorage.setItem(
        "fanstage_auth_user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          nickname: "테스트 사용자",
          defaultPlatform: null, // 기본 플랫폼 미설정
        })
      );
    });

    await page.goto("/letters/letter-1");
    await expect(page.getByText(/플레이리스트/i)).toBeVisible();

    // When: "전체 재생" 버튼 클릭
    const playButton = page.getByRole("button", { name: /전체 재생/i });
    await playButton.click();

    // Then: 플랫폼 선택 모달 표시
    await expect(page.getByText(/플랫폼 선택/i)).toBeVisible({ timeout: 5000 });

    // 플랫폼 선택
    const spotifyOption = page.getByRole("button", { name: /Spotify/i });
    await expect(spotifyOption).toBeVisible();
    await spotifyOption.click();

    // 모달이 닫혔는지 확인
    await expect(page.getByText(/플랫폼 선택/i)).not.toBeVisible({
      timeout: 2000,
    });
  });
});
