import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AttendanceScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      <View style={styles.modeToggle}>
        <TouchableOpacity style={[styles.modeButton, styles.selectedMode]}>
          <Text style={styles.modeText}>Remote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeText}>Onsite</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.time}>10:00 AM</Text>
      <Text style={styles.date}>Wednesday, 03-Feb-2023</Text>

      <TouchableOpacity style={styles.checkInButton}>
        <Text style={styles.checkInText}>Check In</Text>
      </TouchableOpacity>

      <View style={styles.summaryRow}>
        <Text style={styles.summary}>Check In: --</Text>
        <Text style={styles.summary}>Check Out: --</Text>
        <Text style={styles.summary}>Total Hours: --</Text>
      </View>

      <TouchableOpacity style={styles.viewTimesheet}>
        <Text>View Timesheet →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F4F7FC', flexGrow: 1, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  modeToggle: { flexDirection: 'row', marginBottom: 20 },
  modeButton: {
    paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20, backgroundColor: '#fff', marginHorizontal: 5,
    borderWidth: 1, borderColor: '#ddd',
  },
  selectedMode: { backgroundColor: '#007AFF' },
  modeText: { color: '#333' },
  time: { fontSize: 32, fontWeight: '700' },
  date: { fontSize: 14, color: '#666', marginBottom: 24 },
  checkInButton: {
    backgroundColor: '#F6C90E',
    borderRadius: 100,
    padding: 30,
    marginBottom: 30,
  },
  checkInText: { fontSize: 20, fontWeight: '600' },
  summaryRow: { width: '100%', marginTop: 10 },
  summary: { fontSize: 16, marginBottom: 6 },
  viewTimesheet: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
