"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { LetterCard } from "@/domains/letter/components/LetterCard";
import { useAuth } from "@/domains/auth/hooks/useAuth";

export default function DiscoverPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [letters, setLetters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitializing, router]);

  // 공개된 편지 목록 로드
  useEffect(() => {
    const loadDiscoverLetters = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        // 둘러보기용 공개 편지 목록 API 호출
        // 현재는 모든 편지를 가져오지만, 향후 공개 설정된 편지만 필터링할 수 있음
        const response = await fetch("/api/letters?type=discover");
        if (response.ok) {
          const data = await response.json();
          setLetters(data.letters || []);
        } else {
          setLetters([]);
        }
      } catch (error) {
        console.error("편지 목록 로드 실패:", error);
        setLetters([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !isInitializing) {
      loadDiscoverLetters();
    }
  }, [isAuthenticated, isInitializing]);

  // 로딩 중이거나 인증되지 않은 경우 아무것도 렌더링하지 않음
  if (isInitializing || !isAuthenticated) {
    return null;
  }

  // 편지 데이터 변환 (API 응답을 화면 표시용으로 변환)
  const displayLetters = letters.map((letter) => {
    // sender가 객체인 경우 nickname 또는 email 추출
    const senderName =
      typeof letter.sender === "object" && letter.sender !== null
        ? letter.sender.nickname || letter.sender.email || ""
        : letter.sender || "";

    // senderInitials 추출
    const senderInitials =
      typeof letter.sender === "object" && letter.sender !== null
        ? letter.sender.nickname?.[0]?.toUpperCase() ||
          letter.sender.email?.[0]?.toUpperCase() ||
          ""
        : letter.senderInitials || "";

    // 날짜 포맷팅
    const formattedDate = letter.createdAt
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
      : letter.date || "";

    return {
      id: letter.id,
      sender: senderName,
      senderInitials: senderInitials,
      message: letter.message || "",
      trackCount: letter.tracks?.length || 0,
      playCount: letter.playCount || 0,
      likeCount: letter.likeCount || 0,
      date: formattedDate,
    };
  });

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

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center text-white py-12">로딩 중...</div>
        )}

        {/* 편지 목록 */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayLetters.length > 0 ? (
              displayLetters.map((letter) => (
                <LetterCard
                  key={letter.id}
                  sender={letter.sender}
                  senderInitials={letter.senderInitials}
                  message={letter.message}
                  trackCount={letter.trackCount}
                  playCount={letter.playCount}
                  likeCount={letter.likeCount}
                  date={letter.date}
                  onClick={() => router.push(`/letters/${letter.id}`)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-12">
                공개된 편지가 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

