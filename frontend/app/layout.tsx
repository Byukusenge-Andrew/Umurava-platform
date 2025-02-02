import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Umurava",
  description: "Build Work Experience Through Skills Challenges Program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
