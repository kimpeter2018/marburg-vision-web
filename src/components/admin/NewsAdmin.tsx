"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type NewsItem = {
  id: string;
  image_url: string;
  description: string | null;
  news_date: string;
};

export default function NewsAdmin({
  initialItems,
}: {
  initialItems: NewsItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !date) return alert("사진과 날짜를 입력해주세요.");
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `news/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("church-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("church-images").getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from("news")
        .insert({ image_url: publicUrl, description, news_date: date })
        .select()
        .single();

      if (dbError) throw dbError;

      setItems([data, ...items]);
      setFile(null);
      setPreview(null);
      setDate("");
      setDescription("");
    } catch (e) {
      alert("업로드 실패: " + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const path = imageUrl.split("/church-images/")[1];
    await supabase.storage.from("church-images").remove([path]);
    await supabase.from("news").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* 업로드 폼 */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-600">새 소식 등록</h2>

        {/* 사진 업로드 */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">사진 *</label>
          <label className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition-colors">
            📷 사진 선택
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {preview && (
            <div className="relative w-32 aspect-[3/4] mt-3 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="미리보기"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* 날짜 */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">날짜 *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            설명 (선택)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="간단한 설명을 입력하세요"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          {uploading ? "업로드 중..." : "등록하기"}
        </button>
      </div>

      {/* 등록된 소식 목록 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">
          등록된 소식 ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-400">아직 등록된 소식이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt="소식"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  {item.news_date}
                </p>
                <button
                  onClick={() => handleDelete(item.id, item.image_url)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
