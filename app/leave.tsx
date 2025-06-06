import { useTheme } from '@/app/theme-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';



// dark theme
export default function LeaveScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tileBg = isDark ? '#1e1e1e' : '#fff';
  const sectionTitle22 = isDark ? '#fff' : '#000';
  const dates = isDark ? '#fff' : '#808080';




  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [empNo, setEmpNo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const emp_no = user.emp_no;
      setEmpNo(emp_no);

      try {
        const [balanceRes, historyRes] = await Promise.all([
          axios.get(`https://api.rccmaldives.com/ess/leaves/balances.php?emp_no=${emp_no}`),
          axios.get(`https://api.rccmaldives.com/ess/leaves/index.php?emp_no=${emp_no}`)
        ]);

        if (balanceRes.data.status === 'success') setBalances(balanceRes.data.data);
        if (historyRes.data.status === 'success') setHistory(historyRes.data.data);
      } catch (error) {
        console.error('Failed to fetch leave data', error);
      }
    };

    fetchData();
  }, []);

  const filteredHistory = history.filter(h =>
    h.leave_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: sectionTitle22 }]}>Leave Records</Text>
      <Text style={[styles.sectionTitle, { color: sectionTitle22 }]}>Leave Balance</Text>

      <View style={styles.badgesRow}>
        {Object.entries(balances).map(([type, value]) => (
          <View key={type} style={[styles.badge, { backgroundColor: tileBg }]}>
            <Text style={[styles.badgeText, { color: dates }]}>{type}: {value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>History</Text>
      <TextInput
        placeholder="Search leave type..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {filteredHistory.length === 0 ? (
        <Text style={styles.emptyText}>No leave records</Text>
      ) : (
        filteredHistory.map(item => (
          <View key={item.leave_id} style={styles.historyItem}>
            <Text style={styles.historyTitle}>{item.leave_type}</Text>
            <Text>From: {item.start_date} To: {item.end_date}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.applyButton} onPress={() => alert('Feature coming soon')}>
        <Text style={styles.applyButtonText}>Apply Leave</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  badge: {
    backgroundColor: '#b9d9fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: { color: '#006bad', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#006bad', },
  search: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 10, marginBottom: 20, backgroundColor: '#fff'
  },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  historyItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  historyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 30,
    position: 'relative',
  },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
