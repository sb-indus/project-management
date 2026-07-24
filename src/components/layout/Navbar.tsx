import { Bell, Search, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
  <header className="flex h-16 items-center justify-between border-b bg-white px-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h2>

      <p className="text-sm text-gray-500">
        Welcome back, Admin
      </p>
    </div>

 <div className="flex items-center gap-3">
  <div className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100">
    <Search size={20} className="text-gray-500" />
  </div>

  <div className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100">
    <Bell size={20} className="text-gray-500" />
  </div>

  <div className="flex items-center gap-2 rounded-full border px-3 py-2">
    <UserCircle size={24} />
    <span className="text-sm font-medium">Admin</span>
  </div>
</div>
  </header>
);
}