import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MobilePreview } from "@/components/editor/MobilePreview";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Button } from "@/components/ui/button";
import { Settings, Eye } from "lucide-react";

const Editor = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-display font-bold">CreatePage</h1>
          <span className="text-xs text-muted-foreground">Construtor de sites profissional</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full pt-14">
        <EditorSidebar />
        <MobilePreview />
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default Editor;
