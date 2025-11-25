import { useEditorStore } from "@/hooks/useEditorStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertiesPanel } from "./PropertiesPanel";

interface PropertiesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertiesSheet({ open, onOpenChange }: PropertiesSheetProps) {
  const { selectedBlockId, selectedElementId, selectedHeaderFooter } = useEditorStore();

  if (!open) return null;

  const getTitle = () => {
    if (selectedHeaderFooter) {
      return selectedHeaderFooter === "header" ? "Header" : "Rodapé";
    }
    if (selectedElementId) return "Elemento";
    if (selectedBlockId) return "Bloco";
    return "Propriedades";
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="bg-card border-t border-border max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[75vh] rounded-t-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <h3 className="font-semibold text-sm">{getTitle()}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content - Scrollable area */}
          <div className="overflow-y-auto flex-1">
            <div className="px-4 py-3 pb-6">
              <PropertiesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
