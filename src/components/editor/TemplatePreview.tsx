import { HeaderTemplate, FooterTemplate } from "@/types/editor";

interface TemplatePreviewProps {
  type: "header" | "footer";
  template: HeaderTemplate | FooterTemplate;
}

export function TemplatePreview({ type, template }: TemplatePreviewProps) {
  if (type === "header") {
    const headerTemplate = template as HeaderTemplate;
    
    if (headerTemplate === "none") {
      return (
        <div className="w-full h-20 bg-muted/30 rounded-md flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed">
          Sem header
        </div>
      );
    }
    
    if (headerTemplate === "simple") {
      return (
        <div className="w-full bg-card rounded-md border-2 overflow-hidden">
          <div className="h-14 bg-white flex items-center justify-between px-4">
            <span className="text-sm font-semibold text-foreground">Marca</span>
            <div className="flex gap-3">
              <div className="text-xs text-muted-foreground">Home</div>
              <div className="text-xs text-muted-foreground">Sobre</div>
              <div className="text-xs text-muted-foreground">Contato</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (headerTemplate === "centered") {
      return (
        <div className="w-full bg-card rounded-md border-2 overflow-hidden">
          <div className="h-16 bg-white flex flex-col items-center justify-center gap-1.5 py-2">
            <span className="text-sm font-bold text-foreground">Marca</span>
            <div className="flex gap-3">
              <div className="text-xs text-muted-foreground">Home</div>
              <div className="text-xs text-muted-foreground">Sobre</div>
              <div className="text-xs text-muted-foreground">Contato</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (headerTemplate === "with-logo") {
      return (
        <div className="w-full bg-card rounded-md border-2 overflow-hidden">
          <div className="h-14 bg-white flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/30 rounded flex items-center justify-center text-xs font-bold">L</div>
              <span className="text-sm font-semibold text-foreground">Marca</span>
            </div>
            <div className="flex gap-3">
              <div className="text-xs text-muted-foreground">Home</div>
              <div className="text-xs text-muted-foreground">Sobre</div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  if (type === "footer") {
    const footerTemplate = template as FooterTemplate;
    
    if (footerTemplate === "none") {
      return (
        <div className="w-full h-16 bg-muted/30 rounded-md flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed">
          Sem footer
        </div>
      );
    }
    
    if (footerTemplate === "simple") {
      return (
        <div className="w-full h-14 bg-gray-900 rounded-md flex items-center justify-center border-2">
          <span className="text-xs text-gray-400">© 2025 Todos os direitos reservados</span>
        </div>
      );
    }
    
    if (footerTemplate === "social") {
      return (
        <div className="w-full h-20 bg-gray-900 rounded-md flex flex-col items-center justify-center gap-2 border-2">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">© 2025</span>
        </div>
      );
    }
    
    if (footerTemplate === "detailed") {
      return (
        <div className="w-full h-24 bg-gray-900 rounded-md p-3 space-y-2 border-2">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="w-14 h-2 bg-gray-600 rounded mb-1.5"></div>
              <div className="w-20 h-1.5 bg-gray-700 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="w-12 h-2 bg-gray-600 rounded mb-1.5"></div>
              <div className="space-y-1">
                <div className="w-14 h-1.5 bg-gray-700 rounded"></div>
                <div className="w-12 h-1.5 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-1.5">
            <div className="w-24 h-1.5 bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      );
    }
  }
  
  return null;
}
