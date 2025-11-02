import { getTheme } from '@/src/constants/theme';
import { useThemeStore } from '@/src/store/themeStore';

export function useTheme() {
    const themeMode = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    const theme = getTheme(themeMode);

    return { themeMode, theme, toggleTheme };
}
