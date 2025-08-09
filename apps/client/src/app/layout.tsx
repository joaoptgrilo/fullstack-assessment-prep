import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poll App",
  description: "A full-stack polling application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Estilos do container aplicados aqui com Tailwind */}
        <div className="max-w-3xl mx-auto my-12 p-8 sm:p-10 bg-surface border border-border-color rounded-xl shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
