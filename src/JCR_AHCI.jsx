import supabase from "./supabaseClient";
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DisplayJournal from "./displayJournal";

const JCR_AHCI_journal = () => {
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");

  //接收supabase資料
  const fetchFields = async () => {
    const { data, error } = await supabase
        .from("journals")
        .select("field")
        .eq("database", "JCR資料庫-AHCI");

    if (error) throw new Error(error.message);

    const uniqueFields = [...new Set(data.map((item) => item.field))];
    setFields(uniqueFields);
  };

  const fetchJournals = async (newPage, field) => {
    setLoading(true);
    const start = (newPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error } = await supabase
      .from('journal_data')
      .select('*')
      .range(start, end)
      .eq("database", "JCR資料庫-AHCI")
      .eq("field", field)
      .order("if_value", { ascending: false });

    if (error) {
      console.error('Error:', error);
    } else {
      setJournals(data || []);
      console.log("success:");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (selectedField) {
      fetchJournals(page, selectedField);
    }
  }, [page, selectedField]);

  useEffect(() => {
    fetchFields();
  }, []);

  const handleFieldChange = (event) => {
    const field = event.target.value;
    setSelectedField(field);
    fetchJournals(page, field);
};

  //設定展開狀態
  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 切換頁面
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchJournals(newPage, selectedField);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchJournals(newPage, selectedField);
    }
  };

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">JCR AHCI Journal Viewer</h1>
        <select
            className="p-2 border rounded mb-4"
            value={selectedField}
            onChange={handleFieldChange}
        >
            <option value="">Select Field</option>
            {fields.map((field) => (
                <option key={field} value={field}>{field}</option>
            ))}
        </select>
        <ul>
          {loading ? (
            <li className="text-center">Loading...</li>
          ) : <DisplayJournal journals={journals} expandedIds={expandedIds} toggleJournal={toggleJournal} />}
        </ul>

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

export default JCR_AHCI_journal;