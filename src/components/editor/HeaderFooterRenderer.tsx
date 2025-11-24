import { HeaderFooterConfig } from "@/types/editor";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/hooks/useEditorStore";

interface HeaderFooterRendererProps {
  config: HeaderFooterConfig;
  type: "header" | "footer";
  pageId: string;
}

export function HeaderFooterRenderer({ config, type, pageId }: HeaderFooterRendererProps) {
  const { selectedHeaderFooter, selectHeaderFooter } = useEditorStore();
  const isSelected = selectedHeaderFooter === type;

  if (config.template === "none") {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectHeaderFooter(type);
  };

  const baseClasses = cn(
    "relative transition-all cursor-pointer",
    isSelected && "ring-2 ring-accent ring-offset-2"
  );

  // Header Templates
  if (type === "header") {
    if (config.template === "simple") {
      return (
        <header
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-display font-semibold">{config.brandName || "Brand"}</span>
            <nav className="flex gap-4">
              {config.links?.map((link, i) => (
                <a key={i} href={link.href} className="text-sm hover:opacity-70">
                  {link.text}
                </a>
              ))}
            </nav>
          </div>
          {isSelected && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Header Selecionado
              </span>
            </div>
          )}
        </header>
      );
    }

    if (config.template === "centered") {
      return (
        <header
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center text-center px-4 py-4">
            <span className="font-display font-bold text-lg">{config.brandName || "Brand"}</span>
            {config.tagline && <span className="text-xs opacity-70 mt-1">{config.tagline}</span>}
            <nav className="flex gap-4 mt-3">
              {config.links?.map((link, i) => (
                <a key={i} href={link.href} className="text-sm hover:opacity-70">
                  {link.text}
                </a>
              ))}
            </nav>
          </div>
          {isSelected && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Header Selecionado
              </span>
            </div>
          )}
        </header>
      );
    }

    if (config.template === "with-logo") {
      return (
        <header
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="h-8 w-8 object-cover rounded" />
              ) : (
                <div className="h-8 w-8 bg-primary/20 rounded flex items-center justify-center text-xs font-bold">
                  {config.brandName?.charAt(0) || "L"}
                </div>
              )}
              <span className="font-display font-semibold">{config.brandName || "Brand"}</span>
            </div>
            <nav className="flex gap-3">
              {config.links?.map((link, i) => (
                <a key={i} href={link.href} className="text-sm hover:opacity-70">
                  {link.text}
                </a>
              ))}
            </nav>
          </div>
          {isSelected && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Header Selecionado
              </span>
            </div>
          )}
        </header>
      );
    }
  }

  // Footer Templates
  if (type === "footer") {
    if (config.template === "simple") {
      return (
        <footer
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="px-4 py-4 text-center">
            <p className="text-xs">{config.copyright}</p>
          </div>
          {isSelected && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Footer Selecionado
              </span>
            </div>
          )}
        </footer>
      );
    }

    if (config.template === "social") {
      return (
        <footer
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="px-4 py-4 space-y-3">
            <div className="flex justify-center gap-4">
              {config.socialLinks?.map((social, i) => (
                <a key={i} href={social.url} className="text-sm hover:opacity-70">
                  {social.platform}
                </a>
              ))}
            </div>
            <p className="text-xs text-center">{config.copyright}</p>
          </div>
          {isSelected && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Footer Selecionado
              </span>
            </div>
          )}
        </footer>
      );
    }

    if (config.template === "detailed") {
      return (
        <footer
          className={baseClasses}
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
          onClick={handleClick}
        >
          <div className="px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold mb-2">{config.brandName}</h4>
                {config.tagline && <p className="opacity-70">{config.tagline}</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Links</h4>
                <div className="space-y-1">
                  {config.links?.map((link, i) => (
                    <a key={i} href={link.href} className="block opacity-70 hover:opacity-100">
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t pt-3 text-xs text-center opacity-70">
              {config.copyright}
            </div>
          </div>
          {isSelected && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Footer Selecionado
              </span>
            </div>
          )}
        </footer>
      );
    }
  }

  return null;
}
