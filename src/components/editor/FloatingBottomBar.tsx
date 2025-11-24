import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FloatingBottomBar() {
  const { pages, currentPageId, setCurrentPage, setActiveSheet, selectedBlockId, selectedElementId } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  const handleOpenProperties = () => {
    setActiveSheet("properties");
  };

  const handleOpenPageSettings = () => {
    setActiveSheet("page-settings");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50">
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        {/* Page selector */}
        <Select value={currentPageId || ""} onValueChange={setCurrentPage}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Página" />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          {/* Properties button - only show if something is selected */}
          {(selectedBlockId || selectedElementId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenProperties}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Propriedades</span>
            </Button>
          )}

          {/* Page settings button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPageSettings}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Página</span>
          </Button>

          {/* Preview button */}
          <Button
            size="sm"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visualizar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
