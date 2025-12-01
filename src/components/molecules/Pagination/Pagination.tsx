import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onNext: () => void
  onPrev: () => void
  onPageChange: (page: number) => void
  hasNext: boolean
  hasPrev: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onPageChange,
  hasNext,
  hasPrev
}: PaginationProps) {
  // Simplified logic based on user request: "just show the first two and the last two pages"
  // and "if there are more than 5 pages put some ... in the middle"
  const getSimplePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    return [1, 2, '...', totalPages - 1, totalPages]
  }

  const pageNumbers = getSimplePageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-black text-white border-black cursor-default'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              disabled={currentPage === page}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
