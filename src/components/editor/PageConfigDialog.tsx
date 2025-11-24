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
import { Settings } from "lucide-react";
import { HeaderTemplate, FooterTemplate } from "@/types/editor";
import { TemplatePreview } from "./TemplatePreview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

          {/* Info adicional */}
          <div className="rounded-lg bg-primary/10 p-4 space-y-2 text-sm">
            <p className="font-medium">Como funciona:</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>✓ Escolha templates de header e footer acima</li>
              <li>✓ Visualize o preview antes de selecionar</li>
              <li>✓ Clique neles no preview mobile para editar</li>
              <li>✓ Personalize textos, cores, logos e links</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
