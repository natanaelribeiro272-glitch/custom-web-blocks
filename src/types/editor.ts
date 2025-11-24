export type BlockType = "full-width" | "centered" | "split" | "grid";

export type ElementType = "title" | "text" | "image" | "video" | "button" | "link" | "carousel" | "countdown" | "product" | "list";

export type HeaderTemplate = "none" | "simple" | "centered" | "with-logo";
export type FooterTemplate = "none" | "simple" | "social" | "detailed";

export interface BlockElement {
  id: string;
  type: ElementType;
  content: {
    text?: string;
    url?: string;
    alt?: string;
    href?: string;
    style?: Record<string, any>;
    // Countdown
    targetDate?: string;
    countdownLabel?: string;
    // Product
    productName?: string;
    productPrice?: string;
    productOriginalPrice?: string;
    productDescription?: string;
    productImage?: string;
    productButtonText?: string;
    productButtonLink?: string;
    // List
    listItems?: string[];
    listIcon?: string;
    listStyle?: "bullet" | "numbered" | "checklist" | "icon";
    // Carousel
    carouselImages?: string[];
    carouselAutoplay?: boolean;
    carouselInterval?: number;
  };
}

export interface Block {
  id: string;
  type: BlockType;
  elements: BlockElement[];
  style: {
    backgroundColor?: string;
    padding?: number;
    minHeight?: number;
  };
}

export interface HeaderFooterConfig {
  template: HeaderTemplate | FooterTemplate;
  logo?: string;
  brandName?: string;
  tagline?: string;
  links?: { text: string; href: string }[];
  backgroundColor?: string;
  textColor?: string;
  socialLinks?: { platform: string; url: string }[];
  copyright?: string;
}

export interface Page {
  id: string;
  name: string;
  backgroundColor: string;
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
  blocks: Block[];
}

export interface EditorState {
  pages: Page[];
  currentPageId: string | null;
  selectedBlockId: string | null;
  selectedElementId: string | null;
  selectedHeaderFooter: "header" | "footer" | null;
  showingPageConfig: boolean;
  activeSheet: "add-block" | "properties" | "page-settings" | null;
  insertBlockIndex: number;
}
