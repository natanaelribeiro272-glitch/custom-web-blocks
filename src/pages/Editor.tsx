import { MobilePreview } from "@/components/editor/MobilePreview";
import { FloatingBottomBar } from "@/components/editor/FloatingBottomBar";
import { AddBlockSheet } from "@/components/editor/AddBlockSheet";
import { AddElementSheet } from "@/components/editor/AddElementSheet";
import { PropertiesSheet } from "@/components/editor/PropertiesSheet";
import { PageSettingsSheet } from "@/components/editor/PageSettingsSheet";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Editor = () => {
  const { activeSheet, setActiveSheet, loadProject } = useEditorStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      loadProject(projectId);
    }
  }, [searchParams, loadProject]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-editor-preview">
      {/* Full screen mobile preview */}
      <MobilePreview />

      {/* Floating bottom navigation bar */}
      <FloatingBottomBar />

      {/* Sheets for different actions */}
      <AddBlockSheet 
        open={activeSheet === "add-block"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <AddElementSheet 
        open={activeSheet === "add-element"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <PropertiesSheet 
        open={activeSheet === "properties"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <PageSettingsSheet 
        open={activeSheet === "page-settings"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
    </div>
  );
};

export default Editor;
