import { Plus, Minus as MinusIcon } from "lucide-react";

export default function SlideToolbar({ onAdd, onDelete, addButtonRef, deleteButtonRef }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        ref={addButtonRef}
        onClick={onAdd}
        className="w-13 h-13 border border-black rounded-md flex items-center justify-center bg-white hover:border-blue-500 transition-colors focus:outline-none"
      >
        <Plus size={16} />
      </button>
      <button
        ref={deleteButtonRef}
        onClick={onDelete}
        className="w-13 h-13 border border-black rounded-md flex items-center justify-center bg-white hover:border-blue-500 transition-colors focus:outline-none"
      >
        <MinusIcon size={16} />
      </button>
    </div>
  );
}
