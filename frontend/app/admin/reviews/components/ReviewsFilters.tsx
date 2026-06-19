interface Props {
  searchTerm: string;
  ratingFilter: string;
  onSearchChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}

export function ReviewsFilters({
  searchTerm,
  ratingFilter,
  onSearchChange,
  onRatingChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search customer or product..."
        className="h-12 w-[300] rounded-xl border border-[#ead9dd] px-4 outline-none"
      />

      <select
        value={ratingFilter}
        onChange={(e) => onRatingChange(e.target.value)}
        className="h-12 rounded-xl border border-[#ead9dd] px-4"
      >
        <option value="all">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>
    </div>
  );
}
