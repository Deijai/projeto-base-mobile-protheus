// src/store/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/authService';

export interface User {
    username: string;
    name: string;
    email?: string;
    token: string;
    refreshToken?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            async login(username, password) {
                try {
                    set({ isLoading: true, error: null });
                    const response = await authService.login(username, password);

                    // O retorno deve conter o token JWT e dados do usuário
                    const user: User = {
                        username,
                        name: response.name || username,
                        token: response.access_token,
                        refreshToken: response.refresh_token,
                    };

                    set({ user, isAuthenticated: true });
                    return true;
                } catch (error: any) {
                    console.error('Erro de login', error);
                    set({ error: error.message || 'Falha no login', isAuthenticated: false });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout() {
                set({ user: null, isAuthenticated: false });
                AsyncStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
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
