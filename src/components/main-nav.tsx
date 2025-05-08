"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

export function MainNav() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isDev, setIsDev] = useState(false);

  const primaryHover = useThemeColor("Hover", "Primary");
  const onPrimary = useThemeColor("On", "Primary");
  const warningText = useThemeColor("Text", "Warning");
  const linkTheme = `px-3 py-2 rounded ${primaryHover} ${onPrimary} transition-colors`;

  useEffect(() => {
    // Only show design system link in development mode
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="flex justify-between">
      <Link href="/" className={linkTheme}>
        Input
      </Link>
      <Link href="/table" className={linkTheme}>
        Table
      </Link>
      <Link href="/chart" className={linkTheme}>
        Chart
      </Link>
      {isDev && (
        <Link
          href="/design-system"
          className={`px-3 py-2 rounded ${primaryHover} transition-colors ${warningText}`}
        >
          Design System
        </Link>
      )}
    </nav>
  );
}
