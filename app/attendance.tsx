import { useTheme } from '@/app/theme-context';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const dummyTimesheets = [
  { month: 'January 2025' },
  { month: 'February 2025' },
  { month: 'March 2025' },
  { month: 'April 2025' },
  { month: 'May 2025' },
  { month: 'June 2025' }
];

export default function AttendanceScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#000' : '#F4F7FC';
  const tileBg = isDark ? '#1e1e1e' : '#fff';
  const headingColor = isDark ? '#fff' : '#000';
  const textColor = isDark ? '#ccc' : '#333';
  const redNote = '#FF3B30';

  const [search, setSearch] = useState('');

  const filtered = dummyTimesheets.filter((item) =>
    item.month.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'This feature is under development.'
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: headingColor }]}>Attendance</Text>
      <Text style={[styles.note, { color: redNote }]}>
        Attendance records are subject to system sync and company policy.
      </Text>

      <TextInput
        placeholder="Search month..."
        placeholderTextColor={isDark ? '#888' : '#aaa'}
        style={[
          styles.search,
          {
            backgroundColor: tileBg,
            color: headingColor,
            borderColor: isDark ? '#333' : '#ddd'
          }
        ]}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.month}
          style={[styles.item, { backgroundColor: tileBg }]}
          onPress={handlePress}
        >
          <Text style={[styles.itemText, { color: textColor }]}>{item.month}</Text>
        </TouchableOpacity>
      ))}

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 4 },
  note: { fontSize: 12, marginBottom: 14 },
  search: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20
  },
  item: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  itemText: { fontSize: 16, fontWeight: '500' }
});
