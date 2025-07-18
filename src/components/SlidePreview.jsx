export default function SlidePreview({ slide, index, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-44 aspect-video bg-card shadow-sm rounded-md border ${
        active ? "border-2 border-blue-500" : "border border-border"
      } overflow-hidden cursor-pointer`}
    >
      <div className="w-full h-full p-2 flex flex-col justify-between">
        <div
          className="text-xs font-bold text-foreground truncate"
          dangerouslySetInnerHTML={{ __html: slide.title }}
        />
        <div
          className="text-[10px] text-muted-foreground line-clamp-3 break-words whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: slide.body }}
        />
        <div className="text-[10px] text-right text-muted-foreground mt-auto">
          {index + 1}
        </div>
      </div>
    </div>
  );
}
