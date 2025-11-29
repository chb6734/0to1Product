"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDefaultPlatform } from "@/domains/auth/hooks/useDefaultPlatform";
import { useAuth } from "@/domains/auth/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { setDefaultPlatform } = useDefaultPlatform();
  const [nickname, setNickname] = useState("");
  const [defaultPlatform, setDefaultPlatformState] = useState<
    "spotify" | "apple" | "youtube" | "melon" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 프로필 업데이트 (닉네임)
      await updateProfile({ nickname: nickname.trim() });

      // 기본 플랫폼 설정 (선택적)
      if (defaultPlatform) {
        await setDefaultPlatform(defaultPlatform);
      }

      // 보관함으로 이동
      router.push("/inbox");
    } catch (error) {
      console.error("온보딩 실패:", error);
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !nickname.trim() || isSubmitting;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-32"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="max-w-md w-full flex flex-col gap-8">
        {/* 헤딩 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2 leading-tight">
            프로필 설정
          </h1>
          <p className="text-base text-gray-400">
            닉네임과 프로필 사진을 설정해주세요
          </p>
        </div>

        {/* 폼 카드 */}
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl p-8 flex flex-col gap-6"
            style={{
              backgroundColor: "#121212",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* 프로필 사진 업로드 */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {/* 프로필 사진 원형 배경 */}
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFE11D 0%, #2ADFFF 100%)",
                  }}
                >
                  <span className="text-3xl font-bold text-black">?</span>
                  {/* 업로드 버튼 */}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFE11D" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3.33V12.67M3.33 8H12.67"
                        stroke="#000000"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400">프로필 사진 (선택)</p>
            </div>

            {/* 닉네임 입력 */}
            <div className="flex flex-col gap-2">
              <label className="text-base text-white">
                닉네임 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="w-full px-4 py-3 rounded-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              <p className="text-sm" style={{ color: "#6A7282" }}>
                {nickname.length}/20
              </p>
            </div>

            {/* 기본 플랫폼 설정 (PRD v4) */}
            <div className="flex flex-col gap-2">
              <label className="text-base text-white">
                주로 사용하는 음악 플랫폼
              </label>
              <select
                value={defaultPlatform || ""}
                onChange={(e) =>
                  setDefaultPlatformState(
                    e.target.value as
                      | "spotify"
                      | "apple"
                      | "youtube"
                      | "melon"
                      | null
                  )
                }
                className="w-full px-4 py-3 rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <option value="">없음 (나중에 설정)</option>
                <option value="spotify">Spotify</option>
                <option value="apple">Apple Music</option>
                <option value="youtube">YouTube Music</option>
                <option value="melon">멜론</option>
              </select>
              <p className="text-sm" style={{ color: "#6A7282" }}>
                편지를 받을 때 자동으로 이 플랫폼에서 재생됩니다
              </p>
            </div>

            {/* 시작하기 버튼 */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full h-12 rounded-lg font-medium text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFE11D",
                color: "#000000",
                opacity: isButtonDisabled ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "저장 중..." : "시작하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
