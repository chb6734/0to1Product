"use client";

import Link from "next/link";

interface HeaderProps {
  activeNav?: "inbox" | "discover" | null;
  showCreateButton?: boolean;
  showProfile?: boolean;
}

export function Header({
  activeNav = null,
  showCreateButton = false,
  showProfile = false,
}: HeaderProps) {
  return (
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
            <nav className="hidden md:flex items-center px-10">
              <Link
                href="/inbox"
                className={`text-base transition-colors ${
                  activeNav === "inbox"
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
                style={{ marginRight: "24px" }}
              >
                보관함
              </Link>
              <Link
                href="/discover"
                className={`text-base transition-colors ${
                  activeNav === "discover"
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                둘러보기
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {showCreateButton && (
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
            )}
            {showProfile && (
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
            )}
            {!showCreateButton && !showProfile && (
              <Link
                href="/login"
                className="px-4 py-2 text-base text-white hover:opacity-80 transition-opacity"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
