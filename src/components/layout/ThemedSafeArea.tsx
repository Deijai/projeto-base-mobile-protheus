import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & {
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
    surface?: boolean;
};

export const ThemedSafeArea: React.FC<Props> = ({
    style,
    edges = ['top', 'bottom'], // padrão: protege em cima e embaixo
    surface = false,
    children,
    ...rest
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            edges={edges}
            style={[
                {
                    flex: 1,
                    backgroundColor: surface ? theme.surface : theme.background,
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </SafeAreaView>
    );
};
