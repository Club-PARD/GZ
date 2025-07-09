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
}) => (
  <div className="flex justify-center items-center mt-8 space-x-2 text-sm text-gray-500">
    <button
      onClick={handlePrevBlock}
      disabled={currentBlockStart === 1}
      className="px-2 disabled:opacity-50"
    >
      «
    </button>

    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-2 disabled:opacity-50"
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
        className={`px-3 py-1 rounded ${
          n === currentPage ? "bg-gray-100 text-gray-800" : "hover:text-gray-700"
        }`}
      >
        {n}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-2 disabled:opacity-50"
    >
      ›
    </button>

    <button
      onClick={handleNextBlock}
      disabled={currentBlockEnd === totalPages}
      className="px-2 disabled:opacity-50"
    >
      »
    </button>
  </div>
);

export default Pagination;
