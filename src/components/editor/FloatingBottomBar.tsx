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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PropertiesPanel } from "./PropertiesPanel";

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

  // Auto expand when something is selected, keep collapsed when nothing is selected
  useEffect(() => {
    if (selectedBlockId || selectedElementId || selectedHeaderFooter) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [selectedBlockId, selectedElementId, selectedHeaderFooter]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside the bottom bar
      if (!target.closest('[data-bottom-bar]')) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

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
      data-bottom-bar
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
                {/* Show default options when nothing is selected */}
                {!hasSelection && (
                  <>
                    {/* Back button */}
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => navigate("/dashboard")}
                      className="w-full justify-start gap-2 font-medium"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar para Dashboard</span>
                    </Button>

                    {/* Page selector with add button */}
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

                {/* Show properties when block is selected */}
                {showAddElement && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bloco Selecionado</p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAddElement}
                        className="gap-2 font-medium"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Adicionar Elemento</span>
                      </Button>
                    </div>
                    <div className="border-t border-border pt-4">
                      <PropertiesPanel />
                    </div>
                  </div>
                )}

                {/* Show properties when element, header, or footer is selected */}
                {(selectedElementId || selectedHeaderFooter) && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {selectedHeaderFooter ? 
                        (selectedHeaderFooter === "header" ? "Header Selecionado" : "Rodapé Selecionado") : 
                        "Elemento Selecionado"}
                    </p>
                    <div className="border-t border-border pt-4">
                      <PropertiesPanel />
                    </div>
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
