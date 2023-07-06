import { Button, Card, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import { View } from "react-native-ui-lib"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

function AnnouncementScreen({ navigation }) {
    return (
        <ContainerComponent>

            <View
                style={{ height: '100%' }}
            >

                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center', marginBottom: 23 }}
                >
                    <MaterialCommunityIcon name={'bullhorn-variant'} size={25} color={AppUtil.primary} />
                    <Text
                        style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 23, fontWeight: '700', color: AppUtil.primary }]}
                    >
                        Pengumuman
                    </Text>
                </View>

                <Card
                    style={{ marginBottom: 10, backgroundColor: AppUtil.primarySoft }}
                    onPress={() => {
                        navigation.navigate('AppMenu', {
                            screen: 'AnnouncementScreenWrapper', params: {
                                screen: 'AnnouncementDetailScreen'
                            }
                        })
                    }}
                >
                    <Text
                        style={[GlobalStyle.initialFont, { marginBottom: 4, backgroundColor: AppUtil.primary, color: 'white', alignSelf: 'flex-start', fontSize: 12, paddingHorizontal: 7, borderRadius: 3.5, paddingVertical: 2.5 }]}
                    >Belum dibaca</Text>
                    <Text
                        style={[{ fontWeight: '700', fontSize: 15 }, GlobalStyle.initialFont]}
                    >LOWONGAN KERJA - ANGKASA DIGITAL MEDIA_Socmed Publisher</Text>
                    <Text
                        style={[GlobalStyle.initialFont, { marginTop: 8, fontSize: 12 }]}
                    >1 Jam yang lalu</Text>
                </Card>

                <Card
                    style={{ marginBottom: 10 }}
                    onPress={() => {
                        navigation.navigate('AppMenu', {
                            screen: 'AnnouncementScreenWrapper', params: {
                                screen: 'AnnouncementDetailScreen'
                            }
                        })
                    }}
                >
                    <Text
                        style={[{ fontWeight: '700', fontSize: 15 }, GlobalStyle.initialFont]}
                    >LOWONGAN KERJA - ANGKASA DIGITAL MEDIA_Socmed Publisher</Text>
                    <Text
                        style={[GlobalStyle.initialFont, { marginTop: 8, fontSize: 12 }]}
                    >Kemarin</Text>
                </Card>

                <Button
                    style={{ marginTop: 20, alignSelf: 'center', backgroundColor: AppUtil.primary }}
                >Lihat lebih banyak</Button>

            </View>

        </ContainerComponent>
    )
}

export default AnnouncementScreen