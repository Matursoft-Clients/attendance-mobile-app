import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import { ImageComponent, View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import { Colors, Image } from "react-native-ui-lib";
import GlobalStyle from "../../utils/GlobalStyle";
import AppUtil from "../../utils/AppUtil";
import { useEffect, useRef, useState } from "react";
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";
import Toast from "react-native-root-toast";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { API_URL } from "@env"

function ForgotPasswordCodeVerificationScreen({ navigation, route }) {

    const [email, setEmail] = useState(null)
    const toast = useToast()
    const [spinnerShow, setSpinnerShow] = useState(false)

    useEffect(() => {
        setEmail(route.params.email)
    }, [])

    const [code1, setCode1] = useState(null)
    const [code2, setCode2] = useState(null)
    const [code3, setCode3] = useState(null)
    const [code4, setCode4] = useState(null)
    const [code5, setCode5] = useState(null)

    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();

    const handleResendVerificationCode = () => {
        setSpinnerShow(true);

        axios.post(`${API_URL}/employee/forgot-password`, {
            email: email
        }).then((res) => {
            setSpinnerShow(false);
            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })
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

    const doCodeVerification = () => {
        setSpinnerShow(true);

        axios.post(`${API_URL}/employee/check-token`, {
            email: email,
            key: 'reset_password',
            token: `${code1}${code2}${code3}${code4}${code5}`
        }).then((res) => {
            setSpinnerShow(false);
            toast.show(res.data.msg, {
                type: 'success',
                placement: 'center'
            })
            setTimeout(() => {
                navigation.navigate('ResetPasswordScreen', {
                    email: email,
                    token: `${code1}${code2}${code3}${code4}${code5}`
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
                    >Masukan Kode</Text>


                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}
                    >
                        <Input
                            textAlign="center"
                            keyboardType="numeric"
                            value={code1}
                            maxLength={1}
                            onChangeText={(val) => {
                                setCode1(val)
                                if (val) {
                                    ref_input2.current.focus()
                                }
                            }}
                        />
                        <Input
                            ref={ref_input2}
                            textAlign="center"
                            keyboardType="numeric"
                            maxLength={1}
                            value={code2}
                            onChangeText={(val) => {
                                setCode2(val)
                                if (val) {
                                    ref_input3.current.focus()
                                }
                            }}
                        />
                        <Input
                            ref={ref_input3}
                            textAlign="center"
                            keyboardType="numeric"
                            maxLength={1}
                            value={code3}
                            onChangeText={(val) => {
                                setCode3(val)
                                if (val) {
                                    ref_input4.current.focus()
                                }
                            }}
                        />
                        <Input
                            ref={ref_input4}
                            textAlign="center"
                            keyboardType="numeric"
                            maxLength={1}
                            value={code4}
                            onChangeText={(val) => {
                                setCode4(val)
                                if (val) {
                                    ref_input5.current.focus()
                                }
                            }}
                        />
                        <Input
                            ref={ref_input5}
                            textAlign="center"
                            keyboardType="numeric"
                            maxLength={1}
                            value={code5}
                            onChangeText={(val) => {
                                setCode5(val)
                            }}
                        />
                    </View>
                    <Text
                        onPress={() => {
                            handleResendVerificationCode()
                        }}
                        style={[GlobalStyle.initialFont, { textAlign: 'right', marginTop: 10, color: AppUtil.primary, fontWeight: 'bold', fontSize: 13 }]}
                    >Kirim ulang kode</Text>

                    <Button
                        onPress={() => {
                            doCodeVerification()
                        }}
                        style={{ marginTop: 30, backgroundColor: AppUtil.primary }}
                    >
                        {evaProps => <Text {...evaProps}>Verifikasi Kode</Text>}
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

export default ForgotPasswordCodeVerificationScreen;