'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button";
import { BookOpen, Calendar, LayoutDashboard, LogOut, ShieldCheck, Stethoscope, UserCircle2 } from "lucide-react";
import NavItems from "./NavItems";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserDropdown = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const user = session?.user;
    const role = user?.role;

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/auth/signin");
    }

    const customerMenu = [
        { href: "/dashboard/customer/bookings", label: "My Bookings", icon: BookOpen },
        { href: "/dashboard/customer/profile", label: "Profile", icon: UserCircle2 },
    ];

    const adminMenu = [
        { href: "/dashboard/admin", label: "Admin Dashboard", icon: ShieldCheck },
    ];

    const nutritionistMenu = [
        { href: "/dashboard/nutritionist", label: "Nutritionist Dashboard", icon: Stethoscope },
    ];

    const activeMenu =
    role === "admin"
      ? adminMenu
      : role === "nutritionist"
      ? nutritionistMenu
      : customerMenu;
    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-3 hover:bg-emerald-500/20 cursor-pointer py-6">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photo || "https://github.com/shadcn.png"} />
                    <AvatarFallback className="bg-emerald-500 text-emerald-900 text-sm font-bold">
                        {user?.name?.[0] || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-base font-medium text-emerald-500">
                        {user?.name || "User"}
                    </span>
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-gray-400 bg-gray-800">
            <DropdownMenuLabel>
                <div className="flex relative items-center gap-3 py-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photo || "https://github.com/shadcn.png"} />
                        <AvatarFallback className="bg-emerald-500 text-emerald-900 text-sm font-bold">
                            {user?.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-400">
                            {user?.name || "User"}
                        </span>
                        <span className="text-sm text-gray-500">{user?.email}</span>
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />

            {activeMenu.map((item) => (
                <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-emerald-500 transition-colors cursor-pointer"
                >
                    <Link href={item.href} className="flex items-center gap-2 py-2">
                    <item.icon className="h-4 w-4 text-emerald-400" />
                    {item.label}
                    </Link>
                </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="bg-gray-600" />

            <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-emerald-500 transition-colors cursor-pointer">
                <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
            <nav className="sm:hidden">
                <NavItems />
            </nav>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown