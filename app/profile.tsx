// File path: app/profile.tsx
import { useTheme } from '@/app/theme-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { Image as CachedImage } from 'react-native-expo-image-cache';

export default function ProfileScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tileBg = isDark ? '#1e1e1e' : '#fff';
    const tileText = isDark ? '#ccc' : '#000';
    const labelx = isDark ? '#fff' : '#000';
    const vlauex = isDark ? '#ccc' : '#000';
    const [empNo, setEmpNo] = useState('');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [photoFileName, setPhotoFileName] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        contact_number: '',
        email: '',
        present_address: '',
        emergency_contact_number: '',
        emergency_contact_name: ''
    });

    useEffect(() => {
        const load = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);
            setEmpNo(user.emp_no);
            try {
                const [empRes, photoRes] = await Promise.all([
                    axios.get(`https://api.rccmaldives.com/ess/employees/index.php?emp_no=${user.emp_no}`),
                    axios.get(`https://api.rccmaldives.com/ess/document/index.php?emp_no=${user.emp_no}`)
                ]);
                const foundPhoto = Array.isArray(photoRes?.data?.data)
                    ? (photoRes.data.data.find((doc: any) => doc.photo_file_name)?.photo_file_name ?? null)
                    : null;
                if (empRes.data.status === 'success') {
                    setProfile(empRes.data.data);
                    setForm({
                        contact_number: empRes.data.data.contact_number,
                        email: empRes.data.data.email,
                        present_address: empRes.data.data.persentaddress,
                        emergency_contact_number: empRes.data.data.emergency_contact_number ?? '',
                        emergency_contact_name: empRes.data.data.emergency_contact_name ?? ''
                    });
                    setPhotoFileName(foundPhoto);
                }
            } catch {
                Alert.alert(t('error.title'), t('error.profileLoad'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        const { contact_number, email, present_address, emergency_contact_number, emergency_contact_name } = form;
        if (!contact_number || !email || !present_address || !emergency_contact_name || !emergency_contact_number) {
            Alert.alert(t('error.missingFields'), t('error.allFieldsRequired'));
            return;
        }
        const formData = new FormData();
        formData.append('emp_no', empNo);
        formData.append('contact_number', contact_number);
        formData.append('email', email);
        formData.append('present_address', present_address);
        formData.append('emergency_contact_number', emergency_contact_number);
        formData.append('emergency_contact_name', emergency_contact_name);

        try {
            const res = await axios.post(
                'https://api.rccmaldives.com/ess/employees/update_profile.php',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (res.data.status === 'success') {
                setModalVisible(false);
                ToastAndroid.show(t('toast.profileUpdated'), ToastAndroid.SHORT);
                setProfile({
                    ...profile,
                    ...form,
                    persentaddress: form.present_address
                });
            } else {
                Alert.alert(t('error.updateFailed'), res.data.message || t('error.tryAgain'));
            }
        } catch {
            Alert.alert(t('error.title'), t('error.somethingWrong'));
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#f9f9f9' }]}>
            <View style={[styles.card, { backgroundColor: tileBg }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                        {!imageError && photoFileName ? (
                            <CachedImage
                                uri={`https://hros.rccmaldives.com/assets/document/${photoFileName}`}
                                style={styles.avatar}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Ionicons name="person-circle-outline" size={100} color="#fff" />
                        )}
                    </View>
                    <Text style={styles.cardName}>{profile.name}</Text>
                    <Text style={styles.cardMeta}>{profile.designation} • #{profile.emp_no}</Text>
                </View>

                <View style={styles.infoBlock}>
                    <Text style={[styles.sectionTitle, { color: tileText }]}>{t('profile.personalInfo')}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.contact')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.contact_number}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.email')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.email}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.address')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.persentaddress}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.emergencyName')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.emergency_contact_name}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.emergencyNumber')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.emergency_contact_number}</Text>

                    <Text style={[styles.sectionTitle, { color: tileText }]}>{t('profile.jobInfo')}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.department')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.department}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.dateOfJoin')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.date_of_join}</Text>
                    <Text style={[styles.label, { color: labelx }]}>{t('profile.salary')}</Text>
                    <Text style={[styles.value, { color: vlauex }]}>{profile.basic_salary}</Text>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: tileBg }]}>
                        <Text style={[styles.sectionTitle, { marginBottom: 10, color: tileText }]}>{t('profile.editProfile')}</Text>
                        {['contactNumber', 'email', 'presentAddress', 'emergencyContactName', 'emergencyContactNumber'].map((key) => {
                            const mapKeys: Record<string, keyof typeof form> = {
                                contactNumber: 'contact_number',
                                email: 'email',
                                presentAddress: 'present_address',
                                emergencyContactName: 'emergency_contact_name',
                                emergencyContactNumber: 'emergency_contact_number'
                            };
                            const formKey = mapKeys[key];
                            return (
                                <TextInput
                                    key={key}
                                    placeholder={t(`profile.${key}`)}
                                    placeholderTextColor="#999"
                                    style={[styles.input, { color: labelx }]}
                                    value={form[formKey]}
                                    onChangeText={(val) => setForm({ ...form, [formKey]: val })}
                                />
                            );
                        })}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveText}>{t('profile.save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>{t('profile.cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        marginBottom: 20
    },
    cardHeader: {
        backgroundColor: '#006bad',
        padding: 20,
        alignItems: 'center'
    },
    avatarContainer: {
        marginBottom: 10
    },
    avatar: {
        width: 100,
        height: 120,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#f0f0f0'
    },
    cardName: { fontSize: 22, fontWeight: '700', color: '#fff' },
    cardMeta: { fontSize: 14, color: '#f1f1f1', marginTop: 4 },
    infoBlock: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    label: { fontSize: 13, color: '#777', marginTop: 10 },
    value: { fontSize: 15, fontWeight: '500', color: '#222' },
    editButton: {
        backgroundColor: '#006bad',
        padding: 14,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center'
    },
    editButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        padding: 20,
        borderRadius: 12
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
        color: '#000'
    },
    modalActions: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    saveButton: {
        backgroundColor: '#006bad',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6
    },
    saveText: {
        color: '#fff',
        fontWeight: '600'
    },
    cancelText: {
        marginTop: 12,
        color: '#888'
    }
});
