import { create } from 'zustand';
import { Block, BlockElement, EditorState, Page, HeaderTemplate, FooterTemplate, HeaderFooterConfig } from '@/types/editor';

interface EditorStore extends EditorState {
  // Page actions
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  setCurrentPage: (pageId: string) => void;
  updatePageHeader: (pageId: string, header: Partial<HeaderFooterConfig>) => void;
  updatePageFooter: (pageId: string, footer: Partial<HeaderFooterConfig>) => void;
  
  // Block actions
  addBlock: (type: Block['type']) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  selectBlock: (blockId: string | null) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  
  // Element actions
  addElement: (blockId: string, element: BlockElement) => void;
  removeElement: (blockId: string, elementId: string) => void;
  updateElement: (blockId: string, elementId: string, updates: Partial<BlockElement>) => void;
  selectElement: (elementId: string | null) => void;
  
  // Header/Footer selection
  selectHeaderFooter: (type: "header" | "footer" | null) => void;
}

const createDefaultHeader = (): HeaderFooterConfig => ({
  template: "none",
  brandName: "Meu Site",
  logo: "",
  links: [],
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
});

const createDefaultFooter = (): HeaderFooterConfig => ({
  template: "none",
  copyright: "© 2025 Todos os direitos reservados",
  links: [],
  socialLinks: [],
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
});

export const useEditorStore = create<EditorStore>((set, get) => ({
  pages: [
    {
      id: 'page-1',
      name: 'Home',
      backgroundColor: '#ffffff',
      header: createDefaultHeader(),
      footer: createDefaultFooter(),
      blocks: [],
    },
  ],
  currentPageId: 'page-1',
  selectedBlockId: null,
  selectedElementId: null,
  selectedHeaderFooter: null,

  // Page actions
  addPage: () =>
    set((state) => {
      const newPage: Page = {
        id: `page-${Date.now()}`,
        name: `Página ${state.pages.length + 1}`,
        backgroundColor: '#ffffff',
        header: createDefaultHeader(),
        footer: createDefaultFooter(),
        blocks: [],
      };
      return {
        pages: [...state.pages, newPage],
        currentPageId: newPage.id,
      };
    }),

  removePage: (pageId) =>
    set((state) => {
      const newPages = state.pages.filter((p) => p.id !== pageId);
      if (newPages.length === 0) {
        // Always keep at least one page
        return state;
      }
      return {
        pages: newPages,
        currentPageId: state.currentPageId === pageId ? newPages[0].id : state.currentPageId,
      };
    }),

  updatePage: (pageId, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, ...updates } : p
      ),
    })),

  setCurrentPage: (pageId) =>
    set({
      currentPageId: pageId,
      selectedBlockId: null,
      selectedElementId: null,
      selectedHeaderFooter: null,
    }),

  updatePageHeader: (pageId, header) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, header: { ...p.header, ...header } } : p
      ),
    })),

  updatePageFooter: (pageId, footer) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, footer: { ...p.footer, ...footer } } : p
      ),
    })),

  // Block actions
  addBlock: (type) =>
    set((state) => {
      const currentPage = state.pages.find((p) => p.id === state.currentPageId);
      if (!currentPage) return state;

      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type,
        elements: [],
        style: {
          backgroundColor: '#ffffff',
          padding: 2,
          minHeight: 120,
        },
      };

      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? { ...p, blocks: [...p.blocks, newBlock] }
            : p
        ),
      };
    }),

  removeBlock: (blockId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
          : p
      ),
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
    })),

  updateBlock: (blockId, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
            }
          : p
      ),
    })),

  selectBlock: (blockId) =>
    set({ selectedBlockId: blockId, selectedElementId: null, selectedHeaderFooter: null }),

  moveBlock: (blockId, direction) =>
    set((state) => {
      const currentPage = state.pages.find((p) => p.id === state.currentPageId);
      if (!currentPage) return state;

      const blocks = [...currentPage.blocks];
      const index = blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return state;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return state;

      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];

      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId ? { ...p, blocks } : p
        ),
      };
    }),

  // Element actions
  addElement: (blockId, element) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId ? { ...b, elements: [...b.elements, element] } : b
              ),
            }
          : p
      ),
    })),

  removeElement: (blockId, elementId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, elements: b.elements.filter((e) => e.id !== elementId) }
                  : b
              ),
            }
          : p
      ),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    })),

  updateElement: (blockId, elementId, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      elements: b.elements.map((e) =>
                        e.id === elementId ? { ...e, ...updates } : e
                      ),
                    }
                  : b
              ),
            }
          : p
      ),
    })),

  selectElement: (elementId) =>
    set({ selectedElementId: elementId, selectedHeaderFooter: null }),

  selectHeaderFooter: (type) =>
    set({ selectedHeaderFooter: type, selectedBlockId: null, selectedElementId: null }),
}));
