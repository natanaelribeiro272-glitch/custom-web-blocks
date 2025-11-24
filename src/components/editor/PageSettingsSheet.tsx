import { useEditorStore } from "@/hooks/useEditorStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { HeaderTemplate, FooterTemplate } from "@/types/editor";

interface PageSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageSettingsSheet({ open, onOpenChange }: PageSettingsSheetProps) {
  const { pages, currentPageId, updatePage, addPage, removePage, setCurrentPage } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  if (!currentPage) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Configurações da Página</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(85vh-80px)]">
          <div className="px-6 py-6 space-y-8">
            {/* Page Name */}
            <div className="space-y-2">
              <Label>Nome da Página</Label>
              <Input
                value={currentPage.name}
                onChange={(e) => updatePage(currentPage.id, { name: e.target.value })}
                placeholder="Ex: Home, Sobre, Contato"
              />
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label>Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentPage.backgroundColor}
                  onChange={(e) => updatePage(currentPage.id, { backgroundColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={currentPage.backgroundColor}
                  onChange={(e) => updatePage(currentPage.id, { backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Header Template */}
            <div className="space-y-3">
              <Label>Template de Cabeçalho</Label>
              <RadioGroup
                value={currentPage.header.template}
                onValueChange={(value) =>
                  updatePage(currentPage.id, {
                    header: { ...currentPage.header, template: value as HeaderTemplate },
                  })
                }
                className="space-y-3"
              >
                {(["none", "simple", "centered", "with-logo"] as HeaderTemplate[]).map((template) => (
                  <div key={template} className="flex items-start space-x-3">
                    <RadioGroupItem value={template} id={`header-${template}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`header-${template}`} className="cursor-pointer">
                        <TemplatePreview type="header" template={template} />
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Footer Template */}
            <div className="space-y-3">
              <Label>Template de Rodapé</Label>
              <RadioGroup
                value={currentPage.footer.template}
                onValueChange={(value) =>
                  updatePage(currentPage.id, {
                    footer: { ...currentPage.footer, template: value as FooterTemplate },
                  })
                }
                className="space-y-3"
              >
                {(["none", "simple", "social", "detailed"] as FooterTemplate[]).map((template) => (
                  <div key={template} className="flex items-start space-x-3">
                    <RadioGroupItem value={template} id={`footer-${template}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`footer-${template}`} className="cursor-pointer">
                        <TemplatePreview type="footer" template={template} />
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Pages Management */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center justify-between">
                <Label>Páginas do Site</Label>
                <Button size="sm" onClick={addPage} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Página
                </Button>
              </div>
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      page.id === currentPageId ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start"
                      onClick={() => {
                        setCurrentPage(page.id);
                        onOpenChange(false);
                      }}
                    >
                      {page.name}
                    </Button>
                    {pages.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePage(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
