import type { ModelStore } from '@/lib/types'
import { create } from 'zustand'


export const useModelStore = create<ModelStore>()((set) => ({
    model: '',
    setModel: (model) => set({ model })
}))