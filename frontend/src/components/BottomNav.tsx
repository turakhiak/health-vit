"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, BarChart2, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Today", icon: Home },
        { href: "/log", label: "Log", icon: PlusCircle },
        { href: "/dashboard", label: "Trends", icon: BarChart2 },
        { href: "/history", label: "History", icon: Calendar },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-brand-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
