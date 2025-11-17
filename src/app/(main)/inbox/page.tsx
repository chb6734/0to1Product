"use client";

import { useState } from "react";
import { Header } from "@/shared/components/layout/Header";
import { LetterCard } from "@/domains/letter/components/LetterCard";
import { EmptyState } from "@/shared/components/ui/EmptyState";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  // 받은 편지 목록 (예시 데이터)
  const receivedLetters = [
    {
      id: 1,
      sender: "김서연",
      senderInitials: "KS",
      message: "생일 축하해! 이 노래들 들으면서...",
      trackCount: 8,
      playCount: 245,
      likeCount: 45,
      date: "2일 전",
    },
    {
      id: 2,
      sender: "이준호",
      senderInitials: "LJ",
      message: "요즘 듣고 있는 플레이리스트 공유!",
      trackCount: 12,
      playCount: 189,
      likeCount: 32,
      date: "5일 전",
    },
  ];

  // 보낸 편지 목록 (예시 데이터)
  const sentLetters = [
    {
      id: 3,
      recipient: "박민수",
      recipientInitials: "PM",
      message: "이번 주말에 들을 곡들 추천해줄게",
      trackCount: 10,
      playCount: 156,
      likeCount: 28,
      date: "1일 전",
    },
  ];

  const letters = activeTab === "received" ? receivedLetters : sentLetters;

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

