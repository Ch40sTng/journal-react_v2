import { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import DisplayJournal from "./displayJournal";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);

  //獲取使用者收藏的期刊id
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

    } 
    catch (error) {
      console.error(`${isCollected ? "刪除" : "新增"} 收藏失敗:`, error.message);
    }
  };

  // 根據收藏的期刊id來獲得期刊資料
  const fetchJournals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("journal_data")
      .select("*")
      .in("id", collections);

    if (error) {
      console.error("Error fetching journals:", error.message);
    } 
    else {
      setJournals(data || []);
      setLoading(false);
    }
  };

  // 設置期刊展開/收起
  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 在頁面加載時抓取收藏列表和期刊資料
  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (collections.length > 0) {
      fetchJournals();
    }
  }, [collections]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Collections</h1>

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
    </div>
  );
};

export default Collections;
