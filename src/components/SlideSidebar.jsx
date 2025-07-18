import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import SlidePreview from "./SlidePreview";
import SlideToolbar from "./SlideToolbar";

function SortableSlide({ slide, index, active, onClick, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMouseDown = (e) => {
    if (e.detail === 1) {
      let moved = false;

      const handleMove = () => {
        moved = true;
        window.removeEventListener("mousemove", handleMove);
      };

      window.addEventListener("mousemove", handleMove);

      setTimeout(() => {
        window.removeEventListener("mousemove", handleMove);
        if (!moved) {
          onClick();
        }
      }, 100);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
    >
      <SlidePreview
        slide={slide}
        index={index}
        active={active}
        onClick={() => {}}
      />
    </div>
  );
}

export default function SlideSidebar({
  slides,
  activeIndex,
  setActiveIndex,
  onAdd,
  onDelete,
  addButtonRef,
  deleteButtonRef,
  setSlides,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);

      if (activeIndex === oldIndex) setActiveIndex(newIndex);
      else if (oldIndex < activeIndex && newIndex >= activeIndex)
        setActiveIndex((prev) => prev - 1);
      else if (oldIndex > activeIndex && newIndex <= activeIndex)
        setActiveIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pr-2 max-h-full text-foreground">
      <SlideToolbar
        onAdd={onAdd}
        onDelete={onDelete}
        addButtonRef={addButtonRef}
        deleteButtonRef={deleteButtonRef}
      />

      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {slides.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm px-4">
            Appuyez sur + pour créer votre première slide
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {slides.map((slide, i) => (
                  <SortableSlide
                    key={slide.id}
                    id={slide.id}
                    slide={slide}
                    index={i}
                    active={i === activeIndex}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
