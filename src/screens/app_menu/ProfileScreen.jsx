import { Button, Divider, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { BackHandler, Dimensions, Image, ImageBackground, RefreshControl, SafeAreaView, ScrollView, View } from "react-native"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "react-native-toast-notifications"
import { useIsFocused } from "@react-navigation/native"

function ProfileScreen({ navigation, route }) {
    const [user, setUser] = useState({})
    const toast = useToast()
    const [refresh, setRefersh] = useState(false)
    const isFocused = useIsFocused()

    useEffect(() => {
        if (route.params && isFocused) {
            if (route.params.reload) {
                loadUserData()
            }
        }
    }, [isFocused])

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

    useEffect(() => {
        loadUserData()
    }, [])

    const doLogout = () => {
        AsyncStorage.removeItem('api_token')

        setTimeout(() => {
            navigation.navigate('LoginScreen', {
                is_logout: true
            })
        }, 1000);
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

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefersh(true)

                            loadUserData()
                            setRefersh(false)
                        }}
                    />
                }
            >
                <View
                    style={{ height: Dimensions.get('window').height, backgroundColor: 'white' }}
                >
                    <ImageBackground
                        source={require('./../../assets/images/banner.jpg')}
                        style={{ width: '100%', height: 175 }}
                        resizeMethod="auto"
                        resizeMode="cover"
                        blurRadius={1}
                    >
                    </ImageBackground>
                    <ContainerComponent>
                        <View>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -85 }}
                            >
                                {
                                    user.photo ?
                                        <Image
                                            source={{ uri: user.photo }}
                                            width={120}
                                            height={120}
                                            borderRadius={60}
                                        />
                                        :
                                        <Image
                                            source={require('./../../assets/images/no-photo.png')}
                                            width={120}
                                            height={120}
                                            borderRadius={60}
                                        />
                                }
                            </View>
                            <View
                                style={{ marginTop: 10 }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', fontSize: 17 }]}
                                >
                                    {user.name}
                                </Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                                >
                                    {user.nrp}
                                </Text>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 7, gap: 5 }}
                                >
                                    <MaterialCommunityIcon color={'#414141'} name={'office-building'} size={18} />
                                    <Text
                                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                                    >
                                        {user.branch ? user.branch.name : ''}
                                    </Text>
                                </View>
                                <Text
                                    style={[GlobalStyle.initialFont, { textAlign: 'center', marginTop: 10, fontSize: 14, color: 'white', backgroundColor: AppUtil.primary, alignSelf: 'center', paddingHorizontal: 13, paddingVertical: 6, borderRadius: 100 }]}
                                >
                                    {user.job_position}
                                </Text>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 5 }}
                                >
                                    <MaterialCommunityIcon color={'#414141'} name={'email'} size={18} />
                                    <Text
                                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                                    >
                                        {user.email}
                                    </Text>
                                </View>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 5 }}
                                >
                                    <MaterialCommunityIcon color={'#414141'} name={'whatsapp'} size={18} />
                                    <Text
                                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                                    >
                                        {user.whatsapp_number}
                                    </Text>
                                </View>

                                <Button
                                    onPress={() => {
                                        navigation.navigate('AppMenu', {
                                            screen: 'ProfileScreenWrapper', params: {
                                                screen: 'EditProfileScreen',
                                                params: {
                                                    user: user
                                                }
                                            }
                                        })
                                    }}
                                    style={{ marginTop: 20, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 50, backgroundColor: AppUtil.primary }}
                                >
                                    Edit Profil
                                </Button>
                                <Divider
                                    style={{ marginTop: 20, marginBottom: 10 }}
                                />
                                <Button
                                    onPress={() => {
                                        doLogout()
                                    }}
                                    status="danger"
                                    style={{ marginTop: 10 }}
                                >
                                    Logout
                                </Button>
                            </View>

                        </View>
                    </ContainerComponent>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen