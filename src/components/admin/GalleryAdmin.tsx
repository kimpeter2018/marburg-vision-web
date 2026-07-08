"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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
  sort_order: number;
};

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

/** 드래그로 순서를 바꿀 수 있는 썸네일 그리드 (신규 업로드 미리보기용) */
function ReorderablePreviewGrid({
  previews,
  onReorder,
  onRemove,
}: {
  previews: string[];
  onReorder: (from: number, to: number) => void;
  onRemove?: (index: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {previews.map((src, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex === null || dragIndex === i) return;
            onReorder(dragIndex, i);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing ${
            dragIndex === i ? "opacity-40" : ""
          }`}
        >
          <Image
            src={src}
            alt={`미리보기 ${i + 1}`}
            fill
            className="object-cover"
          />
          <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {i + 1}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** 드래그로 순서를 바꿀 수 있는 기존 항목 그리드 (수정 화면용) */
function ReorderableItemGrid({
  items,
  onReorder,
  onDelete,
}: {
  items: GalleryItem[];
  onReorder: (from: number, to: number) => void;
  onDelete: (item: GalleryItem) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex === null || dragIndex === i) return;
            onReorder(dragIndex, i);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          className={`relative group aspect-square cursor-grab active:cursor-grabbing ${
            dragIndex === i ? "opacity-40" : ""
          }`}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            {item.type === "image" && item.image_url ? (
              <Image
                src={item.image_url}
                alt="갤러리"
                fill
                className="object-cover"
              />
            ) : item.youtube_url ? (
              <Image
                src={`https://img.youtube.com/vi/${getYoutubeId(item.youtube_url)}/hqdefault.jpg`}
                alt="유튜브"
                fill
                className="object-cover"
              />
            ) : null}
          </div>
          <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {i + 1}
          </span>
          <button
            onClick={() => onDelete(item)}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

export default function GalleryAdmin({
  initialAlbums,
  initialItems,
}: {
  initialAlbums: Album[];
  initialItems: GalleryItem[];
}) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<
    "list" | "new-album" | "edit-album" | "album"
  >("list");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // 새 앨범 폼 상태
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [albumPreviews, setAlbumPreviews] = useState<string[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 앨범 수정 폼 상태
  const [editAlbum, setEditAlbum] = useState<Album | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  // 수정 화면에서 순서를 바꿀 수 있는 기존 항목 목록 (드래그로 정렬, 저장 시 반영)
  const [existingItemsOrder, setExistingItemsOrder] = useState<GalleryItem[]>(
    [],
  );

  const supabase = createClient();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAlbumFiles(files);
    setAlbumPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleReorderNewFiles = (from: number, to: number) => {
    setAlbumFiles((prev) => moveItem(prev, from, to));
    setAlbumPreviews((prev) => moveItem(prev, from, to));
  };

  const handleRemoveNewFile = (index: number) => {
    setAlbumFiles((prev) => prev.filter((_, i) => i !== index));
    setAlbumPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateAlbum = async () => {
    if (!albumTitle) return alert("제목을 입력해주세요.");
    if (albumFiles.length === 0 && !youtubeUrl)
      return alert("사진 또는 유튜브 URL을 추가해주세요.");
    setUploading(true);

    try {
      // 1. 앨범 생성
      const { data: album, error: albumError } = await supabase
        .from("gallery_albums")
        .insert({ title: albumTitle, description: albumDesc })
        .select()
        .single();
      if (albumError) throw albumError;

      const newItems: GalleryItem[] = [];
      let order = 0;

      // 2. 사진 업로드 — albumFiles 배열의 순서(=드래그로 정한 순서)대로 sort_order 부여
      for (const file of albumFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("church-images")
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("church-images").getPublicUrl(fileName);

        const { data: item, error: itemError } = await supabase
          .from("gallery")
          .insert({
            type: "image",
            image_url: publicUrl,
            album_id: album.id,
            sort_order: order,
          })
          .select()
          .single();
        if (itemError) throw itemError;
        newItems.push(item);
        order += 1;
      }

      // 3. 유튜브 추가 (맨 뒤 순서)
      if (youtubeUrl) {
        const { data: item, error: itemError } = await supabase
          .from("gallery")
          .insert({
            type: "youtube",
            youtube_url: youtubeUrl,
            album_id: album.id,
            sort_order: order,
          })
          .select()
          .single();
        if (itemError) throw itemError;
        newItems.push(item);
      }

      // 4. 앨범 커버 이미지 설정 (첫 번째 사진 = 정렬 순서상 1번)
      const coverUrl = newItems.find((i) => i.type === "image")?.image_url;
      if (coverUrl) {
        await supabase
          .from("gallery_albums")
          .update({ cover_image_url: coverUrl })
          .eq("id", album.id);
        album.cover_image_url = coverUrl;
      }

      setAlbums([album, ...albums]);
      setItems([...newItems, ...items]);
      setAlbumTitle("");
      setAlbumDesc("");
      setAlbumFiles([]);
      setAlbumPreviews([]);
      setYoutubeUrl("");
      setView("list");
    } catch (e) {
      alert("업로드 실패: " + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAlbum = async (album: Album) => {
    if (
      !confirm(
        `"${album.title}" 앨범을 삭제하시겠습니까? 안에 있는 사진도 모두 삭제됩니다.`,
      )
    )
      return;

    const albumItems = items.filter((i) => i.album_id === album.id);
    const paths = albumItems
      .filter((i) => i.image_url)
      .map((i) => i.image_url!.split("/church-images/")[1]);

    if (paths.length > 0) {
      await supabase.storage.from("church-images").remove(paths);
    }
    await supabase.from("gallery_albums").delete().eq("id", album.id);
    setAlbums(albums.filter((a) => a.id !== album.id));
    setItems(items.filter((i) => i.album_id !== album.id));
  };

  const handleStartEditAlbum = (album: Album) => {
    setEditAlbum(album);
    setEditTitle(album.title);
    setEditDesc(album.description ?? "");
    setEditFiles([]);
    setEditPreviews([]);
    setEditYoutubeUrl("");
    setExistingItemsOrder(
      items
        .filter((i) => i.album_id === album.id)
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order),
    );
    setView("edit-album");
  };

  const handleCancelEditAlbum = () => {
    setEditAlbum(null);
    setEditTitle("");
    setEditDesc("");
    setEditFiles([]);
    setEditPreviews([]);
    setEditYoutubeUrl("");
    setExistingItemsOrder([]);
    setView("list");
  };

  const handleEditFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setEditFiles(files);
    setEditPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleReorderEditNewFiles = (from: number, to: number) => {
    setEditFiles((prev) => moveItem(prev, from, to));
    setEditPreviews((prev) => moveItem(prev, from, to));
  };

  const handleRemoveEditNewFile = (index: number) => {
    setEditFiles((prev) => prev.filter((_, i) => i !== index));
    setEditPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderExistingItems = (from: number, to: number) => {
    setExistingItemsOrder((prev) => moveItem(prev, from, to));
  };

  const handleDeleteItem = async (item: GalleryItem) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;

    if (item.image_url) {
      const path = item.image_url.split("/church-images/")[1];
      if (path) await supabase.storage.from("church-images").remove([path]);
    }
    await supabase.from("gallery").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setExistingItemsOrder((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleSaveEditAlbum = async () => {
    if (!editAlbum) return;
    if (!editTitle) return alert("제목을 입력해주세요.");
    setSavingEdit(true);

    try {
      // 1. 제목/설명 업데이트
      const { data: updatedAlbum, error: albumError } = await supabase
        .from("gallery_albums")
        .update({ title: editTitle, description: editDesc })
        .eq("id", editAlbum.id)
        .select()
        .single();
      if (albumError) throw albumError;

      // 2. 기존 항목들 순서(드래그로 정한 순서) DB에 반영
      const reorderedExisting = existingItemsOrder.map((item, idx) => ({
        ...item,
        sort_order: idx,
      }));
      await Promise.all(
        reorderedExisting.map((item) =>
          supabase
            .from("gallery")
            .update({ sort_order: item.sort_order })
            .eq("id", item.id),
        ),
      );

      const newItems: GalleryItem[] = [];
      let order = reorderedExisting.length;

      // 3. 새 사진 업로드 (editFiles 배열 순서대로, 기존 항목들 뒤에 이어서)
      for (const file of editFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("church-images")
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("church-images").getPublicUrl(fileName);

        const { data: item, error: itemError } = await supabase
          .from("gallery")
          .insert({
            type: "image",
            image_url: publicUrl,
            album_id: editAlbum.id,
            sort_order: order,
          })
          .select()
          .single();
        if (itemError) throw itemError;
        newItems.push(item);
        order += 1;
      }

      // 4. 새 유튜브 추가 (있는 경우, 맨 뒤)
      if (editYoutubeUrl) {
        const { data: item, error: itemError } = await supabase
          .from("gallery")
          .insert({
            type: "youtube",
            youtube_url: editYoutubeUrl,
            album_id: editAlbum.id,
            sort_order: order,
          })
          .select()
          .single();
        if (itemError) throw itemError;
        newItems.push(item);
      }

      // 5. 커버 이미지가 없었다면 1번 순서 사진으로 설정
      let finalAlbum = updatedAlbum;
      if (!updatedAlbum.cover_image_url) {
        const coverUrl =
          reorderedExisting.find((i) => i.type === "image")?.image_url ??
          newItems.find((i) => i.type === "image")?.image_url;
        if (coverUrl) {
          const { data: coverUpdated } = await supabase
            .from("gallery_albums")
            .update({ cover_image_url: coverUrl })
            .eq("id", editAlbum.id)
            .select()
            .single();
          if (coverUpdated) finalAlbum = coverUpdated;
        }
      }

      // 6. 로컬 상태 갱신: 이 앨범에 속한 항목들을 새 순서로 교체
      setItems((prev) => [
        ...prev.filter((i) => i.album_id !== editAlbum.id),
        ...reorderedExisting,
        ...newItems,
      ]);
      setAlbums(albums.map((a) => (a.id === editAlbum.id ? finalAlbum : a)));

      handleCancelEditAlbum();
    } catch (e) {
      alert("수정 실패: " + (e as Error).message);
    } finally {
      setSavingEdit(false);
    }
  };

  const albumItems = selectedAlbum
    ? items
        .filter((i) => i.album_id === selectedAlbum.id)
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
    : [];

  // 앨범 목록
  if (view === "list") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setView("new-album")}
          className="bg-green-200 hover:bg-green-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          + 새 앨범 만들기
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">
            앨범 목록 ({albums.length})
          </h2>
          {albums.length === 0 ? (
            <p className="text-sm text-gray-400">
              아직 등록된 앨범이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div key={album.id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedAlbum(album);
                      setView("album");
                    }}
                    className="w-full text-left"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                      {album.cover_image_url ? (
                        <Image
                          src={album.cover_image_url}
                          alt={album.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                          사진 없음
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {items.filter((i) => i.album_id === album.id).length}개
                    </p>
                  </button>
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEditAlbum(album)}
                      className="bg-yellow-300 hover:bg-yellow-400 text-gray-700 text-xs px-2 py-1 rounded-lg"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 새 앨범 만들기
  if (view === "new-album") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setView("list")}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 목록으로
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-600">
            새 앨범 만들기
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              앨범 제목 *
            </label>
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="예: 2024 성탄절 예배"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              설명 (선택)
            </label>
            <input
              type="text"
              value={albumDesc}
              onChange={(e) => setAlbumDesc(e.target.value)}
              placeholder="앨범 설명을 입력하세요"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              사진 (여러 장 선택 가능 — 썸네일을 드래그하면 순서를 바꿀 수
              있어요)
            </label>
            <label className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition-colors">
              📷 사진 선택
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
              />
            </label>
            {albumPreviews.length > 0 && (
              <ReorderablePreviewGrid
                previews={albumPreviews}
                onReorder={handleReorderNewFiles}
                onRemove={handleRemoveNewFile}
              />
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              유튜브 URL (선택, 항상 마지막 순서로 추가됩니다)
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <button
            onClick={handleCreateAlbum}
            disabled={uploading}
            className="bg-green-200 hover:bg-green-300 disabled:opacity-50 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            {uploading ? `업로드 중...` : "앨범 만들기"}
          </button>
        </div>
      </div>
    );
  }

  // 앨범 수정
  if (view === "edit-album" && editAlbum) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleCancelEditAlbum}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 목록으로
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-600">앨범 수정</h2>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              앨범 제목 *
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">
              설명 (선택)
            </label>
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="앨범 설명을 입력하세요"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* 기존 사진/영상 — 드래그로 순서 변경, 저장 시 반영 */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              등록된 사진/영상 ({existingItemsOrder.length}) — 드래그해서 순서를
              바꾸세요
            </label>
            {existingItemsOrder.length === 0 ? (
              <p className="text-xs text-gray-400">
                아직 등록된 항목이 없습니다.
              </p>
            ) : (
              <ReorderableItemGrid
                items={existingItemsOrder}
                onReorder={handleReorderExistingItems}
                onDelete={handleDeleteItem}
              />
            )}
          </div>

          {/* 사진 추가 */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              사진 추가 (선택 — 기존 항목들 뒤에 이어서 추가되며, 드래그로 순서
              조정 가능)
            </label>
            <label className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition-colors">
              📷 사진 선택
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleEditFilesChange}
                className="hidden"
              />
            </label>
            {editPreviews.length > 0 && (
              <ReorderablePreviewGrid
                previews={editPreviews}
                onReorder={handleReorderEditNewFiles}
                onRemove={handleRemoveEditNewFile}
              />
            )}
          </div>

          {/* 유튜브 추가 */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              유튜브 URL 추가 (선택, 항상 마지막 순서로 추가됩니다)
            </label>
            <input
              type="text"
              value={editYoutubeUrl}
              onChange={(e) => setEditYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEditAlbum}
              disabled={savingEdit}
              className="bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              {savingEdit ? "저장 중..." : "저장하기"}
            </button>
            <button
              onClick={handleCancelEditAlbum}
              disabled={savingEdit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 앨범 상세
  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setView("list");
          setSelectedAlbum(null);
        }}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← 목록으로
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-700">
            {selectedAlbum?.title}
          </h2>
          {selectedAlbum && (
            <button
              onClick={() => handleStartEditAlbum(selectedAlbum)}
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-700 text-xs px-3 py-1 rounded-lg transition-colors"
            >
              수정
            </button>
          )}
        </div>
        {selectedAlbum?.description && (
          <p className="text-xs text-gray-400 mb-4">
            {selectedAlbum.description}
          </p>
        )}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {albumItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              {item.type === "image" && item.image_url ? (
                <Image
                  src={item.image_url}
                  alt="갤러리"
                  fill
                  className="object-cover"
                />
              ) : item.youtube_url ? (
                <Image
                  src={`https://img.youtube.com/vi/${getYoutubeId(item.youtube_url)}/hqdefault.jpg`}
                  alt="유튜브"
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
