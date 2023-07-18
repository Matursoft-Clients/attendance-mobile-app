import { Button, Divider, Input, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { BackHandler, Dimensions, Image, ImageBackground, Modal, Pressable, RefreshControl, SafeAreaView, ScrollView, TouchableHighlight, View } from "react-native"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "react-native-toast-notifications"
import { useFocusEffect } from "@react-navigation/native"
import { launchImageLibrary } from 'react-native-image-picker';

function ProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState({})
    const [responseImageGallery, setResponseImageGallery] = useState('');
    const toast = useToast()
    const [errorMessage, setErrorMessage] = useState(null)
    const [refresh, setRefersh] = useState(false)

    const [name, setName] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')


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

    const openGalleryToSelectFile = () => {
        let options = {
            storageOptions: {
                path: 'image'
            }
        }

        launchImageLibrary(options, response => {
            if (!response.didCancel) {
                setResponseImageGallery(response.assets[0])
            }
        })
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

    const doUpdateUserData = async () => {
        setErrorMessage(null)
        const token = await AsyncStorage.getItem('api_token')
        var formData = new FormData();
        formData.append('name', name);
        formData.append('whatsapp_number', whatsappNumber);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);

        if (responseImageGallery != '') {
            formData.append('photo', {
                uri: responseImageGallery.uri,
                type: responseImageGallery.type,
                name: responseImageGallery.fileName,
            })
        }

        axios.post(`${API_URL}/employee/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })
            setModalVisible(!modalVisible)
            setPassword('')
            setPasswordConfirmation('')
            loadUserData()
        }).catch((err) => {
            console.log(err.response)
            if (err.response.status == 422) {
                setErrorMessage(err.response.data.msg + (err.response.data.error ? `, ${err.response.data.error}` : ''))
            } else if (err.response.status == 498) {
                setErrorMessage(err.response.data.msg)

                navigation.navigate('LoginScreen')
            } else if (err.response.status == 406) {
                setErrorMessage(err.response.data.msg)

                navigation.navigate('LoginScreen')
            } else {
                setErrorMessage(err.response.data.msg)
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
            setName(res.data.data.name)
            setWhatsappNumber(res.data.data.whatsapp_number)
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
                                style={{ paddingVertical: 35, backgroundColor: 'white', borderWidth: 2, borderColor: AppUtil.primary, marginTop: '10%', marginLeft: 20, marginRight: 20, borderRadius: 10, paddingHorizontal: 20 }}
                            >

                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                                >
                                    {
                                        responseImageGallery ?
                                            <Image
                                                source={{ uri: responseImageGallery.uri }}
                                                width={100}
                                                height={100}
                                                borderRadius={50}
                                            /> :
                                            <Image
                                                source={user.photo ? { uri: user.photo } : require('./../../assets/images/no-photo.png')}
                                                width={100}
                                                height={100}
                                                borderRadius={50}
                                            />
                                    }

                                </View>
                                <TouchableHighlight
                                    onPress={openGalleryToSelectFile}
                                    underlayColor="#FAFAFA"
                                    style={{ marginTop: 15, marginBottom: 3, backgroundColor: '#414141', alignSelf: 'center', paddingVertical: 9, paddingHorizontal: 17, borderRadius: 6 }}
                                >
                                    <Text
                                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', color: 'white', fontSize: 12 }]}
                                    >Ubah Foto</Text>
                                </TouchableHighlight>

                                {
                                    errorMessage ?
                                        <Text
                                            style={[GlobalStyle.initialFont, { fontSize: 13, backgroundColor: AppUtil.danger, color: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginTop: 15, marginBottom: -5 }]}
                                        >{errorMessage}</Text> : <></>
                                }


                                <Input
                                    style={{ marginTop: 20 }}
                                    label={evaProps => <Text {...evaProps}>Nama Lengkap</Text>}
                                    placeholder="Nama Lengkap"
                                    value={name}
                                    onChangeText={(val) => {
                                        setName(val)
                                    }}
                                />

                                <Input
                                    style={{ marginTop: 20 }}
                                    label={evaProps => <Text {...evaProps}>Nomor Whatsapp</Text>}
                                    placeholder="Nama Lengkap"
                                    value={whatsappNumber}
                                    onChangeText={(val) => {
                                        setWhatsappNumber(val)
                                    }}
                                />

                                <Input
                                    style={{ marginTop: 15 }}
                                    label={evaProps => <Text {...evaProps}>Password Baru</Text>}
                                    placeholder="Password Baru"
                                    secureTextEntry={true}
                                    value={password}
                                    onChangeText={(val) => {
                                        setPassword(val)
                                    }}
                                />
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 10, marginTop: 4.5 }]}
                                >Biarkan kosong jika tidak ingin mengubah password</Text>

                                <Input
                                    style={{ marginTop: 15 }}
                                    label={evaProps => <Text {...evaProps}>Konfirmasi Password Baru</Text>}
                                    placeholder="Konfirmasi Password Baru"
                                    value={passwordConfirmation}
                                    secureTextEntry={true}
                                    onChangeText={(val) => {
                                        setPasswordConfirmation(val)
                                    }}
                                />

                                <Divider style={{ marginTop: 15, marginBottom: 25 }} />

                                <View
                                    style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}
                                >
                                    <Button
                                        onPress={() => {
                                            setErrorMessage(null)
                                            setPassword('')
                                            setPasswordConfirmation('')
                                            setModalVisible(!modalVisible)
                                        }}
                                        status="basic"
                                    >Tutup</Button>
                                    <Button
                                        onPress={() => {
                                            doUpdateUserData()
                                        }}
                                        style={{ backgroundColor: AppUtil.primary }}
                                    >Update</Button>
                                </View>
                            </View>
                        </View>
                    </Modal>

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
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 7, gap: 5 }}
                                >
                                    <MaterialCommunityIcon color={'#414141'} name={'office-building'} size={18} />
                                    <Text
                                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                                    >
                                        {user.branch.name}
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
                                        setModalVisible(true)
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