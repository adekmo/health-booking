import Link from "next/link";

export default function NutritionistLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-800/30 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Nutritionist Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/nutritionist">Home</Link>
          <Link href="/dashboard/nutritionist/profile">My Profile</Link>
          <Link href="/dashboard/nutritionist/bookings">My Bookings</Link>
          <Link href="/dashboard/nutritionist/settings">Settings</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
