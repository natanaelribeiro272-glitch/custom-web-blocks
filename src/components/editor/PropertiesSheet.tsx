import { useEditorStore } from "@/hooks/useEditorStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertiesPanel } from "./PropertiesPanel";

interface PropertiesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertiesSheet({ open, onOpenChange }: PropertiesSheetProps) {
  const { selectedBlockId, selectedElementId } = useEditorStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>
            {selectedElementId ? "Propriedades do Elemento" : selectedBlockId ? "Propriedades do Bloco" : "Propriedades"}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(80vh-80px)]">
          <div className="px-6 py-4">
            <PropertiesPanel />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
