import { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import DisplayJournal from "../displayJournal";
import CmpLineChart from "../charts/cmpLineChart";
import CmpBarChart from "../charts/cmpBarChart";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJournals, setSelectedJournals] = useState([]);

  const [selectedDB, setSelectedDB] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [loadingFields, setLoadingFields] = useState(false);

  const [sortOption, setSortOption] = useState("if_value");
  const [sortDirection, setSortDirection] = useState("desc");

  const [expandedChart, setExpandedChart] = useState("false");
  const [chartMetric, setChartMetric] = useState("if_value");
  const [chartType, setChartType] = useState("line");

  const fetchCollections = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn("使用者尚未登入");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Collections")
        .select("journal_id")
        .eq("user_id", userId);

      if (error) throw error;

      setCollections(data?.map(item => item.journal_id) || []);
    } catch (error) {
      console.error("Fetch collections error:", error.message);
    }
  };

  const toggleCollection = async (journalId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn("使用者尚未登入");
      return;
    }

    const isCollected = collections.includes(journalId);

    try {
      if (isCollected) {
        const { error } = await supabase
          .from("Collections")
          .delete()
          .eq("journal_id", journalId)
          .eq("user_id", userId);

        if (error) throw error;

        setCollections(prev => prev.filter(id => id !== journalId));
      } else {
        const { error } = await supabase
          .from("Collections")
          .insert([{ user_id: userId, journal_id: journalId }]);

        if (error) throw error;

        setCollections(prev => [...prev, journalId]);
      }
    } catch (error) {
      console.error(`${isCollected ? "刪除" : "新增"} 收藏失敗:`, error.message);
    }
  };

  const toggleSelectedJournal = (journalId) => {
    setSelectedJournals((prev) => {
      if (prev.includes(journalId)) {
        return prev.filter((id) => id !== journalId);
      } else {
        if (prev.length >= 5) {
          alert("最多只能選擇 5 筆期刊比較！");
          return prev;
        }
        return [...prev, journalId];
      }
    });
  };

  const fetchFields = async () => {
    if (!selectedDB) {
      setFields([]);
      return;
    }
    
    setLoadingFields(true);

    let allFields = new Set();
    let start = 0;
    const batchSize = 1000;
    
    try {
      while (true) {
        const { data, error } = await supabase
          .from("journal_data")
          .select("field")
          .eq("database", selectedDB)
          .order("field", { ascending: true })
          .range(start, start + batchSize - 1);
    
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) break;
    
        data.forEach(item => allFields.add(item.field));
        start += batchSize;
      }
    
      setFields([...allFields]);
      console.log("Successfully fetched fields");
    } catch (error) {
      console.error("Error fetching fields:", error.message);
    } finally {
      setLoadingFields(false);
    }
  };

  const fetchJournals = async () => {
    setLoading(true);

    let query = supabase
      .from("journal_data")
      .select("*")
      .in("id", collections);

    if (selectedDB) {
      query = query.eq("database", selectedDB);
    }
    if (selectedField) {
      query = query.eq("field", selectedField);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching journals:", error.message);
    } else {
      const sorted = [...data].sort((a, b) => {
        const valA = a[sortOption] || 0;
        const valB = b[sortOption] || 0;
        return sortDirection === "asc" ? valA - valB : valB - valA;
      });
      setJournals(sorted);
    }
    setLoading(false);
  };

  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (collections.length === 0) {
      setJournals([]);
    } else {
      fetchJournals();
    }
  }, [collections, selectedDB, selectedField, sortOption, sortDirection]);

  useEffect(() => {
    if (selectedDB) {
      fetchFields();
    } else {
      setFields([]);
      setSelectedField("");
    }
  }, [selectedDB]);

  const handleFieldChange = (event) => {
    const field = event.target.value;
    setSelectedField(field);
  };

  const handleDbChange = (event) => {
    const DB = event.target.value;
    setSelectedDB(DB);
    setSelectedField("");
  };

  return (
    <div style={{ backgroundColor: "#fcfcfc" }}>
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="p-4 bg-white shadow-sm rounded-4">
            <h2 className="fw-bold fs-2 border-bottom pb-3 mb-4 text-dark">
              My Collections
            </h2>

            <div className="row g-4">
              {/* 資料庫選單 */}
              <div className="col-md-3">
                <label className="form-label text-secondary">資料庫</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={selectedDB}
                  onChange={handleDbChange}
                >
                  <option value="">全部</option>
                  <option value="Scopus">Scopus</option>
                  <option value="JCR資料庫-AHCI">JCR資料庫-AHCI</option>
                  <option value="JCR資料庫-ESCI">JCR資料庫-ESCI</option>
                  <option value="JCR資料庫-SCIE">JCR資料庫-SCIE</option>
                  <option value="JCR資料庫-SSCI">JCR資料庫-SSCI</option>
                  <option value="TCI">TCI</option>
                  <option value="THCI">THCI</option>
                  <option value="TSSCI">TSSCI</option>
                  <option value="文學院認列核心期刊">文學院認列核心期刊</option>
                  <option value="管理學院傑出期刊">管理學院傑出期刊</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-secondary">選擇領域</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={selectedField}
                  onChange={handleFieldChange}
                  disabled={loadingFields}
                >
                  <option value="">全部</option>
                  {fields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                {loadingFields && <div className="form-text text-muted mt-1">載入領域中...</div>}
              </div>

              <div className="col-md-2">
                <label className="form-label text-secondary">排序欄位</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="if_value">Impact Factor</option>
                  <option value="totalcites">被引用次數</option>
                  <option value="publication">發表篇數</option>
                  <option value="ratio">領先程度</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label text-secondary d-block">排序方向</label>
                <div className="btn-group shadow-sm" role="group">
                  <button
                    className={`btn btn-${sortDirection === "asc" ? "dark" : "outline-dark"}`}
                    onClick={() => setSortDirection("asc")}
                  >
                    遞增
                  </button>
                  <button
                    className={`btn btn-${sortDirection === "desc" ? "dark" : "outline-dark"}`}
                    onClick={() => setSortDirection("desc")}
                  >
                    遞減
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-100 py-4" style={{ backgroundColor: "#eeeeee" }}>
        <div className="container">
          <div className="p-4 bg-white shadow-sm rounded-4">
            <div 
              className="d-flex flex-wrap align-items-center justify-content-between mb-3"
              onClick={() => setExpandedChart(!expandedChart)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-2">
                {expandedChart ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                <h4 className="fw-bold text-dark mb-0 fs-4">Selected Journals Comparison Chart</h4>
              </div>
            </div>

            {/* Chart */}
            {expandedChart && (
              <div>
                {/* Control Row */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
                  {/* 左側 - 圖表選項 */}
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label mb-0 text-secondary">圖表指標</label>
                      <select
                        className="form-select form-select-sm rounded-3 shadow-sm"
                        style={{ width: "180px" }}
                        value={chartMetric}
                        onChange={(e) => setChartMetric(e.target.value)}
                      >
                        <option value="if_value">Impact Factor (IF)</option>
                        <option value="totalcites">Total Cites</option>
                        <option value="publication">Publications</option>
                        <option value="ratio">領先程度</option>
                        {/* 更多指標可以加入 */}
                      </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label mb-0 text-secondary">圖表類型</label>
                      <select
                        className="form-select form-select-sm rounded-3 shadow-sm"
                        style={{ width: "160px" }}
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                      >
                        <option value="line">線圖 (Line)</option>
                        <option value="bar">長條圖 (Bar)</option>
                      </select>
                    </div>
                  </div>

                  {/* 右側 - 清除選擇 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJournals([]);
                    }}
                    className="btn btn-outline-secondary btn-sm rounded-3 shadow-sm"
                  >
                    Clear Selection
                  </button>
                </div>

                <div
                  className="bg-light rounded-4 shadow-sm d-flex justify-content-center align-items-center"
                  style={{ height: "400px", padding: "1rem" }}
                > 
                  {chartType === "line" && (
                    <CmpLineChart
                      journals={journals.filter((j) => selectedJournals.includes(j.id))}
                      metric={chartMetric}
                    />
                  )}
                  {chartType === "bar" && (
                    <CmpBarChart
                      journals={journals.filter((j) => selectedJournals.includes(j.id))}
                      metric={chartMetric}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* 收藏清單 */}
      <ul>
        {loading ? (
          <div className="container my-4 fs-4 text-center text-secondary">Loading ...</div>
        ) : (
          <DisplayJournal
            journals={journals}
            expandedIds={expandedIds}
            toggleJournal={toggleJournal}
            collections={collections}
            toggleCollection={toggleCollection}
            checkBox={true}
            selectedJournals={selectedJournals}
            toggleSelectedJournal={toggleSelectedJournal}
          />
        )}
      </ul>
    </div>
  );
};

export default Collections;
