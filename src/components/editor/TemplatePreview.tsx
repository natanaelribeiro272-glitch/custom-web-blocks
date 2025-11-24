import { HeaderTemplate, FooterTemplate } from "@/types/editor";
import { PanelTop, PanelBottom } from "lucide-react";

interface TemplatePreviewProps {
  type: "header" | "footer";
  template: HeaderTemplate | FooterTemplate;
}

export function TemplatePreview({ type, template }: TemplatePreviewProps) {
  if (type === "header") {
    const headerTemplate = template as HeaderTemplate;
    
    if (headerTemplate === "none") {
      return (
        <div className="w-full h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
          Sem header
        </div>
      );
    }
    
    if (headerTemplate === "simple") {
      return (
        <div className="w-full h-16 bg-white rounded-md border flex items-center justify-between px-3">
          <span className="text-xs font-semibold">Marca</span>
          <div className="flex gap-2">
            <div className="w-8 h-1.5 bg-muted rounded"></div>
            <div className="w-8 h-1.5 bg-muted rounded"></div>
            <div className="w-8 h-1.5 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
    
    if (headerTemplate === "centered") {
      return (
        <div className="w-full h-20 bg-white rounded-md border flex flex-col items-center justify-center gap-1">
          <span className="text-xs font-semibold">Marca</span>
          <div className="flex gap-2">
            <div className="w-6 h-1 bg-muted rounded"></div>
            <div className="w-6 h-1 bg-muted rounded"></div>
            <div className="w-6 h-1 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
    
    if (headerTemplate === "with-logo") {
      return (
        <div className="w-full h-16 bg-white rounded-md border flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/20 rounded"></div>
            <span className="text-xs font-semibold">Marca</span>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-1.5 bg-muted rounded"></div>
            <div className="w-8 h-1.5 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
  }
  
  if (type === "footer") {
    const footerTemplate = template as FooterTemplate;
    
    if (footerTemplate === "none") {
      return (
        <div className="w-full h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
          Sem footer
        </div>
      );
    }
    
    if (footerTemplate === "simple") {
      return (
        <div className="w-full h-12 bg-gray-900 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-400">© 2025 Copyright</span>
        </div>
      );
    }
    
    if (footerTemplate === "social") {
      return (
        <div className="w-full h-16 bg-gray-900 rounded-md flex flex-col items-center justify-center gap-2">
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
            <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
            <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">© 2025</span>
        </div>
      );
    }
    
    if (footerTemplate === "detailed") {
      return (
        <div className="w-full h-20 bg-gray-900 rounded-md p-3 space-y-2">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="w-12 h-2 bg-gray-700 rounded mb-1"></div>
              <div className="w-16 h-1 bg-gray-800 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="w-10 h-2 bg-gray-700 rounded mb-1"></div>
              <div className="space-y-0.5">
                <div className="w-12 h-1 bg-gray-800 rounded"></div>
                <div className="w-10 h-1 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-1">
            <div className="w-20 h-1 bg-gray-800 rounded mx-auto"></div>
          </div>
        </div>
      );
    }
  }
  
  return null;
}
