import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { HeaderTemplate, FooterTemplate } from "@/types/editor";

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

export function PageConfigDialog() {
  const { pages, currentPageId, updatePage, updatePageHeader, updatePageFooter } =
    useEditorStore();

  const currentPage = pages.find((p) => p.id === currentPageId);

  if (!currentPage) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configurações da Página</SheetTitle>
          <SheetDescription>Personalize sua página</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
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

          {/* Template de Header */}
          <div className="space-y-2">
            <Label htmlFor="header-template">Template de Header</Label>
            <Select
              value={currentPage.header.template}
              onValueChange={(value) => {
                updatePageHeader(currentPage.id, { template: value as HeaderTemplate });
              }}
            >
              <SelectTrigger id="header-template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {headerTemplates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{template.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentPage.header.template !== "none" && (
              <p className="text-xs text-muted-foreground">
                💡 Clique no header no preview para editar detalhes
              </p>
            )}
          </div>

          {/* Template de Rodapé */}
          <div className="space-y-2">
            <Label htmlFor="footer-template">Template de Rodapé</Label>
            <Select
              value={currentPage.footer.template}
              onValueChange={(value) => {
                updatePageFooter(currentPage.id, { template: value as FooterTemplate });
              }}
            >
              <SelectTrigger id="footer-template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {footerTemplates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{template.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentPage.footer.template !== "none" && (
              <p className="text-xs text-muted-foreground">
                💡 Clique no footer no preview para editar detalhes
              </p>
            )}
          </div>

          {/* Info adicional */}
          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <p className="font-medium">Como funciona:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Escolha templates de header e footer acima</li>
              <li>• Clique neles no preview mobile para editar</li>
              <li>• Personalize textos, cores, logos e links</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
