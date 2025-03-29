import { useEffect, useState } from "react";
import { data } from "../../mock-data";
import { filteredData, sortedData } from "./utilities";
import "./index.css";

interface tableProps {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
    specificDate: string | null;
  };
}

interface tableData {
  name: string;
  date: string;
  amount: number;
  status: string;
}

export default function SortableFilterableTable(props: tableProps) {
  const { dateRange } = props;

  const [search, setSearch] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "name",
    direction: "asc",
  });
  const [tableData, setTableData] = useState<tableData[]>([]);
  const [originalData, setOriginalData] = useState<tableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  function fetchDummyData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1500);
    });
  }

  useEffect(() => {
    setLoading(true);
    fetchDummyData()
      .then((fetchedData) => {
        const data = sortedData(fetchedData as tableData[], sortConfig);
        const filterData = filteredData(data, dateRange, search);
        setTableData(filterData);
        setOriginalData(filterData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [dateRange]);

  useEffect(() => {
    const data = sortedData(tableData as tableData[], sortConfig);
    setTableData(data);
    setOriginalData(data);
  }, [sortConfig]);

  useEffect(() => {
    const filterData = filteredData(originalData, dateRange, search);
    setTableData(filterData);
  }, [search]);

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search by Name..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="shimmer-table">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="shimmer-row"></div>
          ))}
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              {[
                { key: "name", label: "Name" },
                { key: "date", label: "Date" },
                { key: "amount", label: "Amount" },
              ].map(({ key, label }) => (
                <th key={key} onClick={() => handleSort(key)}>
                  {label}{" "}
                  {sortConfig.key === key ? (
                    sortConfig.direction === "asc" ? (
                      <span>&#8593;</span>
                    ) : (
                      <span>&#8595;</span>
                    )
                  ) : (
                    <span>&#8645;</span>
                  )}
                </th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{`${new Date(item.date)}`}</td>
                  <td>{item.amount}</td>
                  <td className={item.status.toLowerCase()}>{item.status}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
