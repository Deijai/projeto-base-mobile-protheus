import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedSafeArea } from '../../src/components/layout/ThemedSafeArea';
import { useTheme } from '../../src/hooks/useTheme';
import { useToast } from '../../src/hooks/useToast';
import { useAuthStore } from '../../src/store/authStore';
import { useConnectionStore } from '../../src/store/connectionStore';

export default function SignInScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const toast = useToast();
    const { isValid: restOk } = useConnectionStore();
    const login = useAuthStore((s) => s.login);

    const [username, setUsername] = useState(''); // user do Protheus
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!restOk) {
            toast.error('Configure o endereço REST primeiro.');
            router.push('/config-rest');
            return;
        }

        if (!username.trim() || !password.trim()) {
            toast.error('Informe usuário e senha.');
            return;
        }

        setLoading(true);
        const ok = await login(username.trim(), password.trim());
        setLoading(false);

        if (!ok) {
            toast.error('Usuário ou senha inválidos.');
        } else {
            toast.success('Bem-vindo 👋');
            router.replace('/branches');
        }
    };

    return (
        <ThemedSafeArea style={{ flex: 1, backgroundColor: theme.background }}>
            {/* topo com botão de voltar e config */}
            <View style={styles.topBar}>
                {/* <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={25} color={theme.primary} />
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => router.push('/config-rest')}>
                    <Ionicons name="settings-outline" size={23} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {/* conteúdo principal */}
            <View style={styles.content}>
                {/* logo redondinho */}
                <View style={[styles.logoWrapper, { backgroundColor: '#fde3e3' }]}>
                    {/* se tiver logo usa <Image /> */}
                    <Image
                        source={require('../../assets/images/react-logo.png')}
                        style={{ width: 48, height: 48, tintColor: '#d72626' }}
                        resizeMode="contain"
                    />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>Sign in with email</Text>
                <Text style={[styles.subtitle, { color: theme.muted }]}>
                    Enter your details to continue. If you’ve forgotten, we’ll help you out.
                </Text>

                {/* caixinha de input igual do print */}
                <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.inputLabel, { color: theme.muted }]}>User / E-mail</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="ex: maria"
                            placeholderTextColor={theme.muted}
                            style={[styles.input, { color: theme.text }]}
                            autoCapitalize="none"
                        />
                        {username.length > 0 && (
                            <TouchableOpacity onPress={() => setUsername('')}>
                                <Ionicons name="close-circle" size={20} color={theme.muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.inputLabel, { color: theme.muted }]}>Password</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="********"
                            placeholderTextColor={theme.muted}
                            secureTextEntry={secure}
                            style={[styles.input, { color: theme.text }]}
                        />
                        <TouchableOpacity onPress={() => setSecure((p) => !p)}>
                            <Ionicons
                                name={secure ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={theme.muted}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/(auth)/recovery-password')}>
                    <Text style={[styles.forgot, { color: theme.primary }]}>I forgot my password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Entering...' : 'Continue'}</Text>
                </TouchableOpacity>
            </View>
        </ThemedSafeArea>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 18,
        paddingTop: 8,
        marginBottom: 6,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 16,
    },
    logoWrapper: {
        width: 76,
        height: 76,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 6,
        marginBottom: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 4,
    },
    inputBox: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        gap: 4,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    input: {
        flex: 1,
        paddingVertical: 6,
        fontSize: 15,
    },
    forgot: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '600',
    },
    button: {
        marginTop: 14,
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
