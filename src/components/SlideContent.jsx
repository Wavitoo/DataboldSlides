import { useRef, useEffect } from "react";

export default function SlideContent({
  slide,
  index,
  onTitleChange,
  onBodyChange,
  empty,
}) {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!slide) return;

    if (titleRef.current && titleRef.current.innerHTML !== slide.title) {
      titleRef.current.innerHTML = slide.title;
    }
    if (bodyRef.current && bodyRef.current.innerHTML !== slide.body) {
      bodyRef.current.innerHTML = slide.body;
    }
  }, [slide?.title, slide?.body]);

  if (empty) {
    return (
      <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-muted flex items-center justify-center text-muted-foreground text-lg">
        Aucune slide. Appuyez sur + pour en créer une.
      </div>
    );
  }

  return (
    <div id="slide-content" className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-muted relative space-y-4">
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          onTitleChange({ target: { value: e.currentTarget.innerHTML } })
        }
        className="w-full text-3xl font-semibold bg-transparent outline-none resize-none text-foreground mb-12"
      />

      <div
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          onBodyChange({ target: { value: e.currentTarget.innerHTML } })
        }
        className="w-full h-full bg-transparent outline-none resize-none text-sm text-muted-foreground"
      />

      <span className="absolute bottom-2 right-4 text-sm text-muted-foreground">
        {index + 1}
      </span>
    </div>
  );
}
