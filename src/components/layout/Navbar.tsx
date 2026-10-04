"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ResizableNavbar } from "@/components/velora/resizable-navbar";

const ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Check Status", href: "/status" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <ResizableNavbar
      items={ITEMS}
      activeHref={pathname}
      threshold={40}
      compactWidth={760}
      maxWidth={1280}
      label="Main"
      logo={
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/pragyam-logo.png" alt="Pragyam 2.0" width={36} height={36} priority className="h-9 w-9" />
          <span className="leading-none">
            <span className="font-display block text-xl text-white">Pragyam</span>
            <span className="mt-0.5 block text-[8px] font-extrabold uppercase tracking-[0.28em] text-orange">2.0 · Tech Fest</span>
          </span>
        </Link>
      }
    />
  );
}
