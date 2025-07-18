import { useState, useRef } from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

import Toolbar from "./Toolbar";
import SlideSidebar from "./SlideSidebar";
import SlideContent from "./SlideContent";
import TopMenu from "./TopMenu";

export default function SlideEditor() {
  const [slides, setSlides] = useState([
    { id: 1, title: "Your Title ...", body: "Your Body ..." },
    { id: 2, title: "Your Title ...", body: "Your Body ..." },
    { id: 3, title: "Your Title ...", body: "Your Body ..." },
    { id: 4, title: "Your Title ...", body: "Your Body ..." },
    { id: 5, title: "Your Title ...", body: "Your Body ..." },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

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

  const handleExportPDF = async () => {
    const originalIndex = activeIndex;
    const pdf = new jsPDF({ unit: "px", format: "a4" });

    setShowSidebar(false);

    for (let i = 0; i < slides.length; i++) {
      setActiveIndex(i);
      await new Promise((res) => setTimeout(res, 300));

      const node = document.querySelector("#slide-content");
      if (!node) continue;

      const dataUrl = await domtoimage.toPng(node, {
        width: 1280,
        height: 720,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          backgroundColor: "#fff",
        },
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
    }

    setActiveIndex(originalIndex);
    setShowSidebar(true);

    pdf.save("presentation.pdf");
  };

  const handleNew = () => {
    const confirmed = confirm("Voulez-vous vraiment tout réinitialiser ?");
    if (confirmed) {
      setSlides([{ id: Date.now(), title: "Your Title ...", body: "Your Body ..." }]);
      setActiveIndex(0);
    }
  };

  const handleSave = () => {
    const data = JSON.stringify(slides, null, 2);
    localStorage.setItem("slides", data);
    alert("Présentation enregistrée localement.");
  };

  const handleExport = () => {
    const data = JSON.stringify(slides, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.json";
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleDuplicate = () => {
    const current = slides[activeIndex];
    const duplicate = { ...current, id: Date.now() };
    const updated = [...slides];
    updated.splice(activeIndex + 1, 0, duplicate);
    setSlides(updated);
    setActiveIndex(activeIndex + 1);
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
      <TopMenu
        onNew={handleNew}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onExport={handleExport}
        onAddSlide={handleAdd}
        onDeleteSlide={handleDelete}
        onDuplicateSlide={handleDuplicate}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        showSidebar={showSidebar}
      />
      <Toolbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="aspect-video w-full max-w-[1200px] border border-foreground rounded-md flex p-6 gap-12 bg-background">
          {showSidebar && (
            <SlideSidebar
              slides={slides}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onAdd={handleAdd}
              onDelete={handleDelete}
              addButtonRef={addButtonRef}
              deleteButtonRef={deleteButtonRef}
              setSlides={setSlides}
            />
          )}
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
