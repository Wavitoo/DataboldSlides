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
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const addButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const slideContentRef = useRef();

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

  const handleUpdateSlide = (updatedSlide) => {
    const updatedSlides = [...slides];
    updatedSlides[activeIndex] = { ...slides[activeIndex], ...updatedSlide };
    setSlides(updatedSlides);
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
    setIsExportingPDF(true);
    const originalIndex = activeIndex;
    slideContentRef.current?.deselectAll();

    const BG_COLOR = "#f4f4f5";
    let pdf = null;
    let firstWidth = null;
    let firstHeight = null;
    for (let i = 0; i < slides.length; i++) {
      setActiveIndex(i);
      await new Promise((res) => setTimeout(res, 400));

      const exportNode = document.querySelector("#slide-content");
      if (!exportNode) continue;

      const rect = exportNode.getBoundingClientRect();
      const CANVAS_WIDTH = Math.round(rect.width);
      const CANVAS_HEIGHT = Math.round(rect.height);

      const prevWidth = exportNode.style.width;
      const prevHeight = exportNode.style.height;

      exportNode.style.width = CANVAS_WIDTH + "px";
      exportNode.style.height = CANVAS_HEIGHT + "px";

      if (i === 0) {
        pdf = new jsPDF({ unit: "px", format: [CANVAS_WIDTH, CANVAS_HEIGHT], orientation: "landscape" });
        firstWidth = CANVAS_WIDTH;
        firstHeight = CANVAS_HEIGHT;
      } else {
        pdf.addPage([CANVAS_WIDTH, CANVAS_HEIGHT], "landscape");
      }

      const dataUrl = await domtoimage.toPng(exportNode, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        style: {
          backgroundColor: BG_COLOR,
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      exportNode.style.width = prevWidth;
      exportNode.style.height = prevHeight;

      pdf.addImage(dataUrl, "PNG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    setActiveIndex(originalIndex);
    setIsExportingPDF(false);
    if (pdf) pdf.save("presentation.pdf");
  };

  const handleNew = () => {
    const confirmed = confirm("Voulez-vous vraiment tout réinitialiser ?");
    if (confirmed) {
      setSlides([{ id: Date.now(), title: "Your Title ...", body: "Your Body ..." }]);
      setActiveIndex(0);
    }
  };

  const handleExportJSON = () => {
    try {
      const data = JSON.stringify(slides, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "presentation.json";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors de l'exportation.");
    }
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedSlides = JSON.parse(text);

        if (!Array.isArray(importedSlides)) {
          alert("Fichier invalide.");
          return;
        }

        setSlides(importedSlides);
        setActiveIndex(0);
      } catch (error) {
        alert("Échec de l'importation.");
      }
    };

    input.click();
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
        onImport={handleImport}
        onExportJSON={handleExportJSON}
        onExportPDF={handleExportPDF}
        onAddSlide={handleAdd}
        onDeleteSlide={handleDelete}
        onDuplicateSlide={handleDuplicate}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        showSidebar={showSidebar}
      />

      <Toolbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="aspect-video w-full max-w-[1280px] border border-foreground rounded-md flex p-6 gap-12 bg-background">
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
            ref={slideContentRef}
            slide={slides[activeIndex]}
            index={activeIndex}
            onTitleChange={handleTitleChange}
            onBodyChange={handleBodyChange}
            onUpdateSlide={handleUpdateSlide}
            empty={slides.length === 0}
            isExporting={isExportingPDF}
          />
        </div>
      </div>
    </div>
  );
}
