import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function TopMenu({
  slides,
  onNew,
  onSave,
  onExport,
  onToggleSidebar,
  onModePresentation,
}) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex gap-4 px-6 py-2 border-b border-gray-300 dark:border-gray-400 bg-background text-foreground">
      {/* Fichier */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Fichier</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onNew}>Nouveau</DropdownMenuItem>
          <DropdownMenuItem onSelect={onSave}>Enregistrer</DropdownMenuItem>
          <DropdownMenuItem onSelect={onExport}>Exporter (JSON)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Accueil */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Accueil</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => alert("Ajout slide")}>
            Ajouter Slide
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Supprimer slide")}>
            Supprimer Slide
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Dupliquer slide")}>
            Dupliquer Slide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Insertion */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Insertion</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => alert("Insérer image")}>
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Insérer forme")}>
            Forme
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => alert("Zone de texte")}>
            Zone de texte
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Affichage */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Affichage</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onToggleSidebar}>
            Masquer la barre latérale
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleTheme}>
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onModePresentation}>
            Mode présentation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
