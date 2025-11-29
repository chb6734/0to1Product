"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { Icon } from "@/shared/components/ui/Icon";
import { useLetter } from "@/domains/letter/hooks/useLetter";
import {
  isDemoMode,
  enableDemoMode,
  saveDemoLetter,
  migrateDemoLetterToServer,
} from "@/shared/utils/demoMode";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import { letterDraftUtils } from "@/shared/utils/letterDraft";
import { generateAutocompleteSuggestions } from "@/shared/utils/autocomplete";

/**
 * 복구 모달 컴포넌트
 */
function RestoreDraftModal({
  isOpen,
  onRestore,
  onNew,
}: {
  isOpen: boolean;
  onRestore: () => void;
  onNew: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="max-w-md w-full rounded-2xl p-8 flex flex-col gap-6"
        style={{
          backgroundColor: "#121212",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          이전에 작성하던 편지가 있습니다
        </h2>
        <p className="text-base text-gray-400 mb-4">복구하시겠습니까?</p>
        <div className="flex gap-3">
          <button
            onClick={onRestore}
            className="flex-1 px-6 py-3 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FFE11D", color: "#000000" }}
          >
            복구
          </button>
          <button
            onClick={onNew}
            className="flex-1 px-6 py-3 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#1A1A1A",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            새로 작성
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 완성 모달 컴포넌트
 */
function CompletionModal({
  isOpen,
  onClose,
  letterLink,
  isDemoMode,
  onLoginClick,
  onEditClick,
  onCompleteClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  letterLink: string;
  isDemoMode: boolean;
  onLoginClick: () => void;
  onEditClick: () => void;
  onCompleteClick: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(letterLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("링크 복사 실패:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full rounded-2xl p-8 flex flex-col gap-6"
        style={{
          backgroundColor: "#121212",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            편지가 완성되었습니다!
          </h2>
          {isDemoMode && (
            <p className="text-sm text-yellow-400">
              임시 링크 (24시간 후 만료)
            </p>
          )}
        </div>

        {/* 공유 링크 카드 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icon name="link" size={20} color="#FFE11D" />
            <h3 className="text-xl font-semibold text-white">공유 링크</h3>
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
              <Icon name="copy" size={16} color="#000000" />
              복사
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-400">링크가 복사되었습니다</p>
          )}
        </div>

        {/* QR 코드 카드 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icon name="qr-code" size={20} color="#2ADFFF" />
            <h3 className="text-xl font-semibold text-white">QR 코드</h3>
          </div>
          <div className="flex justify-center py-4">
            <div
              className="w-48 h-48 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              {/* QR 코드 플레이스홀더 */}
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => {
                  const isCorner =
                    (i < 8 && (i === 0 || i === 7)) ||
                    (i >= 56 && (i === 56 || i === 63)) ||
                    i % 8 === 0 ||
                    i % 8 === 7;
                  const isCenter = i >= 28 && i <= 35;
                  const isBlack = isCorner || isCenter || i % 3 === 0;
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
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mt-4">
          {isDemoMode ? (
            <>
              <button
                onClick={onEditClick}
                className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#FFFFFF",
                }}
              >
                계속 만들기
              </button>
              <button
                onClick={onLoginClick}
                className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#FFE11D", color: "#000000" }}
              >
                영구 저장하려면 로그인하기
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditClick}
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
                onClick={onCompleteClick}
                className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
              >
                완료
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [letterLink, setLetterLink] = useState(
    "https://fanstage.com/l/abc123xyz"
  );

  const {
    letter,
    addTrack,
    removeTrack,
    setMessage,
    setImage,
    removeImage,
    createLetter,
    isCreating,
    loadDraft,
  } = useLetter();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);

  // 데모 모드 확인
  const demoMode = searchParams.get("demo") === "true" || isDemoMode();

  useEffect(() => {
    if (demoMode && !isDemoMode()) {
      enableDemoMode();
    }
  }, [demoMode]);

  // 페이지 진입 시 임시 저장 데이터 확인 (데모 모드가 아닐 때만)
  useEffect(() => {
    if (!demoMode && letterDraftUtils.hasDraft()) {
      setIsRestoreModalOpen(true);
    }
  }, [demoMode]);

  // 자동완성 제안 생성
  useEffect(() => {
    if (searchQuery.length >= 2 && searchResults.length > 0) {
      const suggestions = generateAutocompleteSuggestions(
        searchQuery,
        searchResults.map((track) => ({
          title: track.title,
          artist: track.artist,
        }))
      );
      setAutocompleteSuggestions(suggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [searchQuery, searchResults]);

  // 곡 검색 (debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/music/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.tracks || []);
        }
      } catch (error) {
        console.error("검색 실패:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 완료 및 공유 버튼 클릭
  const handleCompleteAndShare = async () => {
    if (!letter.message.trim()) {
      return;
    }

    if (demoMode) {
      // 데모 모드: 로컬 스토리지에 저장
      saveDemoLetter({
        tracks: letter.tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
        })),
        message: letter.message,
        isPrivate: true,
      });
      setIsCompletionModalOpen(true);
    } else {
      // 로그인 사용자: 서버에 저장
      try {
        const letterId = await createLetter();
        setLetterLink(`https://fanstage.com/l/${letterId}`);
        setIsCompletionModalOpen(true);
      } catch (error) {
        console.error("편지 생성 실패:", error);
      }
    }
  };

  // 로그인 페이지로 이동
  const handleLoginClick = () => {
    router.push("/login");
  };

  // 수정하기 (모달 닫기)
  const handleEditClick = () => {
    setIsCompletionModalOpen(false);
  };

  // 완료 (보관함으로 이동 - 보낸 편지 탭으로)
  const handleCompleteClick = async () => {
    if (demoMode) {
      // 데모 모드에서 로그인 전환
      router.push("/login");
    } else {
      // 편지 생성 완료 후 보낸 편지 탭으로 이동
      router.push("/inbox?tab=sent");
    }
  };

  // 복구 모달 핸들러
  const handleRestoreDraft = () => {
    loadDraft();
    setIsRestoreModalOpen(false);
  };

  const handleNewDraft = () => {
    letterDraftUtils.clearDraft();
    setIsRestoreModalOpen(false);
  };

  // 자동완성 제안 클릭 핸들러
  const handleAutocompleteClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setAutocompleteSuggestions([]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Header showCreateButton showProfile />
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* 데모 모드 배지 */}
        {demoMode && (
          <div className="mb-4 flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: "#FFE11D", color: "#000000" }}
            >
              데모 모드
            </div>
            <p className="text-sm text-gray-400">
              저장하려면 로그인이 필요합니다
            </p>
          </div>
        )}

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
                <Icon
                  name="search"
                  size={20}
                  color="#6A7282"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                {/* 자동완성 제안 (P1) - 검색 결과가 없을 때만 표시 */}
                {autocompleteSuggestions.length > 0 &&
                  searchResults.length === 0 && (
                    <div
                      className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden shadow-lg"
                      style={{
                        backgroundColor: "#1A1A1A",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                      data-testid="autocomplete-suggestions"
                    >
                      {autocompleteSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleAutocompleteClick(suggestion)}
                          className="w-full px-4 py-2 text-left text-base text-white hover:bg-gray-800 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* 검색 결과 */}
              {isSearching && (
                <p className="text-sm text-gray-400">검색 중...</p>
              )}
              {!isSearching && searchResults.length > 0 && (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <div className="flex-1">
                        <p className="text-base text-white font-medium">
                          {track.title}
                        </p>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                      <button
                        onClick={() => {
                          addTrack({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            albumCover: track.albumCover || "",
                          });
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="px-4 py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#FFE11D", color: "#000000" }}
                      >
                        추가
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 추가된 곡 목록 */}
              {letter.tracks.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="text-lg font-semibold text-white">
                    추가된 곡
                  </h4>
                  {letter.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-400 w-6">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-base text-white font-medium">
                            {track.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTrack(track.id)}
                        className="text-sm text-red-400 hover:opacity-80 transition-opacity"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                value={letter.message}
                onChange={(e) => {
                  try {
                    setMessage(e.target.value);
                  } catch (error) {
                    // 에러 무시 (길이 제한 초과)
                  }
                }}
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
                  {letter.message.length}/500
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
                  defaultChecked={true}
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
                <label
                  htmlFor="private"
                  className="flex items-center gap-2 cursor-pointer"
                >
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
                  <span className="text-base text-white">
                    링크만 공유 (비공개)
                  </span>
                </label>
              </div>
              <p className="text-sm ml-8" style={{ color: "#6A7282" }}>
                링크를 가진 사람만 이 편지를 볼 수 있습니다.
              </p>
            </div>

            {/* 완료 및 공유 버튼 */}
            <button
              onClick={handleCompleteAndShare}
              disabled={!letter.message.trim() || isCreating}
              className="w-full h-12 rounded-lg font-medium text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFE11D",
                color: "#000000",
                opacity: !letter.message.trim() ? 0.5 : 1,
              }}
            >
              {isCreating ? "생성 중..." : "완료 및 공유"}
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
              {letter.tracks.length === 0 && letter.message === "" ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icon
                    name="music"
                    size={48}
                    color="#6A7282"
                    className="opacity-50"
                  />
                  <p
                    className="text-base text-center mt-4"
                    style={{ color: "#6A7282" }}
                  >
                    곡과 메시지를 추가하면 미리보기가 표시됩니다
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {letter.message && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <p className="text-base text-white whitespace-pre-wrap">
                        {letter.message}
                      </p>
                    </div>
                  )}
                  {letter.tracks.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h5 className="text-lg font-semibold text-white">
                        플레이리스트
                      </h5>
                      {letter.tracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: "#1A1A1A" }}
                        >
                          <span className="text-sm text-gray-400 w-6">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-base text-white font-medium">
                              {track.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 복구 모달 (P1) */}
      <RestoreDraftModal
        isOpen={isRestoreModalOpen}
        onRestore={handleRestoreDraft}
        onNew={handleNewDraft}
      />

      {/* 완성 모달 */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        letterLink={letterLink}
        isDemoMode={demoMode}
        onLoginClick={handleLoginClick}
        onEditClick={handleEditClick}
        onCompleteClick={handleCompleteClick}
      />
    </div>
  );
}
