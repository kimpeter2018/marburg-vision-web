"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleSecretClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      setClickCount(0);
      router.push("/admin/login");
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 교회 정보 */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              마부르크 비전교회
            </h3>
            <address className="not-italic text-sm text-gray-500 leading-relaxed">
              <p>[주소를 입력하세요]</p>
              <p className="mt-1">Tel: [전화번호를 입력하세요]</p>
            </address>
          </div>

          {/* 예배 안내 */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">예배 안내</h3>
            <ul className="text-sm text-gray-500 leading-relaxed space-y-1">
              <li>주일예배 — 매주 일요일 오후 12:00</li>
              <li>온라인 목요모임 — 매주 목요일 저녁 8:00</li>
            </ul>
          </div>

          {/* 소셜 링크 */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">소셜 미디어</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/marburgvision/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
              >
                Instagram
              </a>

              <a
                href="https://www.youtube.com/@%EB%A7%88%EB%B6%80%EB%A5%B4%ED%81%AC%EB%B9%84%EC%A0%84%EA%B5%90%ED%9A%8C"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 — 5번 클릭하면 어드민으로 */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p onClick={handleSecretClick} className="cursor-default select-none">
            © {new Date().getFullYear()} 마부르크 비전교회. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="hover:text-gray-600 transition-colors"
          >
            개인정보 처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
