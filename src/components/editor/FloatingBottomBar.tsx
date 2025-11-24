import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Eye, Plus, GripVertical, Minimize2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function FloatingBottomBar() {
  const { 
    pages, 
    currentPageId, 
    setCurrentPage, 
    setActiveSheet, 
    selectedBlockId, 
    selectedElementId,
    selectedHeaderFooter,
    floatingBarPosition,
    setFloatingBarPosition
  } = useEditorStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const barRef = useRef<HTMLDivElement>(null);

  const handleOpenProperties = () => {
    setActiveSheet("properties");
  };

  const handleOpenPageSettings = () => {
    setActiveSheet("page-settings");
  };

  const handleAddElement = () => {
    setActiveSheet("add-element");
  };

  const handleDockBar = () => {
    setFloatingBarPosition({ x: 0, y: 0, isDocked: true });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (floatingBarPosition.isDocked) {
      // Undock the bar
      const rect = barRef.current?.getBoundingClientRect();
      if (rect) {
        setFloatingBarPosition({
          x: rect.left,
          y: rect.top,
          isDocked: false
        });
      }
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (floatingBarPosition.isDocked ? 0 : floatingBarPosition.x),
      y: e.clientY - (floatingBarPosition.isDocked ? window.innerHeight - 70 : floatingBarPosition.y)
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (floatingBarPosition.isDocked) {
      const rect = barRef.current?.getBoundingClientRect();
      if (rect) {
        setFloatingBarPosition({
          x: rect.left,
          y: rect.top,
          isDocked: false
        });
      }
    }
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - (floatingBarPosition.isDocked ? 0 : floatingBarPosition.x),
      y: touch.clientY - (floatingBarPosition.isDocked ? window.innerHeight - 70 : floatingBarPosition.y)
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !floatingBarPosition.isDocked) {
        const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 70, e.clientY - dragOffset.y));
        setFloatingBarPosition({ x: newX, y: newY, isDocked: false });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && !floatingBarPosition.isDocked) {
        const touch = e.touches[0];
        const newX = Math.max(0, Math.min(window.innerWidth - 400, touch.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 70, touch.clientY - dragOffset.y));
        setFloatingBarPosition({ x: newX, y: newY, isDocked: false });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset, floatingBarPosition.isDocked, setFloatingBarPosition]);

  // Determine what's selected and what to show
  const hasSelection = selectedBlockId || selectedElementId || selectedHeaderFooter;
  const showAddElement = selectedBlockId && !selectedElementId;

  return (
    <div
      ref={barRef}
      className={cn(
        "bg-card border border-border shadow-2xl rounded-2xl z-50 transition-all",
        floatingBarPosition.isDocked 
          ? "fixed bottom-0 left-0 right-0 rounded-b-none" 
          : "fixed"
      )}
      style={
        floatingBarPosition.isDocked 
          ? undefined 
          : {
              left: `${floatingBarPosition.x}px`,
              top: `${floatingBarPosition.y}px`,
              maxWidth: '400px',
              width: '90vw'
            }
      }
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center py-1 cursor-move touch-none bg-muted/50 rounded-t-2xl"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-between px-4 py-3 gap-2">
        {/* Dock button - only show when floating */}
        {!floatingBarPosition.isDocked && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDockBar}
            className="h-8 w-8 p-0"
            title="Ancorar embaixo"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}

        {/* Page selector with add button */}
        <div className="flex items-center gap-1">
          <Select value={currentPageId || ""} onValueChange={setCurrentPage}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Página" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { addPage } = useEditorStore.getState();
              addPage();
            }}
            className="h-9 w-9 p-0"
            title="Nova página"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Show add element and properties when block is selected */}
          {showAddElement && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddElement}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Elemento</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenProperties}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Propriedades</span>
              </Button>
            </>
          )}

          {/* Show only properties when element, header, or footer is selected */}
          {(selectedElementId || selectedHeaderFooter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenProperties}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">
                {selectedHeaderFooter ? 
                  (selectedHeaderFooter === "header" ? "Header" : "Rodapé") : 
                  "Elemento"}
              </span>
            </Button>
          )}

          {/* Page settings button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPageSettings}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Página</span>
          </Button>

          {/* Preview button */}
          <Button
            size="sm"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visualizar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
