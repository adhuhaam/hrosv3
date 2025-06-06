import { resolveEmpNo, useEmpNo } from '@/app/utils/get-emp-no'; // adjust the import path as needed
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BASE_URL = 'https://api.rccmaldives.com/ess/document/';
const FILE_URL = 'https://hros.rccmaldives.com/assets/document/';

export default function DocumentsScreen() {
    const empNoFromParams = useEmpNo();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            let empNo = empNoFromParams;

            if (!empNo) {
                empNo = await resolveEmpNo();
            }

            if (!empNo) {
                Alert.alert('Missing employee number', 'Cannot load documents.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}index.php?emp_no=${empNo}`);
                const json = await response.json();
                if (json.status === 'success') {
                    setDocuments(json.data);
                } else {
                    Alert.alert('Error', json.message || 'Unable to fetch documents.');
                }
            } catch (error) {
                console.error('Document fetch failed:', error);
                Alert.alert('Network error', 'Failed to load documents.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [empNoFromParams]);

    const handleDownload = async (filename: string) => {
        const fileUri = FILE_URL + filename;
        const localPath = FileSystem.documentDirectory + filename;

        try {
            const downloadResult = await FileSystem.downloadAsync(fileUri, localPath);
            await Sharing.shareAsync(downloadResult.uri);
        } catch (err) {
            console.error('Download failed:', err);
            Alert.alert('Download failed', 'Unable to save or share the file.');
        }
    };

    const renderFile = (filename: string) => {
        if (!filename) return null;

        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename);
        const isPdf = /\.pdf$/i.test(filename);

        return (
            <View style={{ marginBottom: 10 }}>
                {isImage ? (
                    <Image source={{ uri: FILE_URL + filename }} style={styles.image} resizeMode="cover" />
                ) : isPdf ? (
                    <TouchableOpacity
                        style={styles.pdfButton}
                        onPress={() => Linking.openURL(FILE_URL + filename)}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Open PDF</Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(filename)}>
                    <Text style={{ textAlign: 'center' }}>Download</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {documents.map((doc, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.title}>{doc.doc_type}</Text>
                    {renderFile(doc.front_file_name)}
                    {renderFile(doc.back_file_name)}
                    {renderFile(doc.photo_file_name)}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 5,
    },
    downloadButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        borderRadius: 6,
    },
    pdfButton: {
        backgroundColor: '#1d4ed8',
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 5,
    },
});
