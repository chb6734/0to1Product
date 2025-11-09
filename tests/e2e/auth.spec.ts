import { test, expect } from '@playwright/test';

/**
 * E2E 테스트: 사용자 인증 및 프로필
 * 
 * 기반: tests/scenarios/feature_auth.md
 * 작성자: Quinn QA
 * 
 * 테스트 목표:
 * - 소셜 로그인을 통한 가입 및 로그인 정상 동작 확인
 * - 프로필 수정 기능 정상 동작 확인
 * - 엣지 케이스 적절히 처리 확인
 */

test.describe('사용자 인증 및 프로필 (feature_auth.md)', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto('/login');
  });

  /**
   * TC-AUTH-001: 신규 사용자 가입 (Google 소셜 로그인)
   * 
   * 시나리오: 신규 사용자가 Google 계정으로 가입함
   * 
   * Given:
   * - 사용자가 FAN:STAGE 웹사이트에 처음 방문함
   * - 사용자는 Google 계정을 보유하고 있음
   * 
   * When:
   * 1. "시작하기" 버튼 클릭
   * 2. "Google로 로그인" 선택
   * 3. Google 인증 완료
   * 4. 닉네임 입력 (예: "testuser")
   * 5. 프로필 이미지 선택 (선택적)
   * 6. "완료" 버튼 클릭
   * 
   * Then:
   * - 사용자 계정이 생성됨
   * - 메인 화면으로 리다이렉트됨
   * - 사용자 프로필이 저장됨
   */
  test('TC-AUTH-001: 신규 사용자 가입 (Google 소셜 로그인)', async ({ page, context }) => {
    // 로그인 페이지가 정상 로드되었는지 확인
    await expect(page).toHaveTitle(/FAN:STAGE|FanStage/i);
    
    // "Google로 로그인" 버튼이 존재하는지 확인
    const googleLoginButton = page.getByRole('button', { name: /Google로 로그인/i });
    await expect(googleLoginButton).toBeVisible();
    await expect(googleLoginButton).toBeEnabled();

    // 버튼 클릭 (실제 OAuth 플로우는 외부 리다이렉트이므로 여기서는 버튼 클릭만 확인)
    // 실제 OAuth 인증은 수동으로 확인하거나, 테스트용 계정을 사용해야 함
    await googleLoginButton.click();

    // OAuth 리다이렉트 확인 (Google OAuth 페이지로 이동하는지 확인)
    // 실제 환경에서는 Google OAuth 페이지로 리다이렉트됨
    // 테스트 환경에서는 리다이렉트 URL을 확인
    await page.waitForTimeout(1000); // 리다이렉트 대기

    // OAuth 콜백 후 온보딩 페이지로 리다이렉트되는지 확인
    // (실제 테스트에서는 OAuth 인증 완료 후 확인)
  });

  /**
   * TC-AUTH-002: 신규 사용자 가입 (Kakao 소셜 로그인)
   */
  test('TC-AUTH-002: 신규 사용자 가입 (Kakao 소셜 로그인)', async ({ page }) => {
    // "Kakao로 로그인" 버튼이 존재하는지 확인
    const kakaoLoginButton = page.getByRole('button', { name: /Kakao로 로그인/i });
    await expect(kakaoLoginButton).toBeVisible();
    await expect(kakaoLoginButton).toBeEnabled();

    // 버튼 클릭
    await kakaoLoginButton.click();
    await page.waitForTimeout(1000);
  });

  /**
   * TC-AUTH-003: 신규 사용자 가입 (Apple 소셜 로그인)
   */
  test('TC-AUTH-003: 신규 사용자 가입 (Apple 소셜 로그인)', async ({ page }) => {
    // "Apple로 로그인" 버튼이 존재하는지 확인
    const appleLoginButton = page.getByRole('button', { name: /Apple로 로그인/i });
    await expect(appleLoginButton).toBeVisible();
    await expect(appleLoginButton).toBeEnabled();

    // 버튼 클릭
    await appleLoginButton.click();
    await page.waitForTimeout(1000);
  });

  /**
   * TC-AUTH-E003: 닉네임 미입력 검증
   * 
   * 시나리오: 닉네임을 입력하지 않고 완료 버튼 클릭
   * 
   * Given: 사용자가 닉네임 입력 화면에 있음
   * When: 닉네임을 입력하지 않고 "완료" 버튼 클릭
   * Then:
   * - "닉네임을 입력해주세요" 에러 메시지 표시
   * - 닉네임 입력 필드에 포커스 이동
   */
  test('TC-AUTH-E003: 닉네임 미입력 검증', async ({ page }) => {
    // Mock 인증 상태 설정 (localStorage에 사용자 정보 저장)
    await page.addInitScript(() => {
      localStorage.setItem('fanstage_auth_user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        nickname: undefined, // 온보딩 필요
      }));
    });

    // 온보딩 페이지로 이동
    await page.goto('/onboarding');

    // 초기화 완료 대기
    await page.waitForSelector('text=프로필 설정', { timeout: 10000 });

    // 닉네임 입력 필드 확인
    const nicknameInput = page.getByLabel(/닉네임/i);
    await expect(nicknameInput).toBeVisible();

    // 폼 요소 찾기
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // "완료" 버튼 확인
    const submitButton = page.getByRole('button', { name: /완료/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // 폼 제출 (submit 이벤트 직접 트리거)
    await form.evaluate((form) => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
    });

    // 에러 메시지가 나타날 때까지 대기
    await page.waitForSelector('text=닉네임을 입력해주세요', { timeout: 5000 });

    // 에러 메시지 확인
    const errorMessage = page.getByText(/닉네임을 입력해주세요/i);
    await expect(errorMessage).toBeVisible();

    // 닉네임 입력 필드가 여전히 보이는지 확인 (리다이렉트되지 않았는지)
    await expect(nicknameInput).toBeVisible();
  });

  /**
   * 로그인 페이지 UI 검증
   */
  test('로그인 페이지 UI 요소 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole('heading', { name: /FAN:STAGE/i })).toBeVisible();
    
    // 설명 텍스트 확인
    await expect(page.getByText(/음악으로 모인 사람들이/i)).toBeVisible();

    // 소셜 로그인 버튼 3개 모두 확인
    await expect(page.getByRole('button', { name: /Google로 로그인/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Kakao로 로그인/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Apple로 로그인/i })).toBeVisible();

    // 이용약관 안내 텍스트 확인
    await expect(page.getByText(/이용약관 및 개인정보처리방침/i)).toBeVisible();
  });

  /**
   * 온보딩 페이지 UI 검증
   */
  test('온보딩 페이지 UI 요소 확인', async ({ page }) => {
    // Mock 인증 상태 설정
    await page.addInitScript(() => {
      localStorage.setItem('fanstage_auth_user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        nickname: undefined, // 온보딩 필요
      }));
    });

    // 온보딩 페이지로 이동
    await page.goto('/onboarding');

    // 초기화 완료 대기
    await page.waitForSelector('text=프로필 설정', { timeout: 10000 });

    // 페이지 제목 확인
    await expect(page.getByRole('heading', { name: /프로필 설정/i })).toBeVisible();

    // 닉네임 입력 필드 확인
    const nicknameInput = page.getByLabel(/닉네임/i);
    await expect(nicknameInput).toBeVisible();
    await expect(nicknameInput).toHaveAttribute('maxLength', '20');

    // 프로필 이미지 URL 입력 필드 확인
    const profileImageInput = page.getByLabel(/프로필 이미지 URL/i);
    await expect(profileImageInput).toBeVisible();

    // 완료 버튼 확인
    await expect(page.getByRole('button', { name: /완료/i })).toBeVisible();
  });

  /**
   * 닉네임 길이 제한 검증
   */
  test('닉네임 길이 제한 검증', async ({ page }) => {
    // Mock 인증 상태 설정
    await page.addInitScript(() => {
      localStorage.setItem('fanstage_auth_user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        nickname: undefined, // 온보딩 필요
      }));
    });

    await page.goto('/onboarding');

    // 초기화 완료 대기
    await page.waitForSelector('text=프로필 설정', { timeout: 10000 });

    const nicknameInput = page.getByLabel(/닉네임/i);
    
    // 20자 초과 입력 시도
    const longNickname = 'a'.repeat(21);
    await nicknameInput.fill(longNickname);

    // maxLength 속성으로 인해 20자까지만 입력되어야 함
    const value = await nicknameInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(20);
  });
});

