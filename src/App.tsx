import { useState } from "react";
import DateSelector from "./Components/Calendar";
import SortableFilterableTable from "./Components/Table";

function App() {
  // Setting common state for Date selector and sortable filter component
  const [dateRange, setCalendarRange] = useState({
    startDate: `2025-03-01 12:00:00 +0300`,
    endDate: `2025-03-25 23:59:59 +0400`,
    specificDate: null,
  });

  return (
    <div>
      <DateSelector setCalendarRange={setCalendarRange} />
      <SortableFilterableTable dateRange={dateRange} />
    </div>
  );
}

export default App;
