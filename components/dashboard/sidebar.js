"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Box,
  ClipboardList,
  Home,
  MenuIcon,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Enquiries",
    href: "/dashboard/enquiries",
    icon: Users,
  }
  // {
  //   title: "Analytics",
  //   href: "/dashboard/analytics",
  //   icon: BarChart,
  // },
  // {
  //   title: "Reports",
  //   href: "/dashboard/reports",
  //   icon: ClipboardList,
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Close sidebar when route changes on mobile
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Check if current view is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-background p-4 transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-4">
          <nav className="grid gap-1 px-2 mt-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-2 h-10",
                  pathname === item.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>

          {/* <div className="mt-auto">
            <Button
              variant="ghost"
              className="justify-start gap-2 w-full"
              asChild
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div> */}
        </div>
      </aside>
    </>
  );
}