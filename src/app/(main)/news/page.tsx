import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import NewsGrid from "@/components/NewsGrid";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "교회 소식",
  description:
    "마부르크 비전교회의 최신 소식을 확인하세요. 예배, 행사, 교회 공동체의 다양한 소식들을 사진과 함께 전해드립니다.",
  alternates: {
    canonical: `${baseUrl}/news`,
  },
  openGraph: {
    title: "교회 소식 | 마부르크 비전교회",
    description:
      "마부르크 비전교회의 최신 소식을 확인하세요. 예배, 행사, 교회 공동체의 다양한 소식들.",
    url: `${baseUrl}/news`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "마부르크 비전교회 소식",
      },
    ],
  },
};

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("news")
    .select("*")
    .order("news_date", { ascending: false });

  // JSON-LD: ItemList (최근 소식 목록)
  const newsJsonLd =
    items && items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "마부르크 비전교회 소식",
          description: "마부르크 비전교회의 최신 소식 목록",
          numberOfItems: items.length,
          itemListElement: items.slice(0, 10).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.description ?? "마부르크 비전교회 소식",
            url: `${baseUrl}/news`,
            image: item.image_url,
          })),
        }
      : null;

  return (
    <>
      {newsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
        />
      )}

      <div className="flex flex-col">
        <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
            교회 소식
          </h1>
          <div className="w-12 h-1 bg-yellow-300 mx-auto rounded-full" />
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {items && items.length > 0 ? (
              <NewsGrid items={items} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">
                  아직 등록된 소식이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
