import { useTheme } from '@/app/theme-context';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const handleLanguageChange = async (lang: string) => {
        try {
            await i18n.changeLanguage(lang);
            await AsyncStorage.setItem('lang', lang);
            setLanguage(lang);
        } catch (err) {
            console.error('Language change error:', err);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Language Selection */}
            <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>{t('setting.selectLanguage')}</Text>
            <View style={styles.row}>
                <Ionicons name="language-sharp" size={22} color={isDark ? '#fff' : '#333'} style={styles.icon} />
                <Picker
                    selectedValue={language}
                    onValueChange={handleLanguageChange}
                    style={[styles.picker, { color: isDark ? '#fff' : '#333' }]}
                    dropdownIconColor={isDark ? '#fff' : '#333'}
                >
                    <Picker.Item label="English" value="en" />
                    <Picker.Item label="ދިވެހި" value="dv" />
                    <Picker.Item label="हिन्दी" value="hi" />
                    <Picker.Item label="தமிழ்" value="ta" />
                    <Picker.Item label="മലയാളം" value="ml" />
                    <Picker.Item label="বাংলা" value="bn" />
                    <Picker.Item label="සිංහල" value="si" />
                </Picker>
            </View>

            {/* Theme Switch */}
            <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>{t('setting.editTheme') || 'Theme'}</Text>
            <View style={styles.row}>
                <Ionicons name="moon" size={22} color={isDark ? '#fff' : '#333'} style={styles.icon} />
                <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>{t('setting.darkMode') || 'Dark Mode'}</Text>
                <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    thumbColor={isDark ? '#fff' : '#006bad'}
                    trackColor={{ false: '#ccc', true: '#006bad' }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    icon: {
        marginRight: 10,
    },
    picker: {
        flex: 1,
        height: 40,
    },
    label: {
        flex: 1,
        fontSize: 16,
    },
});
