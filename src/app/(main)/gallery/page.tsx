import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "갤러리",
  description:
    "마부르크 비전교회 갤러리입니다. 예배, 행사, 교제의 사진과 영상을 앨범별로 확인하세요.",
  alternates: {
    canonical: `${baseUrl}/gallery`,
  },
  openGraph: {
    title: "갤러리 | 마부르크 비전교회",
    description:
      "마부르크 비전교회 갤러리 — 예배, 행사, 교제의 사진과 영상을 앨범별로 확인하세요.",
    url: `${baseUrl}/gallery`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "마부르크 비전교회 갤러리",
      },
    ],
  },
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const [{ data: albums }, { data: items }] = await Promise.all([
    supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  // JSON-LD: ImageGallery
  const galleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "마부르크 비전교회 갤러리",
    description: "마부르크 비전교회 예배 및 행사 사진 모음",
    url: `${baseUrl}/gallery`,
    author: {
      "@type": "Church",
      name: "마부르크 비전교회",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />

      <div className="flex flex-col">
        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
            갤러리
          </h1>
          <div className="w-12 h-1 bg-green-300 mx-auto rounded-full" />
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {albums && albums.length > 0 ? (
              <GalleryGrid albums={albums} items={items ?? []} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">
                  아직 등록된 항목이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
