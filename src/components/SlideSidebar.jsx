import { useState } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SlideToolbar from "./SlideToolbar";
import SortableSlide from "./SortableSlide";

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
  const [clipboard, setClipboard] = useState(null);

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
    <div
      id="slide-sidebar"
      className="flex flex-col items-center gap-4 pr-2 max-h-full text-foreground"
    >
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
                    slide={slide}
                    index={i}
                    active={i === activeIndex}
                    clipboard={clipboard}
                    setClipboard={setClipboard}
                    slides={slides}
                    setSlides={setSlides}
                    setActiveIndex={setActiveIndex}
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
