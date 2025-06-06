import { useTheme } from '@/app/theme-context';

import {
  FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type UserType = {
  emp_no: string;
  staff_name?: string;
  name?: string;
};


// dark theme
export default function DashboardScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tileBg = isDark ? '#1e1e1e' : '#fff';
  const tileText = isDark ? '#ccc' : '#000';
  const sectionTitle22 = isDark ? '#fff' : '#000';
  const dates = isDark ? '#fff' : '#808080';



  // Animated Linear Gradient card
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Interpolate front and back rotation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });


  // Flip function
  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      Animated.timing(flipAnim, {
        toValue: 180,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    }
  };


  // State variables
  const [user, setUser] = useState<UserType | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (!stored) return;

      const parsedUser: UserType = JSON.parse(stored);
      setUser(parsedUser);

      const empNo = parsedUser.emp_no;

      const [empRes, photoRes, noticeRes, holidayRes] = await Promise.all([
        axios.get(`https://api.rccmaldives.com/ess/employees/index.php?emp_no=${empNo}`),
        axios.get(`https://api.rccmaldives.com/ess/document/index.php?emp_no=${empNo}`),
        axios.get('https://api.rccmaldives.com/ess/settings/index.php?type=notices'),
        axios.get('https://api.rccmaldives.com/ess/settings/index.php?type=holidays'),
      ]);

      const photoFileName =
        Array.isArray(photoRes?.data?.data)
          ? photoRes.data.data.find((doc: { photo_file_name?: string }) => doc.photo_file_name)?.photo_file_name ?? null
          : null;

      if (empRes.data.status === 'success') {
        setEmployee({
          ...empRes.data.data,
          photo_file_name: photoFileName,
        });
      }

      if (noticeRes.data.status === 'success') setNotices(noticeRes.data.data);
      if (holidayRes.data.status === 'success') setHolidays(holidayRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path as any); // Still required unless all routes are declared in TS config
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {/* Profile Card */}
      <Pressable onPress={flipCard}>
        <View style={styles.cardContainer}>
          <View style={styles.cardShadow}>


            {/* FRONT SIDE */}
            <Animated.View style={[styles.cardFace, { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }] }]}>
              <LinearGradient
                colors={[
                  '#006bad', // matte light silver
                  '#070028', // medium steel gray
                  '#006bad', // highlight
                  '#050028', // subtle contrast
                  '#006bad'  // brushed steel edge
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.xcard} >

                <View style={styles.cardOverlay} />

                {/* Top Row with photo + logo */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cardleft}>
                    {employee?.photo_file_name ? (
                      <Image
                        source={{ uri: `https://hros.rccmaldives.com/assets/document/${employee.photo_file_name}` }}
                        style={styles.cardAvatar}
                      />
                    ) : (
                      <Ionicons name="person-circle-outline" size={60} color="#fff" />
                    )}

                  </View>
                  <View style={styles.cardright}>
                    <Image source={require('@/assets/card_logo.png')} style={styles.logo} />
                  </View>
                </View>



                {/* Info */}
                <View style={styles.cardBottom}>
                  <View style={styles.cardBottomLeft}>
                    <Text style={styles.cardValue_name}>{employee?.name || user?.staff_name || user?.name}</Text>
                    <Text style={styles.cardValue_designation}>{employee?.designation || 'Employee'} | {employee?.department}</Text>
                    <Text style={{ color: '#fff' }}>{employee?.contact_number}  |  {employee?.emp_email}</Text>
                  </View>

                  <View style={styles.cardBottomRight}>
                    <Text style={styles.cardValue_empno}>
                      {employee?.emp_no || user?.emp_no}
                    </Text>
                  </View>
                </View>

              </LinearGradient>
            </Animated.View>

            {/* BACK SIDE */}
            <Animated.View
              style={[styles.cardFace, styles.cardBack, { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }] }]}>
              <LinearGradient
                colors={[
                  '#006bad', // matte light silver
                  '#000024', // medium steel gray
                  '#006bad', // highlight
                  '#000028', // subtle contrast
                  '#006bad'  // brushed steel edge
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.xcard} >




                <View style={[styles.strip]}>

                  <Image source={require('@/assets/biz_card_logo.png')} style={styles.biz_card_logo} />
                </View>
                <View style={styles.cardOverlay} />



                {/* Add more fields if needed */}
              </LinearGradient>
            </Animated.View>

          </View>

        </View>
      </Pressable>

      {/* Quick Access Grid */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/attendance')}>
          <FontAwesome5 name="calendar-check" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/leave')}>
          <MaterialIcons name="flight-takeoff" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/profile')}>
          <FontAwesome name="user-circle-o" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/payroll')}>
          <FontAwesome6 name="file-invoice-dollar" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>Payroll</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() =>
          navigateTo(`/documents-screen?emp_no=${user?.emp_no || employee?.emp_no}`)
        }
        >
          <MaterialIcons name="folder" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <Text style={[styles.sectionTitle2, { color: sectionTitle22 }]}>📣 Announcements</Text>
      {notices.length === 0 ? (
        <Text style={styles.emptyText}>No announcements found</Text>
      ) : (
        notices.map((notice) => (
          <View key={notice.id} style={[styles.card, { backgroundColor: tileBg }]}>
            <Text style={[styles.cardTitle, { color: sectionTitle22 }]}>{notice.title}</Text>
            <Text style={[styles.cardContent, { color: dates }]}>{notice.content}</Text>
            <Text style={[styles.cardDate, { color: dates }]}>{notice.created_at}</Text>
          </View>
        ))
      )}

      {/* Holidays */}
      <Text style={[styles.sectionTitle2, { color: sectionTitle22 }]}>🎉 Upcoming Holidays</Text>
      {holidays.length === 0 ? (
        <Text style={[styles.emptyText, { color: sectionTitle22 }]}>No holidays upcoming</Text>
      ) : (
        holidays
          .sort((a, b) => new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime())
          .map((holiday) => {
            const isPast = new Date(holiday.holiday_date) < new Date();

            return (
              <View
                key={holiday.id}
                style={[styles.card,
                {
                  backgroundColor: isPast ? '#FFECEC' : tileBg,
                  borderLeftColor: isPast ? '#FF8A8A' : '#006bad',
                },
                ]}

              >
                <Text style={[styles.cardTitle, { color: sectionTitle22 }]}>
                  {holiday.holiday_name}
                </Text>
                <Text style={[styles.cardDate, { color: dates }]}>
                  {holiday.holiday_date}
                </Text>
              </View>
            );
          })
      )}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 50,

  },

  //holiday styles
  greeting: { fontSize: 19, fontWeight: '700', color: '#222' },
  subtext: { fontSize: 13, color: '#666' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    textAlign: 'center',
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.19,
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },

  // announcement styles
  sectionTitle2: { fontSize: 17, fontWeight: '600', marginBottom: 10, marginTop: 20 },
  emptyText: { fontSize: 14, color: '#888' },
  card: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 10,
    marginBottom: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#006bad',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 0, color: '#333' },
  cardContent: { fontSize: 14, color: '#555' },
  cardDate: { fontSize: 12, color: '#999', marginTop: 0 },







  // card styles for profile section
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280, // Allow space for expansion
    width: '100%',
    overflow: 'visible',
  },


  cardShadow: {
    width: '100%',
    maxWidth: 450,
    height: 250,
    borderRadius: 8,
    alignSelf: 'center',
    position: 'relative',
  },

  cardShadowLayer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 15,
    zIndex: - 1,
    shadowOpacity: 0.2,
  },

  shadowBlur: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: -15,
    bottom: -15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    zIndex: -1,
  },






  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 15,

  },





  xcard: {
    flex: 1,
    borderRadius: 15,
    position: 'relative',
  },

  cardBack: {
    zIndex: -1,
  },

  strip: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  biz_card_logo: {
    width: 600,
    height: 120,
    resizeMode: 'contain',
  },







  cardType: {
    width: 60,
    height: 40,
    backgroundColor: '#808080',
    borderRadius: 6,
  },




  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 18, 42, 0.25)',
    borderRadius: 5,
    borderTopWidth: 0.9,
    borderColor: 'rgba(13, 122, 223, 0.1)',
  },




  // card bottom row

  cardBottom: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cardBottomLeft: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  cardBottomRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },



  cardValue_name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    flexDirection: 'column',

  },
  cardValue_designation: {
    fontSize: 10,
    alignItems: 'flex-end',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    flexDirection: 'column',
  },


  cardValue_empno: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'right',
    flexDirection: 'row',
  },





  // card top row

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cardleft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  cardright: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  cardAvatar: {
    width: 100,
    height: 120,
    resizeMode: 'contain',
    opacity: 0.40,
    marginTop: 3,
    marginLeft: 3,
    borderRadius: 10,
    mixBlendMode: 'luminosity',


  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginTop: 0,
    marginRight: 0,
  },




});
