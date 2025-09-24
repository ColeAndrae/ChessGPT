"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SquareProps {
  color: "light" | "dark";
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove: boolean;
  isDanger: boolean;
  onClick: () => void;
  onDrop: () => void;
  children?: ReactNode;
}

export default function Square({
  color,
  isSelected,
  isPossibleMove,
  isLastMove,
  isDanger,
  onClick,
  onDrop,
  children,
}: SquareProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div
      className={cn(
        "relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-150",
        color === "light"
          ? "bg-board-light hover:bg-board-light-hover"
          : "bg-board-dark hover:bg-board-dark-hover",
        "cursor-pointer"
      )}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Selection highlight */}
      {isSelected && (
        <div className="absolute inset-0 bg-highlight-selected opacity-60 pointer-events-none" />
      )}

      {/* Last move highlight */}
      {isLastMove && !isSelected && (
        <div className="absolute inset-0 bg-highlight-lastMove pointer-events-none" />
      )}

      {/* Possible move indicator */}
      {isPossibleMove && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {children ? (
            // If there's a piece to capture, show a ring
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-4 border-highlight-move opacity-80" />
          ) : (
            // Empty square, show a dot
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-highlight-move opacity-80" />
          )}
        </div>
      )}

      {/* King in check highlight */}
      {isDanger && (
        <div className="absolute inset-0 bg-highlight-danger opacity-70 pointer-events-none animate-pulse" />
      )}

      {/* Piece */}
      {children}
    </div>
  );
}
