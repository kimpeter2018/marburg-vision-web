import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "교회 소개",
  description:
    "마부르크 비전교회를 소개합니다. 2017년에 시작된 마부르크의 한인 교회입니다.",
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

      {/* 교회 소개 — 단락과 사진 교차 배치 */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* 단락 1 + 사진 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                마부르크 비전교회는 누구나 자유롭게, 형식에 얽매이지 않고
                하나님께 예배드릴 수 있기를 바라는 소망 하나로 2017년에 문을
                열었습니다. 작은 시작이었지만, 같은 마음을 품은 작은 손길들이
                하나둘 모여 지금까지 매주 예배를 이어오고 있습니다.
              </p>
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/church.jpg"
                  alt="마부르크 비전교회"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 288px"
                />
              </div>
            </div>
          </div>

          {/* 사진 + 단락 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="flex-1">
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                독일 마부르크는 유서 깊은 학문의 도시입니다. 그 특성에 걸맞게
                저희 교회 역시 학업과 삶의 새로운 챕터를 시작한 학생들이
                공동체의 중심을 이루고 있습니다. 낯선 땅에서 믿음의 동료를
                만나고, 함께 예배하며 서로의 일상을 나눌 수 있는 곳이 되고자
                합니다.
              </p>
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/church.jpg"
                  alt="마부르크 비전교회 예배"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 288px"
                />
              </div>
            </div>
          </div>

          {/* 단락 3 + 사진 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                저희 교회에는 다양한 배경과 이야기를 가진 분들이 함께합니다.
                신앙의 연차도, 살아온 환경도 제각각이지만, 하나님 안에서 하나
                되어 함께 지어져 가는 것이 우리 공동체의 비전입니다. 어떤 분이든
                편안하게 문을 두드려 주시기를 언제나 환영합니다.
              </p>
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/church.jpg"
                  alt="마부르크 비전교회 교제"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 288px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 목사님 소개 */}
      <section className="py-16 px-4 bg-yellow-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            담임 목사 소개
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-44 h-44 rounded-full overflow-hidden flex-shrink-0 bg-yellow-100">
              <Image
                src="/pastor-profile.jpg"
                alt="이경주 목사"
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                이경주 목사
              </h3>
              <p className="text-yellow-500 text-sm font-medium mb-4">
                담임 목사
              </p>
              <ul className="text-gray-500 text-sm space-y-1.5">
                <li>협성대학교 졸업</li>
                <li>청주 OO교회 개척</li>
                <li>FLN 선교훈련 수료</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-8 text-center">
            오시는 길
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* 구글 지도 */}
            <div className="rounded-2xl overflow-hidden aspect-video shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.0!2d8.7493!3d50.8211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bc2a4e4f0b0001%3A0x0!2sWehrdaer+Str.+60%2C+35041+Marburg!5e0!3m2!1sko!2sde!4v1700000000000!5m2!1sko!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="마부르크 비전교회 위치"
              />
            </div>

            {/* 주소 + 교통 정보 */}
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  주소
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Wehrdaer Str. 60, 35041 Marburg
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  전화번호
                </h3>
                <a
                  href="tel:+491738815073"
                  className="text-gray-500 text-sm hover:text-yellow-500 transition-colors"
                >
                  +49 173 8815073
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  대중교통
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 text-yellow-700 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Marburg Hbf에서{" "}
                      <strong className="text-gray-600 font-medium">
                        버스 1번
                      </strong>{" "}
                      탑승 →{" "}
                      <strong className="text-gray-600 font-medium">
                        Diakonie-Krankenhaus
                      </strong>{" "}
                      정류장 하차
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-700 text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Marburg Hbf에서{" "}
                      <strong className="text-gray-600 font-medium">
                        버스 4번
                      </strong>{" "}
                      탑승 →{" "}
                      <strong className="text-gray-600 font-medium">
                        Marburg-Wehrda Mengelsgasse
                      </strong>{" "}
                      하차 후 도보 10분
                    </p>
                  </div>
                </div>
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
