"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type PieceColor = "w" | "b";

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function Piece({
  type,
  color,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: PieceProps) {
  const pieceNames: Record<PieceType, string> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king",
  };

  const colorName = color === "w" ? "white" : "black";
  const pieceName = pieceNames[type];

  // Use the actual SVG files you have
  const imagePath = `/pieces/${colorName}-${pieceName}.svg`;

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      e.dataTransfer.effectAllowed = "move";
      onDragStart();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200",
        "hover:scale-110 hover:z-10",
        isDragging && "opacity-50 scale-110"
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <Image
        src={imagePath}
        alt={`${colorName} ${pieceName}`}
        width={56}
        height={56}
        className="w-[80%] h-[80%] object-contain drop-shadow-md"
        priority
      />
    </div>
  );
}
