// components/TermsModal.tsx
import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function TermsModal({ open, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-11/12 max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">서비스 이용약관</h2>
        {/* TODO: 실제 약관 내용을 여기에 넣어주세요 */}
        <div className="h-64 overflow-auto border p-4">
          <p>여기에 서비스 이용약관 전문을 넣어주세요.</p>
        </div>
      </div>
    </div>
  );
}
