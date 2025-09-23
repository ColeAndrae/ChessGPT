import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold bg-slate-800 bg-clip-text text-transparent mb-4">
            ChessGPT
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose your opponent
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full">
          {/* Play vs AI */}
          <Link
            href="/play/vs-bot"
            className="group relative flex-1 overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Play vs AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Challenge our intelligent chess bot
              </p>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  • 4 difficulty levels
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  • Play as White or Black
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  • Instant gameplay
                </div>
              </div>
              <div className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                Start Playing
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}
