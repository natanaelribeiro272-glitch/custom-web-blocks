import { useEditorStore } from "@/hooks/useEditorStore";
import { BlockRenderer } from "./BlockRenderer";
import { Smartphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobilePreview() {
  const { blocks, addBlock } = useEditorStore();

  return (
    <div className="flex-1 bg-editor-preview p-8 flex items-start justify-center overflow-auto">
      <div className="w-[390px] bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-800 relative min-h-[844px] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-3xl z-10" />
        
        {/* Screen Content */}
        <div className="absolute inset-0 overflow-auto mt-8 mb-2">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Comece do zero</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Adicione blocos para começar a construir seu site personalizado
              </p>
              <Button
                onClick={() => addBlock("full-width")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicione um bloco na barra lateral
              </Button>
            </div>
          ) : (
            <div className="space-y-0">
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
