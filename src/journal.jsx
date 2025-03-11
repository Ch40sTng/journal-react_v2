import LineChart from "./linechart";
import supabase from "./supabaseClient";
import { useEffect, useState } from 'react';

const Journal = () => {
  const [journals, setJournals] = useState([]);

  const fetchJournals = async () => {
    const { data, error } = await supabase
      .from('journal_data2')
      .select('*')
      .limit(3);

    if (error) {
      console.error('Error:', error);
    } else {
      setJournals(data || []);
      console.log("success:");
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div className="container mt-5">
      {Array.isArray(journals) && journals.length > 0 ? (
        journals.map((journal, index) => (  // 不需要在這裡加上額外的花括號
          <div key={journal.id} className="row align-items-center mb-4">
            {/* 左側：期刊資訊區塊 */}
            <div className="col-md-6 pe-md-3">
              <h4 className="fw-bold fs-3 mb-3">{journal.name}</h4>
              
              {/* Database, Field, and Code */}
              <div 
                className="col-md-6 pe-md-3" 
                style={{ borderLeft: '2px solid #d3d3d3', paddingLeft: '1rem' }}
              >
                <div className="text-muted fs-6" style={{ whiteSpace: 'nowrap' }}>
                  <p className="mb-2">
                    <strong>Database:</strong> {journal.database} &nbsp; | &nbsp;
                    <strong>Field:</strong> {journal.field} &nbsp; | &nbsp;
                    <strong>Code:</strong> {journal.code}
                  </p>
                  
                  {/* EISSN and ISSN */}
                  <p className="mb-2">
                    <strong>EISSN:</strong> {journal.eissn} &nbsp; | &nbsp;
                    <strong>ISSN:</strong> {journal.issn}
                  </p>
                </div>
              </div>
              {/* IF Value */}
              <p className="mb-2">
                <strong>Impact Factor (IF):</strong> {journal.if_value?.[0] ?? 'N/A'}
              </p>
              
              {/* Total Cites */}
              <p className="mb-2">
                <strong>Total Cites:</strong> {journal.totalcites?.[0] ?? 'N/A'}
              </p>
              
              {/* Rank (Numerator/Denominator) */}
              <p className="mb-2">
                <strong>期刊領先程度百分位:</strong> {journal.numerator?.[0] ?? 'N/A'} / {journal.denominator?.[0] ?? 'N/A'}
              </p>
              
              {/* Publications */}
              <p className="mb-2">
                <strong>Number of publications: </strong> {journal.publication?.[0] ?? 'N/A'}
              </p>
              
              {/* Latest Update Year */}
              {/* <p className="mb-0"><strong>Latest Update Year:</strong> {journal.year}</p> */}
            </div>

            {/* 右側：折線圖區塊 */}
            <div className="col-md-6 ps-md-3">
              <LineChart journal={journal} />
            </div>

            {/* 除最後一項外，加入分隔線 */}
            {index !== journals.length - 1 && <hr className="my-3 w-100" />}
          </div>
        ))
      ) : (
        <p>沒有期刊資料。</p>
      )}
    </div>
  );
};

export default Journal;
