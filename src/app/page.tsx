import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      {/* 헤더 */}
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
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: "#FFE11D" }}
                ></div>
                <h1 className="text-lg font-bold text-white">FAN:STAGE</h1>
              </div>
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
            <Link
              href="/login"
              className="px-4 py-2 text-base text-white hover:opacity-80 transition-opacity"
            >
              로그인
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="max-w-5xl mx-auto px-8 pt-12 pb-16">
        <div className="mb-14">
          {/* 배지 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#2ADFFF" }}
            ></div>
            <span className="text-sm text-gray-400">
              플랫폼 중립적 음악 공유
            </span>
          </div>

          {/* 헤딩 */}
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            어떤 플랫폼이든
            <br />
            음악을 공유하세요
          </h2>

          {/* 본문 */}
          <div className="mb-8 space-y-2">
            <p className="text-xl text-gray-400">
              플레이리스트와 메시지로 음악 편지를 만드세요.
            </p>
            <p className="text-xl text-gray-400">
              Spotify, Apple Music, YouTube Music 모두 지원합니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FFE11D", color: "#000000" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.17 10L10 4.17M10 4.17L10 15.83M10 4.17L15.83 10"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              편지 만들기
            </Link>
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-normal text-base transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 2L4 14M4 2L12 8L4 2Z"
                  stroke="currentColor"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              데모 보기
            </button>
          </div>
        </div>
      </section>

      {/* 추천 편지 섹션 */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white">추천 편지</h3>
          <Link
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            전체 보기
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#121212",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* 그라데이션 이미지 영역 */}
              <div
                className="w-full h-48"
                style={{
                  background:
                    "linear-gradient(180deg, #FFE11D 0%, #2ADFFF 100%)",
                }}
              >
                {/* 음악 아이콘 */}
                <div className="flex items-center justify-center h-full">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.33 37.33L21.33 42.67M32 5.33L32 48M42.67 37.33L42.67 42.67"
                      stroke="#000000"
                      strokeWidth="5.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 카드 내용 */}
              <div className="p-4 space-y-1">
                <h4 className="text-lg font-semibold text-white">
                  여름 감성 플리
                </h4>
                <p className="text-sm text-gray-400">김서연</p>
                <div className="flex items-center justify-between pt-2">
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
                      12곡
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
                      234
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          이용 방법
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "플레이리스트 만들기",
              description:
                "모든 음악 플랫폼에서 곡을 검색하고 추가하세요. 완벽한 컬렉션을 만들어보세요.",
            },
            {
              step: "2",
              title: "메시지 작성",
              description:
                "음악에 개인적인 메시지를 더하세요. 이 곡들이 왜 중요한지 공유하세요.",
            },
            {
              step: "3",
              title: "어디든 공유",
              description:
                "이메일이나 링크로 전송하세요. 받는 사람은 자신의 플랫폼에 저장할 수 있어요.",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              {/* 번호 배지 */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: "#FFE11D" }}
              >
                <span className="text-xl font-bold text-black">
                  {item.step}
                </span>
              </div>

              {/* 제목 */}
              <h4 className="text-2xl font-semibold text-white mb-3">
                {item.title}
              </h4>

              {/* 설명 */}
              <p className="text-base text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-20">
        <div
          className="rounded-3xl p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 225, 29, 0.1) 0%, rgba(42, 223, 255, 0.1) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            오늘부터 음악을 공유하세요
          </h3>
          <p className="text-xl text-gray-400 mb-8">
            수천 명의 뮤지션과 음악 애호가들이 함께하고 있습니다.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FFE11D", color: "#000000" }}
          >
            첫 편지 만들기
          </Link>
        </div>
      </section>
    </main>
  );
}
