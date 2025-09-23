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
  const imagePath = `/pieces/${colorName}-${pieceName}.svg`;

  // Unicode chess pieces as fallback
  const unicodePieces: Record<string, string> = {
    "white-king": "♔",
    "white-queen": "♕",
    "white-rook": "♖",
    "white-bishop": "♗",
    "white-knight": "♘",
    "white-pawn": "♙",
    "black-king": "♚",
    "black-queen": "♛",
    "black-rook": "♜",
    "black-bishop": "♝",
    "black-knight": "♞",
    "black-pawn": "♟",
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      e.dataTransfer.effectAllowed = "move";
      onDragStart();
    }
  };

  return (
    <div
      className={cn(
        "relative w-14 h-14 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200",
        "hover:scale-110 hover:z-10",
        isDragging && "opacity-50 scale-110"
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Try to load SVG image, fallback to Unicode */}
      <div className="relative w-full h-full">
        <Image
          src={imagePath}
          alt={`${colorName} ${pieceName}`}
          width={56}
          height={56}
          className="drop-shadow-md"
          onError={(e) => {
            // Fallback to Unicode character if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        {/* Unicode fallback */}
        <div
          className="absolute inset-0 items-center justify-center text-5xl select-none hidden"
          style={{ display: "none" }}
        >
          {unicodePieces[`${colorName}-${pieceName}`]}
        </div>
      </div>
    </div>
  );
}
