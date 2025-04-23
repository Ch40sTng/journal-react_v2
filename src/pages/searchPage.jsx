import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DisplayJournal from "../displayJournal";
import supabase from "../supabaseClient";
import { Spinner, Container, Alert, Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.trim() || "";

  const [result, setResult] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 切換展開
  const toggleJournal = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 抓使用者收藏
  const fetchCollections = async () => {
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr) return console.error("Session error:", sessErr.message);
    const userId = session?.user?.id;
    if (!userId) return;
    const { data, error: colErr } = await supabase
      .from("Collections")
      .select("journal_id")
      .eq("user_id", userId);
    if (colErr) return console.error("Fetch collections error:", colErr.message);
    setCollections(data.map(item => item.journal_id));
  };

  // 切換收藏
  const toggleCollection = async (journalId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;
    const isCollected = collections.includes(journalId);
    const action = isCollected ?
      supabase.from("Collections").delete().eq("journal_id", journalId).eq("user_id", userId) :
      supabase.from("Collections").insert([{ user_id: userId, journal_id: journalId }]);
    const { error } = await action;
    if (error) return console.error("Toggle collection error:", error.message);
    setCollections(isCollected ?
      prev => prev.filter(id => id !== journalId) :
      prev => [...prev, journalId]
    );
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      setError(null);
      if (!query) {
        setResult([]);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("journal_data")
          .select("*")
          .ilike("name", `%${query}%`)
          .order("name", { ascending: true });
        if (error) throw error;
        setResult(data || []);
      } catch (err) {
        console.error("Search error:", err.message);
        setError("搜尋失敗，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  return (
    <Container className="mt-4">
      <Form onSubmit={(e) => e.preventDefault()}>
        <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
          <Form.Control
            type="text"
            value={query}
            readOnly
            aria-label="搜尋關鍵字"
          />
        </InputGroup>
      </Form>

      <h5 className="mb-3">搜尋結果：{query}</h5>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        result.length > 0 ? (
          <DisplayJournal
            journals={result}
            expandedIds={expandedIds}
            toggleJournal={toggleJournal}
            collections={collections}
            toggleCollection={toggleCollection}
          />
        ) : (
          <div className="text-muted">沒有找到符合「{query}」的期刊。</div>
        )
      )}
    </Container>
  );
};

export default SearchPage;
