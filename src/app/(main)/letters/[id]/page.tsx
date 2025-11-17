"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LetterDetailPage({ params }: { params: { id: string } }) {
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: "#FFE11D", color: "#000000" }}
            >
              {letter.senderInitials}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
                {letter.sender}
              </h2>
              <p className="text-base" style={{ color: "#6A7282" }}>
                {letter.date}
              </p>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.67L14.67 9.33L22 10.67L16.67 15.33L18 22.67L12 18.67L6 22.67L7.33 15.33L2 10.67L9.33 9.33L12 2.67Z"
                stroke="#6A7282"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33 11.67L3.33 15M10 2.33L10 17.67M16.67 11.67L16.67 15"
                  stroke="#6A7282"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base" style={{ color: "#6A7282" }}>
                {letter.trackCount}곡
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.67 2.5L1.67 17.5M10 1.67L10 18.33M18.33 2.5L18.33 17.5"
                  stroke="#6A7282"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base" style={{ color: "#6A7282" }}>
                {letter.playCount}회 재생
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.33L12.33 7.33L16.67 8.33L13.67 11.33L14.33 15.67L10 13.67L5.67 15.67L6.33 11.33L3.33 8.33L7.67 7.33L10 3.33Z"
                  stroke="#6A7282"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
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
                  d="M2.67 4L2.67 12M8 2.67L8 13.33M13.33 4L13.33 12"
                  stroke="currentColor"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                    <path
                      d="M8 5V19L19 12L8 5Z"
                      fill="#000000"
                    />
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
    </div>
  );
}

