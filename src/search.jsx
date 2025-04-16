// search.js
import Fuse from "fuse.js";
import supabase from "./supabaseClient";

// 從 Supabase 取得所有期刊
export const getAllJournals = async () => {
  const { data, error } = await supabase
    .from("journal_data")
    .select("*");

  if (error) {
    console.error("Failed to fetch journals:", error.message);
    return [];
  }

  return data || [];
};

// 使用 Fuse.js 搜尋
export const searchJournals = (query, journals) => {
  const fuse = new Fuse(journals, {
    keys: ["name"],
    threshold: 0.1,
  });

  const results = fuse.search(query);
  return results.map(r => r.item);
};