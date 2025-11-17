"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
  const router = useRouter();

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
                className="text-base text-gray-400 hover:text-white transition-colors"
              >
                보관함
              </Link>
              <Link
                href="/discover"
                className="text-base text-white font-medium transition-colors"
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header />
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
            <div
              key={letter.id}
              onClick={() => router.push(`/letters/${letter.id}`)}
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
                  {letter.senderInitials}
                </div>

                {/* 편지 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {letter.sender}
                    </h3>
                    <span className="text-sm" style={{ color: "#6A7282" }}>
                      {letter.date}
                    </span>
                  </div>
                  <p className="text-base mb-4 text-white">
                    {letter.title}
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
                        {letter.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

