import { useEditorStore } from "@/hooks/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertiesPanel } from "./PropertiesPanel";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="bg-card border-t border-x border-border shadow-2xl rounded-t-3xl max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
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
          
          {/* Content - Compact scrollable area */}
          <ScrollArea className="max-h-[65vh]">
            <div className="px-4 py-3 pb-6">
              <PropertiesPanel />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
