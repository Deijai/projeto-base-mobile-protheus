import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useToastStore } from '../../store/toastStore';

export const Toast: React.FC = () => {
    const { theme } = useTheme();
    const { visible, message, type } = useToastStore();

    const bgColor =
        type === 'success'
            ? '#16A34A'
            : type === 'error'
                ? '#DC2626'
                : theme.surface;

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container]}>
            <View
                style={[
                    styles.toast,
                    {
                        backgroundColor: bgColor,
                        borderColor: theme.border,
                    },
                ]}
            >
                <Text style={[styles.text, { color: '#fff' }]}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
        elevation: 100,
    },
    toast: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: '80%',
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
});
