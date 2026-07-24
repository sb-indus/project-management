import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderKanban,
  CheckSquare,
  DollarSign,
  Clock3,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: Calendar,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Master Pay Sheet",
    href: "/master-pay-sheet",
    icon: DollarSign,
  },
  {
    label: "Master Time Sheet",
    href: "/master-time-sheet",
    icon: Clock3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];



export default function Sidebar() {
  return (
    <aside className="w-72 border-r bg-white">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold">
          Project Management
        </h1>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}