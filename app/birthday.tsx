import { useTheme } from '@/app/theme-context';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function BirthdayScreen() {

    const [loading, setLoading] = useState(true);
    const [birthdays, setBirthdays] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState({});


    // dark
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const tileBg = isDark ? '#1e1e1e' : '#fff';
    const tileText = isDark ? '#ccc' : '#000';
    const sectionTitle22 = isDark ? '#fff' : '#000';
    const dates = isDark ? '#fff' : '#808080';

    useEffect(() => {
        axios.get('https://api.rccmaldives.com/ess/birthday/index.php')
            .then(res => {
                if (res.data?.data) {
                    const today = new Date();
                    const year = today.getFullYear();
                    const sorted = res.data.data
                        .map((emp: any) => {
                            const dob = new Date(emp.dob);
                            const thisYearBirthday = new Date(year, dob.getMonth(), dob.getDate());
                            return { ...emp, upcoming: thisYearBirthday };
                        })
                        .sort((a: any, b: any) => a.upcoming.getTime() - b.upcoming.getTime());

                    const dateMap: any = {};
                    sorted.forEach((emp: any) => {
                        const date = emp.upcoming;
                        const key = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                        dateMap[key] = {
                            marked: true,
                            dotColor: 'red',
                            customStyles: {
                                container: {
                                    backgroundColor: '#e26a6a',
                                    borderRadius: 8,
                                },
                                text: {
                                    color: '#fff',
                                },
                            }
                        };
                    });

                    setMarkedDates(dateMap);
                    setBirthdays(sorted);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.title, { textTransform: 'uppercase', color: isDark ? '#fff' : '#222' }]}>Birthdays Calendar</Text>

            <View style={{
                height: 3,
                width: '100%',
                backgroundColor: '#fff',
                marginVertical: 1,
                alignSelf: 'stretch',
            }} />

            <Calendar
                markingType="custom"
                markedDates={markedDates}
                theme={{
                    backgroundColor: isDark ? '#000' : '#fff',
                    calendarBackground: isDark ? '#000' : '#fff',
                    textSectionTitleColor: isDark ? '#bbb' : '#333',
                    dayTextColor: isDark ? '#eee' : '#222',
                    monthTextColor: isDark ? '#fff' : '#000',
                    todayTextColor: '#006bad',
                    arrowColor: '#006bad',
                    textDisabledColor: isDark ? '#555' : '#ccc',
                    selectedDayBackgroundColor: '#006bad',
                    selectedDayTextColor: '#fff',
                    dotColor: '#e53935',
                    indicatorColor: '#006bad',
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 13,
                }}
                style={{
                    borderRadius: 8,
                    elevation: 2,
                    backgroundColor: isDark ? '#0f0f0f' : '#fff',
                    marginBottom: 20,
                }}
            />


            <Text style={[styles.subheading, { color: isDark ? '#ccc' : '#444' }]}>Upcoming Birthdays</Text>

            {birthdays.length === 0 ? (
                <Text style={[styles.noBirthday, { color: isDark ? '#888' : '#666' }]}>No upcoming birthdays</Text>
            ) : (
                birthdays.map((emp, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.birthdayCard,
                            {
                                backgroundColor: isDark ? '#1e1e1e' : '#fff',
                                borderLeftColor: '#006bad',
                                elevation: 6,
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.19,
                            },
                        ]}
                    >
                        <View style={styles.bicontainer}>
                            <View style={styles.birow}>
                                <FontAwesome6 name="gift" size={24} color="#006bad" style={styles.icon} />
                            </View>
                            <View style={styles.birthdayInfo}>
                                <Text style={[styles.name, { color: isDark ? '#fff' : '#222' }]}>{emp.name}</Text>
                                <Text style={[styles.detail, { color: isDark ? '#ccc' : '#666' }]}>{emp.dob}</Text>
                                <Text style={[styles.detail, { color: isDark ? '#ccc' : '#666' }]}>{emp.designation}</Text>
                            </View>
                        </View>

                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    title: { fontSize: 27, fontWeight: '500', marginBottom: 10, textAlign: 'center' },
    subheading: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 10 },
    noBirthday: { fontSize: 14, textAlign: 'center' },

    birthdayCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 12,
        marginBottom: 4,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    icon: {
    },
    birthdayInfo: {
        flex: 1,

    },
    name: {
        fontSize: 15,
        fontWeight: '500',
    },
    detail: {
        fontSize: 12,
        marginTop: 2,
    },

    bicontainer: {
        flexDirection: 'row',
    },

    birow: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 20,
    },
});
