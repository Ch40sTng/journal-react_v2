import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllJournals, searchJournals } from "../search";
import DisplayJournal from "../displayJournal";
import supabase from "../supabaseClient";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [journals, setJournals] = useState([]);
  const [result, setResult] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [collections, setCollections] = useState([]);

  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
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
    const fetchAndSearch = async () => {
      const all = await getAllJournals();
      setJournals(all);
      if (query.trim()) {
        const filtered = searchJournals(query, all);
        setResult(filtered);
      }
    };
    fetchAndSearch();
  }, [query]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">搜尋結果：{query}</h3>
      {result.length > 0 ? (
        <DisplayJournal
          journals={result}
          expandedIds={expandedIds}
          toggleJournal={toggleJournal}
          collections={collections}
          toggleCollection={toggleCollection}
        />
      ) : (
        <div className="text-muted">沒有找到符合的期刊。</div>
      )}
    </div>
  );
};

export default SearchPage;