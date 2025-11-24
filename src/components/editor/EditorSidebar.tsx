import { LayoutGrid, AlignCenter, Columns2, Grid3x3, Type, FileText, Image, Video, MousePointerClick, Link as LinkIcon, PanelTop, PanelBottom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/hooks/useEditorStore";
import { BlockType, ElementType, HeaderTemplate, FooterTemplate } from "@/types/editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const blockTypes: { type: BlockType; icon: any; label: string; description: string }[] = [
  { type: "full-width", icon: LayoutGrid, label: "Largura Total", description: "Conteúdo ocupa toda largura" },
  { type: "centered", icon: AlignCenter, label: "Centralizado", description: "Conteúdo centralizado" },
  { type: "split", icon: Columns2, label: "Dividido", description: "Duas colunas lado a lado" },
  { type: "grid", icon: Grid3x3, label: "Grade", description: "Grade de elementos" },
];

const elementTypes: { type: ElementType; icon: any; label: string; description: string }[] = [
  { type: "title", icon: Type, label: "Título", description: "Título grande ou subtítulo" },
  { type: "text", icon: FileText, label: "Texto", description: "Parágrafo ou texto descritivo" },
  { type: "image", icon: Image, label: "Imagem", description: "Foto ou ilustração" },
  { type: "video", icon: Video, label: "Vídeo", description: "Vídeo do YouTube ou Vimeo" },
  { type: "button", icon: MousePointerClick, label: "Botão", description: "Botão de ação/CTA" },
  { type: "link", icon: LinkIcon, label: "Link", description: "Link de texto" },
];

// Import Label for templates tab
import { Label } from "@/components/ui/label";

const headerTemplates: { value: HeaderTemplate; label: string; description: string }[] = [
  { value: "none", label: "Sem Header", description: "Nenhum header na página" },
  { value: "simple", label: "Simples", description: "Logo e menu horizontal" },
  { value: "centered", label: "Centralizado", description: "Logo e menu centralizados" },
  { value: "with-logo", label: "Com Logo", description: "Logo + marca + menu" },
];

const footerTemplates: { value: FooterTemplate; label: string; description: string }[] = [
  { value: "none", label: "Sem Footer", description: "Nenhum rodapé na página" },
  { value: "simple", label: "Simples", description: "Apenas copyright" },
  { value: "social", label: "Com Redes Sociais", description: "Links sociais + copyright" },
  { value: "detailed", label: "Detalhado", description: "Múltiplas colunas de informação" },
];

export function EditorSidebar() {
  const { pages, currentPageId, addBlock, addElement, selectedBlockId, updatePageHeader, updatePageFooter } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  const handleAddElement = (type: ElementType) => {
    if (!selectedBlockId) {
      return;
    }

    const element = {
      id: `element-${Date.now()}`,
      type,
      content: {
        text: type === "title" ? "Novo Título" : type === "text" ? "Novo texto" : type === "button" ? "Clique aqui" : "",
        url: type === "image" ? "" : undefined,
        href: type === "link" || type === "button" ? "#" : undefined,
      },
    };

    addElement(selectedBlockId, element);
  };

  return (
    <div className="w-80 bg-editor-sidebar border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-semibold">Editor</h2>
        <p className="text-sm text-muted-foreground">Construa seu site</p>
      </div>

      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 m-4 mb-0 text-xs">
          <TabsTrigger value="blocks" className="gap-1">
            <LayoutGrid className="h-3 w-3" />
            Blocos
          </TabsTrigger>
          <TabsTrigger value="elements" className="gap-1">
            <MousePointerClick className="h-3 w-3" />
            Elementos
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1">
            <PanelTop className="h-3 w-3" />
            Templates
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="blocks" className="m-4 mt-2 space-y-3">
            <p className="text-xs text-muted-foreground mb-4">Blocos são seções do seu site</p>
            {blockTypes.map((block) => (
              <Button
                key={block.type}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:bg-hover hover:border-primary transition-all"
                onClick={() => addBlock(block.type)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <block.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">{block.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="elements" className="m-4 mt-2 space-y-3">
            {!selectedBlockId ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Selecione um bloco primeiro para adicionar elementos
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">Arraste elementos para o bloco selecionado</p>
                {elementTypes.map((element) => (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 hover:bg-hover hover:border-primary transition-all"
                    onClick={() => handleAddElement(element.type)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <element.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{element.label}</div>
                        <div className="text-xs text-muted-foreground">{element.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="templates" className="m-4 mt-2 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PanelTop className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold">Header da Página</Label>
                </div>
                <Select
                  value={currentPage?.header.template || "none"}
                  onValueChange={(value) => {
                    if (currentPageId) {
                      updatePageHeader(currentPageId, { template: value as HeaderTemplate });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {headerTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{template.label}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {currentPage?.header.template !== "none"
                    ? "✓ Clique no header no preview para editar"
                    : "Selecione um template acima"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PanelBottom className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold">Footer da Página</Label>
                </div>
                <Select
                  value={currentPage?.footer.template || "none"}
                  onValueChange={(value) => {
                    if (currentPageId) {
                      updatePageFooter(currentPageId, { template: value as FooterTemplate });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {footerTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{template.label}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {currentPage?.footer.template !== "none"
                    ? "✓ Clique no footer no preview para editar"
                    : "Selecione um template acima"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Dica:</strong> Depois de adicionar header ou footer, clique neles no preview para editar textos, cores, logos e links!
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" className="w-full">
          Visualizar
        </Button>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Publicar Site
        </Button>
      </div>
    </div>
  );
}
