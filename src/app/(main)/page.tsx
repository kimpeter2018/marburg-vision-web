import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    <div className="flex flex-col">
      {/* 1. 히어로 섹션 */}
      <section className="relative h-[70vh] min-h-[500px] bg-yellow-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/60 to-green-100/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-700 mb-4">
            마부르크 비전교회
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8">
            [교회 슬로건을 여기에 입력하세요]
          </p>
          <Link
            href="/about"
            className="inline-block bg-yellow-300 hover:bg-yellow-400 text-gray-700 font-medium px-8 py-3 rounded-full transition-colors"
          >
            교회 소개 보기
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
                <span className="text-yellow-600 font-bold text-sm">주일</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                주일예배
              </h3>
              <p className="text-gray-500 text-sm mb-3">[장소를 입력하세요]</p>
              <p className="text-2xl font-bold text-yellow-500">매주 일요일</p>
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
                      alt={item.description ?? "교회 소식"}
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
                      alt={album.title}
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
  );
}
