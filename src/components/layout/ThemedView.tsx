
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { ScrollView, StyleSheet, ViewProps } from 'react-native';

type Props = ViewProps & {
    surface?: boolean; // se quiser usar cor de card
};

export const ThemedView: React.FC<Props> = ({ style, surface = false, ...rest }) => {
    const { theme } = useTheme();

    return (
        <ScrollView
            style={[
                { backgroundColor: surface ? theme.surface : theme.background },
                styles.container,
                style,
            ]}
            {...rest}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
