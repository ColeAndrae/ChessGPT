import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent mb-4">
            Chess Master
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional Chess Game Built with Next.js
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Play vs Computer */}
          <Link
            href="/play/vs-bot"
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Play vs AI
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Challenge our intelligent chess bot
              </p>
              <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                4 difficulty levels →
              </div>
            </div>
          </Link>

          {/* Play vs Human (Local) */}
          <Link
            href="/play"
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">♔ ♚</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Play vs Human
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Challenge a friend locally
              </p>
              <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                2 Player mode →
              </div>
            </div>
          </Link>

          {/* Online Play - Coming Soon */}
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 opacity-60 cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Play Online
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Challenge players worldwide
              </p>
              <p className="text-sm text-yellow-600 mt-2">Coming Soon</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}
