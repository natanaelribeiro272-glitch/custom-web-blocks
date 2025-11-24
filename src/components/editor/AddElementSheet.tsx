import { useEditorStore } from "@/hooks/useEditorStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  Image, 
  Video, 
  MousePointer, 
  Link2, 
  Timer,
  ShoppingBag,
  ListOrdered,
  ImageIcon
} from "lucide-react";
import type { ElementType } from "@/types/editor";

const elementTypes = [
  { type: "title" as ElementType, icon: Type, label: "Título", description: "Adicionar título" },
  { type: "text" as ElementType, icon: Type, label: "Texto", description: "Adicionar parágrafo" },
  { type: "image" as ElementType, icon: Image, label: "Imagem", description: "Adicionar imagem" },
  { type: "video" as ElementType, icon: Video, label: "Vídeo", description: "Embed de vídeo" },
  { type: "button" as ElementType, icon: MousePointer, label: "Botão", description: "Botão de ação" },
  { type: "link" as ElementType, icon: Link2, label: "Link", description: "Link clicável" },
  { type: "countdown" as ElementType, icon: Timer, label: "Contador", description: "Contagem regressiva" },
  { type: "product" as ElementType, icon: ShoppingBag, label: "Produto", description: "Card de produto" },
  { type: "list" as ElementType, icon: ListOrdered, label: "Lista", description: "Lista de itens" },
  { type: "carousel" as ElementType, icon: ImageIcon, label: "Carrossel", description: "Galeria de imagens" },
];

interface AddElementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddElementSheet({ open, onOpenChange }: AddElementSheetProps) {
  const { selectedBlockId, addElement } = useEditorStore();

  const handleAddElement = (type: ElementType) => {
    if (!selectedBlockId) return;

    const element = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };

    addElement(selectedBlockId, element);
    onOpenChange(false);
  };

  const getDefaultContent = (type: ElementType) => {
    switch (type) {
      case "title":
        return { text: "Título", style: { fontSize: "2rem", fontWeight: "bold" } };
      case "text":
        return { text: "Seu texto aqui" };
      case "image":
        return { url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f", alt: "Imagem" };
      case "video":
        return { url: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
      case "button":
        return { text: "Clique aqui", href: "#", style: {} };
      case "link":
        return { text: "Link", href: "#" };
      case "countdown":
        return { 
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          countdownLabel: "Faltam apenas:" 
        };
      case "product":
        return {
          productName: "Nome do Produto",
          productPrice: "R$ 99,90",
          productDescription: "Descrição do produto",
          productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          productButtonText: "Comprar Agora",
          productButtonLink: "#"
        };
      case "list":
        return {
          listItems: ["Item 1", "Item 2", "Item 3"],
          listStyle: "bullet" as const
        };
      case "carousel":
        return {
          carouselImages: [
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
          ],
          carouselAutoplay: true,
          carouselInterval: 3000
        };
      default:
        return {};
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-center">Adicionar Elemento</SheetTitle>
        </SheetHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-6 overflow-auto max-h-[calc(75vh-100px)]">
          {elementTypes.map((element) => (
            <Button
              key={element.type}
              variant="outline"
              className="h-auto flex flex-col items-center gap-3 p-4 hover:border-primary hover:bg-primary/5"
              onClick={() => handleAddElement(element.type)}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <element.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">{element.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{element.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
