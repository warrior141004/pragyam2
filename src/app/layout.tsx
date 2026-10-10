import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntroPreloader from "@/components/layout/IntroPreloader";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PageTransition from "@/components/layout/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "PRAGYAM 2.0 | Department of Computer Science, CURAJ",
  description:
    "Pragyam 2.0 — coming soon. A student-run tech fest themed around AI, by the Department of Computer Science, Central University of Rajasthan.",
};

// Decides before first paint whether the intro curtain shows, so the page
// never flashes underneath it. Runs once per browser session; add ?intro=1 to the URL to replay it.
const INTRO_SCRIPT = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var force=/[?&]intro=1(&|$)/.test(location.search);if(!force&&sessionStorage.getItem('pragyam_intro_shown'))return;sessionStorage.setItem('pragyam_intro_shown','1');document.documentElement.classList.add('has-intro');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <IntroPreloader />
        <SmoothScroll />
        <PageTransition>
          <div className="site">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </PageTransition>
      </body>
    </html>
  );
}
