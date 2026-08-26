"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type Album = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
};

type GalleryItem = {
  id: string;
  type: "image" | "youtube";
  image_url: string | null;
  youtube_url: string | null;
  album_id: string | null;
  sort_order?: number;
};

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

const MAX_DOTS = 7;

// 현재 인덱스를 중심으로 최대 maxDots개만 보여주는 범위 계산.
// 처음/끝 근처에서는 창이 더 이상 슬라이드하지 않아 자연스럽게 끝에 다다른 걸 알 수 있음.
function getDotRange(current: number, total: number, maxDots: number) {
  if (total <= maxDots) return { start: 0, end: total };

  const half = Math.floor(maxDots / 2);
  let start = current - half;
  let end = start + maxDots;

  if (start < 0) {
    start = 0;
    end = maxDots;
  } else if (end > total) {
    end = total;
    start = total - maxDots;
  }

  return { start, end };
}

// 스와이프로 인식할 최소 이동 거리(px)
const SWIPE_THRESHOLD = 50;

function AlbumDetail({
  album,
  items,
  onBack,
}: {
  album: Album;
  items: GalleryItem[];
  onBack: () => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) =>
      i !== null ? (i - 1 + items.length) % items.length : null,
    );
  }, [items.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i !== null ? (i + 1) % items.length : null));
  }, [items.length]);

  const handleClose = useCallback(() => setSelectedIndex(null), []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, handlePrev, handleNext, handleClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // 세로 스크롤 제스처는 무시하고, 수평 이동이 충분할 때만 넘김
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-gray-400 hover:text-yellow-500 transition-colors"
      >
        ← 갤러리로 돌아가기
      </button>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-1">{album.title}</h2>
        {album.description && (
          <p className="text-sm text-gray-400">{album.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group hover:opacity-90 transition-opacity"
          >
            {item.type === "image" && item.image_url ? (
              <Image
                src={item.image_url}
                alt="갤러리 이미지"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : item.type === "youtube" && item.youtube_url ? (
              <>
                <Image
                  src={`https://img.youtube.com/vi/${getYoutubeId(item.youtube_url)}/hqdefault.jpg`}
                  alt="유튜브 썸네일"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-gray-700 border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </>
            ) : null}
          </button>
        ))}
      </div>

      {/* 모달 */}
      {selected !== null && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* 닫기 */}
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-white text-sm hover:text-yellow-300 transition-colors"
            >
              닫기 ✕
            </button>

            {/* 카운터 */}
            <div className="absolute -top-10 left-0 text-white text-sm">
              {selectedIndex + 1} / {items.length}
            </div>

            {/* 이전 버튼 — 데스크탑 전용 (모바일은 탭/스와이프로 대체) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full items-center justify-center transition-colors z-10"
            >
              ←
            </button>

            {/* 콘텐츠 */}
            {selected.type === "image" && selected.image_url ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={selected.image_url}
                  alt="갤러리 이미지"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />

                {/* 모바일 탭 영역 — 좌/우 탭으로 이전/다음 사진 이동 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="md:hidden absolute left-0 top-0 h-full w-1/3 z-10"
                  aria-label="이전 사진"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="md:hidden absolute right-0 top-0 h-full w-1/3 z-10"
                  aria-label="다음 사진"
                />
              </div>
            ) : selected.type === "youtube" && selected.youtube_url ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(selected.youtube_url)}?autoplay=1`}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : null}

            {/* 다음 버튼 — 데스크탑 전용 (모바일은 탭/스와이프로 대체) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full items-center justify-center transition-colors z-10"
            >
              →
            </button>

            {/* 모바일 페이지 인디케이터 — 사진이 많아도 최대 7개까지만 표시 */}
            <div className="md:hidden flex justify-center gap-1.5 mt-4">
              {(() => {
                const { start, end } = getDotRange(
                  selectedIndex,
                  items.length,
                  MAX_DOTS,
                );
                return Array.from(
                  { length: end - start },
                  (_, idx) => start + idx,
                ).map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === selectedIndex
                        ? "w-4 bg-yellow-300"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GalleryGrid({
  albums,
  items,
}: {
  albums: Album[];
  items: GalleryItem[];
}) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  if (selectedAlbum) {
    return (
      <AlbumDetail
        album={selectedAlbum}
        items={items.filter((i) => i.album_id === selectedAlbum.id)}
        onBack={() => setSelectedAlbum(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album) => (
        <button
          key={album.id}
          onClick={() => setSelectedAlbum(album)}
          className="text-left group"
        >
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2 group-hover:opacity-90 transition-opacity">
            {album.cover_image_url ? (
              <Image
                src={album.cover_image_url}
                alt={album.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                사진 없음
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {items.filter((i) => i.album_id === album.id).length}장
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 truncate">
            {album.title}
          </p>
          {album.description && (
            <p className="text-xs text-gray-400 truncate">
              {album.description}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
