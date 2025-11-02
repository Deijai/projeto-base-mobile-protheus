// src/utils/debugStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function debugStorage(key?: string) {
    if (key) {
        const value = await AsyncStorage.getItem(key);
        console.log(`🔎 ${key}:`, JSON.parse(value ?? 'null'));
    } else {
        const keys = await AsyncStorage.getAllKeys();
        const entries = await AsyncStorage.multiGet(keys);
        console.log('📦 STORAGE:');
        entries.forEach(([k, v]) => console.log(k, JSON.parse(v ?? 'null')));
    }
}
