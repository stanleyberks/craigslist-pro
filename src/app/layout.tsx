import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { AnalyticsProvider } from '@/providers/analytics-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Craigslist Alert Pro",
  description: "Get instant notifications for new Craigslist listings matching your search criteria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Craigslist Alert Pro</title>
        <meta name="description" content="Get instant alerts for Craigslist listings" />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Providers>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
