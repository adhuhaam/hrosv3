import { useTheme } from '@/app/theme-context';
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import { Image as CachedImage } from "react-native-expo-image-cache";

export default function ProfileScreen() {
    const { t } = useTranslation();
    const [empNo, setEmpNo] = useState("");
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [photoFileName, setPhotoFileName] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        contact_number: "",
        email: "",
        persent_address: "",
        emergency_contact_number: "",
        emergency_contact_name: "",
    });

    // Theme
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tileBg = isDark ? '#1e1e1e' : '#fff';
    const tileText = isDark ? '#ccc' : '#000';

    useEffect(() => {
        const load = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (!userData) return;

            const user = JSON.parse(userData);
            setEmpNo(user.emp_no);

            try {
                const [empRes, photoRes] = await Promise.all([
                    axios.get(`https://api.rccmaldives.com/ess/employees/index.php?emp_no=${user.emp_no}`),
                    axios.get(`https://api.rccmaldives.com/ess/document/index.php?emp_no=${user.emp_no}`),
                ]);

                const foundPhoto = Array.isArray(photoRes?.data?.data)
                    ? (photoRes.data.data.find(
                        (doc: { photo_file_name?: string }) => doc.photo_file_name
                    )?.photo_file_name ?? null)
                    : null;

                if (empRes.data.status === "success") {
                    setProfile(empRes.data.data);
                    setForm({
                        contact_number: empRes.data.data.contact_number,
                        email: empRes.data.data.email,
                        persent_address: empRes.data.data.persentaddress,
                        emergency_contact_number: empRes.data.data.emergency_contact_number ?? "",
                        emergency_contact_name: empRes.data.data.emergency_contact_name ?? "",
                    });
                    setPhotoFileName(foundPhoto);
                }
            } catch {
                Alert.alert(t("error.title"), t("error.profileLoad"));
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleSave = async () => {
        const {
            contact_number,
            email,
            persent_address,
            emergency_contact_number,
            emergency_contact_name,
        } = form;

        if (!contact_number || !email || !persent_address || !emergency_contact_name || !emergency_contact_number) {
            Alert.alert(t("error.missingFields"), t("error.allFieldsRequired"));
            return;
        }

        const formData = new FormData();
        formData.append("emp_no", empNo);
        formData.append("contact_number", contact_number);
        formData.append("email", email);
        formData.append("persent_address", persent_address);
        formData.append("emergency_contact_number", emergency_contact_number);
        formData.append("emergency_contact_name", emergency_contact_name);

        try {
            const res = await axios.post(
                "https://api.rccmaldives.com/ess/employees/update_profile.php",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.status === "success") {
                setModalVisible(false);
                ToastAndroid.show(t("toast.profileUpdated"), ToastAndroid.SHORT);
                setProfile({ ...profile, ...form });
            } else {
                Alert.alert(t("error.updateFailed"), res.data.message || t("error.tryAgain"));
            }
        } catch {
            Alert.alert(t("error.title"), t("error.somethingWrong"));
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
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? "#000" : "#f9f9f9" }]}>
            <View style={styles.card}>
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
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardName}>{profile.name}</Text>
                        <Text style={styles.cardMeta}>
                            {profile.designation} • #{profile.emp_no}
                        </Text>
                    </View>
                </View>

                <View style={[styles.cardBody, { backgroundColor: tileBg }]}>
                    <Text style={[styles.sectionTitle, { color: tileText }]}>{t('profile.personalInfo')}</Text>
                    <View style={styles.section}><MaterialIcons name="call" size={18} color="#555" /><Text style={styles.label}>{t('profile.contact')}</Text><Text style={styles.value}>{profile.contact_number}</Text></View>
                    <View style={styles.section}><MaterialIcons name="email" size={18} color="#555" /><Text style={styles.label}>{t('profile.email')}</Text><Text style={styles.value}>{profile.email}</Text></View>
                    <View style={styles.section}><Ionicons name="location-sharp" size={18} color="#555" /><Text style={styles.label}>{t('profile.address')}</Text><Text style={styles.value}>{profile.persentaddress}</Text></View>
                    <View style={styles.section}><Ionicons name="person-circle" size={18} color="#555" /><Text style={styles.label}>{t('profile.emergencyName')}</Text><Text style={styles.value}>{profile.emergency_contact_name}</Text></View>
                    <View style={styles.section}><MaterialIcons name="phone" size={18} color="#555" /><Text style={styles.label}>{t('profile.emergencyNumber')}</Text><Text style={styles.value}>{profile.emergency_contact_number}</Text></View>
                </View>

                <View style={[styles.cardBody, { backgroundColor: tileBg }]}>
                    <Text style={[styles.sectionTitle, { color: tileText }]}>{t('profile.jobInfo')}</Text>
                    <View style={styles.section}><Feather name="users" size={18} color="#555" /><Text style={styles.label}>{t('profile.department')}</Text><Text style={styles.value}>{profile.department}</Text></View>
                    <View style={styles.section}><Feather name="calendar" size={18} color="#555" /><Text style={styles.label}>{t('profile.dateOfJoin')}</Text><Text style={styles.value}>{profile.date_of_join}</Text></View>
                    <View style={styles.section}><Feather name="dollar-sign" size={18} color="#555" /><Text style={styles.label}>{t('profile.salary')}</Text><Text style={styles.value}>{profile.basic_salary}</Text></View>
                </View>

                <View style={[{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: tileBg }]}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    cardHeader: {
        backgroundColor: "#006bad",
        padding: 20,
        alignItems: "center",
    },
    avatarContainer: {
        width: 80,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: 10,
    },
    avatar: {
        width: 80,
        height: 100,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "#f0f0f0",
    },
    cardHeaderText: { alignItems: "center" },
    cardName: { fontSize: 22, fontWeight: "700", color: "#fff" },
    cardMeta: { fontSize: 14, color: "#f1f1f1", marginTop: 4 },
    cardBody: { padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
    section: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: { fontSize: 13, fontWeight: "600", marginTop: 4, color: "#555" },
    value: { fontSize: 14, marginTop: 4, color: "#222" },
    editButton: {
        backgroundColor: '#006bad',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
