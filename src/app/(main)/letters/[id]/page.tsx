"use client";

import { useState } from "react";
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

export default function LetterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { defaultPlatform } = useDefaultPlatform();
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);

  // 예시 데이터
  const letter = {
    id: params.id,
    sender: "김서연",
    senderInitials: "KS",
    date: "2일 전",
    message:
      "요즘 날씨가 추워지면서 자꾸 듣게 되는 곡들이에요. 추운 겨울밤, 창밖을 보며 들으면 정말 좋아요. 함께 들으면 좋겠어서 공유해요!",
    trackCount: 15,
    playCount: 1245,
    likeCount: 89,
    tracks: [
      { id: 1, title: "Winter Song", artist: "The Dreamers" },
      { id: 2, title: "Snowflake", artist: "Coldplay" },
      { id: 3, title: "December", artist: "Taylor Swift" },
      { id: 4, title: "Frozen", artist: "Madonna" },
      { id: 5, title: "Ice", artist: "Sarah McLachlan" },
    ],
  };

  const handlePlayAll = () => {
    // 플랫폼 자동 추천 (P1)
    const recommendedPlatform = recommendSmartPlatform(
      {
        tracks: letter.tracks.map((t) => ({
          id: String(t.id),
          title: t.title,
          artist: t.artist,
          platform: "spotify" as Platform, // 실제로는 API에서 받아온 플랫폼 정보 사용
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
    console.log(`재생: ${platform}`, letter.tracks);
    // 예: window.open(`spotify:playlist:...`) 또는 API 호출
  };

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
          {/* 보낸 사람 정보 */}
          <div className="flex items-center gap-4 mb-6">
            <ProfileAvatarGradient
              initials={letter.senderInitials}
              size="lg"
              className="rounded-2xl"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
                {letter.sender}
              </h2>
              <p className="text-base" style={{ color: "#6A7282" }}>
                {letter.date}
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
              {letter.message}
            </p>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="music" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {letter.trackCount}곡
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="play" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {letter.playCount}회 재생
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="heart" size={20} color="#6A7282" />
              <span className="text-base" style={{ color: "#6A7282" }}>
                {letter.likeCount}개
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
            {letter.tracks.map((track, index) => (
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
