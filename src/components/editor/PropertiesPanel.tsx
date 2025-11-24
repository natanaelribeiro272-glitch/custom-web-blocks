import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, ArrowUp, ArrowDown, X, Plus, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HeaderTemplate, FooterTemplate } from "@/types/editor";
import { TemplatePreview } from "./TemplatePreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const headerTemplates: { value: HeaderTemplate; label: string; description: string }[] = [
  { value: "none", label: "Nenhum", description: "Sem header" },
  { value: "simple", label: "Simples", description: "Logo e menu horizontal" },
  { value: "centered", label: "Centralizado", description: "Logo e menu centralizados" },
  { value: "with-logo", label: "Com Logo", description: "Logo + marca + menu" },
];

const footerTemplates: { value: FooterTemplate; label: string; description: string }[] = [
  { value: "none", label: "Nenhum", description: "Sem footer" },
  { value: "simple", label: "Simples", description: "Apenas copyright" },
  { value: "social", label: "Com Redes Sociais", description: "Links sociais + copyright" },
  { value: "detailed", label: "Detalhado", description: "Múltiplas colunas" },
];

export function PropertiesPanel() {
  const {
    pages,
    currentPageId,
    selectedBlockId,
    selectedElementId,
    selectedHeaderFooter,
    showingPageConfig,
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

  // Page Configuration
  if (showingPageConfig && currentPage) {
    return (
      <div className="w-80 bg-editor-panel border-l border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Configurações da Página</h3>
          <p className="text-xs text-muted-foreground">Personalize sua página</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Nome da Página */}
            <div className="space-y-2">
              <Label htmlFor="page-name">Nome da Página</Label>
              <Input
                id="page-name"
                value={currentPage.name}
                onChange={(e) => updatePage(currentPage.id, { name: e.target.value })}
                placeholder="Ex: Home, Sobre, Contato"
              />
            </div>

            {/* Cor de Fundo */}
            <div className="space-y-2">
              <Label htmlFor="page-bg">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="page-bg"
                  type="color"
                  className="w-20 h-10 cursor-pointer"
                  value={currentPage.backgroundColor}
                  onChange={(e) =>
                    updatePage(currentPage.id, { backgroundColor: e.target.value })
                  }
                />
                <Input
                  value={currentPage.backgroundColor}
                  onChange={(e) =>
                    updatePage(currentPage.id, { backgroundColor: e.target.value })
                  }
                  className="flex-1 font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <Separator />

            {/* Template de Header */}
            <div className="space-y-3">
              <Label>Template de Header</Label>
              <RadioGroup
                value={currentPage.header.template}
                onValueChange={(value) => {
                  updatePageHeader(currentPage.id, { template: value as HeaderTemplate });
                }}
                className="space-y-3"
              >
                {headerTemplates.map((template) => (
                  <div key={template.value} className="relative">
                    <RadioGroupItem
                      value={template.value}
                      id={`header-${template.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`header-${template.value}`}
                      className="flex flex-col p-3 rounded-lg border-2 border-muted cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm">{template.label}</span>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        {currentPage.header.template === template.value && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <TemplatePreview type="header" template={template.value} />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {currentPage.header.template !== "none" && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  💡 Clique no header no preview para editar detalhes
                </p>
              )}
            </div>

            <Separator />

            {/* Template de Rodapé */}
            <div className="space-y-3">
              <Label>Template de Rodapé</Label>
              <RadioGroup
                value={currentPage.footer.template}
                onValueChange={(value) => {
                  updatePageFooter(currentPage.id, { template: value as FooterTemplate });
                }}
                className="space-y-3"
              >
                {footerTemplates.map((template) => (
                  <div key={template.value} className="relative">
                    <RadioGroupItem
                      value={template.value}
                      id={`footer-${template.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`footer-${template.value}`}
                      className="flex flex-col p-3 rounded-lg border-2 border-muted cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm">{template.label}</span>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        {currentPage.footer.template === template.value && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <TemplatePreview type="footer" template={template.value} />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {currentPage.footer.template !== "none" && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  💡 Clique no footer no preview para editar detalhes
                </p>
              )}
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
                  <div className="space-y-3">
                    <Label>Redes Sociais</Label>
                    {config.socialLinks?.map((social, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Select
                          value={social.platform.toLowerCase()}
                          onValueChange={(value) => {
                            const newLinks = [...(config.socialLinks || [])];
                            newLinks[index].platform = value;
                            updateConfig(currentPage.id, { socialLinks: newLinks });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="site">Site</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="https://"
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
                          { platform: "Instagram", url: "https://" },
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

  // Default state - no selection
  return (
    <div className="w-80 bg-editor-panel border-l border-border flex items-center justify-center p-8 text-center">
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Selecione um elemento para editar:
        </div>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Clique em um bloco no preview</li>
          <li>• Clique no header ou footer</li>
          <li>• Clique em um elemento dentro de um bloco</li>
        </ul>
        <div className="pt-4 border-t text-xs">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Para editar a página</span>
          </div>
          <p className="text-muted-foreground mt-1">
            Clique no ícone de configuração ao lado do seletor de páginas
          </p>
        </div>
      </div>
    </div>
  );
}
