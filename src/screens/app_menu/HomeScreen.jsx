import { Button, Divider, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import Carousel from 'react-native-snap-carousel';
import { Alert, Dimensions, Image, Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from 'react-native-calendars';
import GlobalStyle from "../../utils/GlobalStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppUtil from "../../utils/AppUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env"
import { useToast } from "react-native-toast-notifications";
import DateUtil from "../../utils/DateUtil";

function HomeScreen({ navigation }) {

    const [banners, setBanners] = useState([])
    const [currSholat, setCurrSholat] = useState('')
    const [currWaktuSholat, setCurrWaktuSholat] = useState('')
    const [user, setUser] = useState({})
    const [settings, setSettings] = useState({})
    const [refresh, setRefersh] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [calendars, setCalendars] = useState({})
    const [calendarsRes, setCalendarsRes] = useState([])
    const [dataModalAbsen, setDataModalAbsen] = useState({})
    const [dailyAttendance, setDailyAttendance] = useState({})

    const toast = useToast()

    useEffect(() => {
        loadCalendars()
        loadBanners()
        loadApiSholat()
        loadUserData()
        loadSettings()
        loadDailyAttendance()
    }, [])

    const loadCalendars = async () => {
        const token = await AsyncStorage.getItem('api_token')
        console.log(token)
        axios.get(`${API_URL}/calendar?date=${DateUtil.getCurrentYear()}-${DateUtil.getCurrentMonth()}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            setCalendarsRes(res.data.date)
            const dataCalendarObj = {};
            res.data.date.forEach((dateRes, index) => {
                if (dateRes.absen) {
                    let bgColor = '#FFFFFF'
                    let borderColor = '#FFFFFF'

                    if (dateRes.absen.presence_entry_status == 'on_time') {
                        bgColor = AppUtil.success
                    } else if (dateRes.absen.presence_entry_status == 'late') {
                        bgColor = AppUtil.dangerDark
                    } else if (dateRes.absen.presence_entry_status == 'not_present') {
                        bgColor = '#FFFFFF'
                    } else if (dateRes.absen.presence_entry_status == 'not_valid') {
                        bgColor = '#000000'
                    }

                    if (!dateRes.absen.presence_exit_status) {
                        borderColor = AppUtil.graySoft
                    } else if (dateRes.absen.presence_exit_status == 'early') {
                        borderColor = AppUtil.dangerSoft
                    } else if (dateRes.absen.presence_exit_status == 'on_time') {
                        borderColor = AppUtil.success
                    } else if (dateRes.absen.presence_exit_status == 'not_present') {
                        borderColor = '#FFFFFF'
                    }

                    dataCalendarObj[`${DateUtil.getCurrentYear()}-${DateUtil.getCurrentMonth()}-${dateRes.day}`] = {
                        customStyles: {
                            container: {
                                backgroundColor: bgColor,
                                borderColor: borderColor,
                                borderWidth: 6
                            },
                            text: {
                                color: bgColor == '#FFFFFF' && borderColor == '#FFFFFF' ? '#343434' : 'white',
                                fontWeight: 'bold',
                                lineHeight: 16
                            }
                        }
                    }
                }
            });
            setCalendars(dataCalendarObj)
        }).catch((err) => {
            console.log(err.response)
            if (err.response.status == 422) {
                toast.show(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''), {
                    type: 'danger',
                    placement: 'center'
                })
            } else if (err.response.status == 498) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    const loadApiSholat = () => {
        const dateObj = new Date()

        axios.get(`https://api.myquran.com/v1/sholat/jadwal/1407/${dateObj.getFullYear()}/${dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0` + (dateObj.getMonth() + 1)}/${dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()}`)
            .then((res) => {
                const jadwalSholat = res.data.data.jadwal

                const dateObj = new Date()

                let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
                let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
                let currHoursMinutes = `${currHours}:${currMinutes}`;
                let a = null;
                let b = null;

                for (const key in jadwalSholat) {
                    if (Object.hasOwnProperty.call(jadwalSholat, key)) {
                        if (key != 'tanggal' && key != 'date') {
                            if (currHoursMinutes <= jadwalSholat[key]) {
                                setCurrSholat(key)
                                a = key
                                setCurrWaktuSholat(jadwalSholat[key])
                                b = jadwalSholat[key]
                                break
                            }
                        }
                    }
                }

                if (!a && !b) {
                    const newDateObj = new Date()
                    newDateObj.setDate(newDateObj.getDate() + 1)

                    axios.get(`https://api.myquran.com/v1/sholat/jadwal/1407/${newDateObj.getFullYear()}/${newDateObj.getMonth() + 1 > 9 ? newDateObj.getMonth() + 1 : `0` + (newDateObj.getMonth() + 1)}/${newDateObj.getDate() > 9 ? newDateObj.getDate() : `0` + newDateObj.getDate()}`)
                        .then((res) => {
                            const jadwal = res.data.data.jadwal;

                            setCurrSholat('Imsak')
                            setCurrWaktuSholat(jadwal.imsak)
                        })
                }
            })
    }

    const loadSettings = async () => {
        const token = await AsyncStorage.getItem('api_token')

        axios.get(`${API_URL}/settings`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setSettings(res.data.data.settings)
        }).catch((err) => {
            if (err.response.status == 422) {
                toast.show(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''), {
                    type: 'danger',
                    placement: 'center'
                })
            } else if (err.response.status == 498) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    const loadUserData = async () => {
        const token = await AsyncStorage.getItem('api_token')

        axios.get(`${API_URL}/employee/user`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setUser(res.data.data)
        }).catch((err) => {
            if (err.response.status == 422) {
                toast.show(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''), {
                    type: 'danger',
                    placement: 'center'
                })
            } else if (err.response.status == 498) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    const loadModalShowAbsen = (dayParram) => {
        const dayObj = calendarsRes.find((e) => {
            return e.day == dayParram && e.absen
        })

        if (dayObj) {
            setDataModalAbsen(dayObj)
            setModalVisible(true)
        }
    }

    const _renderTombolAbsen = useMemo(() => {
        const dateObj = new Date()

        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let status = ''

        if (dailyAttendance.status) {
            status = 'Pulang';
        } else {
            status = 'Masuk';
        }

        return (
            <TouchableHighlight
                underlayColor="#FAFAFA"
                style={{ marginTop: 15, marginBottom: 3, backgroundColor: 'white', paddingVertical: 10, borderRadius: 6 }}
                onPress={() => {
                    navigation.navigate('AppMenu', { screen: 'AttendanceScreen' })
                }}
            >
                <Text
                    style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', color: AppUtil.primary }]}
                >Absensi {status}</Text>
            </TouchableHighlight>
        )
    }, [dailyAttendance])

    const loadDailyAttendance = async () => {
        const token = await AsyncStorage.getItem('api_token')
        const dateObj = new Date()

        const date = dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()
        const month = dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() : `0` + (dateObj.getMonth() + 1)
        const year = dateObj.getFullYear()

        axios.get(`${API_URL}/daily-attendances?date=${year}-${month}-${date}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setDailyAttendance(res.data.data.attendance)
        }).catch((err) => {
            if (err.response.status == 422) {
                toast.show(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''), {
                    type: 'danger',
                    placement: 'center'
                })
            } else if (err.response.status == 498) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    const _renderStatusAbsensi = useMemo(() => {
        const dateObj = new Date()
        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}:00`;

        if (dailyAttendance.status == false && currHoursMinutes < settings.presence_entry_start) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Masuk : {settings.presence_entry_start ? settings.presence_entry_start.slice(0, -3) : ''} - {settings.presence_entry_end ? settings.presence_entry_end.slice(0, -3) : ''}</Text>
            )
        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_exit) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Masuk : {settings.presence_entry_start ? settings.presence_entry_start.slice(0, -3) : ''} - {settings.presence_entry_end ? settings.presence_entry_end.slice(0, -3) : ''}</Text>
            )
        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_entry_start) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Masuk : {settings.presence_entry_start ? settings.presence_entry_start.slice(0, -3) : ''} - {settings.presence_entry_end ? settings.presence_entry_end.slice(0, -3) : ''}</Text>
            )
        } else if (dailyAttendance.status == true && !dailyAttendance.presence_exit_status && currHoursMinutes >= settings.presence_exit) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Pulang : {settings.presence_exit ? settings.presence_exit.slice(0, -3) : ''}</Text>
            )
        } else if (dailyAttendance.status == true && dailyAttendance.presence_exit_status) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Masuk : {settings.presence_entry_start ? settings.presence_entry_start.slice(0, -3) : ''} - {settings.presence_entry_end ? settings.presence_entry_end.slice(0, -3) : ''}</Text>
            )
        }

    }, [dailyAttendance])

    const loadBanners = async () => {
        const token = await AsyncStorage.getItem('api_token')

        axios.get(`${API_URL}/banners`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setBanners(res.data.data.banners)
        }).catch((err) => {
            if (err.response.status == 422) {
                toast.show(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''), {
                    type: 'danger',
                    placement: 'center'
                })
            } else if (err.response.status == 498) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                toast.show(err.response.data.msg, {
                    type: 'danger',
                    placement: 'center'
                })

                navigation.navigate('LoginScreen')
            } else {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    const [selected, setSelected] = useState('');

    const { width } = Dimensions.get('window');

    const _renderBanners = ({ item, index }) => {
        return (
            <Image
                source={{ uri: item.image }}
                width={width - 120}
                height={160}
                borderRadius={5}
            />
        )
    }

    const _renderCurrTanggal = useMemo(() => {
        const dateObj = new Date()

        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()
        const year = dateObj.getFullYear()

        return (
            <Text
                style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
            >{date} {monthNames[dateObj.getMonth()]} {year}</Text>
        )
    }, [])

    const _renderPerusahaan = useMemo(() => {
        return (
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <Image
                    source={{ uri: settings.office_logo }}
                    width={35}
                    height={35}
                    borderRadius={15}
                />
                <Text
                    style={[GlobalStyle.initialFont, GlobalStyle.textPrimary, { fontSize: 17, fontWeight: "800" }]}
                >{settings.office_name}</Text>
            </View>
        )
    }, [settings])



    const _renderCalendar = () => {
        return (
            <Calendar
                onDayPress={(datObj) => {
                    loadModalShowAbsen(datObj.day)
                }}
                style={{
                    marginTop: 15,
                    borderRadius: 8
                }}
                theme={{
                    calendarBackground: AppUtil.primarySoft,
                }}
                markingType={'custom'}
                markedDates={calendars}
                disableArrowLeft={true}
                disableArrowRight={true}
            />
        )
    }

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefersh(true)

                            loadCalendars()
                            loadBanners()
                            loadApiSholat()
                            loadUserData()
                            loadSettings()
                            setRefersh(false)
                        }}
                    />
                }
            >
                <ContainerComponent>

                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View
                            style={{ justifyContent: 'center', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                        >
                            <View
                                style={{ paddingVertical: 18, backgroundColor: 'white', borderWidth: 2, borderColor: AppUtil.primary, marginTop: '10%', marginLeft: 20, marginRight: 20, borderRadius: 10, paddingHorizontal: 20 }}
                            >
                                <View>
                                    <Text
                                        style={[GlobalStyle.initialFont, { fontWeight: '700', fontSize: 22, textAlign: 'center' }]}
                                    >{DateUtil.getCurrentDate()} {DateUtil.getCurrentMonthName()} {DateUtil.getCurrentYear()}</Text>
                                    <View
                                        style={{ marginTop: 13, alignItems: 'center' }}
                                    >
                                        <View
                                            style={{ flexDirection: 'row' }}
                                        >
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 3, textAlign: 'right' }]}
                                            >Masuk</Text>
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 1, textAlign: 'center' }]}
                                            >:</Text>
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 3, textAlign: 'left' }]}
                                            >{dataModalAbsen.absen ? dataModalAbsen.absen.presence_entry_hour : '-'}</Text>
                                        </View>
                                        <View
                                            style={{ flexDirection: 'row', marginTop: 6 }}
                                        >
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 3, textAlign: 'right' }]}
                                            >Pulang</Text>
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 1, textAlign: 'center' }]}
                                            >:</Text>
                                            <Text
                                                style={[GlobalStyle.initialFont, { fontSize: 16, flex: 3, textAlign: 'left' }]}
                                            >{dataModalAbsen.absen ? (dataModalAbsen.absen.presence_exit_hour ? dataModalAbsen.absen.presence_exit_hour : '-') : '-'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Divider style={{ marginVertical: 15 }} />
                                <View
                                    style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}
                                >
                                    <Button
                                        size="small"
                                        onPress={() => {
                                            setModalVisible(!modalVisible)
                                        }}
                                        status="basic"
                                    >Tutup</Button>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View
                        style={{ height: '100%', paddingBottom: 10 }}
                    >

                        {_renderPerusahaan}

                        <Text
                            style={[{ textAlign: 'center', marginTop: 5, color: AppUtil.gray, fontSize: 14 }, GlobalStyle.initialFont]}
                        >Assalamu'alaikum,</Text>
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', marginTop: 1, fontWeight: '700', fontSize: 16, color: AppUtil.primary }]}
                        >{user.name}</Text>

                        {
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}
                            >
                                <Icon name="mosque" size={20} color={AppUtil.primary} />
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <Text
                                        style={[GlobalStyle.initialFont, { fontSize: 15 }]}
                                    >Kabupaten Cilacap, {currSholat}</Text>
                                    <Text
                                        style={[GlobalStyle.initialFont, { fontSize: 15, fontWeight: 700, color: AppUtil.primary }]}> {currWaktuSholat}</Text>
                                </View>

                            </View>
                        }
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 13 }}>
                                {
                                    useMemo(() => {
                                        return (
                                            <Carousel
                                                inactiveSlideScale={0.9}
                                                layout={"default"}
                                                data={banners}
                                                sliderWidth={width - 50}
                                                itemWidth={width - 120}
                                                loop={true}
                                                autoplay={true}
                                                renderItem={_renderBanners} />
                                        )
                                    }, [banners])
                                }
                            </View>
                        </View>

                        <View
                            style={{ backgroundColor: AppUtil.primary, borderRadius: 9, marginTop: 20, padding: 14 }}
                        >
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                {_renderStatusAbsensi}
                                {_renderCurrTanggal}
                            </View>
                            {_renderTombolAbsen}
                        </View>

                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 15, fontSize: 15, fontWeight: '700' }]}
                        >Rekapitulasi Absensi</Text>

                        {
                            _renderCalendar()
                        }
                    </View>
                </ContainerComponent>
            </ScrollView>
        </SafeAreaView >
    )
}

export default HomeScreen