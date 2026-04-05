import GameBoard from "./components/GameBoard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-indigo-700 tracking-tight">
            Memory Match
          </h1>
          <p className="text-lg text-gray-500">
            Flip the cards. Find the pairs.
          </p>
        </div>
        <GameBoard />
      </div>
    </main>
  );
}
