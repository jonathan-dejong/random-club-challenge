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
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <nav className="relative z-50 w-full bg-background text-foreground shadow flex flex-col sm:flex-row items-center justify-between px-4 py-2 sm:h-14">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <div className="font-bold text-lg text-foreground mb-2 sm:mb-0 cursor-pointer">Random Club Challenge</div>
      </Link>
      <div className="flex gap-2 items-center">
				<Link href="/play">
          <Button className={(pathname === "/play" ? "bg-green-600 text-white " : "bg-green-600 text-white hover:bg-green-700 ") + "flex items-center gap-2 transition-transform hover:scale-105 focus:scale-105 active:scale-95 top-nav-button top-nav-button--play"}>
            Play <PlayIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <Link href="/bags">
          <Button className={(pathname.startsWith("/bags") ? "bg-primary text-primary-foreground " : "") + "flex items-center gap-2 transition-transform hover:scale-105 focus:scale-105 active:scale-95 top-nav-button"}>
            Bags <BagIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <Link href="/clubs">
          <Button className={(pathname.startsWith("/clubs") ? "bg-primary text-primary-foreground " : "") + "flex items-center gap-2 transition-transform hover:scale-105 focus:scale-105 active:scale-95 top-nav-button"}>
            Clubs <ClubsIcon className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
    </>
  );
}
