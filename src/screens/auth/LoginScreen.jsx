import { Button, Input, Text } from "@ui-kitten/components";
import { View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import { Colors, Image } from "react-native-ui-lib";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";
import { useState } from "react";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent";
import { API_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('tomyntapss@gmail.com')
    const [password, setPassword] = useState('12345678')
    const [spinnerShow, setSpinnerShow] = useState(false)

    const toast = useToast()

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
        <ContainerComponent>
            {
                spinnerShow ? <LoadingSpinnerComponent /> : <></>
            }

            <View
                style={{ backgroundColor: '#FFF', height: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <View>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Image
                            source={require('./../../assets/images/logo.jpg')}
                            width={100}
                            height={100}
                            borderRadius={50}
                        />
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
    )
}

export default LoginScreen;