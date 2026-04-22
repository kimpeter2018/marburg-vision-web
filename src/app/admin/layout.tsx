import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-700 text-sm">🛠 관리자</span>
          <nav className="flex gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
            >
              대시보드
            </Link>
            <Link
              href="/admin/news"
              className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
            >
              소식 관리
            </Link>
            <Link
              href="/admin/gallery"
              className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
            >
              갤러리 관리
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-green-500 transition-colors"
          >
            🏠 홈페이지 보기
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
      >
        로그아웃
      </button>
    </form>
  );
}
