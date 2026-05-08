export const COMPLETION_FILTERS = [
  { id: "all", label: "All" },
  { id: "not-started", label: "Not Started" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export const ALL_OPTION_ID = "all";

export const chunk = (items = [], size = 10) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const formatPercent = (value) =>
  `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
