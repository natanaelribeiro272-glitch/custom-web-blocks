import { Block } from "@/types/editor";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { ElementRenderer } from "./ElementRenderer";
import { Plus } from "lucide-react";

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { selectedBlockId, selectBlock, setActiveSheet } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const getBlockClasses = () => {
    const base = "relative transition-all cursor-pointer";
    const selected = isSelected ? "ring-2 ring-selected ring-offset-2" : "hover:ring-2 hover:ring-primary/30";
    
    switch (block.type) {
      case "centered":
        return cn(base, selected, "flex flex-col items-center justify-center text-center px-4");
      case "split":
        return cn(base, selected, "grid grid-cols-2 gap-4 px-4");
      case "grid":
        return cn(base, selected, "grid grid-cols-2 gap-3 px-4");
      default: // full-width
        return cn(base, selected, "px-4");
    }
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
    setActiveSheet("properties");
  };

  return (
    <div
      className={getBlockClasses()}
      style={{
        backgroundColor: block.style.backgroundColor,
        padding: `${block.style.padding}rem`,
        minHeight: `${block.style.minHeight}px`,
      }}
      onClick={handleBlockClick}
    >
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-selected text-primary-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
            Bloco Selecionado
          </span>
        </div>
      )}
      
      {block.elements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Bloco vazio - Adicione elementos
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {block.elements.map((element) => (
            <ElementRenderer key={element.id} element={element} blockId={block.id} />
          ))}
        </div>
      )}
    </div>
  );
}
