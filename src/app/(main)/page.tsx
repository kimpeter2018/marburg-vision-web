import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
};

// JSON-LD: 교회 구조화 데이터
const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "마부르크 비전교회",
  alternateName: "Marburg Vision Church",
  url: baseUrl,
  description:
    "독일 마부르크에 위치한 한인 교회. 매주 일요일 오후 12시 주일예배, 매주 목요일 저녁 8시 온라인 목요모임.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Wehrdaer Str. 60",
    addressLocality: "Marburg",
    postalCode: "35041",
    addressCountry: "DE",
  },
  telephone: "+49-173-8815073",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.8211,
    longitude: 8.7493,
  },
  sameAs: [
    "https://www.instagram.com/marburgvision/",
    "https://www.youtube.com/@%EB%A7%88%EB%B6%80%EB%A5%B4%ED%81%AC%EB%B9%84%EC%A0%84%EA%B5%90%ED%9A%8C",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "12:00",
      closes: "14:00",
      description: "주일예배",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: "20:00",
      closes: "22:00",
      description: "온라인 목요모임",
    },
  ],
  image: `${baseUrl}/og-image.jpg`,
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: newsItems }, { data: albums }] = await Promise.all([
    supabase
      .from("news")
      .select("*")
      .order("news_date", { ascending: false })
      .limit(4),
    supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
      />

      <div className="flex flex-col">
        {/* 1. 히어로 섹션 */}
        <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
          <Image
            src="/marburg-hero.jpg"
            alt="마부르크 비전교회 예배당"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.05) 38%, transparent 42%)",
            }}
          />
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-xl">
            <p className="text-xs font-medium tracking-widest text-yellow-300 uppercase mb-4">
              마부르크 비전교회
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug mb-6 drop-shadow-sm">
              하나님 안에서 하나 되며
              <br />
              <span className="text-yellow-300">함께 지어져 가는 교회</span>
            </h1>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-medium px-7 py-3 rounded-full transition-colors text-sm w-fit"
            >
              교회 소개 보기
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. 예배 안내 섹션 */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              예배 안내
            </h2>
            <div className="w-12 h-1 bg-yellow-300 mx-auto mb-10 rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-2xl p-8 text-left">
                <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-yellow-600 font-bold text-sm">
                    주일
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  주일예배
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  Wehrdaer Str. 60, 35041 Marburg
                </p>
                <p className="text-2xl font-bold text-yellow-500">
                  매주 일요일
                </p>
                <p className="text-xl text-gray-600">오후 12:00</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-8 text-left">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-sm">목요</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  온라인 목요모임
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  온라인 (Zoom / YouTube)
                </p>
                <p className="text-2xl font-bold text-green-500">매주 목요일</p>
                <p className="text-xl text-gray-600">저녁 8:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 교회 소식 섹션 */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
                교회 소식
              </h2>
              <Link
                href="/news"
                className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="w-12 h-1 bg-green-300 mb-10 rounded-full" />

            {newsItems && newsItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newsItems.map((item) => (
                  <Link
                    href="/news"
                    key={item.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.description ?? "마부르크 비전교회 소식"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-yellow-500 font-medium">
                        {new Date(item.news_date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. 갤러리 섹션 */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
                갤러리
              </h2>
              <Link
                href="/gallery"
                className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="w-12 h-1 bg-yellow-300 mb-10 rounded-full" />

            {albums && albums.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {albums.map((album) => (
                  <Link
                    href="/gallery"
                    key={album.id}
                    className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group hover:opacity-90 transition-opacity"
                  >
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={`마부르크 비전교회 ${album.title} 갤러리`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        사진 없음
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
