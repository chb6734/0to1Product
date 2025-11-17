"use client";

import { useAuth } from "@/domains/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const {
    loginWithGoogle,
    loginWithKakao,
    loginWithApple,
    isLoading,
    error,
    isAuthenticated,
    user,
  } = useAuth();
  const router = useRouter();

  console.log("[LoginPage] 렌더링:", {
    isAuthenticated,
    user,
    isLoading,
    error: error?.message,
  });

  useEffect(() => {
    console.log("[LoginPage] useEffect 실행:", {
      isAuthenticated,
      user,
      hasNickname: !!user?.nickname,
    });
    if (isAuthenticated && user) {
      // 닉네임이 없으면 온보딩 페이지로, 있으면 메인 페이지로
      if (!user.nickname) {
        console.log("[LoginPage] 닉네임 없음 → 온보딩 페이지로 리다이렉트");
        // Next.js router를 사용하여 클라이언트 사이드 네비게이션
        router.replace("/onboarding");
      } else {
        console.log("[LoginPage] 닉네임 있음 → 메인 페이지로 리다이렉트");
        // Next.js router를 사용하여 클라이언트 사이드 네비게이션
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, router]);

  // 로그인된 상태면 리다이렉트만 처리 (화면 표시 안 함)
  if (isAuthenticated) {
    console.log("[LoginPage] 이미 로그인됨, 리다이렉트 대기 중...");
    return null;
  }

  const handleLogin = async (loginFn: () => Promise<any>) => {
    try {
      console.log("[LoginPage] 로그인 버튼 클릭");
      const userData = await loginFn();
      console.log("[LoginPage] 로그인 완료, 사용자 데이터:", userData);
      // 로그인 성공 후 리다이렉트는 useEffect에서 처리됨
    } catch (error) {
      console.error("[LoginPage] 로그인 실패:", error);
      // 에러는 useAuth의 error state로 처리됨
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-32"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        {/* 로고 아이콘 */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "#FFE11D" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.67 23.33L6.67 30M20 3.33L20 36.67M33.33 23.33L33.33 30"
              stroke="#000000"
              strokeWidth="3.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 3.33L20 36.67M33.33 23.33L33.33 30"
              stroke="#000000"
              strokeWidth="3.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 헤딩 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            FAN:STAGE에 오신 것을 환영합니다
          </h1>
          <p className="text-base text-gray-400">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="w-full p-4 rounded-2xl text-sm text-red-400"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error.message}
          </div>
        )}

        {/* 소셜 로그인 버튼 */}
        <div className="w-full flex flex-col gap-3">
          {/* Google 로그인 */}
          <button
            onClick={() => handleLogin(loginWithGoogle)}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              color: "#000000",
            }}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M19.6 10.23C19.6 9.55 19.54 8.89 19.43 8.25H10V11.88H15.38C15.12 12.99 14.42 13.92 13.47 14.52V16.82H16.96C18.65 15.25 19.6 12.95 19.6 10.23Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20C12.7 20 14.96 19.12 16.72 17.41L13.23 15.11C12.28 15.72 11.01 16.11 10 16.11C7.4 16.11 5.19 14.28 4.4 11.89H0.83V14.28C2.55 17.75 6.06 20 10 20Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.4 11.89C4.18 11.23 4.05 10.53 4.05 9.82C4.05 9.11 4.18 8.41 4.4 7.75V5.36H0.83C0.1 6.68 -0.27 8.2 -0.27 9.82C-0.27 11.44 0.1 12.96 0.83 14.28L4.4 11.89Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 3.89C11.17 3.89 12.21 4.29 13.05 5.07L16.83 1.29C14.95 -0.43 12.7 -1.11 10 -1.11C6.06 -1.11 2.55 1.14 0.83 4.61L4.4 7C5.19 4.61 7.4 2.78 10 2.78V3.89Z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google 계정으로 계속하기</span>
              </>
            )}
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={() => handleLogin(loginWithKakao)}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#FEE500",
              color: "#000000",
            }}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C5.58 2 2 5.14 2 9.09C2 12.14 4.13 14.73 7.1 15.64L6.5 17.82C6.4 18.18 6.7 18.5 7.05 18.36L9.1 17.55C9.5 17.64 9.9 17.73 10.3 17.73C10.7 17.73 11.1 17.64 11.5 17.55L13.55 18.36C13.9 18.5 14.2 18.18 14.1 17.82L13.5 15.64C16.47 14.73 18.6 12.14 18.6 9.09C18.6 5.14 15.02 2 10 2Z"
                    fill="#000000"
                  />
                </svg>
                <span>카카오로 계속하기</span>
              </>
            )}
          </button>

          {/* Apple 로그인 */}
          <button
            onClick={() => handleLogin(loginWithApple)}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#121212",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#FFFFFF",
            }}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M13.68 6.5C13.6 4.5 12.2 3 10.2 3C9.1 3 8.2 3.4 7.6 4C7 3.4 6 3 4.9 3C2.9 3 1.5 4.5 1.4 6.5C0.5 7 0 8 0 9.2C0 11.5 1.5 13.5 3.5 15.5C4.5 16.5 5.7 17.5 7 17.5C8.2 17.5 8.7 17 9.5 16.2C10.3 17 10.8 17.5 12 17.5C13.3 17.5 14.5 16.5 15.5 15.5C17.5 13.5 19 11.5 19 9.2C19 8 18.5 7 17.6 6.5C17.5 4.5 16.1 3 14.1 3C13 3 12.1 3.4 11.5 4C10.9 3.4 9.9 3 8.8 3C6.8 3 5.4 4.5 5.3 6.5C4.4 7 3.9 8 3.9 9.2C3.9 11.5 5.4 13.5 7.4 15.5C8.4 16.5 9.6 17.5 10.9 17.5C12.1 17.5 12.6 17 13.4 16.2C14.2 17 14.7 17.5 15.9 17.5C17.2 17.5 18.4 16.5 19.4 15.5C21.4 13.5 22.9 11.5 22.9 9.2C22.9 8 22.4 7 21.5 6.5Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <span>Apple로 계속하기</span>
              </>
            )}
          </button>
        </div>

        {/* 약관 동의 텍스트 */}
        <p className="text-sm text-center leading-relaxed" style={{ color: "#6A7282" }}>
          계속 진행하면 FAN:STAGE의{" "}
          <a
            href="#"
            className="underline hover:no-underline transition-all"
            style={{ color: "#2ADFFF" }}
          >
            이용약관
          </a>{" "}
          및{" "}
          <a
            href="#"
            className="underline hover:no-underline transition-all"
            style={{ color: "#2ADFFF" }}
          >
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
