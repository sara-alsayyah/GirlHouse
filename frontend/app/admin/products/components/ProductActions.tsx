import { Pencil, Trash2 } from "lucide-react";

interface Props {
  onDelete: () => void;
  onEdit: () => void;
}

export function ProductActions({ onDelete, onEdit }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="rounded-xl bg-[#f7eef1] p-2 text-[#b78895] transition hover:bg-[#eddce2]"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={onDelete}
        className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
