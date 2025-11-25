import { useEditorStore } from "@/hooks/useEditorStore";
import { BlockRenderer } from "./BlockRenderer";
import { HeaderFooterRenderer } from "./HeaderFooterRenderer";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobilePreview() {
  const { pages, currentPageId, setActiveSheet, setInsertBlockIndex, selectBlock, selectElement, selectHeaderFooter } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);
  const blocks = currentPage?.blocks || [];

  const handleAddBlockAt = (index: number) => {
    setInsertBlockIndex(index);
    setActiveSheet("add-block");
  };

  const handleBackgroundClick = () => {
    // Deselect everything when clicking on the background
    selectBlock(null);
    selectElement(null);
    selectHeaderFooter(null);
  };

  return (
    <div className="flex-1 overflow-auto pb-20">
      <div 
        className="min-h-screen w-full relative p-4"
        style={{ backgroundColor: currentPage?.backgroundColor || "#ffffff" }}
        onClick={handleBackgroundClick}
      >
        {/* Header */}
        <div onClick={(e) => e.stopPropagation()}>
          {currentPage && <HeaderFooterRenderer config={currentPage.header} type="header" pageId={currentPage.id} />}
        </div>
        
        {blocks.length === 0 ? (
          <div 
            className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center mb-6">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Comece seu site</h3>
            <p className="text-sm text-muted-foreground mb-6 font-light">
              Toque no botão abaixo para adicionar seu primeiro bloco
            </p>
            <Button
              onClick={() => handleAddBlockAt(0)}
              size="lg"
              className="gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Adicionar primeiro bloco
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {blocks.map((block, index) => (
              <div key={block.id}>
                <div onClick={(e) => e.stopPropagation()}>
                  <BlockRenderer block={block} />
                </div>
                {/* Clickable area between blocks */}
                {index < blocks.length - 1 && (
                  <div className="h-6" onClick={handleBackgroundClick} />
                )}
              </div>
            ))}
            
            <div 
              className="flex items-center justify-center py-8 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => handleAddBlockAt(blocks.length)}
                variant="outline"
                size="sm"
                className="gap-2 border-dashed font-medium"
              >
                <Plus className="h-4 w-4" />
                Adicionar bloco
              </Button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div onClick={(e) => e.stopPropagation()}>
          {currentPage && <HeaderFooterRenderer config={currentPage.footer} type="footer" pageId={currentPage.id} />}
        </div>
        
        {/* Extra padding at bottom for easy deselection */}
        <div className="h-32" onClick={handleBackgroundClick} />
      </div>
    </div>
  );
}
