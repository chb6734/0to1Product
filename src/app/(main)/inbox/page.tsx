"use client";

import { useState } from "react";
import Link from "next/link";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  // 헤더
  const Header = () => (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(18, 18, 18, 0.8)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: "#FFE11D" }}
              ></div>
              <h1 className="text-lg font-bold text-white">FAN:STAGE</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/inbox"
                className="text-base text-white font-medium transition-colors"
              >
                보관함
              </Link>
              <Link
                href="#"
                className="text-base text-gray-400 hover:text-white transition-colors"
              >
                둘러보기
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FFE11D", color: "#000000" }}
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
                  stroke="currentColor"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              편지 만들기
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: "linear-gradient(180deg, #FFE11D 0%, #2ADFFF 100%)",
                color: "#000000",
              }}
            >
              ME
            </div>
          </div>
        </div>
      </div>
    </header>
  );

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
      <Header />
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
            <div
              key={letter.id}
              className="rounded-2xl p-6 cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#121212",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex gap-4">
                {/* 프로필 이미지 */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: "#FFE11D", color: "#000000" }}
                >
                  {activeTab === "received"
                    ? letter.senderInitials
                    : letter.recipientInitials}
                </div>

                {/* 편지 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {activeTab === "received"
                        ? letter.sender
                        : letter.recipient}
                    </h3>
                    <span className="text-sm" style={{ color: "#6A7282" }}>
                      {letter.date}
                    </span>
                  </div>
                  <p className="text-base mb-4" style={{ color: "#6A7282" }}>
                    {letter.message}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.67 9.33L2.67 12M8 1.33L8 14.67M13.33 9.33L13.33 12"
                          stroke="#6A7282"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: "#6A7282" }}>
                        {letter.trackCount}곡
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.33 2L1.33 14M8 1.33L8 14.67M14.67 2L14.67 14"
                          stroke="#6A7282"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: "#6A7282" }}>
                        {letter.playCount}회 재생
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 2.67L10.33 6.33L14.67 7.33L11.67 10.33L12.33 14.67L8 12.67L3.67 14.67L4.33 10.33L1.33 7.33L5.67 6.33L8 2.67Z"
                          stroke="#6A7282"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: "#6A7282" }}>
                        {letter.likeCount}개
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {letters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.5 }}
            >
              <path
                d="M8 28L8 32M24 4L24 36M40 28L40 32"
                stroke="#6A7282"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-base text-center mt-4" style={{ color: "#6A7282" }}>
              {activeTab === "received"
                ? "받은 편지가 없습니다"
                : "보낸 편지가 없습니다"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

