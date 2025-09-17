type FilterValue = "All" | "Active" | "Blocked";

type FilterDropdownProps = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
};

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FilterValue)}
      className="border rounded-lg px-3 py-2 bg-white shadow-sm"
    >
      <option value="All">All Users</option>
      <option value="Active">Active</option>
      <option value="Blocked">Blocked</option>
    </select>
  );
}
