import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: newsCount }, { count: galleryCount }] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-700 mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">교회 소식</p>
          <p className="text-3xl font-bold text-yellow-400">{newsCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">등록된 소식</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">갤러리</p>
          <p className="text-3xl font-bold text-green-400">
            {galleryCount ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">등록된 항목</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/news"
          className="bg-yellow-300 hover:bg-yellow-400 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          소식 관리 →
        </Link>
        <Link
          href="/admin/gallery"
          className="bg-green-200 hover:bg-green-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          갤러리 관리 →
        </Link>
      </div>
    </div>
  );
}
