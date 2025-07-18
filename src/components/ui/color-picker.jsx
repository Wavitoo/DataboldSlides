import { SketchPicker } from "react-color";
import "./color-picker.css"

export default function ColorPicker({ color, onChange, defaultColor = "#000" }) {
  return (
    <div
      className="p-2 bg-popover rounded shadow-md text-foreground"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="mb-2 text-sm text-foreground hover:underline"
        onMouseDown={(e) => {
          e.preventDefault(); // garde le focus
          e.stopPropagation();
        }}
        onClick={() => onChange(defaultColor)}
      >
        Par défaut
      </button>
      <div className="sketch-picker-wrapper">
        <SketchPicker
          color={color}
          disableAlpha
          onChangeComplete={(color) => {
            onChange(color.hex);
          }}
          onChange={(color) => {
            onChange(color.hex);
          }}
        />
      </div>
    </div>
  );
}
