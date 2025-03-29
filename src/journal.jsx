import supabase from "./supabaseClient";
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DisplayJournal from "./displayJournal";

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  //接收supabase資料
  const fetchJournals = async (newPage) => {
    setLoading(true);
    const start = (newPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error } = await supabase
      .from('journal_data')
      .select('*')
      .range(start, end);

    if (error) {
      console.error('Error:', error);
    } else {
      setJournals(data || []);
      console.log("success:");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJournals(page);
  }, [page]);

  //設定展開狀態
  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 切換頁面
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchJournals(newPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchJournals(newPage);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : <DisplayJournal journals={journals} expandedIds={expandedIds} toggleJournal={toggleJournal} />}

      {/* 分頁按鈕 */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          className="btn mx-2 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
            transition: "background 0.3s ease",
            opacity: page === 1 ? 0.5 : 1, // 禁用時降低透明度
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FaChevronLeft />
        </button>

        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#444", margin: "0 10px" }}>
          {page}
        </span>

        <button
          className="btn mx-2 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          onClick={handleNextPage}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Journal;
