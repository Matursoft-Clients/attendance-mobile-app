import { Button, Input, Text } from "@ui-kitten/components";
import { Dimensions, Image, Linking, Modal, ScrollView, View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";
import { API_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { useIsFocused } from "@react-navigation/native";
import VersionCheck from 'react-native-version-check';

function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('tomyntapss@gmail.com')
    const [password, setPassword] = useState('maturnuwun')
    const [spinnerShow, setSpinnerShow] = useState(false)
    const [settings, setSettings] = useState({})
    const [cacheLoginCheck, setCacheLoginCheck] = useState(false)
    const [modalUpdateAppVisible, setModalUpdateAppVisible] = useState(false)
    const isFocused = useIsFocused()
    const toast = useToast()

    useEffect(() => {
        SplashScreen.hide()
        checkLogin()
    }, [])

    useEffect(() => {
        if (route.params && isFocused) {
            if (route.params.is_logout) {
                setCacheLoginCheck(true)
            }
        }
    }, [isFocused])

    const checkLogin = async () => {
        const token = await AsyncStorage.getItem('api_token')

        if (token) {
            axios.get(`${API_URL}/employee/user`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(async (res) => {
                navigation.navigate('AppMenu', {
                    screen: 'HomeScreen'
                })
            }).catch((err) => {
                loadSettings()
            })
        } else {
            loadSettings()
        }
    }

    const loadSettings = () => {
        axios.get(`${API_URL}/settings`)
            .then(async (res) => {
                setSettings(res.data.data.settings)
                if (res.data.data.settings.mobile_app_version != VersionCheck.getCurrentVersion()) {
                    setModalUpdateAppVisible(true)
                } else {
                    setCacheLoginCheck(true)
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

    const doLogin = () => {
        setSpinnerShow(true);

        axios.post(`${API_URL}/employee/login`, {
            email: email,
            password: password
        }).then(async (res) => {
            setSpinnerShow(false);

            try {
                await AsyncStorage.setItem('api_token', res.data.data.token)

                toast.show(res.data.msg, {
                    type: 'success',
                    placement: 'center'
                })
                setTimeout(() => {
                    navigation.navigate('AppMenu', {
                        screen: 'HomeScreen'
                    })
                }, 500);
            } catch (error) {
                toast.show('Unhandled error, please contact administrator for report', {
                    type: 'danger',
                    placement: 'center'
                })
            }
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

    return (
        <SafeAreaView
            style={{ backgroundColor: 'white', height: '100%' }}
        >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalUpdateAppVisible}>
                <View style={{ width: '100%', height: Dimensions.get('window').height, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View
                        style={{ height: Dimensions.get('window').height - 125, paddingVertical: 35, backgroundColor: 'white', paddingHorizontal: 25, marginTop: 125, borderTopEndRadius: 10, borderTopStartRadius: 10, bottom: 0, justifyContent: 'center' }}
                    >
                        <FastImage
                            source={require('./../../assets/images/rocket.png')}
                            style={{
                                width: Dimensions.get('window').width - 50,
                                height: Dimensions.get('window').width - 50,
                                marginTop: -50
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: 'bold', fontSize: 21, marginTop: -((Dimensions.get('window').width - 50) - ((Dimensions.get('window').width - 50) / 1.25)) }]}
                        >
                            Update Terbaru Telah Tersedia
                        </Text>
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14, marginTop: 7 }]}
                        >
                            Update aplikasi ke versi terbaru untuk tetap menggunakannya
                        </Text>
                        <Button
                            onPress={() => {
                                Linking.openURL(settings.play_store_url)
                            }}
                            style={{ marginTop: 35, backgroundColor: AppUtil.primary }}
                        >
                            {evaProps => <Text {...evaProps}>Update Aplikasi</Text>}
                        </Button>
                    </View>
                </View>
            </Modal>

            {
                cacheLoginCheck ?

                    <ScrollView>
                        <ContainerComponent>
                            {
                                spinnerShow ? <LoadingSpinnerComponent /> : <></>
                            }

                            <View
                                style={{ backgroundColor: '#FFF', height: Dimensions.get('window').height, display: 'flex', justifyContent: 'center' }}
                            >
                                <View>
                                    <View
                                        style={{ flexDirection: 'row', justifyContent: 'center' }}
                                    >
                                        <FastImage
                                            style={{ width: 100, height: 100 }}
                                            source={{
                                                uri: settings.office_logo,
                                                headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain} />
                                    </View>
                                    <Input
                                        style={{ marginTop: 30 }}
                                        label={evaProps => <Text {...evaProps}>Email</Text>}
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={(val) => {
                                            setEmail(val)
                                        }}
                                    />

                                    <Input
                                        secureTextEntry={true}
                                        style={{ marginTop: 15 }}
                                        label={evaProps => <Text {...evaProps}>Password</Text>}
                                        placeholder="Password"
                                        value={password}
                                        onChangeText={(val) => {
                                            setPassword(val)
                                        }}
                                    />
                                    <Text
                                        onPress={() => {
                                            navigation.navigate('ForgotPasswordScreen')
                                        }}
                                        style={[GlobalStyle.initialFont, { textAlign: 'right', marginTop: 10, color: AppUtil.primary, fontWeight: 'bold', fontSize: 13 }]}
                                    >Lupa kata sandi</Text>

                                    <Button
                                        onPress={() => {
                                            doLogin()
                                        }}
                                        style={{ marginTop: 35, backgroundColor: AppUtil.primary }}
                                    >
                                        {evaProps => <Text {...evaProps}>Login</Text>}
                                    </Button>
                                </View>

                            </View>
                        </ContainerComponent>
                    </ScrollView> : <></>
            }
        </SafeAreaView>
    )
}

export default LoginScreen;