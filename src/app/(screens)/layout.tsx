import { NextAuthProvider } from "@/components/core/provider/NextAuthProvider";
import { ThemeProvider } from "@/components/core/provider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { poppins } from "@/lib/utils/fonts";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={poppins.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            {children}
            {/* {modal} */}
            <Toaster position="top-center" richColors />
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
