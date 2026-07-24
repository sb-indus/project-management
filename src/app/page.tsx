import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-3xl rounded-xl bg-white p-10 shadow-lg">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Project Management System
          </h1>

          <p className="text-gray-600">
            Frontend Starter Template built with Next.js, TypeScript,
            Tailwind CSS, and shadcn/ui.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
          >
            Login (Coming Soon)
          </Link>
        </div>

        <div className="mt-10 rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-3 text-xl font-semibold">
            Project Modules
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div>📊 Dashboard</div>
            <div>👥 Users</div>
            <div>📁 Projects</div>
            <div>✅ Tasks</div>
            <div>🕒 Attendance</div>
            <div>💰 Master Pay Sheet</div>
            <div>⏱️ Master Time Sheet</div>
            <div>⚙️ Settings</div>
          </div>
        </div>
      </div>
    </main>
  );
}