import LineChart from "./linechart";
import RadarChart from "./radarchart";
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import React, { useState } from "react";

const getLatestUpdate = (arr) => {
  if (!Array.isArray(arr)) return -1;
	return arr.findIndex(val => val != null);
};

const DisplayJournal = ({ journals, expandedIds, toggleJournal, collections, toggleCollection, checkBox, selectedJournals, toggleSelectedJournal}) => {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const charts = [LineChart, RadarChart];

  // 切換到下一個圖表
  const handleNextChart = () => {
    setCurrentChartIndex((prevIndex) => (prevIndex + 1) % charts.length); 
  };

  // 切換到上一個圖表
  const handlePreviousChart = () => {
    setCurrentChartIndex((prevIndex) => (prevIndex - 1 + charts.length) % charts.length);
  };

  //獲得期刊資料
  const getValueWithYear = (arr) => {
    const latestIndex = getLatestUpdate(arr);
    if (latestIndex === -1) return 'N/A';
    return (
      <>
        {arr[latestIndex]}{' '}
        <span className="text-secondary">(last update in {2024 - latestIndex})</span>
      </>
    );
  };
  
  // console.log("fetch collection:",collections);
  if (journals.length == 0) {
	  return <p>沒有期刊資料。</p>
  }
  if (!collections) return null;

	return (
	  <div className="container my-4">
      {journals.map((journal) => (
        <div className="card mb-4 shadow-sm border-0 p-3">
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
              <h2
                className="mb-0"
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#212529",
                  marginBottom: "0",
                  flexGrow: 1,
                }}
              >
                {journal.name}
              </h2>

              {/* 收藏按鈕 */}
              <button
                onClick={(e) => {
                e.stopPropagation();
                toggleCollection(journal.id);
                }}
                className="d-flex align-items-center justify-content-center gap-2 px-2 py-1 border-0 rounded"
                style={{
                  backgroundColor: "#f8f9fa",
                  color: collections?.includes(journal.id) ? "#000" : "#666", 
                  cursor: "pointer",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  width: "auto",
                  maxWidth: "50px",
                  padding: "5px 10px",
                }}
              >
                {collections?.includes(journal.id) ? (
                  <FaBookmark size={18} color="#000" />
                ) : (
                  <FaRegBookmark size={18} color="#666" />
                )}
              </button>

              {/*只使用於收藏頁面*/}
              {/* Checkbox */}
              {checkBox && (
                <input
                  type="checkbox"
                  checked={selectedJournals.includes(journal.id)}
                  onChange={() => toggleSelectedJournal(journal.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>

            {expandedIds[journal.id] && (
            <>
              {/* 資訊區 */}
              <div className="col-md-5 border-end pe-4">
                {/* 基本資料 */}
                <h5
                  className="fw-bold px-3 py-2 mt-4 mb-3"
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderLeft: "4px solid #333",
                    borderRadius: "0.25rem",
                    color: "#333",
                    fontSize: "1.25rem", // 更大字體
                    letterSpacing: "0.5px",
                  }}
                >
                  基本資料
                </h5>
                <dl className="row text-dark fs-6">
                  <dt className="col-4 fw-semibold mb-1">Database</dt>
                  <dd className="col-8 mb-1">{journal.database || 'N/A'}</dd>

                  <dt className="col-4 fw-semibold mb-1">Field</dt>
                  <dd className="col-8 mb-1">{journal.field || 'N/A'}</dd>

                  <dt className="col-4 fw-semibold mb-1">Code</dt>
                  <dd className="col-8 mb-1">{journal.code || 'N/A'}</dd>

                  <dt className="col-4 fw-semibold mb-1">EISSN</dt>
                  <dd className="col-8 mb-1">{journal.eissn || 'N/A'}</dd>

                  <dt className="col-4 fw-semibold mb-1">ISSN</dt>
                  <dd className="col-8 mb-1">{journal.issn || 'N/A'}</dd>
                </dl>

                {/* 評估指標 */}
                <h5
                  className="fw-bold px-3 py-2 mt-4 mb-3"
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderLeft: "4px solid #333",
                    borderRadius: "0.25rem",
                    color: "#333",
                    fontSize: "1.25rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  評估指標
                </h5>
                <dl className="row text-dark fs-6">
                  <dt className="col-4 fw-semibold mb-1">Impact Factor (IF)</dt>
                  <dd className="col-8 mb-1">{getValueWithYear(journal.if_value)}</dd>

                  <dt className="col-4 fw-semibold mb-1">Total Cites</dt>
                  <dd className="col-8 mb-1">{getValueWithYear(journal.totalcites)}</dd>

                  <dt className="col-4 fw-semibold mb-1">期刊領先程度</dt>
                  <dd className="col-8 mb-1">
                    {
                      (() => {
                        const iNum = getLatestUpdate(journal.numerator);
                        const iDen = getLatestUpdate(journal.denominator);
                        if (iNum === -1 || iDen === -1) return 'N/A';
                        const i = Math.min(iNum, iDen);
                        return (
                          <>
                            {journal.numerator[i]} / {journal.denominator[i]}{' '}
                            <span className="text-secondary">(last update in {2024 - i})</span>
                          </>
                        );
                      })()
                    }
                  </dd>

                  <dt className="col-4 fw-semibold mb-1">Publications</dt>
                  <dd className="col-8 mb-1">{getValueWithYear(journal.publication)}</dd>
                </dl>
              </div>
              {/* 資訊區 END*/}
        
              {/* 右側：折線圖區塊 */}
              <div className="col-md-7 ps-md-3">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* 左箭頭 */}
                  <button
                    onClick={handlePreviousChart}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    <FiChevronLeft />
                  </button>

                  {/* 顯示當前的圖表 */}
                  <div style={{ flex: 1, textAlign: "center", minHeight: "350px" }}>
                    {React.createElement(charts[currentChartIndex], { journal })}
                  </div>
                  
                  {/* 右箭頭 */}
                  <button
                    onClick={handleNextChart}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
              {/* 右側END */}
            </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
};

export default DisplayJournal;
