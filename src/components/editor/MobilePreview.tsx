import { useEditorStore } from "@/hooks/useEditorStore";
import { BlockRenderer } from "./BlockRenderer";
import { HeaderFooterRenderer } from "./HeaderFooterRenderer";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobilePreview() {
  const { pages, currentPageId, setActiveSheet, setInsertBlockIndex } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);
  const blocks = currentPage?.blocks || [];

  const handleAddBlockAt = (index: number) => {
    setInsertBlockIndex(index);
    setActiveSheet("add-block");
  };

  return (
    <div className="flex-1 overflow-auto pb-20">
      <div 
        className="min-h-screen w-full relative"
        style={{ backgroundColor: currentPage?.backgroundColor || "#ffffff" }}
      >
        {/* Header */}
        {currentPage && <HeaderFooterRenderer config={currentPage.header} type="header" pageId={currentPage.id} />}
        
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Comece seu site</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Toque no botão abaixo para adicionar seu primeiro bloco
            </p>
            <Button
              onClick={() => handleAddBlockAt(0)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Adicionar primeiro bloco
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            {blocks.map((block, index) => (
              <div key={block.id}>
                <BlockRenderer block={block} />
                
                {/* Add block button between blocks */}
                <div className="flex items-center justify-center py-4 px-4">
                  <Button
                    onClick={() => handleAddBlockAt(index + 1)}
                    variant="outline"
                    size="sm"
                    className="gap-2 shadow-md border-2 hover:border-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar bloco
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer */}
        {currentPage && <HeaderFooterRenderer config={currentPage.footer} type="footer" pageId={currentPage.id} />}
      </div>
    </div>
  );
}
