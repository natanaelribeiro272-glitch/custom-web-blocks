import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Eye, Plus, ArrowLeft } from "lucide-react";
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
    <div
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        "bottom-2"
      )}
    >
      <div className="max-w-2xl mx-auto px-2">
        <div 
          className={cn(
            "bg-card border border-border rounded-xl shadow-xl overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[80vh]" : "max-h-14"
          )}
        >
          {/* Toggle bar - always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3 flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </button>

          {/* Expanded content */}
          {isExpanded && (
            <div className="max-h-[calc(80vh-3.5rem)] overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Back button - always visible */}
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => navigate("/dashboard")}
                  className="w-full justify-start gap-2 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar para Dashboard</span>
                </Button>

                {/* Page selector with add button - only show when nothing is selected */}
                {!hasSelection && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Página Atual</label>
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

                    <div className="border-t border-border pt-4 space-y-2">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={handleOpenPageSettings}
                        className="w-full justify-start gap-2 font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Configurações da Página</span>
                      </Button>

                      <Button
                        size="default"
                        className="w-full justify-start gap-2 font-medium"
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
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bloco Selecionado</p>
                    <Button
                      variant="default"
                      size="default"
                      onClick={handleAddElement}
                      className="w-full justify-start gap-2 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Elemento</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleOpenProperties}
                      className="w-full justify-start gap-2 font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Propriedades do Bloco</span>
                    </Button>
                  </div>
                )}

                {/* Show only properties when element, header, or footer is selected */}
                {(selectedElementId || selectedHeaderFooter) && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {selectedHeaderFooter ? 
                        (selectedHeaderFooter === "header" ? "Header Selecionado" : "Rodapé Selecionado") : 
                        "Elemento Selecionado"}
                    </p>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleOpenProperties}
                      className="w-full justify-start gap-2 font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Propriedades</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
