export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            홍길동
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
        </div>
        <div className="h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </main>
    </div>
  );
}
