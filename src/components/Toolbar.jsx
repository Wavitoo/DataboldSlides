import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

import { useEffect, useState } from "react";

const fonts = ["Arial", "Georgia", "Times New Roman", "Courier New", "Aptos Display"];
const sizes = [
  { label: "10px", value: "1" },
  { label: "13px", value: "2" },
  { label: "16px", value: "3" },
  { label: "18px", value: "4" },
  { label: "24px", value: "5" },
  { label: "32px", value: "6" },
  { label: "48px", value: "7" },
];

let savedRange = null;

function saveSelection() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0);
  }
}

function restoreSelection() {
  if (savedRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
}

function exec(cmd, value = null) {
  restoreSelection();
  document.execCommand(cmd, false, value);
}

export default function Toolbar() {
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("transparent");
  const [openTextColor, setOpenTextColor] = useState(false);
  const [openHighlight, setOpenHighlight] = useState(false);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  const updateActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveStyles);
    return () => document.removeEventListener("selectionchange", updateActiveStyles);
  }, []);

  const styleButton = (cmd, Icon) => (
    <Button
      key={cmd}
      variant="outline"
      onMouseDown={saveSelection}
      onClick={() => {
        exec(cmd);
        updateActiveStyles();
      }}
      className={activeStyles[cmd] ? "border border-blue-500" : ""}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex items-center gap-2 p-4 border-b bg-white">
      {/* Font Family */}
      <Select
        onOpenChange={(open) => open && saveSelection()}
        onValueChange={(v) => {
          restoreSelection();
          exec("fontName", v);
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Police" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select
        onOpenChange={(open) => open && saveSelection()}
        onValueChange={(v) => {
          restoreSelection();
          exec("fontSize", v);
        }}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Taille" />
        </SelectTrigger>
        <SelectContent>
          {sizes.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Styles */}
      {styleButton("bold", Bold)}
      {styleButton("italic", Italic)}
      {styleButton("underline", Underline)}
      {styleButton("strikeThrough", Strikethrough)}

      <Separator orientation="vertical" className="h-6" />

      {/* Alignments */}
      {styleButton("justifyLeft", AlignLeft)}
      {styleButton("justifyCenter", AlignCenter)}
      {styleButton("justifyRight", AlignRight)}
      {styleButton("justifyFull", AlignJustify)}

      <Separator orientation="vertical" className="h-6" />

      {/* Text Color */}
      <Popover
        open={openTextColor}
        onOpenChange={(open) => {
          if (open) saveSelection();
          setOpenTextColor(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" onMouseDown={saveSelection}>
            A<span style={{ color: textColor }}>■</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="z-[9999] w-auto p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ColorPicker
            color={textColor}
            defaultColor="#000"
            onChange={(c) => {
              setTextColor(c);
              exec("foreColor", c);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Highlight */}
      <Popover
        open={openHighlight}
        onOpenChange={(open) => {
          if (open) saveSelection();
          setOpenHighlight(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" onMouseDown={saveSelection}>
            🖍
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="z-[9999] w-auto p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ColorPicker
            color={highlightColor}
            defaultColor="transparent"
            onChange={(c) => {
              setHighlightColor(c);
              exec("hiliteColor", c);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
