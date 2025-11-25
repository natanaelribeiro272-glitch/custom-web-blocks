import { HeaderFooterConfig } from "@/types/editor";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  site: Globe,
};

interface HeaderFooterRendererProps {
  config: HeaderFooterConfig;
  type: "header" | "footer";
  pageId: string;
}

export function HeaderFooterRenderer({ config, type, pageId }: HeaderFooterRendererProps) {
  const { selectedHeaderFooter, selectHeaderFooter } = useEditorStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const isHamburgerMenu = config.menuStyle === "hamburger";

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
            
            {isHamburgerMenu ? (
              <>
                <button
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                {mobileMenuOpen && (
                  <nav
                    className="absolute top-full left-0 right-0 bg-card border-b shadow-lg z-50 py-2"
                    style={{ backgroundColor: config.backgroundColor }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {config.links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className="block px-4 py-2 text-sm hover:bg-muted/50"
                      >
                        {link.text}
                      </a>
                    ))}
                  </nav>
                )}
              </>
            ) : (
              <nav className="flex gap-4">
                {config.links?.map((link, i) => (
                  <a key={i} href={link.href} className="text-sm hover:opacity-70">
                    {link.text}
                  </a>
                ))}
              </nav>
            )}
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
            <div className="flex items-center justify-between w-full">
              <div className="w-8"></div>
              <div className="flex flex-col items-center">
                <span className="font-display font-bold text-lg">{config.brandName || "Brand"}</span>
                {config.tagline && <span className="text-xs opacity-70 mt-1">{config.tagline}</span>}
              </div>
              {isHamburgerMenu && (
                <button
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
              {!isHamburgerMenu && <div className="w-8"></div>}
            </div>
            
            {isHamburgerMenu && mobileMenuOpen && (
              <nav
                className="w-full mt-3 bg-card border rounded-lg shadow-lg z-50 py-2"
                style={{ backgroundColor: config.backgroundColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {config.links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="block px-4 py-2 text-sm hover:bg-muted/50"
                  >
                    {link.text}
                  </a>
                ))}
              </nav>
            )}
            
            {!isHamburgerMenu && (
              <nav className="flex gap-4 mt-3">
                {config.links?.map((link, i) => (
                  <a key={i} href={link.href} className="text-sm hover:opacity-70">
                    {link.text}
                  </a>
                ))}
              </nav>
            )}
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
            
            {isHamburgerMenu ? (
              <>
                <button
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                {mobileMenuOpen && (
                  <nav
                    className="absolute top-full left-0 right-0 bg-card border-b shadow-lg z-50 py-2"
                    style={{ backgroundColor: config.backgroundColor }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {config.links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className="block px-4 py-2 text-sm hover:bg-muted/50"
                      >
                        {link.text}
                      </a>
                    ))}
                  </nav>
                )}
              </>
            ) : (
              <nav className="flex gap-3">
                {config.links?.map((link, i) => (
                  <a key={i} href={link.href} className="text-sm hover:opacity-70">
                    {link.text}
                  </a>
                ))}
              </nav>
            )}
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
              {config.socialLinks?.map((social, i) => {
                const IconComponent = socialIcons[social.platform.toLowerCase()] || Globe;
                return (
                  <a key={i} href={social.url} className="hover:opacity-70">
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
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
