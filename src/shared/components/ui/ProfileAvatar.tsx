interface ProfileAvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
};

export function ProfileAvatar({
  initials,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  return (
    <div
      className={`rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${SIZE_MAP[size]} ${className}`}
      style={{ backgroundColor: "#FFE11D", color: "#000000" }}
    >
      {initials}
    </div>
  );
}

