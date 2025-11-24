export type BlockType = "full-width" | "centered" | "split" | "grid";

export type ElementType = "title" | "text" | "image" | "video" | "button" | "link" | "carousel";

export interface BlockElement {
  id: string;
  type: ElementType;
  content: {
    text?: string;
    url?: string;
    alt?: string;
    href?: string;
    style?: Record<string, any>;
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

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  selectedElementId: string | null;
}
