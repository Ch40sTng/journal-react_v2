import { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import DisplayJournal from "./displayJournal";
import CmpLineChart from "./cmpLineChart";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [journals, setJournals] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedJournals, setSelectedJournals] = useState([]);

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

  const fetchJournals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("journal_data")
      .select("*")
      .in("id", collections);

    if (error) {
      console.error("Error fetching journals:", error.message);
    } else {
      setJournals(data || []);
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
    if (collections.length > 0) {
      fetchJournals();
    }
  }, [collections]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Collections</h1>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold">Selected Journals Comparison</h2>
          <button
            onClick={() => setSelectedJournals([])}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded"
          >
            Clear Selection
          </button>
        </div>
        <div
          className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <CmpLineChart
            journals={journals.filter((j) => selectedJournals.includes(j.id))}
          />
        </div>
      </div>
      
      <ul>
        {loading ? (
          <li className="text-center">Loading...</li>
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
