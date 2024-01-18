// place files you want to import through the `$lib` alias in this folder.
import { writable } from 'svelte/store'
export const createProgressStore = () => {
    const { subscribe, set, update } = writable({
        progress: 0,
        total: 0,
        status: 'idle',
        error: null as Error | null,
    })
    return {
        subscribe,
        set,
        update,
        start: (total: number) => set({
            progress: 0,
            total,
            status: 'running',
            error: null,
        }),
        increment: () => update(val => {
            val.progress += 1
            return val;
        }),
        reset: () => set({  
            progress: 0,
            total: 0,
            status: 'idle',
            error: null,
        }),
        error: (error: Error) => set({
            progress: 0,
            total: 0,
            status: 'error',
            error,
        }),
    }
}

export const progress = createProgressStore();