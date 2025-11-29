"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { ProfileAvatarGradient } from "@/shared/components/ui/ProfileAvatarGradient";
import { Icon } from "@/shared/components/ui/Icon";
import { PlatformSelectModal } from "@/shared/components/ui/PlatformSelectModal";
import { useDefaultPlatform } from "@/domains/auth/hooks/useDefaultPlatform";
import {
  recommendSmartPlatform,
  type Platform,
} from "@/shared/utils/platformRecommendation";
import { getDefaultLetterImage } from "@/shared/utils/imageUpload";

export default function LetterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { defaultPlatform } = useDefaultPlatform();
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [letter, setLetter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 편지 데이터 로드
  useEffect(() => {
    const loadLetter = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/letters/${params.id}`);
        if (!response.ok) {
          throw new Error("편지를 찾을 수 없습니다");
        }
        const data = await response.json();
        setLetter(data.letter);
      } catch (error) {
        console.error("편지 로드 실패:", error);
        setError(error instanceof Error ? error.message : "편지를 불러올 수 없습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadLetter();
  }, [params.id]);

  // 편지 데이터 변환 (API 응답을 화면 표시용으로 변환)
  const displayLetter = letter
    ? {
        id: letter.id,
        sender:
          typeof letter.sender === "object" && letter.sender !== null
            ? letter.sender.nickname || letter.sender.email || ""
            : letter.sender || "",
        senderInitials:
          typeof letter.sender === "object" && letter.sender !== null
            ? letter.sender.nickname?.[0]?.toUpperCase() ||
              letter.sender.email?.[0]?.toUpperCase() ||
              ""
            : letter.senderInitials || "",
        date: letter.createdAt
          ? (() => {
              const date = new Date(letter.createdAt);
              const now = new Date();
              const diffMs = now.getTime() - date.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) return "오늘";
              if (diffDays === 1) return "어제";
              if (diffDays < 7) return `${diffDays}일 전`;
              if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
              if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
              return `${Math.floor(diffDays / 365)}년 전`;
            })()
          : letter.date || "",
        message: letter.message || "",
        imageUrl: letter.imageUrl,
        trackCount: letter.tracks?.length || 0,
        playCount: letter.playCount || 0,
        likeCount: letter.likeCount || 0,
        tracks: letter.tracks || [],
      }
    : null;

  const handlePlayAll = () => {
    if (!displayLetter) return;

    // 플랫폼 자동 추천 (P1)
    const recommendedPlatform = recommendSmartPlatform(
      {
        tracks: displayLetter.tracks.map((t: any) => ({
          id: String(t.id),
          title: t.title,
          artist: t.artist,
          platform: (t.platform || "spotify") as Platform,
        })),
      },
      [], // 사용자 이력 (향후 구현)
      defaultPlatform
    );

    if (recommendedPlatform && recommendedPlatform === defaultPlatform) {
      // 추천 플랫폼이 기본 플랫폼과 같으면 바로 재생
      playOnPlatform(recommendedPlatform);
    } else {
      // 추천 플랫폼이 다르거나 기본 플랫폼이 없으면 모달 표시
      setIsPlatformModalOpen(true);
    }
  };

  const playOnPlatform = (
    platform: "spotify" | "apple" | "youtube" | "melon"
  ) => {
    // 실제 구현에서는 플랫폼별 재생 로직 호출
    if (displayLetter) {
      console.log(`재생: ${platform}`, displayLetter.tracks);
      // 예: window.open(`spotify:playlist:...`) 또는 API 호출
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
        <Header showCreateButton showProfile />
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="text-center text-white">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !displayLetter) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
        <Header showCreateButton showProfile />
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="text-center text-white">
            {error || "편지를 찾을 수 없습니다"}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header showCreateButton showProfile />
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <Icon name="arrow-back" size={20} color="currentColor" />
          <span className="text-base">뒤로 가기</span>
        </button>

        {/* 편지 카드 */}
        <div
          className="rounded-2xl p-8 mb-6"
          style={{
            backgroundColor: "#121212",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* 편지 이미지 */}
          {displayLetter.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={displayLetter.imageUrl}
                alt="편지 이미지"
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          {!displayLetter.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={getDefaultLetterImage()}
                alt="기본 편지 이미지"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* 보낸 사람 정보 */}
          <div className="flex items-center gap-4 mb-6">
            <ProfileAvatarGradient
              initials={displayLetter.senderInitials}
              size="lg"
              className="rounded-2xl"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
                {displayLetter.sender}
              </h2>
              <p className="text-base" style={{ color: "#6A7282" }}>
                {displayLetter.date}
              </p>
            </div>
            <Icon name="heart" size={24} color="#6A7282" />
          </div>

          {/* 메시지 */}
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <p className="text-base text-white leading-relaxed whitespace-pre-wrap">
              {displayLetter.message}
            </p>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="music" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {displayLetter.trackCount}곡
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="play" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {displayLetter.playCount}회 재생
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="heart" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {displayLetter.likeCount}개
              </span>
            </div>
          </div>
        </div>

        {/* 플레이리스트 */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "#121212",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">플레이리스트</h3>
            <button
              onClick={handlePlayAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FFE11D", color: "#000000" }}
            >
              <Icon name="play" size={16} color="#000000" />
              전체 재생
            </button>
          </div>

          <div className="space-y-2">
            {displayLetter.tracks.map((track: any, index: number) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span
                  className="text-base font-medium w-8 text-center"
                  style={{ color: "#6A7282" }}
                >
                  {index + 1}
                </span>
                <div
                  className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFE11D" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5V19L19 12L8 5Z" fill="#000000" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-white truncate">
                    {track.title}
                  </h4>
                  <p className="text-sm truncate" style={{ color: "#6A7282" }}>
                    {track.artist}
                  </p>
                </div>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
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
                      d="M2.67 4L2.67 12M8 2.67L8 13.33M13.33 4L13.33 12"
                      stroke="#000000"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 플랫폼 선택 모달 */}
      <PlatformSelectModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        onSelect={playOnPlatform}
      />
    </div>
  );
}
