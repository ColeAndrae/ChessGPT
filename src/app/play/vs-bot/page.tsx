"use client";

import { useState, useEffect, useCallback } from "react";
import Board from "@/components/board/Board";
import { ChessAI, Difficulty } from "@/lib/ai/engine";
import { Chess } from "chess.js";

export default function VsBotPage() {
  const [chess] = useState(new Chess());
  const [ai] = useState(new ChessAI());
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [, forceUpdate] = useState({});

  // Force re-render
  const triggerUpdate = () => forceUpdate({});

  // Check game status
  const checkGameStatus = useCallback(() => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "Black" : "White";
      setGameStatus(`Checkmate! ${winner} wins!`);
      return true;
    }
    if (chess.isDraw()) {
      setGameStatus("Draw!");
      return true;
    }
    if (chess.isStalemate()) {
      setGameStatus("Stalemate!");
      return true;
    }
    if (chess.inCheck()) {
      setGameStatus("Check!");
    } else {
      setGameStatus("");
    }
    return false;
  }, [chess]);

  // Make AI move
  const makeAIMove = useCallback(async () => {
    if (chess.isGameOver()) return;

    setIsThinking(true);

    // Get AI move with simulated thinking time
    const move = await ai.getBestMoveWithDelay(chess, difficulty);

    if (move) {
      const result = chess.move(move);
      if (result) {
        const moveNotation = `${result.from}-${result.to}`;
        setGameHistory((prev) => [...prev, moveNotation]);
        triggerUpdate();

        // Check game status after AI move
        if (!checkGameStatus()) {
          setIsPlayerTurn(true);
        }
      }
    }

    setIsThinking(false);
  }, [chess, ai, difficulty, checkGameStatus]);

  // Handle player move
  const handlePlayerMove = useCallback(() => {
    // This function is no longer needed since we handle everything in handleMove
  }, []);

  // Handle move from board (player move)
  const handleMove = useCallback(
    (from: string, to: string) => {
      const moveNotation = `${from}-${to}`;
      setGameHistory((prev) => [...prev, moveNotation]);
      triggerUpdate();

      // Check game status after player move
      if (!chess.isGameOver()) {
        const gameOver = checkGameStatus();
        if (!gameOver) {
          // Switch to AI turn
          setIsPlayerTurn(false);
        }
      }
    },
    [chess, checkGameStatus]
  );

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (!isPlayerTurn && !chess.isGameOver()) {
      makeAIMove();
    }
  }, [isPlayerTurn, makeAIMove, chess]);

  // If player is black, make first AI move
  useEffect(() => {
    if (playerColor === "black" && gameHistory.length === 0) {
      setIsPlayerTurn(false);
    }
  }, [playerColor, gameHistory.length]);

  // Start new game
  const startNewGame = (
    color: "white" | "black" = playerColor,
    diff: Difficulty = difficulty
  ) => {
    chess.reset();
    setGameHistory([]);
    setPlayerColor(color);
    setDifficulty(diff);
    setIsPlayerTurn(color === "white");
    setGameStatus("");
    triggerUpdate();

    // If player chose black, AI makes first move
    if (color === "black") {
      setIsPlayerTurn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent">
              Chess vs AI
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => startNewGame()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                New Game
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Game Board - full width on mobile */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 sm:p-4 md:p-6 w-full max-w-[500px] lg:max-w-none">
              <Board
                chess={chess}
                orientation={playerColor}
                onMove={handleMove}
                isPlayerTurn={isPlayerTurn}
              />

              {/* Game Status Display */}
              {(gameStatus || isThinking) && (
                <div className="mt-3 sm:mt-4 text-center">
                  {isThinking && (
                    <div className="text-sm sm:text-base md:text-lg font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                      AI is thinking...
                    </div>
                  )}
                  {gameStatus && (
                    <div
                      className={`text-base sm:text-lg md:text-xl font-bold ${
                        gameStatus.includes("wins")
                          ? "text-red-600"
                          : gameStatus === "Check!"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {gameStatus}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - stacks on mobile */}
          <div className="space-y-4 sm:space-y-6">
            {/* Game Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
                Game Settings
              </h2>

              {/* Difficulty Selection */}
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Difficulty
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {(
                    [
                      "beginner",
                      "intermediate",
                      "advanced",
                      "expert",
                    ] as Difficulty[]
                  ).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => startNewGame(playerColor, diff)}
                      className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                        difficulty === diff
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Play as
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <button
                    onClick={() => startNewGame("white", difficulty)}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                      playerColor === "white"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    ♔ White
                  </button>
                  <button
                    onClick={() => startNewGame("black", difficulty)}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                      playerColor === "black"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    ♚ Black
                  </button>
                </div>
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="space-y-4">
                {/* AI Player */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    !isPlayerTurn && !chess.isGameOver()
                      ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        playerColor === "white"
                          ? "bg-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      AI
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        AI ({difficulty})
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {playerColor === "white" ? "Black" : "White"}
                      </p>
                    </div>
                  </div>
                  {isThinking && (
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Human Player */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isPlayerTurn && !chess.isGameOver()
                      ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        playerColor === "white"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      You
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Player
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {playerColor === "white" ? "White" : "Black"}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    {isPlayerTurn && !chess.isGameOver() ? "Your turn" : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Move History
              </h2>
              <div className="max-h-64 overflow-y-auto">
                {gameHistory.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No moves yet
                  </p>
                ) : (
                  <div className="space-y-1">
                    {gameHistory.map((move, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-8">
                          {Math.floor(index / 2) + 1}.
                        </span>
                        <span className="font-chess text-gray-800 dark:text-gray-200">
                          {index % 2 === 0
                            ? playerColor === "white"
                              ? "You: "
                              : "AI: "
                            : playerColor === "white"
                            ? "AI: "
                            : "You: "}
                          {move}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Difficulty Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                Difficulty Guide
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-green-600">
                    Beginner:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Makes random moves sometimes
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-yellow-600">
                    Intermediate:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Thinks 2 moves ahead
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-orange-600">
                    Advanced:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Thinks 3 moves ahead
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-red-600">Expert:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Thinks 4 moves ahead
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
