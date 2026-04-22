"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type NewsItem = {
  id: string;
  image_url: string;
  description: string | null;
  news_date: string;
  created_at: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsGrid({ items }: { items: NewsItem[] }) {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = useState<NewsItem | null>(null);

  const sorted = [...items].sort((a, b) => {
    const dateA = new Date(a.news_date).getTime();
    const dateB = new Date(b.news_date).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <>
      {/* 필터 */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSort("newest")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            sort === "newest"
              ? "bg-yellow-300 text-gray-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setSort("oldest")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            sort === "oldest"
              ? "bg-yellow-300 text-gray-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          오래된순
        </button>
      </div>

      {/* 소식 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sorted.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
          >
            {/* 사진 — portrait 비율 (3:4) */}
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={item.image_url}
                alt={item.description ?? "교회 소식"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* 날짜 & 설명 */}
            <div className="p-3">
              <p className="text-xs text-yellow-500 font-medium mb-1">
                {formatDate(item.news_date)}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 모달 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* 사진 */}
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={selected.image_url}
                alt={selected.description ?? "교회 소식"}
                fill
                className="object-contain bg-gray-900"
                sizes="100vw"
              />
            </div>

            {/* 날짜 & 설명 */}
            <div className="p-5">
              <p className="text-sm text-yellow-500 font-medium mb-2">
                {formatDate(selected.news_date)}
              </p>
              {selected.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
