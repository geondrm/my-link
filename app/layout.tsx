import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "MyLink — 모든 링크를 하나로 연결하세요",
    template: "%s | MyLink",
  },
  description:
    "SNS, 포트폴리오, 블로그, 쇼핑몰까지 — 흩어진 링크를 깔끔한 한 페이지로 정리하세요. 30초면 나만의 프로필 링크가 완성됩니다.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://mylink.vercel.app",
  ),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
  },
  twitter: {
    card: "summary_large_image",
  },
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
