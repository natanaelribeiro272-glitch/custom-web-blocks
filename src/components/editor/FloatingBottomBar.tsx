import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Eye, Plus, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FloatingBottomBar() {
  const navigate = useNavigate();
  const { 
    pages, 
    currentPageId, 
    setCurrentPage, 
    setActiveSheet, 
    selectedBlockId, 
    selectedElementId,
    selectedHeaderFooter
  } = useEditorStore();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenProperties = () => {
    setActiveSheet("properties");
  };

  const handleOpenPageSettings = () => {
    setActiveSheet("page-settings");
  };

  const handleAddElement = () => {
    setActiveSheet("add-element");
  };

  // Determine what's selected and what to show
  const hasSelection = selectedBlockId || selectedElementId || selectedHeaderFooter;
  const showAddElement = selectedBlockId && !selectedElementId;

  return (
    <>
      {/* Toggle button - Always visible on the right side */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-primary-foreground p-3 rounded-l-xl shadow-lg hover:bg-primary/90 transition-all"
        aria-label={isExpanded ? "Fechar menu" : "Abrir menu"}
      >
        {isExpanded ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Sidebar menu */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-2xl z-40 transition-transform duration-300 ease-in-out",
          isExpanded ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
          {/* Back button - always visible */}
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate("/dashboard")}
            className="w-full justify-start gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Dashboard</span>
          </Button>

          {/* Page selector with add button - only show when nothing is selected */}
          {!hasSelection && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Página Atual</label>
                <div className="flex items-center gap-2">
                  <Select value={currentPageId || ""} onValueChange={setCurrentPage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione uma página" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const { addPage } = useEditorStore.getState();
                      addPage();
                    }}
                    title="Nova página"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleOpenPageSettings}
                  className="w-full justify-start gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Configurações da Página</span>
                </Button>

                <Button
                  size="default"
                  className="w-full justify-start gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar Site</span>
                </Button>
              </div>
            </>
          )}

          {/* Show add element and properties when block is selected */}
          {showAddElement && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Bloco Selecionado</p>
              <Button
                variant="default"
                size="default"
                onClick={handleAddElement}
                className="w-full justify-start gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Elemento</span>
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleOpenProperties}
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>Propriedades do Bloco</span>
              </Button>
            </div>
          )}

          {/* Show only properties when element, header, or footer is selected */}
          {(selectedElementId || selectedHeaderFooter) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {selectedHeaderFooter ? 
                  (selectedHeaderFooter === "header" ? "Header Selecionado" : "Rodapé Selecionado") : 
                  "Elemento Selecionado"}
              </p>
              <Button
                variant="outline"
                size="default"
                onClick={handleOpenProperties}
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>Propriedades</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
