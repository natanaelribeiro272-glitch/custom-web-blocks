import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash2, ArrowUp, ArrowDown, X, Plus, Settings, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  
  // Find selected element across all blocks if not found in selected block
  let selectedElement = selectedBlock?.elements.find((e) => e.id === selectedElementId);
  let elementBlockId = selectedBlockId;
  
  if (!selectedElement && selectedElementId) {
    // Search in all blocks for the selected element
    for (const block of blocks) {
      const element = block.elements.find((e) => e.id === selectedElementId);
      if (element) {
        selectedElement = element;
        elementBlockId = block.id;
        break;
      }
    }
  }

  // Page Configuration
  if (showingPageConfig && currentPage) {
    return (
      <div className="space-y-4">
        {/* Nome da Página */}
        <div className="space-y-1.5">
          <Label htmlFor="page-name" className="text-xs">Nome da Página</Label>
          <Input
            id="page-name"
            value={currentPage.name}
            onChange={(e) => updatePage(currentPage.id, { name: e.target.value })}
            placeholder="Ex: Home, Sobre, Contato"
            className="h-8 text-sm"
          />
        </div>

        {/* Cor de Fundo */}
        <div className="space-y-1.5">
          <Label htmlFor="page-bg" className="text-xs">Cor de Fundo</Label>
          <div className="flex gap-2">
            <Input
              id="page-bg"
              type="color"
              className="w-16 h-8 cursor-pointer p-1"
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
              className="flex-1 font-mono h-8 text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <Separator />

        {/* Template de Header */}
        <div className="space-y-2">
          <Label className="text-xs">Template de Header</Label>
          <RadioGroup
            value={currentPage.header.template}
            onValueChange={(value) => {
              updatePageHeader(currentPage.id, { template: value as HeaderTemplate });
            }}
            className="space-y-2"
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
                  className="flex flex-col p-2 rounded-lg border border-muted cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-medium text-xs">{template.label}</span>
                      <p className="text-[10px] text-muted-foreground">{template.description}</p>
                    </div>
                    {currentPage.header.template === template.value && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <TemplatePreview type="header" template={template.value} />
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {currentPage.header.template !== "none" && (
            <p className="text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded">
              💡 Clique no header no preview para editar
            </p>
          )}
        </div>

        <Separator />

        {/* Template de Footer */}
        <div className="space-y-2">
          <Label className="text-xs">Template de Rodapé</Label>
          <RadioGroup
            value={currentPage.footer.template}
            onValueChange={(value) => {
              updatePageFooter(currentPage.id, { template: value as FooterTemplate });
            }}
            className="space-y-2"
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
                  className="flex flex-col p-2 rounded-lg border border-muted cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-medium text-xs">{template.label}</span>
                      <p className="text-[10px] text-muted-foreground">{template.description}</p>
                    </div>
                    {currentPage.footer.template === template.value && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <TemplatePreview type="footer" template={template.value} />
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {currentPage.footer.template !== "none" && (
            <p className="text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded">
              💡 Clique no rodapé no preview para editar
            </p>
          )}
        </div>
      </div>
    );
  }

  // Header/Footer Properties
  if (selectedHeaderFooter && currentPage) {
    const config = selectedHeaderFooter === "header" ? currentPage.header : currentPage.footer;
    const updateConfig =
      selectedHeaderFooter === "header" ? updatePageHeader : updatePageFooter;

    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Template</Label>
          <div className="text-sm font-medium capitalize">{config.template}</div>
        </div>

        <Separator />

        {selectedHeaderFooter === "header" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="brand-name" className="text-xs">Nome da Marca</Label>
              <Input
                id="brand-name"
                value={config.brandName || ""}
                onChange={(e) =>
                  updateConfig(currentPage.id, { brandName: e.target.value })
                }
                className="h-8 text-sm"
              />
            </div>

            {config.template === "with-logo" && (
              <div className="space-y-1.5">
                <Label htmlFor="logo-url" className="text-xs">URL do Logo</Label>
                <Input
                  id="logo-url"
                  placeholder="https://"
                  value={config.logo || ""}
                  onChange={(e) => updateConfig(currentPage.id, { logo: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            )}

            {config.template === "centered" && (
              <div className="space-y-1.5">
                <Label htmlFor="tagline" className="text-xs">Tagline/Slogan</Label>
                <Input
                  id="tagline"
                  placeholder="Seu slogan aqui"
                  value={config.tagline || ""}
                  onChange={(e) => updateConfig(currentPage.id, { tagline: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs">Estilo do Menu</Label>
              <RadioGroup
                value={config.menuStyle || "always-visible"}
                onValueChange={(value) =>
                  updateConfig(currentPage.id, { menuStyle: value as "always-visible" | "hamburger" })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always-visible" id="menu-visible" />
                  <Label htmlFor="menu-visible" className="text-sm font-normal cursor-pointer">
                    Sempre Visível
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hamburger" id="menu-hamburger" />
                  <Label htmlFor="menu-hamburger" className="text-sm font-normal cursor-pointer">
                    Menu Hambúrguer (ícone)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {config.menuStyle === "hamburger" 
                  ? "Menu fica oculto e aparece ao clicar no ícone" 
                  : "Links do menu sempre visíveis"}
              </p>
            </div>
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
                  className="w-16 h-8 p-1"
                  value={config.textColor}
                  onChange={(e) => updateConfig(currentPage.id, { textColor: e.target.value })}
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => updateConfig(currentPage.id, { textColor: e.target.value })}
                  className="flex-1 h-8 text-sm"
                />
              </div>
            </div>
          </div>
        );
      }

  // Element Properties
  if (selectedElement && elementBlockId) {
    const elementStyle = selectedElement.content.style || {};
    const blockId = elementBlockId; // Use this instead of selectedBlockId for all updates
    
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo</Label>
          <div className="text-sm font-medium capitalize">{selectedElement.type}</div>
        </div>

        {/* CONTEÚDO */}
        {(selectedElement.type === "title" ||
          selectedElement.type === "text" ||
          selectedElement.type === "button" ||
          selectedElement.type === "link") && (
          <div className="space-y-1.5">
            <Label htmlFor="element-text" className="text-xs">Texto</Label>
            <Input
              id="element-text"
              value={selectedElement.content.text || ""}
              onChange={(e) =>
                updateElement(blockId, selectedElement.id, {
                  content: { ...selectedElement.content, text: e.target.value },
                })
              }
              className="h-8 text-sm"
            />
          </div>
        )}

        {(selectedElement.type === "button" || selectedElement.type === "link") && (
          <div className="space-y-1.5">
            <Label htmlFor="element-href" className="text-xs">Link (URL)</Label>
            <Input
              id="element-href"
              placeholder="https://"
              value={selectedElement.content.href || ""}
              onChange={(e) =>
                updateElement(blockId, selectedElement.id, {
                  content: { ...selectedElement.content, href: e.target.value },
                })
              }
              className="h-8 text-sm"
            />
          </div>
        )}

        {selectedElement.type === "image" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="element-url" className="text-xs">URL da Imagem</Label>
              <Input
                id="element-url"
                placeholder="https://"
                value={selectedElement.content.url || ""}
                onChange={(e) =>
                  updateElement(blockId, selectedElement.id, {
                    content: { ...selectedElement.content, url: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image-upload" className="text-xs">Ou fazer upload</Label>
              <div className="flex gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="h-8 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, url: dataUrl },
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="element-alt" className="text-xs">Texto Alternativo</Label>
              <Input
                id="element-alt"
                value={selectedElement.content.alt || ""}
                onChange={(e) =>
                  updateElement(blockId, selectedElement.id, {
                    content: { ...selectedElement.content, alt: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {selectedElement.type === "video" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="video-url" className="text-xs">URL do Vídeo (YouTube/Vimeo)</Label>
              <Input
                id="video-url"
                placeholder="https://www.youtube.com/embed/..."
                value={selectedElement.content.url || ""}
                onChange={(e) =>
                  updateElement(blockId, selectedElement.id, {
                    content: { ...selectedElement.content, url: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="video-upload" className="text-xs">Ou fazer upload</Label>
              <div className="flex gap-2">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="h-8 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, url: dataUrl },
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Para vídeos grandes, use YouTube ou Vimeo
              </p>
            </div>
          </>
        )}

            {/* Countdown Properties */}
            {selectedElement.type === "countdown" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="countdown-label">Texto do Contador</Label>
                  <Input
                    id="countdown-label"
                    value={selectedElement.content.countdownLabel || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, countdownLabel: e.target.value },
                      })
                    }
                    placeholder="Ex: Faltam, Termina em"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-date">Data Final</Label>
                  <Input
                    id="target-date"
                    type="datetime-local"
                    value={
                      selectedElement.content.targetDate
                        ? new Date(selectedElement.content.targetDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, targetDate: new Date(e.target.value).toISOString() },
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* Product Properties */}
            {selectedElement.type === "product" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="product-image">URL da Imagem</Label>
                  <Input
                    id="product-image"
                    placeholder="https://"
                    value={selectedElement.content.productImage || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, productImage: e.target.value },
                      })
                    }
                  />
                  <div className="space-y-1.5">
                    <Label htmlFor="product-image-upload" className="text-xs">Ou fazer upload</Label>
                    <Input
                      id="product-image-upload"
                      type="file"
                      accept="image/*"
                      className="h-8 text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            updateElement(blockId, selectedElement.id, {
                              content: { ...selectedElement.content, productImage: dataUrl },
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-name">Nome do Produto</Label>
                  <Input
                    id="product-name"
                    value={selectedElement.content.productName || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, productName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Descrição</Label>
                  <Textarea
                    id="product-description"
                    value={selectedElement.content.productDescription || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, productDescription: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Preço</Label>
                    <Input
                      id="product-price"
                      placeholder="R$ 49,90"
                      value={selectedElement.content.productPrice || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, productPrice: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-original-price">Preço Original</Label>
                    <Input
                      id="product-original-price"
                      placeholder="R$ 59,90"
                      value={selectedElement.content.productOriginalPrice || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, productOriginalPrice: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-button-text">Texto do Botão</Label>
                  <Input
                    id="product-button-text"
                    value={selectedElement.content.productButtonText || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, productButtonText: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-button-link">Link do Botão</Label>
                  <Input
                    id="product-button-link"
                    placeholder="https://"
                    value={selectedElement.content.productButtonLink || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, productButtonLink: e.target.value },
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* List Properties */}
            {selectedElement.type === "list" && (
              <>
                <div className="space-y-2">
                  <Label>Estilo da Lista</Label>
                  <Select
                    value={selectedElement.content.listStyle || "bullet"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, listStyle: value as any },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bullet">Marcadores (•)</SelectItem>
                      <SelectItem value="numbered">Numerada (1, 2, 3)</SelectItem>
                      <SelectItem value="checklist">Checklist (✓)</SelectItem>
                      <SelectItem value="icon">Ícones (⚫)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Itens da Lista</Label>
                  {selectedElement.content.listItems?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(selectedElement.content.listItems || [])];
                          newItems[index] = e.target.value;
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, listItems: newItems },
                          });
                        }}
                        placeholder={`Item ${index + 1}`}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const newItems = selectedElement.content.listItems?.filter((_, i) => i !== index);
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, listItems: newItems },
                          });
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
                      const newItems = [...(selectedElement.content.listItems || []), "Novo item"];
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, listItems: newItems },
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              </>
            )}

            {/* Carousel Properties */}
            {selectedElement.type === "carousel" && (
              <>
                <div className="space-y-2">
                  <Label>Imagens do Carrossel</Label>
                  {selectedElement.content.carouselImages?.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(e) => {
                            const newImages = [...(selectedElement.content.carouselImages || [])];
                            newImages[index] = e.target.value;
                            updateElement(blockId, selectedElement.id, {
                              content: { ...selectedElement.content, carouselImages: newImages },
                            });
                          }}
                          placeholder="https://"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const newImages = selectedElement.content.carouselImages?.filter((_, i) => i !== index);
                            updateElement(blockId, selectedElement.id, {
                              content: { ...selectedElement.content, carouselImages: newImages },
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="h-8 text-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              const newImages = [...(selectedElement.content.carouselImages || [])];
                              newImages[index] = dataUrl;
                              updateElement(blockId, selectedElement.id, {
                                content: { ...selectedElement.content, carouselImages: newImages },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const newImages = [...(selectedElement.content.carouselImages || []), ""];
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, carouselImages: newImages },
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="carousel-autoplay">Reprodução Automática</Label>
                    <Switch
                      id="carousel-autoplay"
                      checked={selectedElement.content.carouselAutoplay || false}
                      onCheckedChange={(checked) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, carouselAutoplay: checked },
                        })
                      }
                    />
                  </div>
                </div>
                {selectedElement.content.carouselAutoplay && (
                  <div className="space-y-2">
                    <Label htmlFor="carousel-interval">Intervalo (ms)</Label>
                    <Input
                      id="carousel-interval"
                      type="number"
                      value={selectedElement.content.carouselInterval || 3000}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, carouselInterval: parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* ESTILOS - Separador */}
            <Separator />
            <Label className="text-xs font-semibold">Estilos</Label>

            {/* Estilos para Título e Texto */}
            {(selectedElement.type === "title" || selectedElement.type === "text") && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size" className="text-xs">Tamanho</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        id="font-size"
                        type="number"
                        min="8"
                        max="120"
                        step="1"
                        value={parseInt(elementStyle.fontSize || "16") || 16}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.fontSize || "16") || 16]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${value}px` } },
                      })
                    }
                    min={8}
                    max={120}
                    step={1}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="font-weight" className="text-xs">Peso</Label>
                  <Select
                    value={elementStyle.fontWeight || "normal"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontWeight: value } },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Negrito</SelectItem>
                      <SelectItem value="lighter">Fino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="font-family" className="text-xs">Tipografia</Label>
                  <Select
                    value={elementStyle.fontFamily || "inherit"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontFamily: value === "inherit" ? undefined : value } },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Padrão</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                      <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                      <SelectItem value="'Comic Sans MS', cursive">Comic Sans MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="text-color" className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      className="w-12 h-8 p-1 cursor-pointer"
                      value={elementStyle.color || "#000000"}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                    />
                    <Input
                      value={elementStyle.color || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                      className="flex-1 h-8 text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="text-align" className="text-xs">Alinhamento de Texto</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={elementStyle.textAlign === "left" || !elementStyle.textAlign ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, textAlign: "left" } },
                        })
                      }
                    >
                      <span className="text-xs">Esquerda</span>
                    </Button>
                    <Button
                      variant={elementStyle.textAlign === "center" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, textAlign: "center" } },
                        })
                      }
                    >
                      <span className="text-xs">Centro</span>
                    </Button>
                    <Button
                      variant={elementStyle.textAlign === "right" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, textAlign: "right" } },
                        })
                      }
                    >
                      <span className="text-xs">Direita</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Estilos para Botão */}
            {selectedElement.type === "button" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Alinhamento do Elemento</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={!elementStyle.marginLeft && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: undefined, marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Esquerda</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && elementStyle.marginRight === "auto" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Centro</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: undefined } },
                        })
                      }
                    >
                      <span className="text-xs">Direita</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="btn-font-family" className="text-xs">Tipografia</Label>
                  <Select
                    value={elementStyle.fontFamily || "inherit"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontFamily: value === "inherit" ? undefined : value } },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Padrão</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                      <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                      <SelectItem value="'Comic Sans MS', cursive">Comic Sans MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="btn-bg-color" className="text-xs">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="btn-bg-color"
                      type="color"
                      className="w-12 h-8 p-1 cursor-pointer"
                      value={elementStyle.backgroundColor || "#000000"}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, backgroundColor: e.target.value } },
                        })
                      }
                    />
                    <Input
                      value={elementStyle.backgroundColor || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, backgroundColor: e.target.value } },
                        })
                      }
                      className="flex-1 h-8 text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="btn-text-color" className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="btn-text-color"
                      type="color"
                      className="w-12 h-8 p-1 cursor-pointer"
                      value={elementStyle.color || "#ffffff"}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                    />
                    <Input
                      value={elementStyle.color || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                      className="flex-1 h-8 text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs">Largura</Label>
                  <Input
                    placeholder="auto, 100%, 200px"
                    value={elementStyle.width || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="50"
                        max="500"
                        step="10"
                        value={parseInt(elementStyle.width) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, width: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.width) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: `${value}px` } },
                      })
                    }
                    min={50}
                    max={500}
                    step={10}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Altura</Label>
                  <Input
                    placeholder="auto, 40px"
                    value={elementStyle.height || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="20"
                        max="200"
                        step="5"
                        value={parseInt(elementStyle.height) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, height: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.height) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: `${value}px` } },
                      })
                    }
                    min={20}
                    max={200}
                    step={5}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Raio da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={parseInt(elementStyle.borderRadius || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderRadius || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${value}px` } },
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Espessura da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={parseInt(elementStyle.borderWidth || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderWidth: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderWidth || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderWidth: `${value}px` } },
                      })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="py-1"
                  />
                </div>

                {elementStyle.borderWidth && parseInt(elementStyle.borderWidth) > 0 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="btn-border-color" className="text-xs">Cor da Borda</Label>
                    <div className="flex gap-2">
                      <Input
                        id="btn-border-color"
                        type="color"
                        className="w-12 h-8 p-1 cursor-pointer"
                        value={elementStyle.borderColor || "#000000"}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderColor: e.target.value } },
                          })
                        }
                      />
                      <Input
                        value={elementStyle.borderColor || ""}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderColor: e.target.value } },
                          })
                        }
                        className="flex-1 h-8 text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="btn-padding" className="text-xs">Padding</Label>
                  <Input
                    id="btn-padding"
                    placeholder="12px 24px ou 16px"
                    value={elementStyle.padding || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, padding: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        step="2"
                        value={parseInt(elementStyle.padding) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, padding: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.padding) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, padding: `${value}px` } },
                      })
                    }
                    min={0}
                    max={50}
                    step={2}
                    className="py-1"
                  />
                </div>
              </>
            )}

            {/* Estilos para Imagem */}
            {selectedElement.type === "image" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Largura</Label>
                  <Input
                    placeholder="100%, 300px, auto"
                    value={elementStyle.width || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="50"
                        max="800"
                        step="10"
                        value={parseInt(elementStyle.width) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, width: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.width) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: `${value}px` } },
                      })
                    }
                    min={50}
                    max={800}
                    step={10}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Altura</Label>
                  <Input
                    placeholder="auto, 200px"
                    value={elementStyle.height || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="50"
                        max="800"
                        step="10"
                        value={parseInt(elementStyle.height) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, height: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.height) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: `${value}px` } },
                      })
                    }
                    min={50}
                    max={800}
                    step={10}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="img-object-fit" className="text-xs">Ajuste</Label>
                  <Select
                    value={elementStyle.objectFit || "cover"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, objectFit: value } },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cobrir</SelectItem>
                      <SelectItem value="contain">Conter</SelectItem>
                      <SelectItem value="fill">Preencher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Raio da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={parseInt(elementStyle.borderRadius || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderRadius || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${value}px` } },
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Espessura da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={parseInt(elementStyle.borderWidth || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderWidth: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderWidth || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderWidth: `${value}px` } },
                      })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="py-1"
                  />
                </div>
                {elementStyle.borderWidth && (
                  <div className="space-y-1.5">
                    <Label htmlFor="img-border-color" className="text-xs">Cor da Borda</Label>
                    <div className="flex gap-2">
                      <Input
                        id="img-border-color"
                        type="color"
                        className="w-12 h-8 p-1 cursor-pointer"
                        value={elementStyle.borderColor || "#000000"}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderColor: e.target.value } },
                          })
                        }
                      />
                      <Input
                        value={elementStyle.borderColor || ""}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderColor: e.target.value } },
                          })
                        }
                        className="flex-1 h-8 text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label className="text-xs">Alinhamento do Elemento</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={!elementStyle.marginLeft && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: undefined, marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Esquerda</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && elementStyle.marginRight === "auto" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Centro</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: undefined } },
                        })
                      }
                    >
                      <span className="text-xs">Direita</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Estilos para Vídeo */}
            {selectedElement.type === "video" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Largura</Label>
                  <Input
                    placeholder="100%, 640px, auto"
                    value={elementStyle.width || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="200"
                        max="1000"
                        step="20"
                        value={parseInt(elementStyle.width) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, width: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.width) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, width: `${value}px` } },
                      })
                    }
                    min={200}
                    max={1000}
                    step={20}
                    className="py-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Altura</Label>
                  <Input
                    placeholder="auto, 360px"
                    value={elementStyle.height || ""}
                    onChange={(e) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: e.target.value } },
                      })
                    }
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="150"
                        max="800"
                        step="10"
                        value={parseInt(elementStyle.height) || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, height: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.height) || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: `${value}px` } },
                      })
                    }
                    min={150}
                    max={800}
                    step={10}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Raio da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={parseInt(elementStyle.borderRadius || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderRadius || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${value}px` } },
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                    className="py-1"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs">Alinhamento do Elemento</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={!elementStyle.marginLeft && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: undefined, marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Esquerda</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && elementStyle.marginRight === "auto" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: "auto" } },
                        })
                      }
                    >
                      <span className="text-xs">Centro</span>
                    </Button>
                    <Button
                      variant={elementStyle.marginLeft === "auto" && !elementStyle.marginRight ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, marginLeft: "auto", marginRight: undefined } },
                        })
                      }
                    >
                      <span className="text-xs">Direita</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Estilos para Link */}
            {selectedElement.type === "link" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="link-color" className="text-xs">Cor</Label>
                  <div className="flex gap-2">
                    <Input
                      id="link-color"
                      type="color"
                      className="w-12 h-8 p-1 cursor-pointer"
                      value={elementStyle.color || "#0000ff"}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                    />
                    <Input
                      value={elementStyle.color || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                      className="flex-1 h-8 text-sm"
                      placeholder="#0000ff"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="link-decoration" className="text-xs">Decoração</Label>
                  <Select
                    value={elementStyle.textDecoration || "underline"}
                    onValueChange={(value) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, textDecoration: value } },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underline">Sublinhado</SelectItem>
                      <SelectItem value="none">Sem decoração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Tamanho</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="8"
                        max="48"
                        step="1"
                        value={parseInt(elementStyle.fontSize || "16") || 16}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.fontSize || "16") || 16]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${value}px` } },
                      })
                    }
                    min={8}
                    max={48}
                    step={1}
                    className="py-1"
                  />
                </div>
              </>
            )}

            {/* Estilos para Lista */}
            {selectedElement.type === "list" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="list-color" className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="list-color"
                      type="color"
                      className="w-12 h-8 p-1 cursor-pointer"
                      value={elementStyle.color || "#000000"}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                    />
                    <Input
                      value={elementStyle.color || ""}
                      onChange={(e) =>
                        updateElement(blockId, selectedElement.id, {
                          content: { ...selectedElement.content, style: { ...elementStyle, color: e.target.value } },
                        })
                      }
                      className="flex-1 h-8 text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Tamanho</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="8"
                        max="32"
                        step="1"
                        value={parseInt(elementStyle.fontSize || "16") || 16}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.fontSize || "16") || 16]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, fontSize: `${value}px` } },
                      })
                    }
                    min={8}
                    max={32}
                    step={1}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Espaçamento</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="40"
                        step="2"
                        value={parseInt(elementStyle.gap || "8") || 8}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, gap: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.gap || "8") || 8]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, gap: `${value}px` } },
                      })
                    }
                    min={0}
                    max={40}
                    step={2}
                    className="py-1"
                  />
                </div>
              </>
            )}

            {/* Estilos para Carrossel */}
            {selectedElement.type === "carousel" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Altura</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="100"
                        max="800"
                        step="10"
                        value={parseInt(elementStyle.height || "300") || 300}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, height: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.height || "300") || 300]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, height: `${value}px` } },
                      })
                    }
                    min={100}
                    max={800}
                    step={10}
                    className="py-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Raio da Borda</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={parseInt(elementStyle.borderRadius || "0") || 0}
                        onChange={(e) =>
                          updateElement(blockId, selectedElement.id, {
                            content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${e.target.value}px` } },
                          })
                        }
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[parseInt(elementStyle.borderRadius || "0") || 0]}
                    onValueChange={([value]) =>
                      updateElement(blockId, selectedElement.id, {
                        content: { ...selectedElement.content, style: { ...elementStyle, borderRadius: `${value}px` } },
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                    className="py-1"
                  />
                </div>
              </>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => removeElement(blockId, selectedElement.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Elemento
            </Button>
          </div>
        );
      }

  // Block Properties
  if (selectedBlock) {
    return (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="bg-color" className="text-xs">Cor de Fundo</Label>
          <div className="flex gap-2">
            <Input
              id="bg-color"
              type="color"
              className="w-12 h-8 p-1 cursor-pointer"
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
              className="flex-1 h-8 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Imagem de Background</Label>
          <div className="flex gap-2">
            <label className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                type="button"
                onClick={() => document.getElementById('bg-image-upload')?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload ou URL
              </Button>
              <input
                id="bg-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateBlock(selectedBlock.id, {
                        style: { ...selectedBlock.style, backgroundImage: reader.result as string },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <Input
            placeholder="Ou cole URL: https://"
            value={selectedBlock.style.backgroundImage?.startsWith('data:') ? '' : selectedBlock.style.backgroundImage || ""}
            onChange={(e) =>
              updateBlock(selectedBlock.id, {
                style: { ...selectedBlock.style, backgroundImage: e.target.value },
              })
            }
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Gradiente</Label>
          <div className="grid grid-cols-6 gap-1.5">
            {[
              { name: 'Sunset', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
              { name: 'Ocean', value: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)' },
              { name: 'Fire', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
              { name: 'Forest', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
              { name: 'Candy', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
              { name: 'Night', value: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)' },
            ].map((gradient) => (
              <button
                key={gradient.name}
                onClick={() =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, backgroundGradient: gradient.value },
                  })
                }
                className={`h-8 rounded border-2 transition-all ${
                  selectedBlock.style.backgroundGradient === gradient.value
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'border-muted hover:border-primary/50'
                }`}
                style={{ background: gradient.value }}
                title={gradient.name}
              />
            ))}
          </div>

          <div className="flex gap-2 items-center pt-1">
            <Input
              type="color"
              className="w-10 h-7 p-0.5 cursor-pointer"
              onChange={(e) => {
                const color1 = e.target.value;
                const color2 = selectedBlock.style.backgroundGradient?.match(/#[0-9A-Fa-f]{6}/g)?.[1] || '#764ba2';
                updateBlock(selectedBlock.id, {
                  style: { ...selectedBlock.style, backgroundGradient: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` },
                });
              }}
            />
            <span className="text-xs text-muted-foreground">→</span>
            <Input
              type="color"
              className="w-10 h-7 p-0.5 cursor-pointer"
              onChange={(e) => {
                const color2 = e.target.value;
                const color1 = selectedBlock.style.backgroundGradient?.match(/#[0-9A-Fa-f]{6}/g)?.[0] || '#667eea';
                updateBlock(selectedBlock.id, {
                  style: { ...selectedBlock.style, backgroundGradient: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` },
                });
              }}
            />
            {selectedBlock.style.backgroundGradient && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, backgroundGradient: '' },
                  })
                }
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Opacidade</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                step="5"
                value={selectedBlock.style.backgroundOpacity || 100}
                onChange={(e) =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, backgroundOpacity: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-16 h-7 text-xs text-right"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[selectedBlock.style.backgroundOpacity || 100]}
            onValueChange={([value]) =>
              updateBlock(selectedBlock.id, {
                style: { ...selectedBlock.style, backgroundOpacity: value },
              })
            }
            min={0}
            max={100}
            step={5}
            className="py-1"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Desfoque</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="20"
                step="1"
                value={selectedBlock.style.backgroundBlur || 0}
                onChange={(e) =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, backgroundBlur: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-16 h-7 text-xs text-right"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
          <Slider
            value={[selectedBlock.style.backgroundBlur || 0]}
            onValueChange={([value]) =>
              updateBlock(selectedBlock.id, {
                style: { ...selectedBlock.style, backgroundBlur: value },
              })
            }
            min={0}
            max={20}
            step={1}
            className="py-1"
          />
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Espaçamento (Padding)</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="6"
                step="0.5"
                value={selectedBlock.style.padding || 2}
                onChange={(e) =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, padding: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-16 h-7 text-xs text-right"
              />
              <span className="text-xs text-muted-foreground">rem</span>
            </div>
          </div>
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
            className="py-1"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Altura Mínima</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="80"
                max="500"
                step="10"
                value={selectedBlock.style.minHeight || 120}
                onChange={(e) =>
                  updateBlock(selectedBlock.id, {
                    style: { ...selectedBlock.style, minHeight: parseInt(e.target.value) || 80 },
                  })
                }
                className="w-16 h-7 text-xs text-right"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
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
            className="py-1"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Reordenar</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => moveBlock(selectedBlock.id, "up")}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Cima
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => moveBlock(selectedBlock.id, "down")}
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              Baixo
            </Button>
          </div>
        </div>

        <Separator />

        <Button
          variant="destructive"
          size="sm"
          className="w-full h-8"
          onClick={() => {
            removeBlock(selectedBlock.id);
          }}
        >
          <Trash2 className="h-3 w-3 mr-2" />
          Remover Bloco
        </Button>
      </div>
    );
  }

  // Default state - no selection, return null since sheet shouldn't be open
  return null;
}
