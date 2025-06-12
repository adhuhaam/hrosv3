import { useTheme } from '@/app/theme-context';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type HandbookSubsection = {
    sub_heading: string;
    content: string;
    image: string | null;
};

type HandbookSection = {
    main_heading: string;
    subsections: HandbookSubsection[];
};

export default function HandbookScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [data, setData] = useState<HandbookSection[]>([]);
    const [filteredData, setFilteredData] = useState<HandbookSection[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const sectionRefs = useRef<Record<number, View | null>>({});
    const sectionPositions = useRef<Record<number, number>>({});

    const fetchHandbook = async () => {
        try {
            const res = await axios.get('https://api.rccmaldives.com/ess/handbook/index.php');
            if (res.data.status === 'success') {
                setData(res.data.data);
                setFilteredData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch handbook', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHandbook();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        const keyword = text.toLowerCase().trim();

        if (!keyword) {
            setFilteredData(data);
            return;
        }

        const filtered = data
            .map(section => {
                const matched = section.subsections.filter(sub =>
                    sub.sub_heading.toLowerCase().includes(keyword) ||
                    sub.content.toLowerCase().includes(keyword)
                );
                if (matched.length > 0) {
                    return { ...section, subsections: matched };
                }
                return null;
            })
            .filter((s): s is HandbookSection => s !== null);

        setFilteredData(filtered);
    };

    const scrollToSection = (index: number) => {
        const y = sectionPositions.current[index];
        if (typeof y === 'number') {
            scrollViewRef.current?.scrollTo({ y, animated: true });
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <ActivityIndicator size="large" color="#006bad" />
                <Text style={[styles.loadingText, { color: isDark ? '#ccc' : '#555' }]}>
                    {t('handbook.loading')}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#F8F9FC' }}>
            <View style={[styles.header, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>
                    {t('handbook.title', 'HR HANDBOOK')}
                </Text>

                <TextInput
                    placeholder={t('handbook.searchPlaceholder')}
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearch}
                    style={[
                        styles.searchInput,
                        {
                            backgroundColor: isDark ? '#1e1e1e' : '#f1f3f9',
                            color: isDark ? '#fff' : '#000',
                            borderColor: isDark ? '#333' : '#ccc',
                        },
                    ]}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tocScroll}>
                    {filteredData.map((section, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => scrollToSection(index)}
                            style={[
                                styles.tocItem,
                                {
                                    backgroundColor: isDark ? '#1c1c1e' : '#e2e8f0',
                                    borderColor: isDark ? '#333' : '#ccc',
                                },
                            ]}
                        >
                            <Text style={{ color: isDark ? '#fff' : '#111', fontSize: 12 }}>
                                {section.main_heading}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={{ paddingHorizontal: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchHandbook} />}
            >
                {filteredData.length === 0 ? (
                    <Text style={{ color: isDark ? '#999' : '#444', textAlign: 'center', marginTop: 20 }}>
                        {t('handbook.noResults')}
                    </Text>
                ) : (
                    filteredData.map((section, index) => (
                        <View
                            key={index}
                            ref={ref => {
                                if (ref) sectionRefs.current[index] = ref;
                            }}
                            onLayout={event => {
                                sectionPositions.current[index] = event.nativeEvent.layout.y;
                            }}
                        >
                            <Text style={[styles.sectionHeading, { color: isDark ? '#fff' : '#1e293b' }]}>
                                {section.main_heading}
                            </Text>

                            {section.subsections.map((sub, j) => (
                                <View
                                    key={j}
                                    style={[
                                        styles.pageCard,
                                        {
                                            backgroundColor: isDark ? '#1a1a1a' : '#fff',
                                            shadowColor: isDark ? '#000' : '#ccc',
                                        },
                                    ]}
                                >
                                    <Text style={[styles.subHeading, { color: isDark ? '#fff' : '#111' }]}>
                                        {sub.sub_heading}
                                    </Text>

                                    {sub.image && (
                                        <Image
                                            source={{ uri: sub.image }}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                    )}

                                    <Text
                                        style={[
                                            styles.content,
                                            {
                                                color: isDark ? '#bbb' : '#333',
                                                fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
                                            },
                                        ]}
                                    >
                                        {sub.content}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 14 },
    header: {
        paddingTop: 20,
        paddingBottom: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Poppins-Regular',
        marginBottom: 8,
    },
    searchInput: {
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        fontSize: 14,
        marginBottom: 10,
    },
    tocScroll: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    tocItem: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 10,
    },
    pageCard: {
        padding: 18,
        borderRadius: 14,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    content: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'justify',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 12,
    },
});
