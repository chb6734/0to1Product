"use client";

import { useState } from "react";
import { Icon } from "./Icon";

interface PlatformSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (platform: "spotify" | "apple" | "youtube" | "melon") => void;
}

const platforms = [
  { id: "spotify", name: "Spotify", color: "#1DB954" },
  { id: "apple", name: "Apple Music", color: "#FA243C" },
  { id: "youtube", name: "YouTube Music", color: "#FF0000" },
  { id: "melon", name: "멜론", color: "#00D563" },
] as const;

export function PlatformSelectModal({
  isOpen,
  onClose,
  onSelect,
}: PlatformSelectModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "spotify" | "apple" | "youtube" | "melon" | null
  >(null);

  if (!isOpen) return null;

  const handleSelect = (platform: "spotify" | "apple" | "youtube" | "melon") => {
    setSelectedPlatform(platform);
    onSelect(platform);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#121212",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">플랫폼 선택</h2>
          <p className="text-base" style={{ color: "#6A7282" }}>
            재생할 음악 플랫폼을 선택해주세요
          </p>
        </div>

        <div className="space-y-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleSelect(platform.id)}
              className="w-full flex items-center gap-4 p-4 rounded-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: platform.color }}
              >
                <Icon name="play" size={20} color="#FFFFFF" />
              </div>
              <span className="text-base font-medium text-white flex-1 text-left">
                {platform.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg text-base font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#1A1A1A",
            color: "#6A7282",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}

