import { create } from 'zustand';
import { Block, BlockElement, EditorState, Page, HeaderTemplate, FooterTemplate, HeaderFooterConfig } from '@/types/editor';

interface EditorStore extends EditorState {
  projectId: string | null;
  projectName: string;
  
  // Project actions
  loadProject: (projectId: string) => void;
  setProjectName: (name: string) => void;
  
  // Page actions
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  setCurrentPage: (pageId: string) => void;
  updatePageHeader: (pageId: string, header: Partial<HeaderFooterConfig>) => void;
  updatePageFooter: (pageId: string, footer: Partial<HeaderFooterConfig>) => void;
  
  // Block actions
  addBlock: (type: Block['type']) => void;
  addBlockAt: (type: Block['type'], index: number) => void;
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
  
  // Page config
  togglePageConfig: () => void;
  
  // Sheet management
  setActiveSheet: (sheet: "add-block" | "add-element" | "properties" | "page-settings" | null) => void;
  setInsertBlockIndex: (index: number) => void;
  
  // Floating bar position
  setFloatingBarPosition: (position: { x: number; y: number; isDocked: boolean }) => void;
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
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "twitter", url: "https://twitter.com" },
  ],
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
});

// Helper to save state to localStorage
const saveToLocalStorage = (projectId: string, state: Partial<EditorStore>) => {
  if (!projectId) return;
  
  const dataToSave = {
    pages: state.pages,
    currentPageId: state.currentPageId,
    projectName: state.projectName,
  };
  
  localStorage.setItem(`editorState-${projectId}`, JSON.stringify(dataToSave));
  
  // Update project in user projects list
  const savedProjects = localStorage.getItem("userProjects");
  if (savedProjects) {
    const projects = JSON.parse(savedProjects);
    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].updatedAt = new Date().toISOString();
      projects[projectIndex].name = state.projectName || projects[projectIndex].name;
      localStorage.setItem("userProjects", JSON.stringify(projects));
    }
  }
};

// Helper to load state from localStorage
const loadFromLocalStorage = (projectId: string) => {
  if (!projectId) return null;
  
  const saved = localStorage.getItem(`editorState-${projectId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load project:", e);
      return null;
    }
  }
  return null;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  projectId: null,
  projectName: "Novo Site",
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
  showingPageConfig: false,
  activeSheet: null,
  insertBlockIndex: 0,
  floatingBarPosition: { x: 0, y: 0, isDocked: true },

  // Project actions
  loadProject: (projectId: string) => {
    const savedState = loadFromLocalStorage(projectId);
    if (savedState) {
      set({
        projectId,
        pages: savedState.pages,
        currentPageId: savedState.currentPageId,
        projectName: savedState.projectName || "Novo Site",
      });
    } else {
      set({ projectId });
    }
  },

  setProjectName: (name: string) => {
    set({ projectName: name });
    const state = get();
    if (state.projectId) {
      saveToLocalStorage(state.projectId, state);
    }
  },

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
      const newState = {
        pages: [...state.pages, newPage],
        currentPageId: newPage.id,
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  removePage: (pageId) =>
    set((state) => {
      const newPages = state.pages.filter((p) => p.id !== pageId);
      if (newPages.length === 0) {
        // Always keep at least one page
        return state;
      }
      const newState = {
        pages: newPages,
        currentPageId: state.currentPageId === pageId ? newPages[0].id : state.currentPageId,
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  updatePage: (pageId, updates) =>
    set((state) => {
      const newState = {
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, ...updates } : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  setCurrentPage: (pageId) =>
    set({
      currentPageId: pageId,
      selectedBlockId: null,
      selectedElementId: null,
      selectedHeaderFooter: null,
      showingPageConfig: false,
    }),

  updatePageHeader: (pageId, header) =>
    set((state) => {
      const newState = {
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, header: { ...p.header, ...header } } : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  updatePageFooter: (pageId, footer) =>
    set((state) => {
      const newState = {
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, footer: { ...p.footer, ...footer } } : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

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
          backgroundImage: '',
          backgroundGradient: '',
          backgroundOpacity: 100,
          backgroundBlur: 0,
          padding: 2,
          minHeight: 120,
        },
      };

      const newState = {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? { ...p, blocks: [...p.blocks, newBlock] }
            : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  addBlockAt: (type, index) =>
    set((state) => {
      const currentPage = state.pages.find((p) => p.id === state.currentPageId);
      if (!currentPage) return state;

      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type,
        elements: [],
        style: {
          backgroundColor: '#ffffff',
          backgroundImage: '',
          backgroundGradient: '',
          backgroundOpacity: 100,
          backgroundBlur: 0,
          padding: 2,
          minHeight: 120,
        },
      };

      const blocks = [...currentPage.blocks];
      blocks.splice(index, 0, newBlock);

      const newState = {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? { ...p, blocks }
            : p
        ),
        selectedBlockId: newBlock.id,
        activeSheet: null,
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  removeBlock: (blockId) =>
    set((state) => {
      const newState = {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
            : p
        ),
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  updateBlock: (blockId, updates) =>
    set((state) => {
      const newState = {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? {
                ...p,
                blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
              }
            : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  selectBlock: (blockId) =>
    set({ selectedBlockId: blockId, selectedElementId: null, selectedHeaderFooter: null, showingPageConfig: false }),

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

      const newState = {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId ? { ...p, blocks } : p
        ),
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  // Element actions
  addElement: (blockId, element) =>
    set((state) => {
      const newState = {
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
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  removeElement: (blockId, elementId) =>
    set((state) => {
      const newState = {
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
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  updateElement: (blockId, elementId, updates) =>
    set((state) => {
      const newState = {
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
      };
      if (state.projectId) {
        saveToLocalStorage(state.projectId, { ...state, ...newState });
      }
      return newState;
    }),

  selectElement: (elementId) =>
    set({ selectedElementId: elementId, selectedHeaderFooter: null, showingPageConfig: false }),

  selectHeaderFooter: (type) =>
    set({ selectedHeaderFooter: type, selectedBlockId: null, selectedElementId: null, showingPageConfig: false }),

  togglePageConfig: () =>
    set((state) => ({
      showingPageConfig: !state.showingPageConfig,
      selectedBlockId: null,
      selectedElementId: null,
      selectedHeaderFooter: null,
    })),

  setActiveSheet: (sheet) =>
    set({ activeSheet: sheet }),

  setInsertBlockIndex: (index) =>
    set({ insertBlockIndex: index }),

  setFloatingBarPosition: (position) =>
    set({ floatingBarPosition: position }),
}));
