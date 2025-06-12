import { useTheme } from '@/app/theme-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

const dummyMonths = [
    'June 2025', 'May 2025', 'April 2025', 'March 2025', 'February 2025', 'January 2025'
];

const dummyBreakdown = [
    { label: 'payroll.basic', amount: '4,500.00' },
    { label: 'payroll.serviceAllowance', amount: '500.00' },
    { label: 'payroll.overtime', amount: '250.00' },
    { label: 'payroll.loanDeduction', amount: '-300.00' },
    { label: 'payroll.noPay', amount: '-100.00' },
    { label: 'payroll.totalEarnings', amount: '5,250.00' },
    { label: 'payroll.totalDeductions', amount: '400.00' },
    { label: 'payroll.netSalary', amount: '4,850.00' },
];

export default function PayrollScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const tileBg = isDark ? '#1e1e1e' : '#fff';
    const textColor = isDark ? '#fff' : '#000';
    const subColor = isDark ? '#aaa' : '#444';

    const [monthlySalary, setMonthlySalary] = useState('0');
    const [annualSalary, setAnnualSalary] = useState('0');
    const [employeeName, setEmployeeName] = useState('Employee');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchSalary = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (!storedUser) return;

            const { emp_no } = JSON.parse(storedUser);
            const res = await axios.get(`https://api.rccmaldives.com/ess/employees/index.php?emp_no=${emp_no}`);
            if (res.data.status === 'success') {
                const data = res.data.data;
                setEmployeeName(data.name || 'Employee');

                if (data.basic_salary) {
                    const monthly = parseFloat(data.basic_salary).toFixed(2);
                    setMonthlySalary(monthly);
                    setAnnualSalary((parseFloat(monthly) * 12).toFixed(2));
                }
            }
        };
        fetchSalary();
    }, []);

    const formatMoney = (val: string) =>
        parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 });

    const openBreakdownModal = (month: string) => {
        setSelectedMonth(month);
        setShowModal(true);
    };

    const filteredMonths = dummyMonths.filter(m => m.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#F4F7FC' }]}>
                <Text style={[styles.title, { color: textColor }]}>{t('payroll.title') || 'Payroll'}</Text>
                <Text style={[styles.note, { color: '#FF3B30' }]}>
                    {t('payroll.notice', { employeeName })}
                </Text>

                <View style={[styles.salaryCard, { backgroundColor: tileBg }]}>
                    <Text style={[styles.label, { color: subColor }]}>{t('payroll.monthlySalary')}</Text>
                    <Text style={[styles.amount, { color: textColor }]}>MVR {formatMoney(monthlySalary)}</Text>

                    <View style={styles.divider} />

                    <Text style={[styles.label, { color: subColor }]}>{t('payroll.annualSalary')}</Text>
                    <Text style={[styles.amount, { color: textColor }]}>MVR {formatMoney(annualSalary)}</Text>
                </View>

                <TextInput
                    placeholder={t('payroll.searchMonth') || 'Search month...'}
                    placeholderTextColor={isDark ? '#aaa' : '#666'}
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        marginBottom: 10,
                        color: textColor,
                        backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
                    }}
                />

                {filteredMonths.map((month, i) => (
                    <View key={i} style={[styles.row, { backgroundColor: tileBg }]}>
                        <Text style={[styles.month, { color: textColor }]}>{month}</Text>
                        <TouchableOpacity
                            style={styles.viewBtn}
                            onPress={() => openBreakdownModal(month)}
                        >
                            <Text style={styles.viewText}>{t('common.view') || 'View'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalFullScreen, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>
                            {t('payroll.breakdownTitle', { month: selectedMonth })}
                        </Text>
                        <View style={styles.modalTitleDivider} />

                        <ScrollView style={{ marginBottom: 16 }}>
                            {dummyBreakdown.map((item, idx) => (
                                <View key={idx}>
                                    <View style={styles.breakRow}>
                                        <Text style={[
                                            styles.breakLabel,
                                            {
                                                color: item.label === 'payroll.netSalary' ? '#006bad' : textColor,
                                                fontSize: item.label === 'payroll.netSalary' ? 18 : 14,
                                                fontWeight: item.label === 'payroll.netSalary' ? '700' : '500',
                                            },
                                        ]}>
                                            {t(item.label)}
                                        </Text>
                                        <Text style={[
                                            styles.breakAmount,
                                            {
                                                color: item.label === 'payroll.netSalary' ? '#006bad' : textColor,
                                                fontSize: item.label === 'payroll.netSalary' ? 18 : 14,
                                                fontWeight: item.label === 'payroll.netSalary' ? '700' : '600',
                                            },
                                        ]}>
                                            {item.amount}
                                        </Text>
                                    </View>
                                    {item.label === 'payroll.noPay' && <View style={styles.dividerLine} />}
                                </View>
                            ))}
                        </ScrollView>

                        <Pressable onPress={() => setShowModal(false)} style={styles.modalClose}>
                            <Text style={styles.modalCloseText}>{t('common.close') || 'Close'}</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 60, flexGrow: 1 },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
    note: { fontSize: 10, marginBottom: 20, lineHeight: 14 },
    salaryCard: {
        padding: 18,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 30,
    },
    label: { fontSize: 14, fontWeight: '500' },
    amount: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 12,
    },
    row: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    month: {
        fontSize: 16,
        fontWeight: '500',
    },
    viewBtn: {
        backgroundColor: '#006bad',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    viewText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalFullScreen: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    modalTitle: {
        fontSize: 23,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalTitleDivider: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 14,
    },
    breakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    breakLabel: { fontSize: 14 },
    breakAmount: { fontSize: 14, fontWeight: '600' },
    dividerLine: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    modalClose: {
        backgroundColor: '#006bad',
        paddingVertical: 10,
        borderRadius: 6,
    },
    modalCloseText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});
