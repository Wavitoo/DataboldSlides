export default function SlidePreview({ slide, index, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-44 aspect-video bg-white shadow-sm rounded-md border ${
        active ? "border-2 border-blue-500" : "border border-black"
      } overflow-hidden cursor-pointer`}
    >
      <div className="w-full h-full p-2 flex flex-col justify-between">
        <div className="text-xs font-bold text-gray-800 truncate">{slide.title}</div>
        <div className="text-[10px] text-gray-600 line-clamp-3 break-words whitespace-pre-wrap">{slide.body}</div>
        <div className="text-[10px] text-right text-gray-400 mt-auto">{index + 1}</div>
      </div>
    </div>
  );
}
