// components/profile/TabButton.tsx
import React from 'react';

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      text-left w-full px-6 py-3 font-medium
      ${
        active
          ? 'bg-[var(--Gray-02,#F9F9FA)] text-[var(--Gray-10,#232323)] text-[18px] font-medium leading-[130%] tracking-[-0.36px]'
          : 'bg-[var(--Gray-02,#F9F9FA)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-medium leading-[130%] tracking-[-0.36px]'
      }
    `}
  >
    {label}
  </button>
);

export default TabButton;
