"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-10 flex items-center justify-between px-4 h-14">
      <div className="font-bold text-lg">Random Club Challenge</div>
      <div className="flex gap-2">
        <Link href="/bags" passHref legacyBehavior>
          <Button asChild className={pathname.startsWith("/bags") ? "bg-green-700" : ""}>
            <a>Bags</a>
          </Button>
        </Link>
        <Link href="/play" passHref legacyBehavior>
          <Button asChild className={pathname === "/play" ? "bg-green-700" : ""}>
            <a>Play</a>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
