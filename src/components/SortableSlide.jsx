import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

import SlidePreview from "./SlidePreview";

export default function SortableSlide({
  slide,
  index,
  active,
  onClick,
  clipboard,
  setClipboard,
  slides,
  setSlides,
  setActiveIndex,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

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
    <ContextMenu>
      <ContextMenuTrigger>
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setClipboard(slide)}>
          Copier
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            if (!clipboard) return;
            const newSlide = { ...clipboard, id: Date.now() };
            const updated = [...slides];
            updated.splice(index + 1, 0, newSlide);
            setSlides(updated);
            setActiveIndex(index + 1);
          }}
        >
          Coller
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const duplicate = { ...slide, id: Date.now() };
            const updated = [...slides];
            updated.splice(index + 1, 0, duplicate);
            setSlides(updated);
            setActiveIndex(index + 1);
          }}
        >
          Dupliquer
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            if (slides.length <= 1) return;
            const updated = slides.filter((_, idx) => idx !== index);
            const newIndex = index >= updated.length ? updated.length - 1 : index;
            setSlides(updated);
            setActiveIndex(newIndex);
          }}
        >
          Supprimer
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const newSlide = {
              id: Date.now(),
              title: "Your Title ...",
              body: "Your Body ...",
            };
            const updated = [...slides];
            updated.splice(index + 1, 0, newSlide);
            setSlides(updated);
            setActiveIndex(index + 1);
          }}
        >
          Nouvelle slide
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
