import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          Project Management
        </h1>
      </div>

      <nav className="flex flex-col p-4 gap-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/users">Users</Link>
        <Link href="/attendance">Attendance</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/tasks">Tasks</Link>
        <Link href="/master-pay-sheet">
          Master Pay Sheet
        </Link>
        <Link href="/master-time-sheet">
          Master Time Sheet
        </Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </aside>
  );
}