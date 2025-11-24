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
    addBlockAt(type, insertBlockIndex);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-center">Adicionar Bloco</SheetTitle>
        </SheetHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {blockTypes.map((block) => (
            <Button
              key={block.type}
              variant="outline"
              className="h-auto flex flex-col items-center gap-3 p-6 hover:border-primary hover:bg-primary/5"
              onClick={() => handleAddBlock(block.type)}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <block.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">{block.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{block.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
