interface Props {
  searchTerm: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export function ProductsFilters({
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
  categories,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="h-12 rounded-xl border border-[#ead9dd] px-4 outline-none"
      />

      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-12 rounded-xl border border-[#ead9dd] px-4"
        >
          <option value="all">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="rounded-xl bg-[#b78895] px-5 text-white">
          Add Product
        </button>
      </div>
    </div>
  );
}
