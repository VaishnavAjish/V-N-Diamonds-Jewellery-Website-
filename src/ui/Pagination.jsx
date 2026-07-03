import { useEffect, useState } from "react";
import { PaginationNext, PaginationPrev } from "@/svg";

const Pagination = ({
  items = [],
  countOfPage = 12,
  paginatedData,
  currPage,
  setCurrPage,
}) => {
  const pageStart = (currPage - 1) * countOfPage;
  const totalPage = Math.ceil(items.length / countOfPage);

  function setPage(idx) {
    if (idx <= 0 || idx > totalPage) {
      return;
    }
    setCurrPage(idx);
    window.scrollTo(0, 0);
    paginatedData(items, pageStart, countOfPage);
  }

  useEffect(() => {
    paginatedData(items, pageStart, countOfPage);
  }, [items, pageStart, countOfPage]);

  return (
    <nav>
      {totalPage > 1 && (
        <ul>
          <li>
            <button
              onClick={() => setPage(currPage - 1)}
              className={`tp-pagination-prev prev page-numbers ${
                currPage === 1 && "disabled"
              }`}
            >
              <PaginationPrev />
            </button>
          </li>

          {(() => {
            const items = [];
            let startPage, endPage;

            if (totalPage <= 5) {
              startPage = 1;
              endPage = totalPage;
            } else {
              if (currPage <= 3) {
                startPage = 1;
                endPage = 5;
              } else if (currPage + 2 >= totalPage) {
                startPage = totalPage - 4;
                endPage = totalPage;
              } else {
                startPage = currPage - 2;
                endPage = currPage + 2;
              }
            }

            if (startPage > 1) {
              items.push(
                <li key={1} onClick={() => setPage(1)}>
                  <span className={`${currPage === 1 ? "current" : ""}`}>1</span>
                </li>
              );
              items.push(
                <li key="ellipsis-start">
                  <span className="dot">...</span>
                </li>
              );
            }

            for (let i = startPage; i <= endPage; i++) {
              items.push(
                <li key={i} onClick={() => setPage(i)}>
                  <span className={`${currPage === i ? "current" : ""}`}>{i}</span>
                </li>
              );
            }

            if (endPage < totalPage) {
              items.push(
                <li key="ellipsis-end">
                  <span className="dot">...</span>
                </li>
              );
              items.push(
                <li key={totalPage} onClick={() => setPage(totalPage)}>
                  <span className={`${currPage === totalPage ? "current" : ""}`}>{totalPage}</span>
                </li>
              );
            }

            return items;
          })()}

          <li>
            <button
              onClick={() => setPage(currPage + 1)}
              className={`next page-numbers ${
                currPage === totalPage ? "disabled" : ""
              }`}
            >
              <PaginationNext />
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Pagination;
