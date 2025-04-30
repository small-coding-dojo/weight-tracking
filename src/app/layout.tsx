import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Datentracker",
  description: "Eine mobile Anwendung zur Datenverfolgung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          {/* Header mit Navigation für Mobile */}
          <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-xl font-bold mb-3">Datentracker</h1>
              <nav className="flex justify-between">
                <Link 
                  href="/" 
                  className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Eingabe
                </Link>
                <Link 
                  href="/tabelle" 
                  className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Tabelle
                </Link>
                <Link 
                  href="/diagramm" 
                  className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Diagramm
                </Link>
              </nav>
            </div>
          </header>
          
          {/* Hauptinhalt */}
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-100 border-t">
            <div className="container mx-auto p-4 text-center text-sm text-gray-600">
              &copy; 2025 Datentracker - Mobile optimierte Anwendung
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
