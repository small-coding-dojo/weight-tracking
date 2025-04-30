import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Tracker",
  description: "A mobile application for data tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* Header with navigation for mobile */}
            <header className="bg-blue-600 text-white shadow-md">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center mb-3">
                  <h1 className="text-xl font-bold">Data Tracker</h1>
                  <UserNav />
                </div>
                <MainNav />
              </div>
            </header>
            
            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-6">
              {children}
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-100 border-t">
              <div className="container mx-auto p-4 text-center text-sm text-gray-600">
                &copy; 2025 Data Tracker - Mobile optimized application
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
