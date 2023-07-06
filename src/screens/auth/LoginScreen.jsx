import { Button, Input, Text } from "@ui-kitten/components";
import { View } from "react-native";
import ContainerComponent from "../../components/ContainerComponent";
import { Colors, Image } from "react-native-ui-lib";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";

function LoginScreen({ navigation }) {
    return (
        <ContainerComponent>
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
                    />

                    <Input
                        style={{ marginTop: 15 }}
                        label={evaProps => <Text {...evaProps}>Password</Text>}
                        placeholder="Password"
                    />
                    <Text
                        onPress={() => {
                            navigation.navigate('ForgotPasswordScreen')
                        }}
                        style={[GlobalStyle.initialFont, { textAlign: 'right', marginTop: 10, color: AppUtil.primary, fontWeight: 'bold', fontSize: 13 }]}
                    >Lupa kata sandi</Text>

                    <Button
                        onPress={() => {
                            navigation.navigate('AppMenu', { screen: 'HomeScreen' });
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