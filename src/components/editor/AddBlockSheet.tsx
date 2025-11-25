import { useEditorStore } from "@/hooks/useEditorStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutGrid, AlignCenter, Columns2, Grid2X2 } from "lucide-react";

const blockTypes = [
  { type: "full-width" as const, icon: LayoutGrid, label: "Largura Total", description: "Ocupa toda a largura" },
  { type: "centered" as const, icon: AlignCenter, label: "Centralizado", description: "Conteúdo centralizado" },
  { type: "split" as const, icon: Columns2, label: "Dividido", description: "Duas colunas" },
  { type: "grid" as const, icon: Grid2X2, label: "Grade", description: "Layout em grade" },
];

interface AddBlockSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBlockSheet({ open, onOpenChange }: AddBlockSheetProps) {
  const { addBlockAt, insertBlockIndex } = useEditorStore();

  const handleAddBlock = (type: typeof blockTypes[0]["type"]) => {
    // addBlockAt já fecha o sheet internamente
    addBlockAt(type, insertBlockIndex);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center font-semibold">Adicionar Bloco</SheetTitle>
        </SheetHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          {blockTypes.map((block) => (
            <Button
              key={block.type}
              variant="outline"
              className="h-auto flex flex-col items-center gap-3 p-5 hover:border-primary hover:bg-card font-normal"
              onClick={() => handleAddBlock(block.type)}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <block.icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{block.label}</div>
                <div className="text-xs text-muted-foreground mt-1 font-light">{block.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
