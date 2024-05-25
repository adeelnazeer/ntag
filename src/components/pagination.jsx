/* eslint-disable react/prop-types */
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  console.log({pageNumbers})

  return (
    <nav className=" flex justify-center">
      <ul className="flex space-x-1 sm:space-x-2 md:space-x-4">
        <li>
          <button
            className={`rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 sm:px-3 sm:py-1.5 sm:text-lg md:px-4 md:py-2 md:text-xl`}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            {"<"}
          </button>
        </li>

        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                className={`${
                  currentPage === page
                    ? "bg-[#5538c8] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded px-2 py-1 sm:px-3 sm:py-1.5 sm:text-lg md:px-4 md:py-2 md:text-xl`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            className={`rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 sm:px-3 sm:py-1.5 sm:text-lg md:px-4 md:py-2 md:text-xl `}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            {">"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
