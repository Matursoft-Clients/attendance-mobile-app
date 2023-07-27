import { Button, Input, Text } from "@ui-kitten/components";
import { View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "@env"
import { useToast } from "react-native-toast-notifications";
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";

function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState(null)
    const [spinnerShow, setSpinnerShow] = useState(false)

    const toast = useToast()

    const doSendForgotPasswordEmail = () => {
        setSpinnerShow(true);

        axios.post(`${API_URL}/employee/forgot-password`, {
            email: email
        }).then((res) => {
            setSpinnerShow(false);
            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })
            setTimeout(() => {
                navigation.navigate('ForgotPasswordCodeVerificationScreen', {
                    email: email
                })
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
                    >Lupa Kata Sandi</Text>
                    <Text
                        style={[GlobalStyle.initialFont, { marginTop: 13, textAlign: 'center', lineHeight: 22, fontSize: 14 }]}
                    >Masukan email kamu, untuk mendapatkan kode untuk reset kata sandi</Text>

                    <Input
                        style={{ marginTop: 25 }}
                        label={evaProps => <Text {...evaProps}>Email</Text>}
                        placeholder="Email"
                        value={email}
                        onChangeText={(val) => { setEmail(val) }}
                    />

                    <Button
                        style={{ marginTop: 30, backgroundColor: AppUtil.primary }}
                        onPress={() => {
                            doSendForgotPasswordEmail()
                        }}
                    >
                        {evaProps => <Text {...evaProps}>Kirim Kode</Text>}
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

export default ForgotPasswordScreen;