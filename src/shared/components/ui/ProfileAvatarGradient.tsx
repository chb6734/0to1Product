interface ProfileAvatarGradientProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
};

export function ProfileAvatarGradient({
  initials,
  size = "md",
  className = "",
}: ProfileAvatarGradientProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${SIZE_MAP[size]} ${className}`}
      style={{
        background: "linear-gradient(180deg, #FFE11D 0%, #2ADFFF 100%)",
        color: "#000000",
      }}
    >
      {initials}
    </div>
  );
}

