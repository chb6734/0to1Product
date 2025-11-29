"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/shared/components/layout/Header";
import { LetterCard } from "@/domains/letter/components/LetterCard";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import {
  loadDemoLetter,
  migrateDemoLetterToServer,
} from "@/shared/utils/demoMode";
import { useLetter } from "@/domains/letter/hooks/useLetter";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const { user, isAuthenticated } = useAuth();
  const { createLetter } = useLetter();
  const [letters, setLetters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 편지 목록 로드 함수
  const loadLetters = useCallback(async () => {
    setIsLoading(true);
    try {
      const type = activeTab === "received" ? "received" : "sent";
      const response = await fetch(`/api/letters?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        let loadedLetters = data.letters || [];
        
        // 보낸 편지 탭에서 데모 모드 편지도 함께 표시 (마이그레이션 전)
        if (activeTab === "sent") {
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
        
        setLetters(loadedLetters);
      } else {
        // API 실패 시 데모 모드 편지 표시 (보낸 편지 탭에서만)
        if (activeTab === "sent") {
          const demoData = loadDemoLetter();
          if (demoData) {
            setLetters([
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
            ]);
          } else {
            setLetters([]);
          }
        } else {
          setLetters([]);
        }
      }
    } catch (error) {
      console.error("편지 목록 로드 실패:", error);
      // 에러 시 데모 모드 편지 표시 (보낸 편지 탭에서만)
      if (activeTab === "sent") {
        const demoData = loadDemoLetter();
        if (demoData) {
          setLetters([
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
          ]);
        } else {
          setLetters([]);
        }
      } else {
        setLetters([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // 데모 모드 편지 마이그레이션
  useEffect(() => {
    const migrateDemoLetter = async () => {
      if (!isAuthenticated || !user) {
        // 로그인하지 않은 경우 편지 목록만 로드
        loadLetters();
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
        
        // 마이그레이션 성공 후 편지 목록 다시 로드
        await loadLetters();
      } catch (error) {
        console.error("데모 모드 편지 마이그레이션 실패:", error);
        // 마이그레이션 실패 시에도 편지 목록 로드 (데모 모드 편지 표시)
        loadLetters();
      }
    };

    migrateDemoLetter();
  }, [isAuthenticated, user, loadLetters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header activeNav="inbox" showCreateButton showProfile />
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* 헤딩 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">내 보관함</h1>
        </div>

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
          {letters.map((letter) => (
            <LetterCard
              key={letter.id}
              sender={activeTab === "received" ? letter.sender : undefined}
              recipient={activeTab === "sent" ? letter.recipient : undefined}
              senderInitials={letter.senderInitials}
              recipientInitials={letter.recipientInitials}
              message={letter.message}
              trackCount={letter.trackCount}
              playCount={letter.playCount}
              likeCount={letter.likeCount}
              date={letter.date}
            />
          ))}
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

