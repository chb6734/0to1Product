import { Icon } from "./Icon";

interface EmptyStateProps {
  icon?: "music" | "letter";
  message: string;
  className?: string;
}

export function EmptyState({
  icon = "music",
  message,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 ${className}`}
    >
      <Icon
        name={icon === "music" ? "music" : "letter"}
        size={64}
        color="#6A7282"
        className="opacity-50"
      />
      <p
        className="text-base text-center mt-4"
        style={{ color: "#6A7282" }}
      >
        {message}
      </p>
    </div>
  );
}

