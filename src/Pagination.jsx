import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <>
          <button onClick={() => handlePageChange(1)}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button onClick={() => handlePageChange(currentPage - 1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </>
      )}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      {currentPage < totalPages && (
        <>
          <button onClick={() => handlePageChange(currentPage + 1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button onClick={() => handlePageChange(totalPages)}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
