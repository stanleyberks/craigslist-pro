import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "Craigslist Alert Pro",
    description: "Get instant notifications for new Craigslist listings matching your search criteria.",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>);
}
