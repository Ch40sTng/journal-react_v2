import LineChart from "./linechart";
import supabase from "./supabaseClient";
import { useEffect, useState } from 'react';
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getLatestUpdate = (arr) => {
  if (!Array.isArray(arr)) return -1;
  return arr.findIndex(val => val != null);
};

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
      ) : journals.length > 0 ? (
        journals.map((journal, index) => (
          <div key={journal.id} className="row align-items-center mb-4">
            {/* 標題 + 展開/收起按鈕 */}
            <div
              onClick={() => toggleJournal(journal.id)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {/* 根據展開狀態變換圖示 */}
              {expandedIds[journal.id] ? <FiChevronDown /> : <FiChevronRight />}
              <h4 className="fw-bold fs-3 mb-0">{journal.name}</h4>
            </div>


            {expandedIds[journal.id] && (
              <>
                {/* 左側：期刊資訊區塊 */}
                <div className="col-md-6 pe-md-3">
                  
                  {/* Database, Field, and Code */}
                  <div 
                    className="col-md-6 pe-md-3" 
                    style={{ borderLeft: '2px solid #d3d3d3', paddingLeft: '1rem' }}
                  >
                    <div className="text-muted fs-6" style={{ whiteSpace: 'nowrap' }}>
                      <p className="mb-2">
                        <strong>Database:</strong> {journal.database} &nbsp; | &nbsp;
                        <strong>Field:</strong> {journal.field} &nbsp; | &nbsp;
                        <strong>Code:</strong> {journal.code}
                      </p>
                      
                      {/* EISSN and ISSN */}
                      <p className="mb-2">
                        <strong>EISSN:</strong> {journal.eissn} &nbsp; | &nbsp;
                        <strong>ISSN:</strong> {journal.issn}
                      </p>
                    </div>
                  </div>
                  {/* IF Value */}
                  <p className="mb-2">
                    <strong>Impact Factor (IF):</strong> {
                      (() => {
                        const latestIfIndex = getLatestUpdate(journal.if_value);
                        if (latestIfIndex == -1) {
                          return 'N/A';
                        }
                        return (
                          <>
                            {journal.if_value[latestIfIndex]}{' '}
                              <span style={{ color: 'grey' }}>
                                  ( last update in {2024 - latestIfIndex} )
                              </span>
                          </>
                        );
                      })()
                    }
                  </p>
                  
                  {/* Total Cites */}
                  <p className="mb-2">
                    <strong>Total Cites:</strong> {
                      (() => {
                        const latestTotalCitiesIndex = getLatestUpdate(journal.totalcites);
                        if (latestTotalCitiesIndex == -1) {
                          return 'N/A';
                        }
                        return (
                          <>
                            {journal.totalcites[latestTotalCitiesIndex]}{' '}
                              <span style={{ color: 'grey' }}>
                                  ( last update in {2024 - latestTotalCitiesIndex} )
                              </span>
                          </>
                        );
                      })()
                    }
                  </p>
                  
                  {/* Rank (Numerator/Denominator) */}
                  <p className="mb-2">
                    <strong>期刊領先程度百分位:</strong> {
                      (() => {
                        const latestRankIndex = Math.min(getLatestUpdate(journal.numerator), getLatestUpdate(journal.denominator));
                        if (latestRankIndex == -1) {
                          return 'N/A';
                        }
                        return (
                          <>
                            {journal.numerator[latestRankIndex]} / {journal.denominator[latestRankIndex]} {' '}
                              <span style={{ color: 'grey' }}>
                                  ( last update in {2024 - latestRankIndex} )
                              </span>
                          </>
                        );
                      })()
                    }
                  </p>
                  
                  {/* Publications */}
                  <p className="mb-2">
                    <strong>Number of publications: </strong> {
                      (() => {
                        const latestPublicIndex = getLatestUpdate(journal.publication);
                        if (latestPublicIndex == -1) {
                          return 'N/A';
                        }
                        return (
                          <>
                            {journal.publication[latestPublicIndex]}{' '}
                              <span style={{ color: 'grey' }}>
                                  ( last update in {2024 - latestPublicIndex} )
                              </span>
                          </>
                        );
                      })()
                    }
                  </p>
                </div>

                {/* 右側：折線圖區塊 */}
                <div className="col-md-6 ps-md-3">
                  <LineChart journal={journal} />
                </div>

                {/* 除最後一項外，加入分隔線 */}
                {index !== journals.length - 1 && <hr className="my-3 w-100" />}
              </>
            )}
          </div>
        ))
      ) : (
        <p>沒有期刊資料。</p>
      )}

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
