"use client";

import React, { useState, useEffect } from "react";
import Square from "./Square";
import Piece from "./Piece";
import { Chess } from "chess.js";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type PieceColor = "w" | "b";
type SquareType =
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "a7"
  | "a8"
  | "b1"
  | "b2"
  | "b3"
  | "b4"
  | "b5"
  | "b6"
  | "b7"
  | "b8"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "c8"
  | "d1"
  | "d2"
  | "d3"
  | "d4"
  | "d5"
  | "d6"
  | "d7"
  | "d8"
  | "e1"
  | "e2"
  | "e3"
  | "e4"
  | "e5"
  | "e6"
  | "e7"
  | "e8"
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "g1"
  | "g2"
  | "g3"
  | "g4"
  | "g5"
  | "g6"
  | "g7"
  | "g8"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "h7"
  | "h8";

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface BoardProps {
  chess: Chess;
  orientation?: "white" | "black";
  onMove?: (from: string, to: string) => void;
  isPlayerTurn?: boolean;
}

const Board: React.FC<BoardProps> = ({
  chess,
  orientation = "white",
  onMove,
  isPlayerTurn = true,
}) => {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [isCheck, setIsCheck] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: ChessPiece;
    from: string;
  } | null>(null);

  // Update board whenever chess instance changes
  useEffect(() => {
    updateBoardState();
  }, [chess.fen()]);

  const updateBoardState = () => {
    const newBoard: (ChessPiece | null)[][] = [];
    for (let row = 0; row < 8; row++) {
      newBoard[row] = [];
      for (let col = 0; col < 8; col++) {
        const square = getSquareNotation(row, col) as SquareType;
        const piece = chess.get(square);
        newBoard[row][col] = piece;
      }
    }
    setBoard(newBoard);
    setIsCheck(chess.inCheck());
  };

  const getSquareNotation = (row: number, col: number): string => {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = String(8 - row); // 8-1
    return `${file}${rank}`;
  };

  const getSquareColor = (row: number, col: number): "light" | "dark" => {
    return (row + col) % 2 === 0 ? "light" : "dark";
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!isPlayerTurn) return; // Prevent moves when it's AI's turn

    const square = getSquareNotation(row, col);
    const piece = board[row][col];

    if (selectedSquare) {
      // Try to make a move
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square);
      } else if (piece && piece.color === orientation[0]) {
        // Select a new piece (only player's pieces)
        selectSquare(square);
      } else {
        // Deselect
        clearSelection();
      }
    } else if (piece && piece.color === orientation[0]) {
      // Select a piece (only player's pieces)
      selectSquare(square);
    }
  };

  const selectSquare = (square: string) => {
    setSelectedSquare(square);
    const moves = chess.moves({
      square: square as SquareType,
      verbose: true,
    }) as Array<{ to: string }>;
    // When verbose is true, moves returns an array of Move objects
    setPossibleMoves(moves.map((m) => m.to));
  };

  const clearSelection = () => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const makeMove = (from: string, to: string) => {
    try {
      const move = chess.move({
        from: from as SquareType,
        to: to as SquareType,
        promotion: "q",
      });
      if (move) {
        setLastMove({ from, to });
        updateBoardState();
        clearSelection();
        if (onMove) {
          onMove(from, to);
        }
      }
    } catch (error) {
      console.error("Invalid move:", error);
      clearSelection();
    }
  };

  const handleDragStart = (piece: ChessPiece, square: string) => {
    if (!isPlayerTurn) return; // Prevent drag when it's AI's turn
    if (piece.color === orientation[0]) {
      // Only allow dragging player's pieces
      setIsDragging(true);
      setDraggedPiece({ piece, from: square });
      selectSquare(square);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedPiece(null);
    clearSelection();
  };

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      const to = getSquareNotation(row, col);
      makeMove(draggedPiece.from, to);
    }
    handleDragEnd();
  };

  const isKingInCheck = (row: number, col: number): boolean => {
    const piece = board[row][col];
    return isCheck && piece?.type === "k" && piece.color === chess.turn();
  };

  const files =
    orientation === "white"
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];
  const ranks =
    orientation === "white"
      ? ["8", "7", "6", "5", "4", "3", "2", "1"]
      : ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="relative">
        {/* Rank labels */}
        <div className="absolute -left-4 sm:-left-6 md:-left-8 top-0 h-full flex flex-col justify-around">
          {ranks.map((rank) => (
            <div
              key={rank}
              className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 h-12 sm:h-14 md:h-16 flex items-center"
            >
              {rank}
            </div>
          ))}
        </div>

        {/* File labels */}
        <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 left-0 w-full flex justify-around">
          {files.map((file) => (
            <div
              key={file}
              className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 w-12 sm:w-14 md:w-16 text-center"
            >
              {file}
            </div>
          ))}
        </div>

        {/* Chess board */}
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 dark:border-gray-600 rounded-lg shadow-2xl overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const square = getSquareNotation(rowIndex, colIndex);
              const isSelected = selectedSquare === square;
              const isPossibleMove = possibleMoves.includes(square);
              const isLastMoveSquare =
                lastMove?.from === square || lastMove?.to === square;
              const isDanger = isKingInCheck(rowIndex, colIndex);

              return (
                <Square
                  key={square}
                  color={getSquareColor(rowIndex, colIndex)}
                  isSelected={isSelected}
                  isPossibleMove={isPossibleMove}
                  isLastMove={isLastMoveSquare}
                  isDanger={isDanger}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                >
                  {piece && (
                    <Piece
                      type={piece.type}
                      color={piece.color}
                      isDragging={isDragging && draggedPiece?.from === square}
                      onDragStart={() => handleDragStart(piece, square)}
                      onDragEnd={handleDragEnd}
                    />
                  )}
                </Square>
              );
            })
          )}
        </div>
      </div>

      {/* Game status - responsive text sizes */}
      <div className="mt-4 sm:mt-6 text-center">
        {chess.isCheckmate() && (
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
            Checkmate! {chess.turn() === "w" ? "Black" : "White"} wins!
          </div>
        )}
        {chess.isDraw() && (
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
            Draw!
          </div>
        )}
        {chess.inCheck() && !chess.isCheckmate() && (
          <div className="text-base sm:text-lg md:text-xl font-semibold text-orange-600">
            Check!
          </div>
        )}
        {!chess.isGameOver() && (
          <div className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
            {chess.turn() === "w" ? "White" : "Black"} to move
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
