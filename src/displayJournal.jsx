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

  // console.log("fetch collection:",collections);
  if (journals.length == 0) {
	  return <p>沒有期刊資料。</p>
  }
  if (!collections) return null;
	return (
	  <>
      {journals.map((journal, index) => (
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
            <h2 className="fw-bold fs-3 mb-0">{journal.name}</h2>

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
                  <div style={{ flex: 1, textAlign: "center" }}>
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
          </>
          )}
          {/* 除最後一項外，加入分隔線 */}
          {index !== journals.length - 1 && <hr className="my-3 w-100" />}
        </div>
      ))}
    </>
  )
};

export default DisplayJournal;
