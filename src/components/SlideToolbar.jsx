import { Plus, Minus as MinusIcon } from "lucide-react";

export default function SlideToolbar({ onAdd, onDelete, addButtonRef, deleteButtonRef }) {
  const baseClasses =
    "w-13 h-13 border border-border rounded-md flex items-center justify-center bg-card hover:bg-accent hover:border-blue-500 transition-colors focus:outline-none";

  return (
    <div className="flex gap-2 mb-4">
      <button ref={addButtonRef} onClick={onAdd} className={baseClasses}>
        <Plus size={18} className="text-foreground" />
      </button>
      <button ref={deleteButtonRef} onClick={onDelete} className={baseClasses}>
        <MinusIcon size={18} className="text-foreground" />
      </button>
    </div>
  );
}
