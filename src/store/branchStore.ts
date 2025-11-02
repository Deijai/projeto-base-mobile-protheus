import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BranchDto, branchService } from '../api/branchService';

type BranchState = {
    branches: BranchDto[];
    selectedBranch: BranchDto | null;
    loading: boolean;
    error: string | null;
    hasNext: boolean;
    page: number; // 👈 controla pagina atual
    fetchBranches: (reset?: boolean) => Promise<void>;
    selectBranch: (branch: BranchDto) => void;
    clear: () => void;
};

export const useBranchStore = create<BranchState>()(
    persist(
        (set, get) => ({
            branches: [],
            selectedBranch: null,
            loading: false,
            error: null,
            hasNext: false,
            page: 1,

            async fetchBranches(reset = false) {
                const { loading, hasNext, page, branches } = get();

                // evita requisição duplicada
                if (loading) return;

                // se não for reset e o backend já falou que não tem próxima, sai
                if (!reset && !hasNext && branches.length > 0) {
                    return;
                }

                try {
                    set({ loading: true, error: null });

                    // se for reset, sempre busca página 1
                    const nextPage = reset ? 1 : page + 1;
                    const res = await branchService.list(nextPage);

                    if (reset) {
                        // primeira carga
                        set({
                            branches: res.items,
                            hasNext: res.hasNext ?? false,
                            page: 1,
                        });
                    } else {
                        // append
                        set({
                            branches: [...branches, ...res.items],
                            hasNext: res.hasNext ?? false,
                            page: nextPage,
                        });
                    }
                } catch (err: any) {
                    set({
                        error: err?.message ?? 'Erro ao carregar filiais',
                    });
                } finally {
                    set({ loading: false });
                }
            },

            selectBranch(branch) {
                set({ selectedBranch: branch });
            },

            clear() {
                set({
                    branches: [],
                    selectedBranch: null,
                    hasNext: false,
                    page: 1,
                });
            },
        }),
        {
            name: 'branch-storage',
            storage: {
                getItem: async (name) => {
                    const value = await AsyncStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: async (name, value) => {
                    await AsyncStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: async (name) => {
                    await AsyncStorage.removeItem(name);
                },
            },
        }
    )
);
