import { create } from 'zustand';
import { Block, BlockElement, EditorState } from '@/types/editor';

interface EditorStore extends EditorState {
  addBlock: (type: Block['type']) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  selectBlock: (blockId: string | null) => void;
  addElement: (blockId: string, element: BlockElement) => void;
  removeElement: (blockId: string, elementId: string) => void;
  updateElement: (blockId: string, elementId: string, updates: Partial<BlockElement>) => void;
  selectElement: (elementId: string | null) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  blocks: [],
  selectedBlockId: null,
  selectedElementId: null,

  addBlock: (type) =>
    set((state) => ({
      blocks: [
        ...state.blocks,
        {
          id: `block-${Date.now()}`,
          type,
          elements: [],
          style: {
            backgroundColor: '#ffffff',
            padding: 2,
            minHeight: 120,
          },
        },
      ],
    })),

  removeBlock: (blockId) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== blockId),
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
    })),

  updateBlock: (blockId, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    })),

  selectBlock: (blockId) => set({ selectedBlockId: blockId, selectedElementId: null }),

  addElement: (blockId, element) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId
          ? { ...b, elements: [...b.elements, element] }
          : b
      ),
    })),

  removeElement: (blockId, elementId) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId
          ? { ...b, elements: b.elements.filter((e) => e.id !== elementId) }
          : b
      ),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    })),

  updateElement: (blockId, elementId, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              elements: b.elements.map((e) =>
                e.id === elementId ? { ...e, ...updates } : e
              ),
            }
          : b
      ),
    })),

  selectElement: (elementId) => set({ selectedElementId: elementId }),

  moveBlock: (blockId, direction) =>
    set((state) => {
      const blocks = [...state.blocks];
      const index = blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return state;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return state;

      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
      return { blocks };
    }),
}));
