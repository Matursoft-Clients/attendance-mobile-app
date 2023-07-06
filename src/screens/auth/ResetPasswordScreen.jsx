import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import { BackHandler, ImageComponent, TextInput, View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import { Colors, Image } from "react-native-ui-lib";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import GlobalStyle from "../../utils/GlobalStyle";
import AppUtil from "../../utils/AppUtil";
import React, { useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { API_URL } from "@env"
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

function ResetPasswordScreen({ navigation, route }) {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [spinnerShow, setSpinnerShow] = useState(false)

    const toast = useToast()

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

    useEffect(() => {
        setEmail(route.params.email)
        setToken(route.params.token)
    }, [])

    const doResetPassword = () => {
        setSpinnerShow(true);

        axios.post(`${API_URL}/employee/reset-password`, {
            email: email,
            token: token,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
        }).then((res) => {
            setSpinnerShow(false);
            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })
            setTimeout(() => {
                navigation.navigate('LoginScreen')
            }, 500);
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
        <ContainerComponent>
            {
                spinnerShow ? <LoadingSpinnerComponent /> : <></>
            }
            <View
                style={{ backgroundColor: '#FFF', height: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <View>
                    <Text
                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: 'bold', fontSize: 25 }]}
                    >Reset Kata Sandi</Text>
                    <Input
                        secureTextEntry={true}
                        style={{ marginTop: 30 }}
                        label={evaProps => <Text {...evaProps}>Password Baru</Text>}
                        placeholder="Password Baru"
                        onChangeText={(val) => {
                            setNewPassword(val)
                        }}
                    />

                    <Input
                        secureTextEntry={true}
                        style={{ marginTop: 15 }}
                        label={evaProps => <Text {...evaProps}>Konfirmasi Password Baru</Text>}
                        placeholder="Konfirmasi Password Baru"
                        onChangeText={(val) => {
                            setNewPasswordConfirmation(val)
                        }}
                    />

                    <Button
                        onPress={() => {
                            doResetPassword()
                        }}
                        style={{ marginTop: 35, backgroundColor: AppUtil.primary }}
                    >
                        {evaProps => <Text {...evaProps}>Reset</Text>}
                    </Button>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}
                    >
                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 15, textAlign: 'center', fontSize: 13 }]}
                        >Kembali ke</Text>
                        <Text
                            onPress={() => {
                                navigation.navigate('LoginScreen')
                            }}
                            style={[GlobalStyle.initialFont, { marginTop: 15, textAlign: 'center', fontWeight: 'bold', color: AppUtil.primary, fontSize: 13 }]}
                        >Login</Text>
                    </View>
                </View>

            </View>
        </ContainerComponent>
    )
}

export default ResetPasswordScreen;