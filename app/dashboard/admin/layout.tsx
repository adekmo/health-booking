import Link from "next/link";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/admin">Home</Link>
          <Link href="/dashboard/admin/users">Users</Link>
          <Link href="/dashboard/admin/bookings">Bookings</Link>
          <Link href="/dashboard/admin/settings">Settings</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
