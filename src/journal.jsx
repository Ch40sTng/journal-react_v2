import LineChart from "./linechart";

const journals = [
  {
    id: 1,
    name: 'Forensic Anthropology',
    database: 'Scopus',
    field: 'Anthropology',
    code: 'S1-3314',
    EISSN: '2573-5039',
    ISSN: '2573-5020',
    TotalCites: [149, 160, 185, 190, 216, 149],
    IF_values: [1.5, 1.8, 2.0, 2.1, 2.4, 2.7],
    numerator: [76, 80, 50, 62, 23, 52],
    denominator: [501, 460, 485, 478, 522, 391],
    publications: [76, 80, 56, 68, 89, 111],
    year: 2024,
  },
  {
    id: 2,
    name: 'Litteraria Copernicana',
    database: 'Scopus',
    field: 'Cultural Studies',
    code: 'S1-3314',
    EISSN: '2573-5039',
    ISSN: '2573-5020',
    TotalCites: [10, 20, 15, 17, 20, 10],
    IF_values: [3.2, 3.5, 4.1, 4.8, 5.2, 5.6],
    numerator: [5, 8, 7, 9, 8, 10],
    denominator: [100, 105, 110, 115, 120, 125],
    publications: [15, 18, 16, 20, 22, 24],
    year: 2024,
  },
  {
    id: 3,
    name: 'Urologie',
    database: 'Scopus',
    field: 'Urology',
    code: 'S1-3314',
    EISSN: '2573-5039',
    ISSN: '2573-5020',
    TotalCites: [318, 300, 325, 450, 600, 318],
    IF_values: [2.8, 3.1, 3.6, 3.9, 4.0, 4.1],
    numerator: [120, 130, 110, 125, 150, 180],
    denominator: [700, 750, 780, 800, 850, 900],
    publications: [100, 110, 95, 105, 120, 140],
    year: 2024,
  },
];

const Journal = () => {
  return (
    <div className="container mt-5">
      {journals.map((journal, index) => (
        <div key={journal.id} className="row align-items-center mb-4">
          {/* 左側：期刊資訊區塊 */}
          <div className="col-md-6 pe-md-3">
            <h4 className="fw-bold fs-3 mb-3">{journal.name}</h4>
            
            {/* Database, Field, and Code */}
            <div 
            className="col-md-6 pe-md-3" 
            style={{ borderLeft: '2px solid #d3d3d3', paddingLeft: '1rem' }}
            >
              <p className="text-muted fs-6" style={{ whiteSpace: 'nowrap' }}>
                <p className="mb-2">
                  <strong>Database:</strong> {journal.database} &nbsp; | &nbsp;
                  <strong>Field:</strong> {journal.field} &nbsp; | &nbsp;
                  <strong>Code:</strong> {journal.code}
                </p>
                
                {/* EISSN and ISSN */}
                <p className="mb-2">
                  <strong>EISSN:</strong> {journal.EISSN} &nbsp; | &nbsp;
                  <strong>ISSN:</strong> {journal.ISSN}
                </p>
              </p>
            </div>
            {/* IF Value */}
            <p className="mb-2">
              <strong>Impact Factor (IF):</strong> {journal.IF_values[journal.IF_values.length - 1]}
            </p>
            
            {/* Total Cites */}
            <p className="mb-2">
              <strong>Total Cites:</strong> {journal.TotalCites[journal.TotalCites.length - 1]}
            </p>
            
            {/* Rank (Numerator/Denominator) */}
            <p className="mb-2">
              <strong>期刊領先程度百分位:</strong> {journal.numerator[journal.numerator.length - 1]} / {journal.denominator[journal.denominator.length - 1]}
            </p>
            
            {/* Publications */}
            <p className="mb-2">
              <strong>Number of publications: </strong> {journal.publications[journal.publications.length - 1]}
            </p>
            
            {/* Latest Update Year */}
            <p className="mb-0"><strong>Latest Update Year:</strong> {journal.year}</p>
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
