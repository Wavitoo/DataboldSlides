import { SketchPicker } from "react-color";

export default function ColorPicker({ color, onChange, defaultColor = "#000" }) {
  return (
    <div
      className="p-2 bg-white rounded shadow-md"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="mb-2 text-sm text-blue-600 hover:underline"
        onMouseDown={(e) => {
          e.preventDefault(); // garde le focus
          e.stopPropagation();
        }}
        onClick={() => onChange(defaultColor)}
      >
        Par défaut
      </button>

      <SketchPicker
        color={color}
        disableAlpha
        onChangeComplete={(color) => {
          onChange(color.hex);
        }}
        onChange={(color) => {
          // Optionnel : live update pendant le drag
          onChange(color.hex);
        }}
      />
    </div>
  );
}
