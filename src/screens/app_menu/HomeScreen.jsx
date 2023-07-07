import { Layout, Select, SelectItem, Text } from "@ui-kitten/components"
import { Colors, Image, View } from "react-native-ui-lib"
import ContainerComponent from "../../components/ContainerComponent"
import Carousel from 'react-native-snap-carousel';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useKeenSliderNative } from 'keen-slider/react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import GlobalStyle from "../../utils/GlobalStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppUtil from "../../utils/AppUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env"
import { useToast } from "react-native-toast-notifications";

function HomeScreen({ navigation }) {

    const [banners, setBanners] = useState([])
    const [jadwalSholat, setJadwalSholat] = useState({})
    const [currSholat, setCurrSholat] = useState('')
    const [currWaktuSholat, setCurrWaktuSholat] = useState('')
    const [user, setUser] = useState({})
    const [settings, setSettings] = useState({})

    const toast = useToast()

    useEffect(() => {
        loadBanners()
        loadApiSholat()
        loadUserData()
        loadSettings()
    }, [])

    const loadApiSholat = () => {
        const dateObj = new Date()

        axios.get(`https://api.myquran.com/v1/sholat/jadwal/1407/${dateObj.getFullYear()}/${dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0` + (dateObj.getMonth() + 1)}/${dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()}`)
            .then((res) => {
                setJadwalSholat(res.data.data.jadwal)
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

    const loadTomorrowImsak = () => {
        const newDateObj = new Date()
        newDateObj.setDate(newDateObj.getDate() + 1)

        axios.get(`https://api.myquran.com/v1/sholat/jadwal/1407/${newDateObj.getFullYear()}/${newDateObj.getMonth() + 1 > 9 ? newDateObj.getMonth() + 1 : `0` + (newDateObj.getMonth() + 1)}/${newDateObj.getDate() > 9 ? newDateObj.getDate() : `0` + newDateObj.getDate()}`)
            .then((res) => {
                const jadwal = res.data.data.jadwal;

                setCurrSholat('Imsak')
                setCurrWaktuSholat(jadwal.imsak)
            })
    }

    const _renderApiSholat = () => {
        const dateObj = new Date()
        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}`;

        if (currHoursMinutes <= jadwalSholat.subuh) {

        } else if (currHoursMinutes <= jadwalSholat.subuh) {
            setCurrSholat('Shubuh')
            setCurrWaktuSholat(jadwalSholat.subuh)
        }

        for (const key in jadwalSholat) {
            if (Object.hasOwnProperty.call(jadwalSholat, key)) {
                if (key != 'tanggal' && key != 'date') {
                    if (currHoursMinutes <= jadwalSholat[key]) {
                        setCurrSholat(key)
                        setCurrWaktuSholat(jadwalSholat[key])
                        break
                    }
                }
            }
        }

        if (!currSholat && !currWaktuSholat) {
            loadTomorrowImsak()
        }

        return (
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
        )
    }

    const _renderTombolAbsen = () => {
        const dateObj = new Date()
        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}:00`;
        let status = ''
        if (currHoursMinutes > settings.presence_entry_start && currHoursMinutes < settings.presence_entry_start) {
            status = 'Masuk';
        } else {
            status = 'Pulang';
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
    }

    const _renderStatusAbsensi = () => {
        const dateObj = new Date()
        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}:00`;

        if (currHoursMinutes > settings.presence_entry_start && currHoursMinutes < settings.presence_entry_start) {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Masuk : {settings.presence_entry_start ? settings.presence_entry_start.slice(0, -3) : ''} - {settings.presence_entry_end ? settings.presence_entry_end.slice(0, -3) : ''}</Text>
            )
        } else {
            return (
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                >Absensi Pulang : {settings.presence_exit ? settings.presence_exit.slice(0, -3) : ''}</Text>
            )
        }
    }

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
                height={70}
                borderRadius={5}
            />
        )
    }

    const _renderCurrTanggal = () => {
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
    }

    const _renderPerusahaan = () => {
        return (
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <Image
                    source={{ uri: settings.office_logo }}
                    width={30}
                    height={30}
                    borderRadius={15}
                />
                <Text
                    style={[GlobalStyle.initialFont, GlobalStyle.textPrimary, { fontSize: 17, fontWeight: "800" }]}
                >{settings.office_name}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <ContainerComponent>
                    <View
                        style={{ height: '100%', paddingBottom: 10 }}
                    >

                        {_renderPerusahaan()}

                        <Text
                            style={[{ textAlign: 'center', marginTop: 5, color: Colors.grey20, fontSize: 14 }, GlobalStyle.initialFont]}
                        >Assalamu'alaikum,</Text>
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', marginTop: 1, fontWeight: '700', fontSize: 16, color: AppUtil.primary }]}
                        >{user.name}</Text>

                        {_renderApiSholat()}
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 13 }}>
                                <Carousel
                                    inactiveSlideScale={0.9}
                                    layout={"default"}
                                    data={banners}
                                    sliderWidth={width - 50}
                                    itemWidth={width - 120}
                                    loop={true}
                                    autoplay={true}
                                    renderItem={_renderBanners} />
                            </View>
                        </View>

                        <View
                            style={{ backgroundColor: AppUtil.primary, borderRadius: 9, marginTop: 20, padding: 14 }}
                        >
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                {_renderStatusAbsensi()}
                                {_renderCurrTanggal()}
                            </View>
                            {_renderTombolAbsen()}
                        </View>

                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 15, fontSize: 15, fontWeight: '700' }]}
                        >Rekapitulasi Absensi</Text>

                        <Calendar
                            style={{
                                marginTop: 15,
                                borderRadius: 8
                            }}
                            theme={{
                                calendarBackground: AppUtil.primarySoft,
                            }}
                            onDayPress={day => {
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                    </View>
                </ContainerComponent>
            </ScrollView>
        </SafeAreaView >
    )
}

export default HomeScreen