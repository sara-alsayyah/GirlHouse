interface Props {
  count: number;
}

export function CategoryProductsBadge({ count }: Props) {
  return (
    <span className="rounded-full bg-[#f9eef1] px-3 py-1 text-xs font-medium text-[#b78895]">
      {count} products
    </span>
  );
}
