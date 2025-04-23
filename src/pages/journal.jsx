import supabase from "../supabaseClient";
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DisplayJournal from "../displayJournal";

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedDB, setSelectedDB] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [loadingFields, setLoadingFields] = useState(false);

  const [collections, setCollections] = useState([]);

  const [sortOption, setSortOption] = useState("if_value");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchCollections = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      console.warn("使用者尚未登入");
      return;
    }
    console.log("User:", userId);
    
    try {
      const { data, error } = await supabase
        .from("Collections")
        .select("journal_id")
        .eq("user_id", userId);
  
      if (error) throw error;
      
      setCollections(data?.map(item => item.journal_id) || []);
    } 
    catch (error) {
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
  
        console.log("Collection has been deleted:", journalId);
        setCollections(prev => prev.filter(id => id !== journalId));
      } else {
        const { error } = await supabase
          .from("Collections")
          .insert([{ user_id: userId, journal_id: journalId }]);
  
        if (error) throw error;
  
        console.log("Collection has been inserted:", journalId);
        setCollections(prev => [...prev, journalId]);
      }

    } catch (error) {
      console.error(`${isCollected ? "刪除" : "新增"} 收藏失敗:`, error.message);
    }
  };
  
  useEffect(() => {
    fetchCollections();
  }, []);

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

  const fetchJournals = async (newPage) => {
    setLoading(true);
    const start = (newPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const sortBy = sortOption;
    const ascending = sortDirection === "asc";

    let query = supabase
      .from("journal_data")
      .select("*")
      .range(start, end)
      .order(sortBy, { ascending });

    if (selectedDB) {
      query = query.eq("database", selectedDB);
    }
    if (selectedField) {
      query = query.eq("field", selectedField);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching journals:", error.message);
    } 
    else {
      setJournals(data || []);
      console.log("Successfully fetched journals");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJournals(page);
  }, [page, selectedDB, selectedField, sortOption, sortDirection]);

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
    setPage(1);
  };

  const handleDbChange = (event) => {
    const DB = event.target.value;
    setSelectedDB(DB);
    setSelectedField("");
    setPage(1);
  };

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
    <div style={{ backgroundColor: "#fcfcfc"}}>
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="p-4 bg-white shadow-sm rounded-4">
            <h2 className="fw-bold fs-2 border-bottom pb-3 mb-4 text-dark">
              All Journals
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
                  <option value="TCI資料庫(國家圖書館-臺灣人文及社會科學引文資料庫)">TCI</option>
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

      <ul>
        {loading ? (
          <div className="container my-4 fs-4 text-center text-secondary">Loading ...</div>
        ) : <DisplayJournal 
              journals={journals}
              expandedIds={expandedIds}
              toggleJournal={toggleJournal}
              collections={collections}
              toggleCollection={toggleCollection}
            />}
      </ul>

      <nav className="mt-5">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-3 shadow-sm px-3 py-2 text-dark"
              onClick={handlePrevPage}
              style={{ fontSize: "1rem" }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link bg-white border-0 fw-bold fs-6 shadow-none">{page}</span>
          </li>
          <li className="page-item">
            <button
              className="page-link rounded-3 shadow-sm px-3 py-2 text-dark"
              onClick={handleNextPage}
              style={{ fontSize: "1rem" }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Journal;