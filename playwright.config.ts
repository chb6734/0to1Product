import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 * 
 * 목적: E2E 테스트 환경 설정
 * 기반: feature_auth.md 테스트 시나리오
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* 테스트 실행 최대 시간 */
  timeout: 30 * 1000,
  expect: {
    /* Assertion 타임아웃 */
    timeout: 5000
  },
  /* 테스트 병렬 실행 */
  fullyParallel: true,
  /* CI에서 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,
  /* 병렬 실행 워커 수 */
  workers: process.env.CI ? 1 : undefined,
  /* 리포터 설정 */
  reporter: 'html',
  /* 공유 설정 */
  use: {
    /* 기본 타임아웃 */
    actionTimeout: 0,
    /* Base URL */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    /* 스크린샷 설정 */
    screenshot: 'only-on-failure',
    /* 비디오 설정 */
    video: 'retain-on-failure',
    /* 트레이스 설정 */
    trace: 'on-first-retry',
  },

  /* 프로젝트 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 필요시 다른 브라우저 추가
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* 개발 서버 설정 */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

