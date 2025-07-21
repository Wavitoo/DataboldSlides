import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Menu } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const items = [
    {
      label: "Fichier",
      children: [
        { label: "Nouveau", action: onNew },
        { label: "Enregistrer", action: onSave },
        { label: "Exporter (JSON)", action: onExport },
        { label: "Exporter en PDF", action: onExportPDF },
      ],
    },
    {
      label: "Accueil",
      children: [
        { label: "Ajouter Slide", action: onAddSlide },
        { label: "Supprimer Slide", action: onDeleteSlide },
        { label: "Dupliquer Slide", action: onDuplicateSlide },
      ],
    },
    {
      label: "Affichage",
      children: [
        {
          label: showSidebar ? "Masquer la barre latérale" : "Afficher la barre latérale",
          action: onToggleSidebar,
        },
        {
          label: theme === "dark" ? "Mode clair" : "Mode sombre",
          action: toggleTheme,
        },
      ],
    },
  ];

  return (
    <div className="w-full border-b border-gray-300 dark:border-gray-400 bg-background text-foreground px-4 py-4 flex items-center justify-between">
      {/* Large screen menu */}
      <div className="hidden md:flex gap-2 flex-wrap overflow-x-auto scrollbar-none py-1 px-1">
        {items.map((group) => (
          <DropdownMenu key={group.label}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">{group.label}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {group.children.map((item) => (
                <DropdownMenuItem key={item.label} onSelect={item.action}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>

      {/* Mobile hamburger menu */}
      <div className="md:hidden">
        <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((group) => (
              <div key={group.label}>
                <DropdownMenuItem disabled>{group.label}</DropdownMenuItem>
                {group.children.map((item) => (
                  <DropdownMenuItem key={item.label} onSelect={item.action}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
