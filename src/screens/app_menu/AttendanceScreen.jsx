import { Button, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";
import { BackHandler, PermissionsAndroid, SafeAreaView, View } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons'
import Leaflet, { Markers, TileOptions } from 'react-native-leaflet-ts';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "@env"
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";
import Geolocation from 'react-native-geolocation-service';
import NetInfo from "@react-native-community/netinfo";
import haversine from 'haversine-distance'
import { PERMISSIONS, checkMultiple } from "react-native-permissions";
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Linking } from 'react-native'
import { useIsFocused } from "@react-navigation/native";

function AttendanceScreen() {
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [radius, setRadius] = useState('')
    const [mapLoaded, setMapLoaded] = useState(false)
    const [tanggalDanWaktuSekarang, setTanggalDanWaktuSekarang] = useState('')
    const [dailyAttendance, setDailyAttendance] = useState({})
    const [settings, setSettings] = useState({})
    const [spinnerShow, setSpinnerShow] = useState(false)
    const [dialogOpenSetting, setDialogOpenSetting] = useState(false)
    const [dialogAskLocation, setDialogAskLocation] = useState(false)
    const [currStateAbsFunc, setCurrStateAbsFunc] = useState(null)
    const isFocused = useIsFocused()

    const toast = useToast()

    useEffect(() => {
        loadTanggalDanWaktuSekarang()
        loadSettings()
        loadDailyAttendance()
    }, [])

    useEffect(() => {
        if (isFocused) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
                return () => { };
            })

            return () => backHandler.remove()
        } else {
            return () => { }
        }
    }, [isFocused])

    const reloadScreen = () => {
        loadTanggalDanWaktuSekarang()
        loadSettings()
        loadDailyAttendance()
    }

    const requestLocationPermission = async (cb) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Izinkan akses lokasi?',
                    message: 'Akses lokasi wajib diizinkan, guna diperlukan untuk proses absensi berdasarkan cabang kantor',
                    buttonNeutral: 'Tanya lagi nanti',
                    buttonNegative: 'Tolak',
                    buttonPositive: 'Oke',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                cb(true, granted)
            } else {
                cb(false, granted)
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const loadUserData = async () => {
        const token = await AsyncStorage.getItem('api_token')

        axios.get(`${API_URL}/employee/user`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setLatitude(res.data.data.branch.presence_location_latitude)
            setLongitude(res.data.data.branch.presence_location_longitude)

            axios.get(`${API_URL}/settings`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(async (res) => {
                setRadius(res.data.data.settings.presence_meter_radius)
                setSettings(res.data.data.settings)

                setMapLoaded(true)
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

    const loadTanggalDanWaktuSekarang = () => {
        const dateObj = new Date()

        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()
        const year = dateObj.getFullYear()

        setTanggalDanWaktuSekarang(`${date} ${monthNames[dateObj.getMonth()]} ${year}`)
    }

    const checkPermissionStatus = (cb) => {
        checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]).then(async (res) => {
            cb(res[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'granted' && res[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted')
        })
    }

    const permissionHandler = (cb) => {
        checkPermissionStatus((status) => {
            if (!status) {
                setDialogAskLocation(true)
            } else {
                cb()
            }
        })
    }

    const doAbsenButton = (absenButtonStatus) => {
        setCurrStateAbsFunc(absenButtonStatus)
        permissionHandler(() => {
            doAbsenButtonFunc()
        })
    }

    const doAbsenPulang = async () => {
        setSpinnerShow(true);
        const token = await AsyncStorage.getItem('api_token')

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setSpinnerShow(false);
                toast.show('Periksa koneksi internet anda untuk melakukan absensi pulang', {
                    type: 'danger',
                    placement: 'center'
                })
            } else {
                Geolocation.getCurrentPosition(
                    (position) => {

                        const userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }
                        const branchLocation = { latitude: latitude, longitude: longitude }

                        if (haversine(userLocation, branchLocation) > settings.presence_meter_radius) {
                            setSpinnerShow(false);

                            toast.show('Maaf, kamu tidak bisa absen. Kamu berada diluar radius jarak kantor', {
                                type: 'danger',
                                placement: 'center'
                            })
                        } else {
                            axios.post(`${API_URL}/presence/exit`, {
                                address: 'address',
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            }).then(async (res) => {
                                setSpinnerShow(false);
                                toast.show(res.data.msg, {
                                    type: 'success',
                                    placement: 'center'
                                })

                                reloadScreen()
                            }).catch((err) => {
                                setSpinnerShow(false);
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
                    },
                    (error) => {
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        })
    }

    const doAbsenMasuk = async () => {
        setSpinnerShow(true);
        const token = await AsyncStorage.getItem('api_token')

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setSpinnerShow(false);
                toast.show('Periksa koneksi internet anda untuk melakukan absensi', {
                    type: 'danger',
                    placement: 'center'
                })
            } else {
                Geolocation.getCurrentPosition(
                    (position) => {

                        const userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }
                        const branchLocation = { latitude: latitude, longitude: longitude }

                        if (haversine(userLocation, branchLocation) > settings.presence_meter_radius) {
                            setSpinnerShow(false);

                            toast.show('Maaf, kamu tidak bisa absen. Kamu berada diluar radius jarak kantor', {
                                type: 'danger',
                                placement: 'center'
                            })
                        } else {
                            axios.post(`${API_URL}/presence/entry`, {
                                address: 'address',
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            }).then(async (res) => {
                                setSpinnerShow(false);
                                toast.show(res.data.msg, {
                                    type: 'success',
                                    placement: 'center'
                                })

                                reloadScreen()
                            }).catch((err) => {
                                setSpinnerShow(false);
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
                    })
            }
        });
    }

    const _renderTombolAbsensi = () => {
        let text;

        const dateObj = new Date()

        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}:00`;

        if (dailyAttendance.status == false && currHoursMinutes < settings.presence_entry_start) {

        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_exit) {

        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_entry_start) {
            text = 'Absensi'
        } else if (dailyAttendance.status == true && !dailyAttendance.presence_exit_status && currHoursMinutes >= settings.presence_exit) {
            text = 'Absensi Pulang'
        } else if (dailyAttendance.status == true && dailyAttendance.presence_exit_status) {

        }

        return (
            text ?
                <View
                    style={{ borderTopColor: AppUtil.primarySoft, borderTopWidth: 1, paddingTop: 15 }}
                >
                    <Button
                        onPress={() => {
                            if (text == 'Absensi') {
                                doAbsenButton('absen-masuk')
                            } else if (text == 'Absensi Pulang') {
                                doAbsenButton('absen-pulang')
                            }
                        }}
                        style={{ marginBottom: 15, marginHorizontal: 25, backgroundColor: AppUtil.primary }}
                    >{text}</Button>
                </View> : <></>
        )
    }

    const doAbsenButtonFunc = () => {
        if (currStateAbsFunc == 'absen-masuk') {
            doAbsenMasuk()
        } else if (currStateAbsFunc == 'absen-pulang') {
            doAbsenPulang()
        }
    }

    const _renderStatusLabel = () => {

        const dateObj = new Date()

        let currHours = dateObj.getHours() > 9 ? dateObj.getHours() : ('0' + dateObj.getHours())
        let currMinutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ('0' + dateObj.getMinutes())
        let currHoursMinutes = `${currHours}:${currMinutes}:00`;

        let displayText;
        let bgColor;

        if (dailyAttendance.status == true && currHoursMinutes > settings.presence_entry_start && currHoursMinutes < settings.presence_exit && !dailyAttendance.presence_exit_status) {
            bgColor = AppUtil.success
            displayText = 'Anda Sudah Melakukan Absensi Masuk'
        } else if (dailyAttendance.status == false && currHoursMinutes < settings.presence_entry_start) {
            bgColor = AppUtil.warning
            displayText = 'Absensi Belum dibuka'
        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_exit) {
            bgColor = AppUtil.danger
            displayText = 'Absensi sudah ditutup'
        } else if (dailyAttendance.status == false && currHoursMinutes >= settings.presence_entry_start) {
            bgColor = AppUtil.warning
            displayText = 'Anda Belum Melakukan Absensi Masuk'
        } else if (dailyAttendance.status == true && !dailyAttendance.presence_exit_status && currHoursMinutes >= settings.presence_exit) {
            bgColor = AppUtil.warning
            displayText = 'Anda Belum Melakukan Absensi Pulang'
        } else if (dailyAttendance.status == true && dailyAttendance.presence_exit_status) {
            bgColor = AppUtil.success
            displayText = 'Anda Sudah Melakukan Absensi Pulang'
        }

        return (
            <View
                style={{ borderRadius: 5, gap: 4, backgroundColor: bgColor, paddingVertical: 12, marginTop: 25, flexDirection: 'row', justifyContent: 'center' }}
            >
                <Ionicon name={'information-circle'} color={'white'} size={20} />
                <Text
                    style={[GlobalStyle.initialFont, { color: 'white', fontWeight: '700' }]}
                >{displayText}</Text>
            </View>
        )
    }

    const loadSettings = async () => {
        const token = await AsyncStorage.getItem('api_token')


        axios.get(`${API_URL}/custom-attendance-locations`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            if (res.data.data) {
                setLatitude(res.data.data.custom_attendance_location.presence_location_latitude)
                setLongitude(res.data.data.custom_attendance_location.presence_location_longitude)

                axios.get(`${API_URL}/settings`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(async (res) => {
                    setRadius(res.data.data.settings.presence_meter_radius)
                    setSettings(res.data.data.settings)

                    setMapLoaded(true)
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
            } else {
                loadUserData()
            }
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

    const markerList = [
        {
            latLng: [latitude, longitude],
            icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg',
            iconSize: {
                width: 23.5,
                height: 32,
            },
            title: 'Title 1',
            disabled: true,
            radius: radius
        },
    ];

    const mapLayers = [
        {
            name: 'Floor 1',
            src: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            tileOptions: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            },

        },
    ];

    const _renderMap = useMemo(() => {
        return (
            <Leaflet
                mapLayers={mapLayers}
                minZoom={1}
                zoom={2}
                maxZoom={20}
                flyTo={{
                    latLng: [latitude, longitude],
                    zoom: 19,
                }}
                markers={markerList}
            />
        )
    }, [radius])

    return (
        <SafeAreaView
            style={{ height: '100%', backgroundColor: 'white' }}
        >
            <View
                style={{ flex: 1 }}
            >
                <ConfirmDialog
                    title="Akses Lokasi Diperlukan"
                    message="Izinkan aplikasi untuk mengakses lokasi?. Izin ini diperlukan untuk kebutuhan lokasi absensi"
                    visible={dialogOpenSetting}
                    onTouchOutside={() => setDialogOpenSetting(false)}
                    positiveButton={{
                        title: "YES",
                        onPress: () => {
                            setDialogOpenSetting(false)
                            Linking.openSettings()
                        }
                    }}
                    negativeButton={{
                        title: "NO",
                        onPress: () => {
                            setDialogOpenSetting(false)
                        }
                    }}
                />

                <ConfirmDialog
                    title="Akses Lokasi Diperlukan"
                    message="Izinkan aplikasi untuk mengakses lokasi?. Izin ini diperlukan untuk kebutuhan lokasi absensi"
                    visible={dialogAskLocation}
                    onTouchOutside={() => setDialogAskLocation(false)}
                    positiveButton={{
                        title: "YES",
                        onPress: () => {
                            setDialogAskLocation(false)

                            requestLocationPermission((statusPermissions, statusName) => {
                                if (!statusPermissions) {
                                    if (statusName == 'never_ask_again') {
                                        setDialogOpenSetting(true)
                                    } else {
                                        toast.show('Tidak bisa melakukan absensi, Harap berikan izin aplikasi untuk mengakses lokasi', {
                                            type: 'danger',
                                            placement: 'center'
                                        })
                                    }
                                } else {
                                    doAbsenButtonFunc()
                                }
                            })
                        }
                    }}
                    negativeButton={{
                        title: "NO",
                        onPress: () => {
                            setDialogAskLocation(false)
                        }
                    }}
                />
                {
                    spinnerShow ? <LoadingSpinnerComponent /> : <></>
                }
                <View
                    style={{ width: '100%', height: '55%', borderBottomWidth: 3, borderBottomColor: AppUtil.primary }}
                >
                    {
                        mapLoaded ?
                            _renderMap : <></>
                    }
                </View>
                <ContainerComponent>
                    <View
                        style={{ height: '100%' }}
                    >
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 1 }}
                        >
                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 13 }]}
                                >Tanggal Sekarang</Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 21, marginTop: 5, fontWeight: 700 }]}
                                >{tanggalDanWaktuSekarang}</Text>
                            </View>
                        </View>

                        {_renderStatusLabel()}

                    </View>
                </ContainerComponent>
            </View>

            {_renderTombolAbsensi()}

        </SafeAreaView>
    )
}

export default AttendanceScreen