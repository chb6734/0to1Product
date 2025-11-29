import { test as base } from "@playwright/test";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

/**
 * MSW를 사용한 테스트 환경 설정
 *
 * 목적: E2E 테스트에서 Mock 인증 상태 제공
 */

// Mock 사용자 데이터 생성 함수
function createMockUser(overrides?: {
  id?: string;
  email?: string;
  nickname?: string;
  profileImage?: string;
}) {
  const id = overrides?.id || `user-${Date.now()}`;
  const email = overrides?.email || `user${Date.now()}@example.com`;
  const nickname = overrides?.nickname;
  const profileImage =
    overrides?.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
  const createdAt = new Date().toISOString();

  return {
    id,
    email,
    nickname,
    profileImage,
    createdAt,
  };
}

// MSW 서버 설정
const server = setupServer(
  // 로그인 API Mock
  http.post("/api/auth/login/google", async () => {
    const user = createMockUser({
      email: "test@example.com",
      nickname: undefined, // 신규 사용자는 닉네임 없음
    });
    const { nickname, ...userWithoutNickname } = user;
    const responseUser = nickname === undefined ? userWithoutNickname : user;
    return HttpResponse.json({ user: responseUser, token: "mock-jwt-token" });
  }),

  http.post("/api/auth/login/kakao", async () => {
    const user = createMockUser({
      email: "kakao@example.com",
      nickname: undefined,
    });
    const { nickname, ...userWithoutNickname } = user;
    const responseUser = nickname === undefined ? userWithoutNickname : user;
    return HttpResponse.json({ user: responseUser, token: "mock-jwt-token" });
  }),

  http.post("/api/auth/login/apple", async () => {
    const user = createMockUser({
      email: "apple@example.com",
      nickname: undefined,
    });
    const { nickname, ...userWithoutNickname } = user;
    const responseUser = nickname === undefined ? userWithoutNickname : user;
    return HttpResponse.json({ user: responseUser, token: "mock-jwt-token" });
  }),

  // 프로필 업데이트 API Mock
  http.put("/api/auth/profile", async ({ request }) => {
    const body = (await request.json()) as {
      nickname?: string;
      profileImage?: string;
      defaultPlatform?: string | null;
    };
    const user = createMockUser({
      email: "test@example.com",
      nickname: body.nickname,
      profileImage: body.profileImage,
    });
    // defaultPlatform 추가
    const userWithPlatform = {
      ...user,
      defaultPlatform:
        body.defaultPlatform !== undefined ? body.defaultPlatform : undefined,
    };
    return HttpResponse.json({ user: userWithPlatform });
  }),

  // 로그아웃 API Mock
  http.post("/api/auth/logout", async () => {
    return HttpResponse.json({ success: true });
  })
);

// 테스트 확장
export const test = base.extend({
  // Mock 인증 상태를 가진 페이지 컨텍스트
  authenticatedPage: async ({ page }, use) => {
    // localStorage에 인증 상태 저장
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

    await use(page);
  },

  // 온보딩 완료 상태를 가진 페이지 컨텍스트
  onboardedPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "fanstage_auth_user",
        JSON.stringify({
          id: "test-user-id",
          email: "test@example.com",
          nickname: "testuser",
          profileImage: "https://example.com/image.jpg",
        })
      );
    });

    await use(page);
  },
});

// MSW 서버 export (각 테스트 파일에서 직접 사용)
export { server };

export { expect } from "@playwright/test";
