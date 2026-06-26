interface Props {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function OrdersFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by email..."
        className="h-12 rounded-xl border border-[#ead9dd] px-4 outline-none"
      />

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-12 rounded-xl border border-[#ead9dd] px-4"
      >
        <option value="all">All Status</option>
        <option value="pending">pending</option>
        <option value="processing">processing</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
        <option value="cancelled">cancelled</option>
      </select>
    </div>
  );
}
