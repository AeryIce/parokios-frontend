import BackendProbe from "@/app/_components/BackendProbe";

export default function ProbePage() {
  return (
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black">Debug: Backend Probe</h1>
        <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Halaman ini buat ngecek env Vercel (Preview vs Production).
        </p>

        <BackendProbe />
      </div>
    </main>
  );
}
