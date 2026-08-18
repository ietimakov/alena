import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Алёна Урсова — портфолио", description: "Портфолио художника Алёны Урсовой" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body>{children}</body></html>; }
