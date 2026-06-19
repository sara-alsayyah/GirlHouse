interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CategoriesFilters({ searchTerm, onSearchChange }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search category..."
        className="h-12 rounded-xl border border-[#ead9dd] px-4 outline-none"
      />

      <button className="h-12 rounded-xl bg-[#b78895] px-5 text-white">
        Add Category
      </button>
    </div>
  );
}
