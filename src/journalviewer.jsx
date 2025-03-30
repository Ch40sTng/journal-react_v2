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
  "Scopus": "Scopus"
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

    const { data, error } = await supabase
      .from('journal_data')
      .select('*')
      .range(start, end)
      .eq("database", displayName)
      .eq("field", field)
      .order("if_value", { ascending: false });

    if (error) {
      console.error('Error:', error);
    } else {
      setJournals(data || []);
      console.log("successfully fetch journals");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (selectedField) {
      fetchJournals(page, selectedField);
    }
  }, [page, selectedField, displayName]);

  useEffect(() => {
    if (!displayName) return;
    fetchFields();
  }, [displayName]);

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
        <h1 className="text-2xl font-bold mb-4">{displayName} Journal Viewer</h1>
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
          ) : <DisplayJournal 
                journals={journals}
                expandedIds={expandedIds}
                toggleJournal={toggleJournal}
                collections={collections}
                toggleCollection={toggleCollection} 
              />}
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

export default JournalViewer;