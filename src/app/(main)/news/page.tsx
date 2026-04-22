import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import NewsGrid from "@/components/NewsGrid";

export const metadata: Metadata = {
  title: "교회 소식",
  description: "마부르크 비전교회의 최신 소식을 확인하세요.",
};

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("news")
    .select("*")
    .order("news_date", { ascending: false });

  return (
    <div className="flex flex-col">
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          교회 소식
        </h1>
        <div className="w-12 h-1 bg-yellow-300 mx-auto rounded-full" />
      </section>

      {/* 소식 그리드 */}
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
  );
}
