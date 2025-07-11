import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentBlockStart: number;
  currentBlockEnd: number;
  handlePrevBlock: () => void;
  handleNextBlock: () => void;
  setCurrentPage: (n: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  currentBlockStart,
  currentBlockEnd,
  handlePrevBlock,
  handleNextBlock,
  setCurrentPage,
}) => {
  // 데이터가 없어도 최소 1페이지는 표시
  const effectiveTotalPages = Math.max(1, totalPages);
  const effectiveCurrentPage = Math.max(1, Math.min(currentPage, effectiveTotalPages));
  
  return (
    <div className="flex justify-center items-center mt-8 space-x-2 text-sm text-gray-500">
      <button
        onClick={handlePrevBlock}
        disabled={currentBlockStart === 1}
        className="px-2 disabled:opacity-50 transition hover:opacity-90"
      >
        «
      </button>

      <button
        onClick={() => setCurrentPage(Math.max(1, effectiveCurrentPage - 1))}
        disabled={effectiveCurrentPage === 1}
        className="px-2 disabled:opacity-50 transition hover:opacity-90"
      >
        ‹
      </button>

      {Array.from(
        { length: currentBlockEnd - currentBlockStart + 1 },
        (_, i) => currentBlockStart + i
      ).map((n) => (
        <button
          key={n}
          onClick={() => setCurrentPage(n)}
          className={`px-3 py-1 rounded transition hover:opacity-90 ${
            n === effectiveCurrentPage ? "bg-gray-100 text-gray-800" : "hover:text-gray-700"
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(Math.min(effectiveTotalPages, effectiveCurrentPage + 1))}
        disabled={effectiveCurrentPage === effectiveTotalPages}
        className="px-2 disabled:opacity-50 transition hover:opacity-90"
      >
        ›
      </button>

      <button
        onClick={handleNextBlock}
        disabled={currentBlockEnd === effectiveTotalPages}
        className="px-2 disabled:opacity-50 transition hover:opacity-90"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
