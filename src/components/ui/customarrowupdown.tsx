import React from "react";
import { cn } from "@/lib/utils";

type CustomArrowUpDownProps = {
  direction?: "asc" | "desc" | false;
  size?: number;
  className?: string;
};

export function CustomArrowUpDown({
  direction = false,
  size = 20,
  className = "",
}: CustomArrowUpDownProps) {
  const upColor = direction === "asc" ? "#FFE58A" : "#000000";   
  const downColor = direction === "desc" ? "#FFE58A" : "#000000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("lucide-arrow-up-down", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Up arrow (left) */}
      <line x1="8" y1="19" x2="8" y2="5" stroke={upColor} />
      <polyline points="5 8 8 5 11 8" stroke={upColor} />

      {/* Down arrow (right) */}
      <line x1="16" y1="5" x2="16" y2="19" stroke={downColor} />
      <polyline points="13 16 16 19 19 16" stroke={downColor} />
    </svg>
  );
}
