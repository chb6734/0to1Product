"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateLetterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [letterLink] = useState("https://fanstage.com/l/abc123xyz");

  const handleNext = () => {
    console.log("[CreateLetterPage] 다음 버튼 클릭 (퍼블리싱 테스트용)");
    setStep(2);
  };

  const handleCopyLink = () => {
    console.log("[CreateLetterPage] 링크 복사 (퍼블리싱 테스트용)");
    navigator.clipboard.writeText(letterLink);
  };

  const handleEdit = () => {
    console.log("[CreateLetterPage] 수정하기 버튼 클릭 (퍼블리싱 테스트용)");
    setStep(1);
  };

  const handleComplete = () => {
    console.log("[CreateLetterPage] 완료 버튼 클릭 (퍼블리싱 테스트용)");
  };

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
                href="#"
                className="text-base text-gray-400 hover:text-white transition-colors"
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
                background:
                  "linear-gradient(180deg, #FFE11D 0%, #2ADFFF 100%)",
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

  // 첫 번째 단계: 편지 작성
  if (step === 1) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <Header />
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* 헤딩 */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              음악 편지 만들기
            </h2>
            <p className="text-base text-gray-400">
              곡을 추가하고 메시지를 작성하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 입력 폼 */}
            <div className="flex flex-col gap-6">
              {/* 곡 추가 카드 */}
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h3 className="text-2xl font-semibold text-white">곡 추가</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="곡, 아티스트, 앨범 검색..."
                    className="w-full px-12 py-3 rounded-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#6A7282" }}
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.67"
                    />
                    <path
                      d="M13 13L17 17"
                      stroke="currentColor"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 메시지 카드 */}
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h3 className="text-2xl font-semibold text-white">메시지</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="음악과 함께 전할 메시지를 작성하세요..."
                  maxLength={500}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent resize-none"
                  style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "#6A7282" }}>
                    {message.length}/500
                  </p>
                  <button
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "#2ADFFF" }}
                  >
                    템플릿 사용
                  </button>
                </div>
              </div>

              {/* 공개 설정 카드 */}
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h3 className="text-2xl font-semibold text-white">공개 설정</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5 rounded"
                    style={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.33 1.72L8.33 10.78M1.71 7.5L8.33 1.72L14.95 7.5"
                        stroke="#99A1AF"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-base text-white">링크만 공유 (비공개)</span>
                  </label>
                </div>
                <p className="text-sm ml-8" style={{ color: "#6A7282" }}>
                  링크를 가진 사람만 이 편지를 볼 수 있습니다.
                </p>
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={handleNext}
                disabled={!message.trim()}
                className="w-full h-12 rounded-lg font-medium text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#FFE11D",
                  color: "#000000",
                  opacity: !message.trim() ? 0.5 : 1,
                }}
              >
                다음
              </button>
            </div>

            {/* 오른쪽: 미리보기 */}
            <div>
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h4 className="text-lg font-semibold text-white">미리보기</h4>
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
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
                    곡과 메시지를 추가하면 미리보기가 표시됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 두 번째 단계: 완성 화면
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <Header />
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* 헤딩 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            편지가 완성되었습니다!
          </h2>
          <p className="text-base text-gray-400">
            링크나 QR코드로 공유하세요
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* 공유 링크 카드 */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              backgroundColor: "#121212",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.33 1.72L8.33 10.78M1.71 7.5L8.33 1.72L14.95 7.5"
                  stroke="#FFE11D"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-white">공유 링크</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={letterLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg text-base text-white focus:outline-none"
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 rounded-lg font-medium text-base transition-opacity hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: "#FFE11D", color: "#000000" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5.33"
                    y="5.33"
                    width="9.33"
                    height="9.33"
                    stroke="currentColor"
                    strokeWidth="1.33"
                  />
                  <path
                    d="M1.33 1.33L1.33 10.67M10.67 1.33L1.33 1.33L1.33 10.67"
                    stroke="currentColor"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                  />
                </svg>
                복사
              </button>
            </div>
          </div>

          {/* QR 코드 카드 */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              backgroundColor: "#121212",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 2.5L2.5 4.17M13.33 2.5L13.33 4.17M2.5 13.33L2.5 15M13.33 13.33L13.33 15M17.5 17.5L17.5 17.51M5.83 5.83L5.83 5.84M2.5 10L2.51 10M10 2.5L10 2.51M10 13.33L10 13.34M13.33 10L13.34 10M17.5 10L17.5 10.01M10 16.67L10 16.68M16.67 10L16.68 10"
                  stroke="#2ADFFF"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-white">QR 코드</h3>
            </div>
            <div className="flex justify-center py-8">
              <div
                className="w-64 h-64 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                {/* QR 코드 플레이스홀더 */}
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => {
                    // 고정된 QR 코드 패턴 (모서리와 중앙 패턴)
                    const isCorner =
                      (i < 8 && (i === 0 || i === 7)) ||
                      (i >= 56 && (i === 56 || i === 63)) ||
                      (i % 8 === 0 || i % 8 === 7);
                    const isCenter = i >= 28 && i <= 35;
                    const isBlack = isCorner || isCenter || (i % 3 === 0);
                    return (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-sm"
                        style={{
                          backgroundColor: isBlack ? "#000000" : "#FFFFFF",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-sm text-center" style={{ color: "#6A7282" }}>
              QR 코드를 스캔하면 편지로 바로 이동합니다
            </p>
          </div>

          {/* 전체 공개 카드 */}
          <div
            className="rounded-2xl p-6 flex items-center gap-3"
            style={{
              backgroundColor: "#121212",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.67 4.17L1.67 15.83M10 1.67L10 18.33M18.33 4.17L18.33 15.83M7.5 7.5L7.5 7.51"
                stroke="#2ADFFF"
                strokeWidth="1.67"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-1">전체 공개</h4>
              <p className="text-sm text-gray-400">
                이 편지는 둘러보기 페이지에 표시됩니다
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
              }}
            >
              수정하기
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

