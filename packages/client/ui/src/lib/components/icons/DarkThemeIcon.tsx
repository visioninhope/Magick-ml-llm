type DarkIconProps = {
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

export const DarkIcon = ({
  className = "",
  width = 15,
  height = 16,
  onClick,
}: DarkIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <g id="dark_mode">
        <path
          id="Vector"
          d="M5.95488 4.20791C5.84238 4.60791 5.78613 5.02666 5.78613 5.45166C5.78613 8.00166 7.86113 10.0767 10.4111 10.0767C10.8361 10.0767 11.2549 10.0204 11.6549 9.90791C11.0049 11.5079 9.42988 12.6392 7.59863 12.6392C5.18613 12.6392 3.22363 10.6767 3.22363 8.26416C3.22363 6.43291 4.35488 4.85791 5.95488 4.20791ZM7.59863 2.63916C4.49238 2.63916 1.97363 5.15791 1.97363 8.26416C1.97363 11.3704 4.49238 13.8892 7.59863 13.8892C10.7049 13.8892 13.2236 11.3704 13.2236 8.26416C13.2236 7.97666 13.1986 7.68916 13.1611 7.41416C12.5486 8.27041 11.5486 8.82666 10.4111 8.82666C8.54863 8.82666 7.03613 7.31416 7.03613 5.45166C7.03613 4.32041 7.59238 3.31416 8.44863 2.70166C8.17363 2.66416 7.88613 2.63916 7.59863 2.63916Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

