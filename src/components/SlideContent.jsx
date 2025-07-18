export default function SlideContent({
  slide,
  index,
  onTitleChange,
  onBodyChange,
  empty,
}) {
  if (empty) {
    return (
      <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
        Aucune slide. Appuyez sur + pour en créer une.
      </div>
    );
  }

  return (
    <div className="flex-1 border-2 border-blue-500 rounded-sm p-6 bg-gray-100 relative">
      <textarea
        value={slide.title}
        onChange={onTitleChange}
        placeholder="Titre..."
        className="w-full text-3xl font-semibold bg-transparent outline-none resize-none text-gray-800 mb-4"
      />
      <textarea
        value={slide.body}
        onChange={onBodyChange}
        placeholder="Contenu..."
        className="w-full h-full bg-transparent outline-none resize-none text-sm text-gray-700"
      />
      <span className="absolute bottom-2 right-4 text-sm text-gray-500">{index + 1}</span>
    </div>
  );
}
