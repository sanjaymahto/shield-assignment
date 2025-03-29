interface tableData {
  name: string;
  date: string;
  amount: number;
  status: string;
}

export const sortedData = (
  data: tableData[],
  sortConfig: {
    key: string;
    direction: string;
  }
) => {
  return [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    // @ts-expect-error
    const valA = a[sortConfig.key];
    // @ts-expect-error
    const valB = b[sortConfig.key];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
    return sortConfig.direction === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });
};

const parseDate = (dateString: any) => {
  const [datePart, timePart, timezone] = dateString.split(" ");
  return new Date(`${datePart}T${timePart}${timezone}`);
};

export const filteredData = (
  data: tableData[],
  dateRange: {
    startDate: string | null;
    endDate: string | null;
    specificDate: string | null;
  },
  search: string
) => {
  return data.filter((item: tableData) => {
    const itemDate = parseDate(item.date);
    const specificDate = dateRange?.specificDate
      ? parseDate(dateRange.specificDate)
      : null;
    const startDate = dateRange?.startDate
      ? parseDate(dateRange.startDate)
      : null;
    const endDate = dateRange?.endDate ? parseDate(dateRange.endDate) : null;

    let matchesDateRange, matchesSpecificDate;
    if (specificDate) {
      matchesSpecificDate =
        specificDate && itemDate.toDateString() === specificDate.toDateString();
    } else {
      matchesDateRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);
    }

    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (matchesSpecificDate || matchesDateRange)
    );
  });
};
