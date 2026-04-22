import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GalleryAdmin from "@/components/admin/GalleryAdmin";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: albums }, { data: items }] = await Promise.all([
    supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-700 mb-6">갤러리 관리</h1>
      <GalleryAdmin initialAlbums={albums ?? []} initialItems={items ?? []} />
    </div>
  );
}
