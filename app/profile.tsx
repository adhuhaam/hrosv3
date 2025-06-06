import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { useEffect, useState } from 'react';
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
    const [empNo, setEmpNo] = useState('');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [photoFileName, setPhotoFileName] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({ contact_number: '', email: '', persent_address: '' });

    useEffect(() => {
        const load = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;

            const user = JSON.parse(userData);
            setEmpNo(user.emp_no);

            try {
                const [empRes, photoRes] = await Promise.all([
                    axios.get(`https://api.rccmaldives.com/ess/employees/index.php?emp_no=${user.emp_no}`),
                    axios.get(`https://api.rccmaldives.com/ess/document/index.php?emp_no=${user.emp_no}`),
                ]);

                const foundPhoto =
                    Array.isArray(photoRes?.data?.data)
                        ? photoRes.data.data.find((doc: { photo_file_name?: string }) => doc.photo_file_name)
                            ?.photo_file_name ?? null
                        : null;

                if (empRes.data.status === 'success') {
                    setProfile(empRes.data.data);
                    setForm({
                        contact_number: empRes.data.data.contact_number,
                        email: empRes.data.data.email,
                        persent_address: empRes.data.data.persentaddress,
                    });
                    setPhotoFileName(foundPhoto);
                }
            } catch (e) {
                Alert.alert('Error', 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);


    // IMAGE ERROR HANDLING
    const [imageError, setImageError] = useState(false);


    const handleSave = async () => {
        if (!form.contact_number || !form.email || !form.persent_address) {
            Alert.alert('Missing Fields', 'All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('emp_no', empNo);
        formData.append('contact_number', form.contact_number);
        formData.append('email', form.email);
        formData.append('persent_address', form.persent_address);

        try {
            const res = await axios.post(
                'https://api.rccmaldives.com/ess/employees/update_profile.php',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (res.data.status === 'success') {
                setModalVisible(false);
                ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
                setProfile({ ...profile, ...form });
            } else {
                Alert.alert('Update Failed', res.data.message || 'Try again');
            }
        } catch (e) {
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    const [imageLoaded, setImageLoaded] = useState(false);

    if (loading) {
        return (
            <View style={styles.loading}><ActivityIndicator size="large" color="#007AFF" /></View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                {/*USER IMAGE*/}

                <View style={styles.mathi_row}>
                    <View style={styles.avatarContainer}>
                        {!imageError && photoFileName ? (
                            <CachedImage
                                uri={`https://hros.rccmaldives.com/assets/document/${photoFileName}`}
                                style={styles.avatar}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Ionicons name="person-circle-outline" size={80} color="#006BAD" />
                        )}
                    </View>

                    <View style={styles.medhu}>
                        <Text style={styles.name}>{profile.name}</Text>
                        <Text style={styles.subInfo}>
                            {profile.designation} • #{profile.emp_no}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => setModalVisible(true)}
                >
                    <Feather name="edit" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <MaterialIcons name="call" size={18} color="#555" />
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.value}>{profile.contact_number}</Text>
            </View>

            <View style={styles.section}>
                <MaterialIcons name="email" size={18} color="#555" />
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{profile.email}</Text>
            </View>

            <View style={styles.section}>
                <Ionicons name="location-sharp" size={18} color="#555" />
                <Text style={styles.label}>Present Address</Text>
                <Text style={styles.value}>{profile.persentaddress}</Text>
            </View>

            <View style={styles.section}>
                <Feather name="users" size={18} color="#555" />
                <Text style={styles.label}>Department</Text>
                <Text style={styles.value}>{profile.department}</Text>
            </View>

            <View style={styles.section}>
                <Feather name="calendar" size={18} color="#555" />
                <Text style={styles.label}>Date of Join</Text>
                <Text style={styles.value}>{profile.date_of_join}</Text>
            </View>

            <View style={styles.section}>
                <Feather name="dollar-sign" size={18} color="#555" />
                <Text style={styles.label}>Basic Salary</Text>
                <Text style={styles.value}>MVR {profile.basic_salary}</Text>
            </View>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Update Your Infomation</Text>
                        <TextInput
                            placeholder="Contact Number"
                            style={styles.input}
                            value={form.contact_number}
                            onChangeText={(v) => setForm({ ...form, contact_number: v })}
                        />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            value={form.email}
                            onChangeText={(v) => setForm({ ...form, email: v })}
                        />
                        <TextInput
                            placeholder="Present Address"
                            style={[styles.input, { height: 60 }]}
                            multiline
                            value={form.persent_address}
                            onChangeText={(v) => setForm({ ...form, persent_address: v })}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtn}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                                <Text style={styles.saveText}>Save</Text>
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
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { alignItems: "center", marginBottom: 24, position: "relative" },
    name: { fontSize: 20, fontWeight: "700", color: "#333", flexDirection: "row", },
    subInfo: { color: "#777", marginBottom: 8, flexDirection: "row", },
    editIcon: { position: "absolute", top: 0, right: 0 },

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

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        width: "90%",
    },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
    input: {
        backgroundColor: "#F1F1F3",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 12,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    cancelBtn: { color: "#730505", marginRight: 20 },
    saveBtn: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 6,
    },
    saveText: { color: "#fff", fontWeight: "600" },


    imageLoader: {
        position: "absolute",
        zIndex: 1,
    },
    mathi_row: {
        flexDirection: "row",
        alignItems: "center", // vertically align avatar + name
        marginBottom: 10,
    },

    avatarContainer: {
        width: 80,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginRight: 12, // spacing between avatar and name
    },

    avatar: {
        width: 80,
        height: 100,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#007AFF",
        backgroundColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOpacity: 0.14,
    },

    medhu: {
        flex: 1,
        justifyContent: "center",
    },





});
