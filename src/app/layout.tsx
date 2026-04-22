import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "마부르크 비전교회",
    template: "%s | 마부르크 비전교회",
  },
  description: "[교회 소개 문구를 여기에 입력하세요]",
  keywords: [
    "마부르크 비전교회",
    "독일 교회",
    "한인 교회",
    "Marburg",
    "비전교회",
    "독일 한인 교회",
  ],
  authors: [{ name: "마부르크 비전교회" }],
  creator: "마부르크 비전교회",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "마부르크 비전교회",
    description: "[교회 소개 문구를 여기에 입력하세요]",
    locale: "ko_KR",
    type: "website",
    siteName: "마부르크 비전교회",
  },
  twitter: {
    card: "summary_large_image",
    title: "마부르크 비전교회",
    description: "[교회 소개 문구를 여기에 입력하세요]",
  },
  verification: {
    google: "[Google Search Console 인증 코드 — 나중에 입력]",
    other: {
      "naver-site-verification":
        "[네이버 서치어드바이저 인증 코드 — 나중에 입력]",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
