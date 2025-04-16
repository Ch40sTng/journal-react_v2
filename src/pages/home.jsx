import React from 'react';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

const databases = [
  { id: "JCR-AHCI", name: "JCR資料庫-AHCI" },
  { id: "JCR-ESCI", name: "JCR資料庫-ESCI" },
  { id: "JCR-SCIE", name: "JCR資料庫-SCIE" },
  { id: "JCR-SSCI", name: "JCR資料庫-SSCI" },
  { id: "Scopus", name: "Scopus" },
  { id: "Literature", name: "文學院認列核心期刊" },
  { id: "Management", name: "管理學院傑出期刊" },
];

const Home = () => {
  const [topCollected, setTopCollected] = useState([]);

  useEffect(() => {
    const fetchTopCollected = async () => {
      const { data, error } = await supabase.rpc("get_top_collected_journals", { count: 3 });
      if (error) console.error("Error fetching top journals:", error);
      else setTopCollected(data);
    };

    fetchTopCollected();
  }, []);
  
  return (
    <div style={{ backgroundColor: "#fcfcfc" }}>
      {/* Hero 區塊 */}
      <section className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">期刊多元宇宙</h1>
          <p className="lead">探索最合適的學術期刊，支援多資料庫查詢與收藏功能</p>
          <Link to="/journals" className="btn btn-light btn-lg mt-3 shadow me-4">立即開始</Link>
          <Link to="/login" className="btn btn-light btn-lg mt-3 shadow">立即註冊</Link>
        </div>
      </section>

      {/** 導覽區 */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">三步驟開始使用</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-white shadow rounded-4 text-center">
                <h5 className="fw-bold mb-3">1. 選擇資料庫</h5>
                <p>從 JCR、Scopus 或學院內部期刊中挑選資料庫。</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow rounded-4 text-center">
                <h5 className="fw-bold mb-3">2. 篩選與排序</h5>
                <p>依據學科領域、IF、被引用數進行篩選與排序。</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow rounded-4 text-center">
                <h5 className="fw-bold mb-3">3. 收藏與比較</h5>
                <p>將喜愛的期刊收藏起來，方便未來快速查閱。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速搜尋區塊 */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">快速搜尋</h2>
          <input
            type="text"
            className="form-control w-75 mx-auto rounded-3 shadow-sm"
            placeholder="輸入期刊名稱或ISSN...（功能開發中）"
            disabled
          />
          <small className="text-muted d-block mt-2">快速搜尋功能將於後續版本提供</small>
        </div>
      </section>

      {/* 資料庫 */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-4 text-dark">資料庫選擇</h2>
          <div className="row g-4">
            {databases.map((db) => (
              <div className="col-md-6 col-lg-4" key={db.id}>
                <div className="card shadow-sm rounded-4 h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title fw-bold text-dark">{db.name}</h5>
                    <Link
                      to={`/journals/${db.id}`}
                      className="btn btn-outline-dark mt-3 rounded-3"
                    >
                      查看期刊
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

