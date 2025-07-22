import React from "react";
import "../App.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="secondary"
            >
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="secondary"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
