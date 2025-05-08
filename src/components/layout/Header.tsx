"use client";

import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { useThemeColor } from "@/hooks/useThemeColor";

export function Header() {
  const primary = useThemeColor("Main", "Primary");
  const onPrimary = useThemeColor("On", "Primary");

  return (
    <header className={`${primary} ${onPrimary} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">ScaleTrack</h1>
          <UserNav />
        </div>
        <MainNav />
      </div>
    </header>
  );
}
