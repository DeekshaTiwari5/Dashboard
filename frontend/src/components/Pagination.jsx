import React from "react";
import "../App.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      gap: "20px",
      padding:"20px"
    }}>
      <span
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          cursor: currentPage === 1 ? "default" : "pointer",
          color: currentPage === 1 ? "#ccc" : "#00a86b",
        }}
      >
        Previous
      </span>

      <span >{currentPage||1}</span>

      <span
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          cursor: currentPage === totalPages ? "default" : "pointer",
          color: currentPage === totalPages ? "#ccc" : "#00a86b",
        }}
      >
        Next
      </span>
    </div>
  );
}

export default Pagination;
