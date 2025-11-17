interface IconProps {
  name:
    | "music"
    | "play"
    | "heart"
    | "search"
    | "plus"
    | "arrow-back"
    | "link"
    | "qr-code"
    | "copy"
    | "check";
  size?: number;
  className?: string;
  color?: string;
}

export function Icon({
  name,
  size = 16,
  className = "",
  color = "currentColor",
}: IconProps) {
  const icons = {
    music: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M2.67 9.33L2.67 12M8 1.33L8 14.67M13.33 9.33L13.33 12"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    play: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M2.67 4L2.67 12M8 2.67L8 13.33M13.33 4L13.33 12"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    heart: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M8 2.67L10.33 6.33L14.67 7.33L11.67 10.33L12.33 14.67L8 12.67L3.67 14.67L4.33 10.33L1.33 7.33L5.67 6.33L8 2.67Z"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
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
    ),
    plus: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M8 3.33V12.67M3.33 8H12.67"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "arrow-back": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M8.33 1.72L8.33 10.78M1.71 7.5L8.33 1.72L14.95 7.5"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "qr-code": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M2.5 2.5L2.5 4.17M13.33 2.5L13.33 4.17M2.5 13.33L2.5 15M13.33 13.33L13.33 15M17.5 17.5L17.5 17.51M5.83 5.83L5.83 5.84M2.5 10L2.51 10M10 2.5L10 2.51M10 13.33L10 13.34M13.33 10L13.34 10M17.5 10L17.5 10.01M10 16.67L10 16.68M16.67 10L16.68 10"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
        />
      </svg>
    ),
    copy: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
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
    ),
    check: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M3 8L6 11L13 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return icons[name] || null;
}

