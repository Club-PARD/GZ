// components/profile/SupportSection.tsx
import React from 'react';

const SupportSection: React.FC = () => (
  <>
    <h1 className="text-2xl font-semibold mb-4 border-b pb-2">고객센터</h1>
    <div className="space-y-4 text-gray-700">
      <p><span className="font-medium">이메일:</span> zigu06official@gmail.com</p>
      <p>
        <span className="font-medium">근무시간 및 휴무안내:</span><br />
        평일 09:00–18:00 (점심 12:00–14:00)<br />
        휴무: 토/일/공휴일
      </p>
    </div>
  </>
);
export default SupportSection;
