"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import BagIcon from "@/components/ui/BagIcon";
import PlayIcon from "@/components/ui/PlayIcon";
import ClubsIcon from "@/components/ui/ClubsIcon";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="relative z-50 w-full bg-background text-foreground shadow flex flex-col sm:flex-row items-center justify-between px-4 py-2 sm:h-14">
      <div className="font-bold text-lg text-foreground mb-2 sm:mb-0">Random Club Challenge</div>
      <div className="flex gap-2 items-center">
				<Link href="/play">
          <Button className={(pathname === "/play" ? "bg-green-600 text-white " : "bg-green-600 text-white hover:bg-green-700 ") + "flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 top-nav-button top-nav-button--play"}>
            Play <PlayIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <Link href="/bags">
          <Button className={(pathname.startsWith("/bags") ? "bg-primary text-primary-foreground " : "") + "flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 top-nav-button"}>
            Bags <BagIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <Link href="/clubs">
          <Button className={(pathname.startsWith("/clubs") ? "bg-primary text-primary-foreground " : "") + "flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 top-nav-button"}>
            Clubs <ClubsIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
