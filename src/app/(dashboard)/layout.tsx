import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

    <div className="flex flex-1 flex-col">
  <Navbar />

  <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
    {children}
  </main>

  <Footer />
</div>
    </div>
  );
}