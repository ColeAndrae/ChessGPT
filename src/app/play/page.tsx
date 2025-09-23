"use client";

import { useState } from "react";
import Board from "@/components/board/Board";

export default function PlayPage() {
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [currentFen, setCurrentFen] = useState<string | undefined>(undefined);

  const handleMove = (from: string, to: string) => {
    const move = `${from}-${to}`;
    setGameHistory((prev) => [...prev, move]);
    console.log("Move made:", move);
  };

  const resetGame = () => {
    setCurrentFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setGameHistory([]);
    setTimeout(() => {
      setCurrentFen(undefined);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent">
              Chess Master
            </h1>
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                New Game
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
              <Board fen={currentFen} orientation="white" onMove={handleMove} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Player Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="space-y-4">
                {/* Black Player */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Black
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Player 2
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-chess text-gray-800 dark:text-gray-200">
                    10:00
                  </div>
                </div>

                {/* White Player */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-green-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-800 flex items-center justify-center text-gray-800 font-bold">
                      W
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        White
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Player 1
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-chess text-gray-800 dark:text-gray-200">
                    10:00
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
                          {move}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Game Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors">
                  Undo
                </button>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors">
                  Redo
                </button>
                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors">
                  Draw
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                  Resign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
