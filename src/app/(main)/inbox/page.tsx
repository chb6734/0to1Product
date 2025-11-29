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

export default function InboxPage() {
  const router = useRouter();
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
        
        // 중복 제거 (같은 메시지를 가진 편지 제거)
        const seenMessages = new Set<string>();
        loadedLetters = loadedLetters.filter((letter: any) => {
          const message = letter.message || '';
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
        
        setLetters(loadedLetters);
      } else {
        // API 실패 시 데모 모드 편지 표시 (보낸 편지 탭에서만, 로그인하지 않은 경우만)
        if (activeTab === "sent" && !isAuthenticated) {
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
      // 에러 시 데모 모드 편지 표시 (보낸 편지 탭에서만, 로그인하지 않은 경우만)
      if (activeTab === "sent" && !isAuthenticated) {
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
  }, [activeTab, isAuthenticated]);

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
          {letters.map((letter) => {
            // sender가 객체인 경우 nickname 또는 email 추출
            const senderName = 
              typeof letter.sender === 'object' && letter.sender !== null
                ? letter.sender.nickname || letter.sender.email || ''
                : letter.sender || '';
            
            // recipient가 객체인 경우 nickname 또는 email 추출
            const recipientName = 
              typeof letter.recipient === 'object' && letter.recipient !== null
                ? letter.recipient.nickname || letter.recipient.email || ''
                : letter.recipient || '';
            
            // senderInitials 추출 (객체인 경우 nickname의 첫 글자)
            const senderInitials = 
              typeof letter.sender === 'object' && letter.sender !== null
                ? letter.sender.nickname?.[0]?.toUpperCase() || letter.sender.email?.[0]?.toUpperCase() || ''
                : letter.senderInitials || '';
            
            // recipientInitials 추출 (객체인 경우 nickname의 첫 글자)
            const recipientInitials = 
              typeof letter.recipient === 'object' && letter.recipient !== null
                ? letter.recipient.nickname?.[0]?.toUpperCase() || letter.recipient.email?.[0]?.toUpperCase() || ''
                : letter.recipientInitials || '';

            return (
              <LetterCard
                key={letter.id}
                sender={activeTab === "received" ? senderName : undefined}
                recipient={activeTab === "sent" ? recipientName : undefined}
                senderInitials={senderInitials}
                recipientInitials={recipientInitials}
                message={letter.message}
                trackCount={letter.trackCount || letter.tracks?.length || 0}
                playCount={letter.playCount || 0}
                likeCount={letter.likeCount || 0}
                date={letter.date || letter.createdAt || ''}
                onClick={() => {
                  if (letter.id && letter.id !== "demo-letter") {
                    router.push(`/letters/${letter.id}`);
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

