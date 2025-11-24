import { BlockElement } from "@/types/editor";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, Link as LinkIcon } from "lucide-react";

interface ElementRendererProps {
  element: BlockElement;
  blockId: string;
}

export function ElementRenderer({ element, blockId }: ElementRendererProps) {
  const { selectedElementId, selectElement } = useEditorStore();
  const isSelected = selectedElementId === element.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const baseClasses = cn(
    "transition-all rounded-lg",
    isSelected ? "ring-2 ring-accent ring-offset-2" : "hover:bg-hover/50"
  );

  switch (element.type) {
    case "title":
      return (
        <h2
          className={cn(baseClasses, "text-2xl font-display font-bold px-2 py-1 cursor-pointer")}
          onClick={handleClick}
        >
          {element.content.text || "Título"}
        </h2>
      );

    case "text":
      return (
        <p
          className={cn(baseClasses, "text-sm leading-relaxed px-2 py-1 cursor-pointer")}
          onClick={handleClick}
        >
          {element.content.text || "Texto"}
        </p>
      );

    case "image":
      return (
        <div
          className={cn(baseClasses, "aspect-video bg-muted flex items-center justify-center cursor-pointer overflow-hidden")}
          onClick={handleClick}
        >
          {element.content.url ? (
            <img src={element.content.url} alt={element.content.alt || "Imagem"} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Adicione uma imagem</span>
            </div>
          )}
        </div>
      );

    case "video":
      return (
        <div
          className={cn(baseClasses, "aspect-video bg-muted flex items-center justify-center cursor-pointer")}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Video className="h-8 w-8" />
            <span className="text-xs">URL do vídeo</span>
          </div>
        </div>
      );

    case "button":
      return (
        <div onClick={handleClick} className="cursor-pointer">
          <Button className={cn(baseClasses, "w-full")} size="lg">
            {element.content.text || "Botão"}
          </Button>
        </div>
      );

    case "link":
      return (
        <a
          href={element.content.href}
          className={cn(baseClasses, "flex items-center gap-2 text-primary hover:underline px-2 py-1 cursor-pointer")}
          onClick={handleClick}
        >
          <LinkIcon className="h-4 w-4" />
          {element.content.text || "Link"}
        </a>
      );

    default:
      return null;
  }
}
