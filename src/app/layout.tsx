import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",
  title: {
    default: "마부르크 비전교회",
    template: "%s | 마부르크 비전교회",
  },
  description:
    "독일 마부르크에 위치한 한인 교회입니다. 매주 일요일 오후 12시 주일예배, 매주 목요일 저녁 8시 온라인 목요모임을 드립니다. Wehrdaer Str. 60, 35041 Marburg",
  keywords: [
    "마부르크 비전교회",
    "마부르크 한인교회",
    "독일 한인교회",
    "독일 교회",
    "Marburg 한인교회",
    "비전교회",
    "독일 마부르크",
    "마부르크 교회",
    "Marburg Korean Church",
    "독일 유학생 교회",
    "마부르크 유학생 교회",
  ],
  authors: [{ name: "마부르크 비전교회" }],
  creator: "마부르크 비전교회",
  publisher: "마부르크 비전교회",
  formatDetection: {
    telephone: true,
    email: false,
    address: true,
  },
  openGraph: {
    title: "마부르크 비전교회",
    description:
      "독일 마부르크에 위치한 한인 교회입니다. 매주 일요일 오후 12시 주일예배, 매주 목요일 저녁 8시 온라인 목요모임을 드립니다.",
    url: baseUrl,
    locale: "ko_KR",
    type: "website",
    siteName: "마부르크 비전교회",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "마부르크 비전교회",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "마부르크 비전교회",
    description:
      "독일 마부르크에 위치한 한인 교회입니다. 매주 일요일 오후 12시 주일예배.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Y42Qi2jiSVx3bB1vLOEy8OteBlFS7utw-DtItvUpLfI",
    other: {
      "naver-site-verification": "55c62158d4c40d961b52e1a87f1829d75fe3d6b6",
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
