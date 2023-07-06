import { Button, Divider, Input, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import { Colors, Image, View, Button as ButtonUiLib } from "react-native-ui-lib"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ImageBackground, Modal, Pressable, TouchableHighlight } from "react-native"
import { useState } from "react"

function ProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View
            style={{ height: '100%', backgroundColor: 'white' }}
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
                            <Image
                                source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                                width={100}
                                height={100}
                                borderRadius={50}
                            />
                        </View>
                        <TouchableHighlight
                            underlayColor="#FAFAFA"
                            style={{ marginTop: 15, marginBottom: 3, backgroundColor: '#414141', alignSelf: 'center', paddingVertical: 9, paddingHorizontal: 17, borderRadius: 6 }}
                        >
                            <Text
                                style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', color: 'white', fontSize: 12 }]}
                            >Ubah Foto</Text>
                        </TouchableHighlight>

                        <Input
                            style={{ marginTop: 20 }}
                            label={evaProps => <Text {...evaProps}>Nama Lengkap</Text>}
                            placeholder="Nama Lengkap"
                        />

                        <Input
                            style={{ marginTop: 15 }}
                            label={evaProps => <Text {...evaProps}>Password Baru</Text>}
                            placeholder="Password Baru"
                        />
                        <Text
                            style={[GlobalStyle.initialFont, { fontSize: 10, marginTop: 4.5 }]}
                        >Biarkan kosong jika tidak ingin mengubah password</Text>

                        <Input
                            style={{ marginTop: 15 }}
                            label={evaProps => <Text {...evaProps}>Konfirmasi Password Baru</Text>}
                            placeholder="Konfirmasi Password Baru"
                        />

                        <Divider style={{ marginTop: 15, marginBottom: 25 }} />

                        <View
                            style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}
                        >
                            <Button
                                onPress={() => setModalVisible(!modalVisible)}
                                status="basic"
                            >Tutup</Button>
                            <Button
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
                        <Image
                            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                            width={120}
                            height={120}
                            borderRadius={60}
                        />
                    </View>
                    <View
                        style={{ marginTop: 10 }}
                    >
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', fontSize: 17 }]}
                        >
                            Ahmad Yusuf
                        </Text>
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', marginTop: 10, fontSize: 14, color: 'white', backgroundColor: AppUtil.primary, alignSelf: 'center', paddingHorizontal: 13, paddingVertical: 6, borderRadius: 100 }]}
                        >
                            Kasir
                        </Text>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 5 }}
                        >
                            <MaterialCommunityIcon color={'#414141'} name={'email'} size={18} />
                            <Text
                                style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 14 }]}
                            >
                                ahmad@gmail.com
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
                                navigation.navigate('LoginScreen')
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
    )
}

export default ProfileScreen