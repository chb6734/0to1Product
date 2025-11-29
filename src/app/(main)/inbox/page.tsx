"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { LetterCard } from "@/domains/letter/components/LetterCard";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import {
  loadDemoLetter,
  migrateDemoLetterToServer,
} from "@/shared/utils/demoMode";
import { useLetter } from "@/domains/letter/hooks/useLetter";
import {
  sortLetters,
  filterLetters,
  type SortOption,
  type FilterOptions,
} from "@/shared/utils/sortFilter";
import { Icon } from "@/shared/components/ui/Icon";

export default function InboxPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const { user, isAuthenticated, isInitializing } = useAuth();
  const { createLetter } = useLetter();
  const [letters, setLetters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitializing, router]);

  // 정렬/필터 상태 (P1)
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 편지 목록 로드 함수
  const loadLetters = useCallback(async () => {
    setIsLoading(true);
    try {
      const type = activeTab === "received" ? "received" : "sent";
      const response = await fetch(`/api/letters?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        let loadedLetters = data.letters || [];

        // 중복 제거 (같은 메시지를 가진 편지 제거)
        const seenMessages = new Set<string>();
        loadedLetters = loadedLetters.filter((letter: any) => {
          const message = letter.message || "";
          if (seenMessages.has(message)) {
            return false;
          }
          seenMessages.add(message);
          return true;
        });

        // 보낸 편지 탭에서 데모 모드 편지도 함께 표시 (마이그레이션 전, 로그인하지 않은 경우만)
        if (activeTab === "sent" && !isAuthenticated) {
          const demoData = loadDemoLetter();
          if (demoData) {
            // API 응답에 데모 모드 편지가 없으면 추가
            const hasDemoLetter = loadedLetters.some(
              (letter: any) => letter.message === demoData.message
            );
            if (!hasDemoLetter) {
              loadedLetters = [
                {
                  id: "demo-letter",
                  recipient: "데모 편지",
                  recipientInitials: "DM",
                  message: demoData.message,
                  trackCount: demoData.tracks.length,
                  playCount: 0,
                  likeCount: 0,
                  date: "방금",
                },
                ...loadedLetters,
              ];
            }
          }
        }

        // P1: 정렬 및 필터 적용
        let processedLetters = loadedLetters;
        
        // 필터 적용
        if (Object.keys(filterOptions).length > 0) {
          processedLetters = filterLetters(processedLetters, filterOptions);
        }
        
        // 정렬 적용
        processedLetters = sortLetters(processedLetters, sortOption);
        
        setLetters(processedLetters);
      } else {
        // API 실패 시 데모 모드 편지 표시 (보낸 편지 탭에서만, 로그인하지 않은 경우만)
        if (activeTab === "sent" && !isAuthenticated) {
          const demoData = loadDemoLetter();
          if (demoData) {
            let demoLetters = [
              {
                id: "demo-letter",
                recipient: "데모 편지",
                recipientInitials: "DM",
                message: demoData.message,
                trackCount: demoData.tracks.length,
                playCount: 0,
                likeCount: 0,
                date: "방금",
                createdAt: new Date().toISOString(),
              },
            ];
            
            // P1: 정렬 및 필터 적용
            if (Object.keys(filterOptions).length > 0) {
              demoLetters = filterLetters(demoLetters, filterOptions);
            }
            demoLetters = sortLetters(demoLetters, sortOption);
            
            setLetters(demoLetters);
          } else {
            setLetters([]);
          }
        } else {
          setLetters([]);
        }
      }
    } catch (error) {
      console.error("편지 목록 로드 실패:", error);
      // 에러 시 데모 모드 편지 표시 (보낸 편지 탭에서만, 로그인하지 않은 경우만)
      if (activeTab === "sent" && !isAuthenticated) {
        const demoData = loadDemoLetter();
        if (demoData) {
          let demoLetters = [
            {
              id: "demo-letter",
              recipient: "데모 편지",
              recipientInitials: "DM",
              message: demoData.message,
              trackCount: demoData.tracks.length,
              playCount: 0,
              likeCount: 0,
              date: "방금",
              createdAt: new Date().toISOString(),
            },
          ];
          
          // P1: 정렬 및 필터 적용
          if (Object.keys(filterOptions).length > 0) {
            demoLetters = filterLetters(demoLetters, filterOptions);
          }
          demoLetters = sortLetters(demoLetters, sortOption);
          
          setLetters(demoLetters);
        } else {
          setLetters([]);
        }
      } else {
        setLetters([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, isAuthenticated, sortOption, filterOptions]);

  // 데모 모드 편지 마이그레이션 (한 번만 실행)
  const [hasMigrated, setHasMigrated] = useState(false);

  useEffect(() => {
    const migrateDemoLetter = async () => {
      // 이미 마이그레이션했거나 로그인하지 않은 경우 스킵
      if (hasMigrated || !isAuthenticated || !user) {
        if (!hasMigrated) {
          loadLetters();
        }
        return;
      }

      const demoData = loadDemoLetter();
      if (!demoData) {
        // 데모 모드 편지가 없으면 편지 목록만 로드
        loadLetters();
        return;
      }

      try {
        await migrateDemoLetterToServer(async (data) => {
          const response = await fetch("/api/letters", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tracks: data.tracks,
              message: data.message,
            }),
          });

          if (!response.ok) {
            throw new Error("편지 마이그레이션 실패");
          }

          const result = await response.json();
          return { id: result.id || result.letter?.id };
        });

        setHasMigrated(true);
        // 마이그레이션 성공 후 편지 목록 다시 로드
        await loadLetters();
      } catch (error) {
        console.error("데모 모드 편지 마이그레이션 실패:", error);
        // 마이그레이션 실패 시에도 편지 목록 로드
        loadLetters();
      }
    };

    migrateDemoLetter();
  }, [isAuthenticated, user, loadLetters, hasMigrated]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header activeNav="inbox" showCreateButton showProfile />
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* 헤딩 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">내 보관함</h1>
        </div>

        {/* 정렬/필터 컨트롤 (P1) */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#FFFFFF",
            }}
          >
            <Icon name="filter" size={16} color="#FFFFFF" />
            필터
          </button>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 focus:outline-none"
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#FFFFFF",
            }}
          >
            <option value="date-desc">최신순</option>
            <option value="date-asc">오래된순</option>
            <option value="tracks-desc">곡 수 많은순</option>
            <option value="tracks-asc">곡 수 적은순</option>
            <option value="plays-desc">재생 횟수 많은순</option>
            <option value="plays-asc">재생 횟수 적은순</option>
          </select>
        </div>

        {/* 필터 모달 (P1) */}
        {isFilterModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setIsFilterModalOpen(false)}
          >
            <div
              className="max-w-md w-full rounded-2xl p-8 flex flex-col gap-6"
              style={{
                backgroundColor: "#121212",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-2">필터</h2>
              
              {/* 보낸 사람/받은 사람 이름 필터 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  {activeTab === "received" ? "보낸 사람" : "받은 사람"}
                </label>
                <input
                  type="text"
                  placeholder={
                    activeTab === "received"
                      ? "보낸 사람 이름 입력"
                      : "받은 사람 이름 입력"
                  }
                  value={filterOptions.name || ""}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      name: e.target.value || undefined,
                    })
                  }
                  className="px-4 py-2 rounded-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>

              {/* 곡 제목 필터 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  곡 제목
                </label>
                <input
                  type="text"
                  placeholder="곡 제목 입력"
                  value={filterOptions.trackTitle || ""}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      trackTitle: e.target.value || undefined,
                    })
                  }
                  className="px-4 py-2 rounded-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>

              {/* 날짜 범위 필터 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  날짜 범위
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filterOptions.dateFrom || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateFrom: e.target.value || undefined,
                      })
                    }
                    className="flex-1 px-4 py-2 rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <span className="text-gray-400 self-center">~</span>
                  <input
                    type="date"
                    value={filterOptions.dateTo || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateTo: e.target.value || undefined,
                      })
                    }
                    className="flex-1 px-4 py-2 rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setFilterOptions({});
                    setIsFilterModalOpen(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#1A1A1A",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  초기화
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FFE11D", color: "#000000" }}
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 탭 */}
        <div
          className="inline-flex gap-2 p-1 rounded-lg mb-8"
          style={{
            backgroundColor: "#121212",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <button
            onClick={() => setActiveTab("received")}
            className="px-6 py-2 rounded-md font-medium text-base transition-all"
            style={{
              backgroundColor:
                activeTab === "received" ? "#FFE11D" : "transparent",
              color: activeTab === "received" ? "#000000" : "#6A7282",
            }}
          >
            받은 편지
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className="px-6 py-2 rounded-md font-medium text-base transition-all"
            style={{
              backgroundColor: activeTab === "sent" ? "#FFE11D" : "transparent",
              color: activeTab === "sent" ? "#000000" : "#6A7282",
            }}
          >
            보낸 편지
          </button>
        </div>

        {/* 편지 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {letters.map((letter, index) => {
            // sender가 객체인 경우 nickname 또는 email 추출
            const senderName =
              typeof letter.sender === "object" && letter.sender !== null
                ? letter.sender.nickname || letter.sender.email || ""
                : letter.sender || "";

            // recipient가 객체인 경우 nickname 또는 email 추출
            const recipientName =
              typeof letter.recipient === "object" && letter.recipient !== null
                ? letter.recipient.nickname || letter.recipient.email || ""
                : letter.recipient || "";

            // senderInitials 추출 (객체인 경우 nickname의 첫 글자)
            const senderInitials =
              typeof letter.sender === "object" && letter.sender !== null
                ? letter.sender.nickname?.[0]?.toUpperCase() ||
                  letter.sender.email?.[0]?.toUpperCase() ||
                  ""
                : letter.senderInitials || "";

            // recipientInitials 추출 (객체인 경우 nickname의 첫 글자)
            const recipientInitials =
              typeof letter.recipient === "object" && letter.recipient !== null
                ? letter.recipient.nickname?.[0]?.toUpperCase() ||
                  letter.recipient.email?.[0]?.toUpperCase() ||
                  ""
                : letter.recipientInitials || "";

            // 편지 ID 확인
            const letterId = letter.id;
            if (!letterId) {
              console.warn("편지 ID가 없습니다:", letter);
            }

            return (
              <LetterCard
                key={letterId || `letter-${index}`}
                sender={activeTab === "received" ? senderName : undefined}
                recipient={activeTab === "sent" ? recipientName : undefined}
                senderInitials={senderInitials}
                recipientInitials={recipientInitials}
                message={letter.message}
                trackCount={letter.trackCount || letter.tracks?.length || 0}
                playCount={letter.playCount || 0}
                likeCount={letter.likeCount || 0}
                date={letter.date || letter.createdAt || ""}
                onClick={() => {
                  const id = letter.id;
                  if (id && id !== "demo-letter") {
                    router.push(`/letters/${id}`);
                  } else {
                    console.warn("편지 ID가 없거나 데모 편지입니다:", id, letter);
                  }
                }}
              />
            );
          })}
        </div>

        {/* 빈 상태 */}
        {letters.length === 0 && (
          <EmptyState
            icon="letter"
            message={
              activeTab === "received"
                ? "받은 편지가 없습니다"
                : "보낸 편지가 없습니다"
            }
          />
        )}
      </div>
    </div>
  );
}
