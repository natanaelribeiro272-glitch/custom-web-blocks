import { BlockElement } from "@/types/editor";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, Link as LinkIcon, Check, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ElementRendererProps {
  element: BlockElement;
  blockId: string;
}

export function ElementRenderer({ element, blockId }: ElementRendererProps) {
  const { selectedElementId, selectElement } = useEditorStore();
  const isSelected = selectedElementId === element.id;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const baseClasses = cn(
    "transition-all rounded-lg",
    isSelected ? "ring-2 ring-accent ring-offset-2" : ""
  );

  // Countdown effect
  useEffect(() => {
    if (element.type === "countdown" && element.content.targetDate) {
      const interval = setInterval(() => {
        const target = new Date(element.content.targetDate!).getTime();
        const now = new Date().getTime();
        const distance = target - now;

        if (distance < 0) {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [element.type, element.content.targetDate]);

  // Carousel autoplay
  useEffect(() => {
    if (
      element.type === "carousel" &&
      element.content.carouselAutoplay &&
      element.content.carouselImages &&
      element.content.carouselImages.length > 0
    ) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % element.content.carouselImages!.length);
      }, element.content.carouselInterval || 3000);

      return () => clearInterval(interval);
    }
  }, [element.type, element.content.carouselAutoplay, element.content.carouselImages, element.content.carouselInterval]);

  switch (element.type) {
    case "title":
      return (
        <h2
          className={cn(baseClasses, "text-2xl font-bold px-2 py-1 cursor-pointer")}
          onClick={handleClick}
          style={{
            backgroundColor: element.content.style?.backgroundColor || 'transparent',
            fontFamily: element.content.style?.fontFamily,
            textAlign: element.content.style?.textAlign as any,
            color: element.content.style?.color,
            fontSize: element.content.style?.fontSize,
            ...element.content.style,
          }}
        >
          {element.content.text || "Título"}
        </h2>
      );

    case "text":
      return (
        <p
          className={cn(baseClasses, "text-sm leading-relaxed px-2 py-1 cursor-pointer")}
          onClick={handleClick}
          style={{
            backgroundColor: element.content.style?.backgroundColor || 'transparent',
            fontFamily: element.content.style?.fontFamily,
            textAlign: element.content.style?.textAlign as any,
            color: element.content.style?.color,
            fontSize: element.content.style?.fontSize,
            ...element.content.style,
          }}
        >
          {element.content.text || "Texto"}
        </p>
      );

    case "image":
      const getImageJustify = () => {
        if (element.content.style?.marginLeft === "auto" && element.content.style?.marginRight === "auto") return "center";
        if (element.content.style?.marginLeft === "auto") return "flex-end";
        return "flex-start";
      };

      return (
        <div className="flex" style={{ justifyContent: getImageJustify() }}>
          <div
            className={cn(baseClasses, "cursor-pointer overflow-hidden")}
            onClick={handleClick}
            style={{
              width: element.content.style?.width || '100%',
              height: element.content.style?.height || 'auto',
              borderRadius: element.content.style?.borderRadius,
              borderWidth: element.content.style?.borderWidth,
              borderColor: element.content.style?.borderColor,
              borderStyle: element.content.style?.borderWidth ? 'solid' : undefined,
            }}
          >
          {element.content.url ? (
            <img 
              src={element.content.url} 
              alt={element.content.alt || "Imagem"} 
              className="w-full h-full"
              style={{
                objectFit: (element.content.style?.objectFit as any) || 'cover'
              }}
            />
          ) : (
            <div className="aspect-video bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Adicione uma imagem</span>
            </div>
          )}
          </div>
        </div>
      );

    case "video":
      const getVideoJustify = () => {
        if (element.content.style?.marginLeft === "auto" && element.content.style?.marginRight === "auto") return "center";
        if (element.content.style?.marginLeft === "auto") return "flex-end";
        return "flex-start";
      };

      return (
        <div className="flex" style={{ justifyContent: getVideoJustify() }}>
          <div
            className={cn(baseClasses, "bg-muted flex items-center justify-center cursor-pointer overflow-hidden")}
            onClick={handleClick}
            style={{
              width: element.content.style?.width || '100%',
              height: element.content.style?.height || 'auto',
              borderRadius: element.content.style?.borderRadius,
              aspectRatio: !element.content.style?.height ? '16/9' : undefined,
            }}
          >
          {element.content.url ? (
            element.content.url.startsWith('data:') ? (
              <video controls className="w-full h-full">
                <source src={element.content.url} />
              </video>
            ) : (
              <iframe
                src={element.content.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Video className="h-8 w-8" />
              <span className="text-xs">URL do vídeo</span>
            </div>
          )}
          </div>
        </div>
      );

    case "button":
      const getButtonJustify = () => {
        if (element.content.style?.marginLeft === "auto" && element.content.style?.marginRight === "auto") return "center";
        if (element.content.style?.marginLeft === "auto") return "flex-end";
        return "flex-start";
      };

      return (
        <div 
          onClick={handleClick} 
          className="cursor-pointer flex"
          style={{
            justifyContent: getButtonJustify(),
          }}
        >
          <Button 
            className={cn(baseClasses)} 
            size="lg"
            style={{
              backgroundColor: element.content.style?.backgroundColor || 'hsl(var(--primary))',
              color: element.content.style?.color || 'hsl(var(--primary-foreground))',
              width: element.content.style?.width,
              height: element.content.style?.height,
              borderRadius: element.content.style?.borderRadius,
              borderWidth: element.content.style?.borderWidth,
              borderColor: element.content.style?.borderColor,
              borderStyle: element.content.style?.borderWidth ? 'solid' : undefined,
              padding: element.content.style?.padding,
              fontFamily: element.content.style?.fontFamily,
            }}
          >
            {element.content.text || "Botão"}
          </Button>
        </div>
      );

    case "link":
      return (
        <a
          href={element.content.href}
          className={cn(baseClasses, "flex items-center gap-2 px-2 py-1 cursor-pointer")}
          onClick={handleClick}
          style={{
            backgroundColor: element.content.style?.backgroundColor || 'transparent',
            color: element.content.style?.color || 'hsl(var(--primary))',
            textDecoration: element.content.style?.textDecoration || 'underline',
            fontSize: element.content.style?.fontSize,
          }}
        >
          <LinkIcon className="h-4 w-4" />
          {element.content.text || "Link"}
        </a>
      );

    case "countdown":
      return (
        <div
          className={cn(baseClasses, "p-4 cursor-pointer")}
          onClick={handleClick}
          style={{
            backgroundColor: element.content.style?.backgroundColor || 'transparent',
          }}
        >
          {element.content.countdownLabel && (
            <div className="text-sm text-center mb-2 text-muted-foreground">
              {element.content.countdownLabel}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: countdown.days, label: "Dias" },
              { value: countdown.hours, label: "Horas" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Seg" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold font-display">{String(item.value).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "product":
      return (
        <div
          className={cn(baseClasses, "border border-border rounded-lg overflow-hidden cursor-pointer")}
          onClick={handleClick}
        >
          {/* Product Image */}
          <div className="aspect-square bg-muted flex items-center justify-center">
            {element.content.productImage ? (
              <img
                src={element.content.productImage}
                alt={element.content.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-sm">{element.content.productName || "Nome do Produto"}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {element.content.productDescription || "Descrição do produto"}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{element.content.productPrice || "R$ 0,00"}</span>
              {element.content.productOriginalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {element.content.productOriginalPrice}
                </span>
              )}
            </div>
            <Button size="sm" className="w-full">
              {element.content.productButtonText || "Comprar"}
            </Button>
          </div>
        </div>
      );

    case "list":
      return (
        <div 
          className={cn(baseClasses, "px-2 py-1 cursor-pointer")} 
          onClick={handleClick}
          style={{
            backgroundColor: element.content.style?.backgroundColor || 'transparent',
          }}
        >
          <ul 
            className="space-y-2"
            style={{
              color: element.content.style?.color,
              fontSize: element.content.style?.fontSize,
              gap: element.content.style?.gap,
            }}
          >
            {element.content.listItems?.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {element.content.listStyle === "numbered" ? (
                  <span className="font-semibold">{index + 1}.</span>
                ) : element.content.listStyle === "checklist" ? (
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                ) : element.content.listStyle === "icon" ? (
                  <Circle className="h-2 w-2 text-primary mt-1.5 flex-shrink-0 fill-current" />
                ) : (
                  <span className="text-primary mt-1">•</span>
                )}
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "carousel":
      const images = element.content.carouselImages || [];
      return (
        <div
          className={cn(baseClasses, "relative bg-muted overflow-hidden cursor-pointer group")}
          onClick={handleClick}
          style={{
            height: element.content.style?.height || '300px',
            borderRadius: element.content.style?.borderRadius,
            aspectRatio: !element.content.style?.height ? '16/9' : undefined,
          }}
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs mt-2">Adicione imagens ao carrossel</span>
            </div>
          ) : (
            <>
              <img
                src={images[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % images.length);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          i === currentSlide ? "bg-white w-4" : "bg-white/50"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(i);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      );

    default:
      return null;
  }
}
