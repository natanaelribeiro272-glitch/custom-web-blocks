import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PropertiesPanel() {
  const { blocks, selectedBlockId, selectedElementId, updateBlock, removeBlock, updateElement, removeElement, moveBlock } = useEditorStore();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedElement = selectedBlock?.elements.find((e) => e.id === selectedElementId);

  if (!selectedBlockId && !selectedElementId) {
    return (
      <div className="w-80 bg-editor-panel border-l border-border flex items-center justify-center p-8 text-center">
        <div className="text-sm text-muted-foreground">
          Selecione um bloco ou elemento para editar suas propriedades
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold">
            {selectedElement ? "Propriedades do Elemento" : "Propriedades do Bloco"}
          </h3>
          <p className="text-xs text-muted-foreground">Personalize seu {selectedElement ? "elemento" : "bloco"}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (selectedElement && selectedBlockId) {
              removeElement(selectedBlockId, selectedElement.id);
            }
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {selectedElement && selectedBlockId ? (
            // Element Properties
            <>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="text-sm font-medium capitalize">{selectedElement.type}</div>
              </div>

              {(selectedElement.type === "title" || selectedElement.type === "text" || selectedElement.type === "button" || selectedElement.type === "link") && (
                <div className="space-y-2">
                  <Label htmlFor="element-text">Texto</Label>
                  <Input
                    id="element-text"
                    value={selectedElement.content.text || ""}
                    onChange={(e) =>
                      updateElement(selectedBlockId, selectedElement.id, {
                        content: { ...selectedElement.content, text: e.target.value },
                      })
                    }
                  />
                </div>
              )}

              {(selectedElement.type === "button" || selectedElement.type === "link") && (
                <div className="space-y-2">
                  <Label htmlFor="element-href">Link (URL)</Label>
                  <Input
                    id="element-href"
                    placeholder="https://"
                    value={selectedElement.content.href || ""}
                    onChange={(e) =>
                      updateElement(selectedBlockId, selectedElement.id, {
                        content: { ...selectedElement.content, href: e.target.value },
                      })
                    }
                  />
                </div>
              )}

              {selectedElement.type === "image" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="element-url">URL da Imagem</Label>
                    <Input
                      id="element-url"
                      placeholder="https://"
                      value={selectedElement.content.url || ""}
                      onChange={(e) =>
                        updateElement(selectedBlockId, selectedElement.id, {
                          content: { ...selectedElement.content, url: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="element-alt">Texto Alternativo</Label>
                    <Input
                      id="element-alt"
                      value={selectedElement.content.alt || ""}
                      onChange={(e) =>
                        updateElement(selectedBlockId, selectedElement.id, {
                          content: { ...selectedElement.content, alt: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => removeElement(selectedBlockId, selectedElement.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Elemento
              </Button>
            </>
          ) : selectedBlock ? (
            // Block Properties
            <>
              <div className="space-y-2">
                <Label>Tipo de Bloco</Label>
                <div className="text-sm font-medium capitalize">{selectedBlock.type.replace("-", " ")}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-color">Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    className="w-16 h-10"
                    value={selectedBlock.style.backgroundColor}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, {
                        style: { ...selectedBlock.style, backgroundColor: e.target.value },
                      })
                    }
                  />
                  <Input
                    value={selectedBlock.style.backgroundColor}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, {
                        style: { ...selectedBlock.style, backgroundColor: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Espaçamento Interno: {selectedBlock.style.padding}rem</Label>
                <Slider
                  value={[selectedBlock.style.padding || 2]}
                  onValueChange={([value]) =>
                    updateBlock(selectedBlock.id, {
                      style: { ...selectedBlock.style, padding: value },
                    })
                  }
                  min={0}
                  max={6}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label>Altura Mínima: {selectedBlock.style.minHeight}px</Label>
                <Slider
                  value={[selectedBlock.style.minHeight || 120]}
                  onValueChange={([value]) =>
                    updateBlock(selectedBlock.id, {
                      style: { ...selectedBlock.style, minHeight: value },
                    })
                  }
                  min={80}
                  max={500}
                  step={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Ordem do Bloco</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => moveBlock(selectedBlock.id, "up")}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Mover para Cima
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => moveBlock(selectedBlock.id, "down")}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Mover para Baixo
                  </Button>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => removeBlock(selectedBlock.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Bloco
              </Button>
            </>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
