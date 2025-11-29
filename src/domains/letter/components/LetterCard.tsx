"use client";

import { ProfileAvatar } from "@/shared/components/ui/ProfileAvatar";
import { Icon } from "@/shared/components/ui/Icon";
import { getDefaultLetterImage } from "@/shared/utils/imageUpload";

interface LetterCardProps {
  sender?: string;
  recipient?: string;
  senderInitials?: string;
  recipientInitials?: string;
  title?: string;
  message?: string;
  imageUrl?: string;
  trackCount: number;
  playCount: number;
  likeCount: number;
  date: string;
  onClick?: () => void;
}

export function LetterCard({
  sender,
  recipient,
  senderInitials,
  recipientInitials,
  title,
  message,
  imageUrl,
  trackCount,
  playCount,
  likeCount,
  date,
  onClick,
}: LetterCardProps) {
  const displayName = sender || recipient || "";
  const displayInitials = senderInitials || recipientInitials || "";

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden transition-opacity hover:opacity-90 ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: "#121212",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* 편지 이미지 */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={imageUrl || getDefaultLetterImage()}
          alt="편지 이미지"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex gap-4">
        <ProfileAvatar initials={displayInitials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{displayName}</h3>
            <span className="text-sm" style={{ color: "#6A7282" }}>
              {date}
            </span>
          </div>
          {title && (
            <p className="text-base mb-4 text-white">{title}</p>
          )}
          {message && (
            <p className="text-base mb-4" style={{ color: "#6A7282" }}>
              {message}
            </p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Icon name="music" size={16} color="#6A7282" />
              <span className="text-sm" style={{ color: "#6A7282" }}>
                {trackCount}곡
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="play" size={16} color="#6A7282" />
              <span className="text-sm" style={{ color: "#6A7282" }}>
                {playCount}회 재생
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="heart" size={16} color="#6A7282" />
              <span className="text-sm" style={{ color: "#6A7282" }}>
                {likeCount}개
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

