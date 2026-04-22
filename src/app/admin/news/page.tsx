import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewsAdmin from "@/components/admin/NewsAdmin";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: items } = await supabase
    .from("news")
    .select("*")
    .order("news_date", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-700 mb-6">소식 관리</h1>
      <NewsAdmin initialItems={items ?? []} />
    </div>
  );
}
