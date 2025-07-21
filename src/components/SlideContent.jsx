import { useRef, useState, useEffect } from "react";
import { GripHorizontal, MoveHorizontal } from "lucide-react";

export default function SlideContent({ slide, index, empty }) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const [elements, setElements] = useState([
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

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [copiedElement, setCopiedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const pushHistory = (newState) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newState);
  };

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

      if (e.ctrlKey && key === "c" && selectedId && editingId === null) {
        const found = elements.find((el) => el.id === selectedId);
        if (found) {
          setCopiedElement({ ...found, id: Date.now().toString(), x: found.x + 20, y: found.y + 20 });
        }
      }

      if (e.ctrlKey && key === "v" && copiedElement && editingId === null) {
        pushHistory([...elements, copiedElement]);
        setSelectedId(copiedElement.id);
        setCopiedElement(null);
      }

      if ((key === "backspace" || key === "delete") && selectedId && editingId === null) {
        pushHistory(elements.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedId, copiedElement, history, redoStack, editingId]);

  const startDrag = (e, id) => {
    if (editingId || resizeRef.current) return;
    dragRef.current = { id, startX: e.clientX, startY: e.clientY };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    e.stopPropagation();
  };

  const onDrag = (e) => {
    if (!dragRef.current) return;
    const { id, startX, startY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              x: Math.min(Math.max(0, el.x + dx), canvasRect.width - el.width),
              y: Math.min(Math.max(0, el.y + dy), canvasRect.height - el.height),
            }
          : el
      )
    );

    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const stopDrag = () => {
    dragRef.current = null;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  const startResize = (e, id, direction) => {
    e.stopPropagation();
    resizeRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      direction,
    };
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

    const isCorner =
      direction === "top-left" ||
      direction === "top-right" ||
      direction === "bottom-left" ||
      direction === "bottom-right";

    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;

        let newWidth = el.width;
        let newX = el.x;
        let newY = el.y;
        let newFontSize = el.fontSize;

        if (isCorner) {
          if (direction.includes("right")) {
            newWidth = Math.max(minWidth, el.width + dx);
          }
          if (direction.includes("left")) {
            newWidth = Math.max(minWidth, el.width - dx);
            newX = el.x + dx;
          }
          if (direction.includes("top")) {
            newY = el.y + dy;
          }
          newFontSize = Math.max(minFontSize, (el.fontSize * newWidth) / el.width);
        } else {
          if (direction === "right") {
            newWidth = Math.max(minWidth, el.width + dx);
          }
          if (direction === "left") {
            newWidth = Math.max(minWidth, el.width - dx);
            newX = el.x + dx;
          }
        }

        return {
          ...el,
          width: newWidth,
          x: newX,
          y: newY,
          fontSize: newFontSize,
        };
      })
    );

    resizeRef.current.startX = e.clientX;
    resizeRef.current.startY = e.clientY;
  };



  const stopResize = () => {
    resizeRef.current = null;
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setEditingId(null);
  };

  const handleDoubleClick = (id) => {
    const el = elements.find((e) => e.id === id);
    setEditingId(id);
    setEditingContent(el.content);
  };

  const handleEditConfirm = () => {
    if (editingId) {
      pushHistory(
        elements.map((el) =>
          el.id === editingId ? { ...el, content: editingContent } : el
        )
      );
    }
    setEditingId(null);
    setEditingContent("");
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
            onMouseDown={(e) => startDrag(e, el.id)}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(el.id);
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
                autoFocus
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onBlur={handleEditConfirm}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditingContent("");
                  }
                }}
                className={`w-full bg-transparent outline-none resize-none ${el.style}`}
                style={{
                  fontSize: el.fontSize,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              />
            ) : (
              <div
                className={`w-full h-full bg-transparent text-foreground ${el.style}`}
                style={{
                  fontSize: el.fontSize,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  cursor: "text",
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(el.id);
                }}
              >
                {el.content}
              </div>
            )}

            {/* Resize Handles */}
            {selectedId === el.id && (
              <>
                {/* Sides */}
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 cursor-ew-resize" onMouseDown={(e) => startResize(e, el.id, "left")}>
                  <MoveHorizontal size={14} />
                </div>
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 cursor-ew-resize" onMouseDown={(e) => startResize(e, el.id, "right")}>
                  <MoveHorizontal size={14} />
                </div>

                {/* Corners */}
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

        <span className="absolute bottom-2 right-4 text-sm text-muted-foreground">
          {index + 1}
        </span>
      </div>
    </div>
  );
}
