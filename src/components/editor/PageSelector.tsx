import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PageConfigDialog } from "./PageConfigDialog";

export function PageSelector() {
  const { pages, currentPageId, setCurrentPage, addPage, removePage, updatePage } = useEditorStore();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const currentPage = pages.find((p) => p.id === currentPageId);

  const handleStartEdit = (pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (pageId: string) => {
    if (editingName.trim()) {
      updatePage(pageId, { name: editingName.trim() });
    }
    setEditingPageId(null);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[150px]">
            <FileText className="h-4 w-4" />
            {currentPage?.name || "Selecionar Página"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <div className="p-2 space-y-1">
            {pages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer group",
                  currentPageId === page.id && "bg-accent"
                )}
              >
                {editingPageId === page.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(page.id);
                        if (e.key === "Escape") setEditingPageId(null);
                      }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleSaveEdit(page.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex-1 text-sm"
                      onClick={() => setCurrentPage(page.id)}
                      onDoubleClick={() => handleStartEdit(page.id, page.name)}
                    >
                      {page.name}
                      {currentPageId === page.id && (
                        <span className="ml-2 text-xs text-muted-foreground">(atual)</span>
                      )}
                    </div>
                    {pages.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Deseja remover a página "${page.name}"?`)) {
                            removePage(page.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button size="sm" variant="outline" onClick={addPage} className="gap-2">
        <Plus className="h-4 w-4" />
        Nova Página
      </Button>

      <PageConfigDialog />
    </div>
  );
}
