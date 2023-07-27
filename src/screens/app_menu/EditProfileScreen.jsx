import { Button, Divider, Input, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dimensions, Image, SafeAreaView, ScrollView, TouchableHighlight, View } from "react-native"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "react-native-toast-notifications"
import { launchImageLibrary } from 'react-native-image-picker';
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent"

function EditProfileScreen({ navigation, route }) {
    const [user, setUser] = useState({})
    const [responseImageGallery, setResponseImageGallery] = useState('');
    const toast = useToast()
    const [errorMessage, setErrorMessage] = useState(null)

    const [spinnerShow, setSpinnerShow] = useState(false)

    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    useEffect(() => {
        setUser(route.params.user)
    }, [])

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

    const doUpdateUserData = async () => {
        setSpinnerShow(true)

        setErrorMessage(null)
        const token = await AsyncStorage.getItem('api_token')
        var formData = new FormData();
        formData.append('name', user.name);
        formData.append('whatsapp_number', user.whatsapp_number);
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
            setSpinnerShow(false)

            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })

            setResponseImageGallery('')
            setPassword('')
            setPasswordConfirmation('')

            setTimeout(() => {
                navigation.navigate('AppMenu', {
                    screen: 'ProfileScreenWrapper', params: {
                        screen: 'ProfileScreen',
                        params: {
                            reload: true
                        }
                    }
                })
            }, 150);

        }).catch((err) => {
            setSpinnerShow(false)

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

    return (
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{ height: Dimensions.get('window').height, backgroundColor: 'white' }}
                >
                    {
                        spinnerShow ? <LoadingSpinnerComponent /> : <></>
                    }
                    <ContainerComponent>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center', marginBottom: 40 }}
                        >
                            <MaterialCommunityIcon name={'account-edit'} size={25} color={AppUtil.primary} />
                            <Text
                                style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 20, fontWeight: '700', color: AppUtil.primary }]}
                            >
                                Edit Profil
                            </Text>
                        </View>
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
                                    style={[GlobalStyle.initialFont, { fontSize: 13, backgroundColor: AppUtil.danger, color: 'white', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, marginTop: 15, marginBottom: -5 }]}
                                >{errorMessage}</Text> : <></>
                        }

                        <Input
                            style={{ marginTop: 20 }}
                            label={evaProps => <Text {...evaProps}>Nama Lengkap</Text>}
                            placeholder="Nama Lengkap"
                            value={user.name}
                            onChangeText={(val) => {
                                setUser(() => {
                                    let obj = Object.assign({}, user)
                                    obj.name = val

                                    return obj
                                })
                            }}
                        />

                        <Input
                            style={{ marginTop: 20 }}
                            label={evaProps => <Text {...evaProps}>Nomor Whatsapp</Text>}
                            placeholder="Nomor Whatsapp"
                            value={user.whatsapp_number}
                            onChangeText={(val) => {
                                setUser(() => {
                                    let obj = Object.assign({}, user)
                                    obj.whatsapp_number = val

                                    return obj
                                })
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
                                    navigation.navigate('AppMenu', {
                                        screen: 'ProfileScreenWrapper', params: {
                                            screen: 'ProfileScreen'
                                        }
                                    })
                                }}
                                status="basic"
                            >Kembali</Button>
                            <Button
                                onPress={() => {
                                    doUpdateUserData()
                                }}
                                style={{ backgroundColor: AppUtil.primary }}
                            >Update</Button>
                        </View>
                    </ContainerComponent>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfileScreen