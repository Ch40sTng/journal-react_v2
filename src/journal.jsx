import LineChart from "./linechart";

const journals = [
    {
      id: 1,
      name: 'Forensic Anthropology',
      TotalCites: [149, 160, 185, 190, 216, 149],
      IF_values: [1.5, 1.8, 2.0, 2.1, 2.4, 2.7],
      database: 'Scopus',
      field: 'Anthropology',
      year: 2024,
    },
    {
      id: 2,
      name: 'Litteraria Copernicana',
      TotalCites: [10, 20, 15, 17, 20, 10],
      IF_values: [3.2, 3.5, 4.1, 4.8, 5.2, 5.6],
      database: 'Scopus',
      field: 'Cultural Studies',
      year: 2024,
    },
    {
      id: 3,
      name: 'Urologie',
      TotalCites: [318, 300, 325, 450, 600, 318],
      IF_values: [2.8, 3.1, 3.6, 3.9, 4.0, 4.1],
      database: 'Scopus',
      field: 'Urology',
      year: 2024,
    },
    // 可以繼續添加更多期刊資料
  ];
  
  const Journal = () => {
    return (
      <div className="container mt-5">
        {journals.map((journal, index) => (
          <div key={journal.id} className="row align-items-center mb-4">
            {/* 左側：期刊資訊區塊 */}
            <div className="col-md-6 pe-md-3">
              <h4 className="fw-bold fs-3 mb-3">{journal.name}</h4>
              
              {/* Database and Field */}
              <p className="mb-2">
                <strong>Database:</strong> {journal.database} &nbsp; | &nbsp;
                <strong>Field:</strong> {journal.field}
              </p>
              
              {/* IF Value */}
              <p className="mb-2">
                <strong>Impact Factor (IF):</strong> {journal.IF_values[journal.IF_values.length - 1]}
              </p>
              
              {/* Total Cites */}
              <p className="mb-2"><strong>Total Cites:</strong> {journal.TotalCites[journal.TotalCites.length - 1]}</p>
              
              {/* Latest Update Year */}
              <p className="mb-0"><strong>Year:</strong> {journal.year}</p>
            </div>
  
            {/* 右側：折線圖區塊 */}
            <div className="col-md-6 ps-md-3">
              <LineChart journal={journal} />
            </div>
  
            {/* 除最後一項外，加入分隔線 */}
            {index !== journals.length - 1 && <hr className="my-3 w-100" />}
          </div>
        ))}
      </div>
    );
  };
  
  export default Journal;
  