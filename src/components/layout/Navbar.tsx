export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span>Admin</span>
      </div>
    </header>
  );
}