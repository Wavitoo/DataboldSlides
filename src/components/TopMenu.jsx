import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function TopMenu({
  onNew,
  onSave,
  onExport,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onToggleSidebar,
  onExportPDF,
  showSidebar,
}) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      id="top-menu"
      className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-300 dark:border-gray-400 bg-background text-foreground overflow-x-auto scrollbar-none"
    >
      {/* Fichier */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Fichier</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onNew}>Nouveau</DropdownMenuItem>
          <DropdownMenuItem onSelect={onSave}>Enregistrer</DropdownMenuItem>
          <DropdownMenuItem onSelect={onExport}>Exporter (JSON)</DropdownMenuItem>
          <DropdownMenuItem onSelect={onExportPDF}>Exporter en PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Accueil */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Accueil</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onAddSlide}>Ajouter Slide</DropdownMenuItem>
          <DropdownMenuItem onSelect={onDeleteSlide}>Supprimer Slide</DropdownMenuItem>
          <DropdownMenuItem onSelect={onDuplicateSlide}>Dupliquer Slide</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Insertion */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Insertion</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => alert("Insérer image")}>Image</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Insérer forme")}>Forme</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Zone de texte")}>Zone de texte</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Affichage */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Affichage</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onToggleSidebar}>
            {showSidebar ? "Masquer la barre latérale" : "Afficher la barre latérale"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleTheme}>
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
