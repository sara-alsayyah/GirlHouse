interface Props {
  searchTerm: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export function CustomersFilters({
  searchTerm,
  roleFilter,
  onSearchChange,
  onRoleChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by email or phone number..."
        className="h-12 w-[350] rounded-xl border border-[#ead9dd] px-5 outline-none"
      />

      <select
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
        className="h-12 rounded-xl border border-[#ead9dd] px-4"
      >
        <option value="all">All Users</option>
        <option value="customer">Customers</option>
        <option value="admin">Admins</option>
      </select>
    </div>
  );
}
