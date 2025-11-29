"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { LetterCard } from "@/domains/letter/components/LetterCard";
import { useAuth } from "@/domains/auth/hooks/useAuth";

export default function DiscoverPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitializing, router]);

  // 예시 데이터
  const letters = [
    {
      id: 1,
      sender: "김서연",
      senderInitials: "KS",
      title: "겨울에 듣기 좋은 감성 플레이리스트",
      trackCount: 15,
      playCount: 1245,
      likeCount: 89,
      date: "2일 전",
    },
    {
      id: 2,
      sender: "이준호",
      senderInitials: "LJ",
      title: "운동할 때 듣는 신나는 음악 모음",
      trackCount: 20,
      playCount: 892,
      likeCount: 67,
      date: "3일 전",
    },
  ];

  // 로딩 중이거나 인증되지 않은 경우 아무것도 렌더링하지 않음
  if (isInitializing || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header activeNav="discover" showCreateButton />
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* 헤딩 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">둘러보기</h1>
          <p className="text-base text-gray-400">
            다른 사람들이 공유한 음악 편지를 둘러보세요
          </p>
        </div>

        {/* 편지 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              sender={letter.sender}
              senderInitials={letter.senderInitials}
              title={letter.title}
              trackCount={letter.trackCount}
              playCount={letter.playCount}
              likeCount={letter.likeCount}
              date={letter.date}
              onClick={() => router.push(`/letters/${letter.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

