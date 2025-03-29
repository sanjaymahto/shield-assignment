export const formatDate = (date: Date) => {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Get timezone offset in minutes
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const timezone = `${offsetSign}${pad(Math.floor(absOffsetMinutes / 60))}${pad(
    absOffsetMinutes % 60
  )}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezone}`;
};

// Function to create dummy Data
export function generateUniqueDummyData(size: number) {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack",
    "Kevin",
    "Liam",
    "Mia",
    "Nora",
    "Oliver",
    "Paul",
    "Quinn",
    "Rachel",
    "Steve",
    "Tina",
  ];
  const lastNames = [
    "Anderson",
    "Brown",
    "Clark",
    "Davis",
    "Evans",
    "Foster",
    "Green",
    "Harris",
    "Iverson",
    "Jackson",
    "King",
    "Lewis",
    "Moore",
    "Nelson",
    "Owens",
    "Parker",
    "Quincy",
    "Roberts",
    "Smith",
    "Taylor",
  ];

  const statuses = ["Paid", "Pending", "Failed"];
  const timeZones = [
    "+0100",
    "+0200",
    "+0300",
    "+0400",
    "+0530",
    "+0700",
    "+0800",
    "+0900",
    "-0500",
    "-0700",
  ];

  let dummyData = new Set();

  while (dummyData.size < size) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    if ([...dummyData].some((item) => item.name === name)) continue; // Ensure unique names

    const amount = Math.floor(Math.random() * 500) + 50;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const year = 2025;
    const month = Math.floor(Math.random() * 11);
    const day = Math.floor(Math.random() * 28) + 1; // Avoids invalid dates
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    const timeZone = timeZones[Math.floor(Math.random() * timeZones.length)];

    const date = new Date(year, month - 1, day, hour, minute, second);
    const formattedDate = date
      .toISOString()
      .replace("T", " ")
      .replace(".000Z", ` ${timeZone}`);

    dummyData.add({ name, date: formattedDate, amount, status });
  }

  return [...dummyData];
}
