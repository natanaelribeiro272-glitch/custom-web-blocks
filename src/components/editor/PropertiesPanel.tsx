import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, ArrowUp, ArrowDown, X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function PropertiesPanel() {
  const {
    pages,
    currentPageId,
    selectedBlockId,
    selectedElementId,
    selectedHeaderFooter,
    updateBlock,
    removeBlock,
    updateElement,
    removeElement,
    moveBlock,
    updatePage,
    updatePageHeader,
    updatePageFooter,
  } = useEditorStore();

  const currentPage = pages.find((p) => p.id === currentPageId);
  const blocks = currentPage?.blocks || [];
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedElement = selectedBlock?.elements.find((e) => e.id === selectedElementId);

  // Page Properties
  if (!selectedBlockId && !selectedElementId && !selectedHeaderFooter && currentPage) {
    return (
      <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Propriedades da Página</h3>
          <p className="text-xs text-muted-foreground">Personalize sua página</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="page-name">Nome da Página</Label>
              <Input
                id="page-name"
                value={currentPage.name}
                onChange={(e) => updatePage(currentPage.id, { name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-bg">Cor de Fundo da Página</Label>
              <div className="flex gap-2">
                <Input
                  id="page-bg"
                  type="color"
                  className="w-16 h-10"
                  value={currentPage.backgroundColor}
                  onChange={(e) => updatePage(currentPage.id, { backgroundColor: e.target.value })}
                />
                <Input
                  value={currentPage.backgroundColor}
                  onChange={(e) => updatePage(currentPage.id, { backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Header/Footer Properties
  if (selectedHeaderFooter && currentPage) {
    const config = selectedHeaderFooter === "header" ? currentPage.header : currentPage.footer;
    const updateConfig =
      selectedHeaderFooter === "header" ? updatePageHeader : updatePageFooter;

    return (
      <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">
              {selectedHeaderFooter === "header" ? "Header" : "Footer"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Edite o {selectedHeaderFooter === "header" ? "cabeçalho" : "rodapé"}
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="text-sm font-medium capitalize">{config.template}</div>
            </div>

            <Separator />

            {selectedHeaderFooter === "header" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Nome da Marca</Label>
                  <Input
                    id="brand-name"
                    value={config.brandName || ""}
                    onChange={(e) =>
                      updateConfig(currentPage.id, { brandName: e.target.value })
                    }
                  />
                </div>

                {config.template === "with-logo" && (
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">URL do Logo</Label>
                    <Input
                      id="logo-url"
                      placeholder="https://"
                      value={config.logo || ""}
                      onChange={(e) => updateConfig(currentPage.id, { logo: e.target.value })}
                    />
                  </div>
                )}

                {config.template === "centered" && (
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline/Slogan</Label>
                    <Input
                      id="tagline"
                      placeholder="Seu slogan aqui"
                      value={config.tagline || ""}
                      onChange={(e) => updateConfig(currentPage.id, { tagline: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}

            {selectedHeaderFooter === "footer" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="copyright">Texto de Copyright</Label>
                  <Input
                    id="copyright"
                    value={config.copyright || ""}
                    onChange={(e) => updateConfig(currentPage.id, { copyright: e.target.value })}
                  />
                </div>

                {(config.template === "detailed" || config.template === "social") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="footer-brand">Nome da Marca</Label>
                      <Input
                        id="footer-brand"
                        value={config.brandName || ""}
                        onChange={(e) =>
                          updateConfig(currentPage.id, { brandName: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footer-tagline">Descrição</Label>
                      <Input
                        id="footer-tagline"
                        value={config.tagline || ""}
                        onChange={(e) =>
                          updateConfig(currentPage.id, { tagline: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}

                {(config.template === "social" || config.template === "detailed") && (
                  <div className="space-y-2">
                    <Label>Redes Sociais</Label>
                    {config.socialLinks?.map((social, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Plataforma"
                          value={social.platform}
                          onChange={(e) => {
                            const newLinks = [...(config.socialLinks || [])];
                            newLinks[index].platform = e.target.value;
                            updateConfig(currentPage.id, { socialLinks: newLinks });
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="URL"
                          value={social.url}
                          onChange={(e) => {
                            const newLinks = [...(config.socialLinks || [])];
                            newLinks[index].url = e.target.value;
                            updateConfig(currentPage.id, { socialLinks: newLinks });
                          }}
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const newLinks = config.socialLinks?.filter((_, i) => i !== index);
                            updateConfig(currentPage.id, { socialLinks: newLinks });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const newLinks = [
                          ...(config.socialLinks || []),
                          { platform: "Instagram", url: "#" },
                        ];
                        updateConfig(currentPage.id, { socialLinks: newLinks });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Rede Social
                    </Button>
                  </div>
                )}
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Links de Navegação</Label>
              {config.links?.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Texto"
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...(config.links || [])];
                      newLinks[index].text = e.target.value;
                      updateConfig(currentPage.id, { links: newLinks });
                    }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="URL"
                    value={link.href}
                    onChange={(e) => {
                      const newLinks = [...(config.links || [])];
                      newLinks[index].href = e.target.value;
                      updateConfig(currentPage.id, { links: newLinks });
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const newLinks = config.links?.filter((_, i) => i !== index);
                      updateConfig(currentPage.id, { links: newLinks });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newLinks = [...(config.links || []), { text: "Link", href: "#" }];
                  updateConfig(currentPage.id, { links: newLinks });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="bg-color">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  className="w-16 h-10"
                  value={config.backgroundColor}
                  onChange={(e) =>
                    updateConfig(currentPage.id, { backgroundColor: e.target.value })
                  }
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) =>
                    updateConfig(currentPage.id, { backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Cor do Texto</Label>
              <div className="flex gap-2">
                <Input
                  id="text-color"
                  type="color"
                  className="w-16 h-10"
                  value={config.textColor}
                  onChange={(e) => updateConfig(currentPage.id, { textColor: e.target.value })}
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => updateConfig(currentPage.id, { textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Element Properties
  if (selectedElement && selectedBlockId) {
    return (
      <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Propriedades do Elemento</h3>
            <p className="text-xs text-muted-foreground">Personalize seu elemento</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              removeElement(selectedBlockId, selectedElement.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="text-sm font-medium capitalize">{selectedElement.type}</div>
            </div>

            {(selectedElement.type === "title" ||
              selectedElement.type === "text" ||
              selectedElement.type === "button" ||
              selectedElement.type === "link") && (
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
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Block Properties
  if (selectedBlock) {
    return (
      <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Propriedades do Bloco</h3>
            <p className="text-xs text-muted-foreground">Personalize seu bloco</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              removeBlock(selectedBlock.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Bloco</Label>
              <div className="text-sm font-medium capitalize">
                {selectedBlock.type.replace("-", " ")}
              </div>
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
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Default state
  return (
    <div className="w-80 bg-editor-panel border-l border-border flex items-center justify-center p-8 text-center">
      <div className="text-sm text-muted-foreground">
        Selecione um bloco, elemento, header ou footer para editar suas propriedades
      </div>
    </div>
  );
}
