import LineChart from "./linechart";
import supabase from "./supabaseClient";
import { useEffect, useState } from "react";

const JCR_SSCI_journal = () => {
    const [journals, setJournals] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState("");
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const [journalHistory, setJournalHistory] = useState([]);

    const fetchFields = async () => {
        const { data, error } = await supabase
            .from("journals")
            .select("field")
            .eq("database", "JCR資料庫-SSCI");

        if (error) throw new Error(error.message);

        const uniqueFields = [...new Set(data.map((item) => item.field))];
        setFields(uniqueFields);
    };

    const fetchJournals = async (field) => {
        const { data, error } = await supabase
            .from("journals")
            .select("*")
            .eq("database", "JCR資料庫-SSCI")
            .eq("field", field)
            .order("if_value", { ascending: false });

        if (error) throw new Error(error.message);

        const uniqueJournals = Array.from(
            new Map(data.map(journal => [journal.name, journal])).values()
        );
        setJournals(uniqueJournals || []);
    };

    const fetchJournalHistory = async (journalName, field) => {
        const { data, error } = await supabase
            .from("journals")
            .select('*')
            .eq("database", "JCR資料庫-SSCI")
            .eq("field", field)
            .eq("name", journalName)
            .order("year_id", { ascending: true });

        if (error) throw new Error(error.message);

        const new_ifValue = [];
        const new_totalCites = [];
        const new_numerator = [];
        const new_denominator = [];
        const new_publication = [];

        let year_id_index = 1;
        let i = 0;

        while(true)
        {
            if(year_id_index > 6)
            {
                console.log('hit');
                break;
            }

            var record;

            if(i>data.length-1)
            {
                new_ifValue.push('null');
                new_totalCites.push('null');
                new_numerator.push('null');
                new_denominator.push('null');
                new_publication.push('null');
            }
            else
            {
                record = data[i] || {};

                while(record.year_id != year_id_index)
                {
                    new_ifValue.push('null');
                    new_totalCites.push('null');
                    new_numerator.push('null');
                    new_denominator.push('null');
                    new_publication.push('null');
    
                    year_id_index++;
                }

                new_ifValue.push(record.if_value ?? 'null');
                new_totalCites.push(record.totalcites ?? 'null');
                new_numerator.push(record.numerator ?? 'null');
                new_denominator.push(record.denominator ?? 'null');
                new_publication.push(record.publication ?? 'null');
            }

            console.log(new_ifValue);
            year_id_index++;
            i++;
        }

        const new_data = {
            code: data[0].code,
            database: data[0].database,
            database_id: data[0].database_id,
            denominator: new_denominator,
            eissn: data[0].eissn,
            field: data[0].field,
            id: data[0].id,
            if_value: new_ifValue,
            issn: data[0].issn,
            name: data[0].name,
            numerator: new_numerator,
            publication: new_publication,
            totalcites: new_totalCites,
        }

        console.log(new_data);
        setJournalHistory(new_data || []);

    };

    useEffect(() => {
        fetchFields();
    }, []);

    const handleFieldChange = (event) => {
        const field = event.target.value;
        setSelectedField(field);
        setSelectedJournalId(null); // 清除選中的 journal
        setJournalHistory({});
        fetchJournals(field);
    };

    const handleJournalClick = (journal) => {
        const newId = journal.id === selectedJournalId ? null : journal.id;
        setSelectedJournalId(newId);

        if (newId) {
            fetchJournalHistory(journal.name, selectedField);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">JCR SSCI Journal Viewer</h1>
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
                {journals.map((journal) => (
                    <li key={journal.id} className="p-2 mb-2 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleJournalClick(journal)}>
                        期刊名稱： {journal.name}

                        {/* 這裡條件式渲染 LineChart，並加上過渡效果 */}
                        {selectedJournalId === journal.id && (
                            <div className="mt-2 p-2 border-t transition-all duration-300 ease-in-out">
                                <h2 className="text-lg font-semibold">{journal.name} - IF Trend (6 Years)</h2>
                                <LineChart journal={journalHistory} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JCR_SSCI_journal;
