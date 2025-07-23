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
  
  const canvasWidth = 1280;
  const canvasHeight = 720;
  const previewWidth = 176;
  const previewHeight = previewWidth * (canvasHeight / canvasWidth);
  const baseScale = Math.min(previewWidth / canvasWidth, previewHeight / canvasHeight);
  const scale = baseScale * 1.2;

  return (
    <div className="p-1 box-border">
      <div
        onClick={onClick}
        className={`w-44 aspect-video bg-muted rounded-md shadow-sm relative cursor-pointer transition-all duration-100
        ${active ? "ring-2 ring-blue-500" : "border border-border"}
        overflow-hidden`}
        style={{
          boxSizing: "border-box",
          width: previewWidth,
          height: previewHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          {elements.map((el) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                width: el.width,
                fontSize: el.fontSize,
                height: el.height,
                padding: 2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              className={`text-foreground ${el.style}`}
            >
              {el.type === "image" ? (
                <img
                  src={el.src}
                  alt=""
                  style={{
                    width: "100%",
                    height: el.height,
                    objectFit: "contain",
                    display: "block",
                  }}
                  draggable={false}
                />
              ) : (
                el.content
              )}
            </div>
          ))}
        </div>
        <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
          {index + 1}
        </span>
      </div>
    </div>
  );
}
