import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-2">
          관리자 대시보드
        </h1>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
    </div>
  );
}
