import supabase from "./supabaseClient";
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DisplayJournal from "./displayJournal";
import { useParams } from 'react-router-dom';

const databaseNameMap = {
  "JCR-AHCI": "JCR資料庫-AHCI",
  "JCR-ESCI": "JCR資料庫-ESCI",
  "JCR-SCIE": "JCR資料庫-SCIE",
  "JCR-SSCI": "JCR資料庫-SSCI",
  "Scopus": "Scopus",
  "Literature": "文學院認列核心期刊",
  "Management": "管理學院傑出期刊"
};

const JournalViewer = () => {
  const { databaseName } = useParams();
  const displayName = databaseNameMap[databaseName] || databaseName;

  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");

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

  //接收supabase資料
  const fetchFields = async () => {
    if (!displayName) return;
  
    let allFields = new Set();
    let start = 0;
    const batchSize = 1000;
  
    while (true) {
      const { data, error } = await supabase
        .from("journals")
        .select("field")
        .eq("database", displayName)
        .order("field", { ascending: true })
        .range(start, start + batchSize - 1);
  
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) break;
  
      data.forEach(item => allFields.add(item.field));
      start += batchSize;
    }
  
    setFields([...allFields]);
    console.log("Successfully fetch field")
  };

  const fetchJournals = async (newPage, field) => {
    setLoading(true);
    const start = (newPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const sortBy = sortOption;
    const ascending = sortDirection === "asc";

  
    const { data, error } = await supabase
      .from('journal_data')
      .select('*')
      .range(start, end)
      .eq("database", displayName)
      .eq("field", field)
      .order(sortBy, { ascending });
  
    if (error) {
      console.error('Error:', error);
    } else {
      setJournals(data || []);
      console.log("Successfully fetched journals");
    }
  
    setLoading(false);
  };

  useEffect(() => {
    if (selectedField) {
      fetchJournals(page, selectedField);
    }
  }, [page, selectedField, sortOption, sortDirection, displayName]);

  useEffect(() => {
    if (!displayName) return;
    fetchFields();
  }, [displayName]);

  const handleFieldChange = (event) => {
    const field = event.target.value;
    setSelectedField(field);
    setPage(1);
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
    <div>
      <section className="w-100 py-4" style={{ backgroundColor: "#555555" }}>
        <div className="container">
          <div className="p-4 bg-white shadow-sm rounded-4">
            <h2 className="fw-bold fs-2 border-bottom pb-3 mb-4 text-dark">
              {displayName} Journal Viewer
            </h2>

            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label text-secondary">選擇領域</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={selectedField}
                  onChange={handleFieldChange}
                >
                  {fields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-secondary">排序欄位</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="if_value">IF</option>
                  <option value="cites">Total Cites</option>
                </select>
              </div>

              <div className="col-md-4">
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
          <li className="text-center">Loading...</li>
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

export default JournalViewer;