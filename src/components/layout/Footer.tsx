export default function Footer() {
  return (
    <footer className="border-t bg-white px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          © {new Date().getFullYear()} Project Management System
        </span>

        <span>Version 1.0</span>
      </div>
    </footer>
  );
}