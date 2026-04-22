import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-gray-700 mb-2">
        개인정보 처리방침
      </h1>
      <p className="text-xs text-gray-400 mb-10">시행일: 2025년 1월 1일</p>

      <div className="space-y-10 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            1. 개인정보의 처리 목적
          </h2>
          <p>
            마부르크 비전교회(이하 &quot;교회&quot;)는 다음의 목적을 위하여
            개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는
            사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할
            것입니다.
          </p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-gray-500">
            <li>교회 소식 및 행사 안내</li>
            <li>예배 및 모임 참석 관리</li>
            <li>교인 간 교류 및 공동체 운영</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            2. 개인정보의 처리 및 보유 기간
          </h2>
          <p>
            교회는 법령에 따른 개인정보 보유 및 이용기간 또는 정보주체로부터
            개인정보를 수집 시에 동의 받은 개인정보 보유 및 이용기간 내에서
            개인정보를 처리 및 보유합니다. 교인 관계가 종료된 경우 해당
            개인정보는 즉시 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            3. 개인정보의 제3자 제공
          </h2>
          <p>
            교회는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한
            범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
            해당하는 경우에만 개인정보를 제3자에게 제공합니다. 교회는 원칙적으로
            정보주체의 개인정보를 외부에 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            4. 웹사이트 운영 및 수집 정보
          </h2>
          <p>
            본 웹사이트는 방문자의 개인정보를 별도로 수집하지 않습니다.
            웹사이트에 게시되는 사진 및 영상은 교회 행사 및 예배 기록을 위한
            것이며, 사진에 포함된 교인의 초상권을 존중합니다. 사진 게시에 이의가
            있으신 경우 아래 연락처로 문의해 주시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            5. 정보주체의 권리·의무 및 행사 방법
          </h2>
          <p>
            정보주체는 교회에 대해 언제든지 다음 각 호의 개인정보 보호 관련
            권리를 행사할 수 있습니다.
          </p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-gray-500">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            6. 개인정보의 파기
          </h2>
          <p>
            교회는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
            불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 전자적
            파일 형태의 정보는 복구 및 재생이 불가능한 기술적 방법을 사용하여
            완전히 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            7. 개인정보 보호책임자
          </h2>
          <p>
            교회는 개인정보 처리에 관한 업무를 총괄하고, 개인정보 처리와 관련한
            정보주체의 불만 처리 및 피해 구제를 위하여 아래와 같이 개인정보
            보호책임자를 지정하고 있습니다.
          </p>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl text-gray-500 space-y-1">
            <p>개인정보 보호책임자: [담당자 이름]</p>
            <p>연락처: [전화번호 또는 이메일]</p>
            <p>주소: [교회 주소]</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            8. 개인정보 처리방침의 변경
          </h2>
          <p>
            이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
            변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
            전부터 웹사이트를 통하여 고지할 것입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
