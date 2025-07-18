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
    if (titleRef.current && titleRef.current.innerText !== slide.title) {
      titleRef.current.innerText = slide.title;
    }
    if (bodyRef.current && bodyRef.current.innerText !== slide.body) {
      bodyRef.current.innerText = slide.body;
    }
  }, [slide.title, slide.body]);

  if (empty) {
    return (
      <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
        Aucune slide. Appuyez sur + pour en créer une.
      </div>
    );
  }

  return (
    <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-gray-100 relative space-y-4">
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onTitleChange({ target: { value: e.currentTarget.innerText } })}
        className="w-full text-3xl font-semibold bg-transparent outline-none resize-none text-gray-800 mb-12"
      ></div>

      <div
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onBodyChange({ target: { value: e.currentTarget.innerText } })}
        className="w-full h-full bg-transparent outline-none resize-none text-sm text-gray-700"
      ></div>

      <span className="absolute bottom-2 right-4 text-sm text-gray-500">
        {index + 1}
      </span>
    </div>
  );
}
