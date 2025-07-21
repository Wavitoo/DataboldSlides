export default function SlidePreview({ slide, index, active, onClick }) {
  const elements = slide?.elements?.length
    ? slide.elements
    : [
        {
          id: "preview-title",
          content: slide?.title || "Your Title ...",
          x: 50,
          y: 40,
          width: 300,
          fontSize: 24,
          style: "text-3xl font-bold",
        },
        {
          id: "preview-body",
          content: slide?.body || "Your Body ...",
          x: 50,
          y: 120,
          width: 400,
          fontSize: 16,
          style: "text-base",
        },
      ];
  
  return (
    <div className="p-1 box-border">
      <div
        onClick={onClick}
        className={`w-44 aspect-video bg-muted rounded-md shadow-sm relative cursor-pointer transition-all duration-100
        ${active ? "ring-2 ring-blue-500" : "border border-border"}
        overflow-hidden`}
        style={{
          boxSizing: "border-box",
        }}
      >
        <div className="relative w-full h-full">
          {elements.map((el) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x * 0.25,
                top: el.y * 0.25,
                width: el.width * 0.25,
                fontSize: el.fontSize * 0.25,
                padding: 2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              className={`text-foreground ${el.style}`}
            >
              {el.content}
            </div>
          ))}
          <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
            {index + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
