import { useRef, useState, useEffect } from "react";
import { GripHorizontal, MoveHorizontal } from "lucide-react";

export default function SlideContent({ slide, index, empty, onUpdateSlide }) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const textareaRef = useRef(null);
  const currentElementsRef = useRef([]);
  const copiedElementRef = useRef(null);
  const elementRefs = useRef({});

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    setSelectedId(null);
    setEditingId(null);
    setEditingContent("");
    setHistory([]);
    setRedoStack([]);

    if (slide?.elements) {
      setElements(slide.elements);
    } else {
      setElements([
        {
          id: "title",
          content: slide?.title || "Your Title ...",
          x: 50,
          y: 40,
          width: 300,
          height: 60,
          fontSize: 24,
          style: "text-3xl font-bold",
        },
        {
          id: "body",
          content: slide?.body || "Your Body ...",
          x: 50,
          y: 120,
          width: 400,
          height: 100,
          fontSize: 16,
          style: "text-base",
        },
      ]);
    }
  }, [slide?.id]);


  useEffect(() => {
    if (editingId && textareaRef.current) {
      const el = textareaRef.current;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      });
    }
  }, [editingId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const isUndo = e.ctrlKey && key === "z" && !e.shiftKey;
      const isRedo = e.ctrlKey && key === "z" && e.shiftKey;

      if (isUndo && history.length > 0) {
        e.preventDefault();
        const last = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setRedoStack((r) => [...r, elements]);
        setElements(last);
      }

      if (isRedo && redoStack.length > 0) {
        e.preventDefault();
        const next = redoStack[redoStack.length - 1];
        setRedoStack((r) => r.slice(0, -1));
        setHistory((h) => [...h, elements]);
        setElements(next);
      }

      if (e.ctrlKey && key === "c" && selectedId && !editingId) {
        const found = elements.find((el) => el.id === selectedId);
        if (found) {
          copiedElementRef.current = { 
            ...found, 
            id: Date.now().toString(), 
            x: found.x + 20, 
            y: found.y + 20 
          };
        }
      }

      if (e.ctrlKey && key === "v" && copiedElementRef.current && !editingId) {
        e.preventDefault();
        const pasted = { 
          ...copiedElementRef.current, 
          id: Date.now().toString(), 
          x: copiedElementRef.current.x + 10, 
          y: copiedElementRef.current.y + 10 
        };

        const newElements = [...elements, pasted];
        pushHistory(newElements);
        setSelectedId(pasted.id);
        onUpdateSlide?.({ elements: newElements });
      }


      if (e.ctrlKey && key === "d" && selectedId && !editingId) {
        e.preventDefault();
        const found = elements.find((el) => el.id === selectedId);
        if (found) {
          const duplicated = {
            ...found,
            id: Date.now().toString(),
            x: found.x + 30,
            y: found.y + 30,
          };
          const newElements = [...elements, duplicated];
          pushHistory(newElements);
          setSelectedId(duplicated.id);
          onUpdateSlide?.({ elements: newElements });
        }
      }


      if (e.ctrlKey && key === "x" && selectedId && !editingId) {
        e.preventDefault();
        const found = elements.find((el) => el.id === selectedId);
        if (found) {
          copiedElementRef.current = { ...found };
          const filtered = elements.filter((el) => el.id !== selectedId);
          pushHistory(filtered);
          setSelectedId(null);
          onUpdateSlide?.({ elements: filtered });
        }
      }


      if (!editingId && selectedId) {
        const offset = e.shiftKey ? 10 : 1;
        const moveElement = (dx, dy) => {
          const updated = elements.map((el) =>
            el.id === selectedId ? { ...el, x: el.x + dx, y: el.y + dy } : el
          );
          setElements(updated);
        };

        switch (e.key) {
          case "arrowup":
            e.preventDefault();
            moveElement(0, -offset);
            break;
          case "arrowdown":
            e.preventDefault();
            moveElement(0, offset);
            break;
          case "arrowleft":
            e.preventDefault();
            moveElement(-offset, 0);
            break;
          case "arrowright":
            e.preventDefault();
            moveElement(offset, 0);
            break;
        }
      }

      if (key === "enter" && selectedId && !editingId) {
        e.preventDefault();
        const el = elements.find((el) => el.id === selectedId);
        if (el) {
          setEditingId(el.id);
          setEditingContent(el.content);
        }
      }

      if (key === "escape") {
        if (editingId) {
          setEditingId(null);
          setEditingContent("");
        } else if (selectedId) {
          setSelectedId(null);
        }
      }

      if ((key === "backspace" || key === "delete") && selectedId && !editingId) {
        const updated = elements.filter((el) => el.id !== selectedId);
        pushHistory(updated);
        setSelectedId(null);
        onUpdateSlide?.({ elements: updated });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedId, copiedElementRef, history, redoStack, editingId]);

  useEffect(() => {
    const handlePaste = async (e) => {
      if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const src = event.target.result;
            const newImage = {
              id: Date.now().toString(),
              type: "image",
              src,
              x: 100,
              y: 100,
              width: 300,
              height: 200,
            };
            const newElements = [...elements, newImage];
            pushHistory(newElements);
            setSelectedId(newImage.id);
            onUpdateSlide?.({ elements: newElements });
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          return;
        }
      }

      const html = e.clipboardData.getData("text/html");
      if (html) {
        const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
        if (match && match[1]) {
          const src = match[1];
          const newImage = {
            id: Date.now().toString(),
            type: "image",
            src,
            x: 100,
            y: 100,
            width: 300,
            height: 200,
          };
          const newElements = [...elements, newImage];
          pushHistory(newElements);
          setSelectedId(newImage.id);
          onUpdateSlide?.({ elements: newElements });
          e.preventDefault();
          return;
        }
      }
      const text = e.clipboardData.getData("text/plain");
      if (text && (text.startsWith("http://") || text.startsWith("https://")) && /\.(png|jpe?g|gif|webp|svg)$/i.test(text)) {
        const src = text;
        const newImage = {
          id: Date.now().toString(),
          type: "image",
          src,
          x: 100,
          y: 100,
          width: 300,
          height: 200,
        };
        const newElements = [...elements, newImage];
        pushHistory(newElements);
        setSelectedId(newImage.id);
        onUpdateSlide?.({ elements: newElements });
        e.preventDefault();
        return;
      }
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("paste", handlePaste);
    } else {
      window.addEventListener("paste", handlePaste);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("paste", handlePaste);
      } else {
        window.removeEventListener("paste", handlePaste);
      }
    };
  }, [elements, onUpdateSlide]);

  const pushHistory = (newState) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newState);
  };

  const handleEditConfirm = () => {
    if (editingId) {
      const updated = elements.map((el) =>
        el.id === editingId ? { ...el, content: editingContent } : el
      );
      pushHistory(updated);
      setElements(updated);
      onUpdateSlide?.({ elements: updated });
    }
    setEditingId(null);
    setEditingContent("");
  };

  const startDrag = (e, id) => {
    if (editingId !== null || resizeRef.current) return;

    const element = elements.find((el) => el.id === id);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x,
      initialY: element.y,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    e.stopPropagation();
  };


  const onDrag = (e) => {
    if (!dragRef.current || !canvasRef.current) return;

    const { id, startX, startY, initialX, initialY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    setElements((prev) => {
      const next = prev.map((el) => {
        if (el.id !== id) return el;

        const realHeight = elementRefs.current[id]?.getBoundingClientRect().height || el.height || 0;
        
        const newX = Math.min(Math.max(0, initialX + dx), canvasRect.width - el.width);
        const newY = Math.min(Math.max(0, initialY + dy), canvasRect.height - realHeight);

        return { ...el, x: newX, y: newY };
      });

      currentElementsRef.current = next;
      return next;
    });

  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    dragRef.current = null;

    onUpdateSlide?.({ elements: currentElementsRef.current });
  };

  const startResize = (e, id, direction) => {
    e.stopPropagation();
    resizeRef.current = { id, startX: e.clientX, startY: e.clientY, direction };
    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);
  };

  const onResize = (e) => {
    const minFontSize = 8;
    const minWidth = 50;
    if (!resizeRef.current) return;

    const { id, startX, startY, direction } = resizeRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const isCorner = ["top-left", "top-right", "bottom-left", "bottom-right"].includes(direction);

    const updated = elements.map((el) => {
      if (el.id !== id) return el;

      let newWidth = el.width;
      let newX = el.x;
      let newY = el.y;
      let newFontSize = el.fontSize;

      if (isCorner) {
        if (direction.includes("right")) newWidth = Math.max(minWidth, el.width + dx);
        if (direction.includes("left")) {
          newWidth = Math.max(minWidth, el.width - dx);
          newX = el.x + dx;
        }
        if (direction.includes("top")) newY = el.y + dy;
        newFontSize = Math.max(minFontSize, (el.fontSize * newWidth) / el.width);
      } else {
        if (direction === "right") newWidth = Math.max(minWidth, el.width + dx);
        if (direction === "left") {
          newWidth = Math.max(minWidth, el.width - dx);
          newX = el.x + dx;
        }
      }

      return { ...el, width: newWidth, x: newX, y: newY, fontSize: newFontSize };
    });

    setElements(updated);
  };

  const stopResize = () => {
    resizeRef.current = null;
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
    onUpdateSlide?.({ elements });
  };

  const deselect = () => {
    setSelectedId(null);
    handleEditConfirm();
  };

  if (empty) {
    return (
      <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-muted flex items-center justify-center text-muted-foreground text-lg">
        Aucune slide. Appuyez sur + pour en créer une.
      </div>
    );
  }

  return (
    <div
      id="slide-content"
      ref={canvasRef}
      className="flex-1 border-2 border-blue-500 rounded-sm bg-muted relative overflow-hidden"
      onClick={deselect}
    >
      <div className="w-full h-full relative">
        {elements.map((el) => (
          <div
            key={el.id}
            ref={(elRef) => {
              if (elRef) elementRefs.current[el.id] = elRef;
            }}
            onMouseDown={(e) => {
              if (editingId !== el.id) {
                startDrag(e, el.id);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(el.id);
              setEditingId(null);
            }}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: "auto",
              border: selectedId === el.id ? "1px dashed rgba(0,0,0,0.3)" : "none",
              borderRadius: "4px",
              padding: "4px",
              cursor: editingId === el.id ? "text" : "move",
              backgroundColor: "transparent",
              userSelect: editingId === el.id ? "text" : "none",
            }}
          >
            {editingId === el.id ? (
              <textarea
                ref={textareaRef}
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onBlur={handleEditConfirm}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditingContent("");
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full bg-transparent outline-none resize-none ${el.style}`}
                style={{ fontSize: el.fontSize, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              />
            ) : (
              el.type === "image" ? (
                <img
                  src={el.src}
                  alt=""
                  style={{
                    width: el.width,
                    height: el.height,
                    objectFit: "contain",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              ) : (
                <div
                  className={`w-full h-full bg-transparent text-foreground ${el.style}`}
                  style={{ fontSize: el.fontSize, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  contentEditable={selectedId === el.id && !editingId}
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const updatedContent = e.currentTarget.innerText;
                    const updated = elements.map((elem) =>
                      elem.id === el.id ? { ...elem, content: updatedContent } : elem
                    );
                    setElements(updated);
                    onUpdateSlide?.({ elements: updated });
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(el.id);
                  }}
                >
                  {el.content}
                </div>
              )
            )}

            {selectedId === el.id && (
              <>
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 cursor-ew-resize" onMouseDown={(e) => startResize(e, el.id, "left")}>
                  <MoveHorizontal size={14} />
                </div>
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 cursor-ew-resize" onMouseDown={(e) => startResize(e, el.id, "right")}>
                  <MoveHorizontal size={14} />
                </div>
                <div className="absolute top-[-6px] left-[-6px] cursor-nwse-resize" onMouseDown={(e) => startResize(e, el.id, "top-left")}>
                  <GripHorizontal size={12} />
                </div>
                <div className="absolute top-[-6px] right-[-6px] cursor-nesw-resize" onMouseDown={(e) => startResize(e, el.id, "top-right")}>
                  <GripHorizontal size={12} />
                </div>
                <div className="absolute bottom-[-6px] left-[-6px] cursor-nesw-resize" onMouseDown={(e) => startResize(e, el.id, "bottom-left")}>
                  <GripHorizontal size={12} />
                </div>
                <div className="absolute bottom-[-6px] right-[-6px] cursor-nwse-resize" onMouseDown={(e) => startResize(e, el.id, "bottom-right")}>
                  <GripHorizontal size={12} />
                </div>
              </>
            )}
          </div>
        ))}
        <span className="absolute bottom-2 right-4 text-sm text-muted-foreground">{index + 1}</span>
      </div>
    </div>
  );
}
