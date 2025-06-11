import { useTheme } from '@/app/theme-context';
import {
  Entypo,
  FontAwesome, FontAwesome5, FontAwesome6,
  Fontisto,
  Ionicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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



export default function DashboardScreen() {
  //lang
  const { t } = useTranslation();
  // dark theme
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
            <Animated.View style={[styles.cardFace, { transform: [{ perspective: 2000 }, { rotateY: frontInterpolate }] }]}>

              <LinearGradient
                colors={[
                  '#006bad',
                  '#050027',
                  '#004069',
                  '#006bad',
                  '#050027',
                  '#006bad',
                  '#042275' // brushed steel edge
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.xcard} >


                <View style={styles.cardOverlay} />
                <View style={styles.cardOverlayContainer}>
                  <Image source={require('@/assets/bg.jpg')} style={styles.cardBackgroundImage} />
                  <View style={styles.cardOverlay} />
                </View>



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
                    <Text style={styles.cardValue_designation}>{employee?.designation || 'Employee'}  --  {employee?.department}</Text>


                    <View style={{
                      height: 1,
                      width: '70%',
                      backgroundColor: '#ffffff50',
                      marginVertical: 1,
                      alignSelf: 'stretch',
                    }} />

                    <Text style={styles.cardValue_designation}>M- {employee?.contact_number}    ----    E-  {employee?.emp_email}</Text>
                  </View>

                  <View style={styles.cardBottomRight}>
                    <Text style={styles.cardValue_empno_x}>Emp No</Text>
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





                <View style={styles.cardOverlayContainer}>
                  <Image source={require('@/assets/bg.jpg')} style={styles.cardBackgroundImage} />
                  <Image source={require('@/assets/biz_card_logo.png')} style={styles.biz_card_logo} />
                  <View style={styles.cardOverlay} />
                </View>




                {/* Add more fields if needed */}
              </LinearGradient>
            </Animated.View>

          </View>

        </View>
      </Pressable>

      {/* Quick Access Grid */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/attendance')}>
          <FontAwesome5 name="business-time" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.attendance')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/leave')}>
          <Fontisto name="island" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.leave')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/profile')}>
          <FontAwesome name="user-circle-o" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.profile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/payroll')}>
          <FontAwesome6 name="file-invoice-dollar" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.payroll')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/chat')}>
          <Ionicons name="chatbubbles" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.chat')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/ot')}>
          <FontAwesome5 name="user-clock" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.ot')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/birthday')}>
          <Entypo name="cake" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.birthday')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() => navigateTo('/handbook')}>
          <FontAwesome name="book" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.handbook')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: tileBg }]} onPress={() =>
          navigateTo(`/documents-screen?emp_no=${user?.emp_no || employee?.emp_no}`)}>
          <Entypo name="images" size={36} color="#006bad" />
          <Text style={[styles.tileTitle, { color: tileText }]}>{t('dashboard.documents')}</Text>
        </TouchableOpacity>

      </View>

      {/* Announcements */}
      <Text style={[styles.sectionTitle2, { color: sectionTitle22 }]}>📣 {t('dashboard.announcements')}</Text>
      {notices.length === 0 ? (
        <Text style={[styles.emptyText]}>{t('dashboard.noAnnouncements')}</Text>
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
      <Text style={[styles.sectionTitle2, { color: sectionTitle22 }]}>🎉 {t('dashboard.holidays')}</Text>
      {holidays.length === 0 ? (
        <Text style={[styles.emptyText, { color: sectionTitle22 }]}>{t('dashboard.noHolidays')}</Text>
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
  greeting: { fontSize: 19, fontWeight: '400', color: '#222' },
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
    fontWeight: '600',
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
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.19,
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





  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 15,

  },







  cardBack: {

  },



  biz_card_logo: {
    width: 600,
    height: 120,
    resizeMode: 'center',
    mixBlendMode: 'difference',
    right: 102,
    top: 55,
  },










  //card gradient 
  xcard: {
    flex: 1,
    borderRadius: 15,
    position: 'relative',
    opacity: 0.99,
  },
  // container for bg image and overlay
  cardOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    overflow: 'hidden',
  },

  // background image
  cardBackgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    backgroundBlendMode: 'multiply',
    opacity: 0.69,
    borderRadius: 15,



  },

  // overlay on top of image
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 40, 88, 0.31)',
    borderTopWidth: 0.9,
    borderColor: 'rgba(13, 122, 223, 0.1)',
    borderRadius: 15,




  },



  // card bottom row

  cardBottom: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
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
    fontWeight: '400',
    color: '#fff',
    textTransform: 'uppercase',
    flexDirection: 'column',

  },

  cardValue_designation: {
    fontSize: 10,
    alignItems: 'flex-start',
    fontWeight: '400',
    color: '#aaa',
    textTransform: 'uppercase',
    flexDirection: 'column',
  },




  cardValue_empno: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'right',
    flexDirection: 'row',
  },

  cardValue_empno_x: {
    fontSize: 11,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'right',
    top: 7,
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
    opacity: 0.80,
    marginTop: 3,
    marginLeft: 3,
    borderRadius: 10,
    mixBlendMode: 'luminosity',
    zIndex: 0,


  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginTop: 0,
    marginRight: 0,
    zIndex: 0,
  },




});
