import { Block } from "@/types/editor";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { ElementRenderer } from "./ElementRenderer";
import { Plus } from "lucide-react";

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { selectedBlockId, selectBlock } = useEditorStore();
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
  };

  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {
      padding: `${block.style.padding}rem`,
      minHeight: `${block.style.minHeight}px`,
    };

    // Base background color
    if (block.style.backgroundColor) {
      style.backgroundColor = block.style.backgroundColor;
    }

    // Background image
    if (block.style.backgroundImage) {
      style.backgroundImage = `url(${block.style.backgroundImage})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    }

    // Gradient overlay
    if (block.style.backgroundGradient) {
      if (block.style.backgroundImage) {
        style.backgroundImage = `${block.style.backgroundGradient}, url(${block.style.backgroundImage})`;
      } else {
        style.backgroundImage = block.style.backgroundGradient;
      }
    }

    // Opacity
    if (block.style.backgroundOpacity !== undefined && block.style.backgroundOpacity !== 100) {
      style.opacity = block.style.backgroundOpacity / 100;
    }

    return style;
  };

  const getBackdropStyle = () => {
    if (block.style.backgroundBlur && block.style.backgroundBlur > 0) {
      return {
        backdropFilter: `blur(${block.style.backgroundBlur}px)`,
        WebkitBackdropFilter: `blur(${block.style.backgroundBlur}px)`,
      };
    }
    return {};
  };

  return (
    <div
      className={getBlockClasses()}
      style={{
        ...getBackgroundStyle(),
        ...getBackdropStyle(),
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
