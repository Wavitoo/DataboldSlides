import SlidePreview from "./SlidePreview";
import SlideToolbar from "./SlideToolbar";

export default function SlideSidebar({
  slides,
  activeIndex,
  setActiveIndex,
  onAdd,
  onDelete,
  addButtonRef,
  deleteButtonRef,
}) {
  return (
    <div className="flex flex-col items-center gap-4 pr-2 max-h-full">
      <SlideToolbar
        onAdd={onAdd}
        onDelete={onDelete}
        addButtonRef={addButtonRef}
        deleteButtonRef={deleteButtonRef}
      />

      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {slides.length === 0 ? (
          <div className="text-center text-gray-500 text-sm px-4">
            Appuyez sur + pour créer votre première slide
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {slides.map((slide, i) => (
              <SlidePreview
                key={slide.id}
                index={i}
                slide={slide}
                active={i === activeIndex}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
