// src/store/connectionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RestConfig, restValidator } from '../api/restValidatorService';

type ConnectionState = {
    config: RestConfig | null;
    isValid: boolean;
    isTesting: boolean;
    error: string | null;
    testConnection: (config: RestConfig) => Promise<{ success: boolean; error?: string }>;
    saveConfig: (config: RestConfig) => void;
    testAndSave: (config: RestConfig) => Promise<{ success: boolean; error?: string }>;
    getBaseUrl: () => string | null; // 👈 ADICIONAMOS
    clear: () => void;
};

export const useConnectionStore = create<ConnectionState>()(
    persist(
        (set, get) => ({
            config: null,
            isValid: false,
            isTesting: false,
            error: null,

            async testConnection(config) {
                set({ isTesting: true, error: null });
                const result = await restValidator.testConnectionWithFallback(config);
                if (result.success) {
                    set({ isTesting: false, isValid: true, error: null });
                    return { success: true };
                } else {
                    set({
                        isTesting: false,
                        error: result.error || 'Falha ao testar REST',
                        isValid: false,
                    });
                    return { success: false, error: result.error, isValid: false, };
                }
            },

            saveConfig(config) {
                set({ config, isValid: true });
            },

            async testAndSave(config) {
                const r = await get().testConnection(config);
                if (r.success) {
                    get().saveConfig(config);
                }
                return r;
            },

            // 👇 ESSA É A FUNÇÃO QUE FALTAVA
            getBaseUrl() {
                const cfg = get().config;
                if (!cfg) return null;
                const portPart = cfg.port?.trim() ? `:${cfg.port.trim()}` : '';
                const endpointClean = cfg.endpoint?.replace(/^\//, '') || 'rest';
                // ex: https://meuservidor:8080/rest
                return `${cfg.protocol.toLowerCase()}://${cfg.address.trim()}${portPart}/${endpointClean}`;
            },

            clear() {
                set({ config: null, isValid: false, error: null });
            },
        }),
        {
            name: 'connection-storage',
        }
    )
);
