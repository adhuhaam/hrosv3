import { useTheme } from '@/app/theme-context';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function ChatScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const scrollViewRef = useRef<ScrollView>(null);
    const [empNo, setEmpNo] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const loadEmpNo = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                setEmpNo(parsed.emp_no);
            }
        } catch (err) {
            console.error('Error loading emp_no', err);
        }
    };

    const fetchMessages = async () => {
        if (!empNo) return;
        try {
            const res = await axios.get(`https://api.rccmaldives.com/ess/chat/index.php?emp_no=${empNo}`);
            if (res.data.status === 'success') {
                setMessages(res.data.messages);
                if (res.data.messages.length > lastMessageCount) {
                    const latest = res.data.messages[res.data.messages.length - 1];
                    if (latest.from === 'hr') {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: 'New message from HR',
                                body: latest.message,
                                sound: 'default',
                            },
                            trigger: null,
                            android: {
                                channelId: 'chat-messages',
                                sound: 'default',
                                priority: 'max',
                                vibrate: [0, 250, 250, 250],
                            },
                        });






                    }

                }
                setLastMessageCount(res.data.messages.length);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };


    const sendMessage = async () => {
        if (!empNo || !newMessage.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Type something first',
                visibilityTime: 2000,
            });
            return;
        }

        const payload = new URLSearchParams({
            emp_no: empNo,
            message: newMessage.trim(),
        }).toString();

        try {
            const res = await axios.post(
                'https://api.rccmaldives.com/ess/chat/send.php',
                payload,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            if (res.data.status === 'success') {
                setNewMessage('');
                await fetchMessages();
                setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message || 'Send failed',
                    visibilityTime: 2000,
                });
            }
        } catch (err) {
            console.error('Send error:', err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error sending message',
                visibilityTime: 2000,
            });
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMessages();
    }, [empNo]);

    useEffect(() => {
        loadEmpNo();
    }, []);

    useEffect(() => {
        if (empNo) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [empNo]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDark ? '#000' : '#f2f2f2' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.chatContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.length === 0 && !loading ? (
                    <Text style={[styles.noChatText, { color: isDark ? '#aaa' : '#444' }]}>No messages yet</Text>
                ) : (
                    messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageBubble,
                                msg.from === 'employee' ? styles.selfBubble : styles.hrBubble,
                                {
                                    backgroundColor: msg.from === 'employee'
                                        ? (isDark ? '#00344d' : '#daf1ff')
                                        : (isDark ? '#1a1a1a' : '#eee'),
                                },
                            ]}
                        >
                            <View style={styles.senderRow}>
                                <FontAwesome
                                    name={msg.from === 'employee' ? 'user' : 'user'}
                                    size={16}
                                    color={isDark ? '#aaa' : '#444'}
                                    style={styles.icon}
                                />
                                <Text style={styles.senderLabel}>{msg.from === 'employee' ? 'Me' : 'RCC HR'}</Text>
                            </View>
                            <Text style={{ color: isDark ? '#fff' : '#000' }}>{msg.message}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(msg.timestamp).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    ))
                )}
                {isTyping && (
                    <Text style={[styles.typingText, { color: isDark ? '#888' : '#666' }]}>Typing...</Text>
                )}
            </ScrollView>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#111' : '#fff' }]}>
                <TextInput
                    value={newMessage}
                    onChangeText={(text) => {
                        setNewMessage(text);
                        setIsTyping(text.length > 0);
                    }}
                    placeholder={t('chat.placeholder') || 'Type your message...'}
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
                    <Ionicons name="send" size={22} color="#006bad" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        padding: 10,
        paddingBottom: 80,
    },
    noChatText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
    },
    typingText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 6,
        textAlign: 'left',
    },
    senderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    senderLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#888',
        marginLeft: 5,
    },
    icon: {
        marginRight: 2,
    },
    messageBubble: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 8,
        maxWidth: '85%',
    },
    selfBubble: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 2,
    },
    hrBubble: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 2,
    },
    timestamp: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        fontSize: 14,
    },
    sendButton: {
        marginLeft: 10,
        padding: 6,
    },
});
