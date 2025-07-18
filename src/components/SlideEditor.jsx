import { useState, useRef } from "react";

import SlideSidebar from "./SlideSidebar";
import SlideContent from "./SlideContent";
// import TopMenu from "./TopMenu";
// import Toolbar from "./Toolbar";

export default function SlideEditor() {
  const [slides, setSlides] = useState([
    { id: 1, title: "Your Title ...", body: "Your Body ..." },
    { id: 2, title: "Your Title ...", body: "Your Body ..." },
    { id: 3, title: "Your Title ...", body: "Your Body ..." },
    { id: 4, title: "Your Title ...", body: "Your Body ..." },
    { id: 5, title: "Your Title ...", body: "Your Body ..." },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const addButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const handleAdd = () => {
    const newSlide = {
      id: Date.now(),
      title: "Your Title ...",
      body: "Your Body ...",
    };
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    setActiveIndex(updatedSlides.length - 1);
    addButtonRef.current?.blur();
  };

  const handleDelete = () => {
    if (slides.length <= 1) {
      setSlides([]);
      return;
    }
    const updated = slides.filter((_, i) => i !== activeIndex);
    const newIndex = activeIndex >= updated.length ? updated.length - 1 : activeIndex;
    setSlides(updated);
    setActiveIndex(newIndex);
    deleteButtonRef.current?.blur();
  };

  const handleTitleChange = (e) => {
    const updated = [...slides];
    updated[activeIndex].title = e.target.value;
    setSlides(updated);
  };

  const handleBodyChange = (e) => {
    const updated = [...slides];
    updated[activeIndex].body = e.target.value;
    setSlides(updated);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* <TopMenu /> */}
      {/* <Toolbar /> */}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="aspect-video w-full max-w-[1400px] border border-black rounded-md flex p-6 gap-12 bg-white">
          <SlideSidebar
            slides={slides}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onAdd={handleAdd}
            onDelete={handleDelete}
            addButtonRef={addButtonRef}
            deleteButtonRef={deleteButtonRef}
          />
          <SlideContent
            slide={slides[activeIndex]}
            index={activeIndex}
            onTitleChange={handleTitleChange}
            onBodyChange={handleBodyChange}
            empty={slides.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
