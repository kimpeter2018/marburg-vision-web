import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "교회 소개",
  description: "[교회 소개 설명을 입력하세요]",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          교회 소개
        </h1>
        <div className="w-12 h-1 bg-yellow-300 mx-auto rounded-full" />
      </section>

      {/* 1. 교회 소개글 */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            우리 교회를 소개합니다
          </h2>
          <div className="space-y-4 text-gray-500 leading-relaxed text-sm md:text-base">
            <p>[교회 소개 첫 번째 단락을 여기에 입력하세요.]</p>
            <p>[교회 소개 두 번째 단락을 여기에 입력하세요.]</p>
            <p>[교회 소개 세 번째 단락을 여기에 입력하세요.]</p>
          </div>
        </div>
      </section>

      {/* 2. 교회 사진들 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            교회 사진
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-video bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. 목사님 소개 */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            담임 목사 소개
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 목사님 사진 placeholder */}
            <div className="w-48 h-48 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
              <span className="text-yellow-400 text-sm">[사진]</span>
            </div>

            {/* 목사님 소개글 */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                [목사님 성함]
              </h3>
              <p className="text-yellow-500 text-sm font-medium mb-4">
                담임 목사
              </p>
              <div className="space-y-3 text-gray-500 text-sm leading-relaxed">
                <p>[목사님 소개 첫 번째 단락을 여기에 입력하세요.]</p>
                <p>[목사님 소개 두 번째 단락을 여기에 입력하세요.]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 위치 */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            오시는 길
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* 지도 placeholder */}
            <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400 text-sm">
                [Google Maps iframe을 여기에 삽입하세요]
              </span>
            </div>

            {/* 주소 정보 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  주소
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  [교회 주소를 여기에 입력하세요]
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  전화번호
                </h3>
                <p className="text-gray-500 text-sm">[전화번호를 입력하세요]</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  대중교통
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  [대중교통 안내를 여기에 입력하세요]
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  예배 시간
                </h3>
                <ul className="text-gray-500 text-sm space-y-1">
                  <li>주일예배 — 매주 일요일 오후 12:00</li>
                  <li>온라인 목요모임 — 매주 목요일 저녁 8:00</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
