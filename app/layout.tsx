import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Header, Footer } from "@/components";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bekzod Isakov",
  description: "Personal portfolio",
  verification: { google: "LszkQ400U6C7Ncd88Bpbug7Cje-UmHdXkA6zut-P" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' themes={["light", "dark"]}>
          <div className='min-h-screen custom-container mx-auto flex flex-col overflow-x-hidden sm:gap-8'>
            <Header />
            {/* <div className="custom-container flex flex-col grow px-4"> */}
            <main className='space-y-20 grow mb-20 '>{children}</main>
            <Footer />
            {/* </div> */}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
