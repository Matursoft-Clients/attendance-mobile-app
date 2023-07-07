import { Button, Card, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import { View } from "react-native-ui-lib"
import { SafeAreaView, ScrollView } from "react-native"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AppUtil from "../../utils/AppUtil"
import GlobalStyle from "../../utils/GlobalStyle"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useToast } from "react-native-toast-notifications"
import { API_URL } from "@env"

function AnnouncementDetailScreen({ route }) {
    const [announcement, setAnnouncement] = useState('')

    useEffect(() => {
        loadAnnouncementDetail(route.params.slug)
    }, [])

    const toast = useToast()

    const loadAnnouncementDetail = async (slug) => {
        const token = await AsyncStorage.getItem('api_token')

        axios.get(`${API_URL}/announcements/${slug}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setAnnouncement(res.data.data)

            try {
                await AsyncStorage.setItem(res.data.data.slug, true)
            } catch (error) {

            }

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
        <SafeAreaView
            style={{ height: '100%', backgroundColor: 'white' }}
        >
            <ScrollView>
                <ContainerComponent>

                    <View
                        style={{ height: '100%' }}
                    >
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center', marginBottom: 23 }}
                        >
                            <MaterialCommunityIcon name={'bullhorn-variant'} size={25} color={AppUtil.primary} />
                            <Text
                                style={[GlobalStyle.initialFont, { textAlign: 'center', fontSize: 20, fontWeight: '700', color: AppUtil.primary }]}
                            >
                                Detail Pengumuman
                            </Text>
                        </View>

                        <Text
                            style={[{ fontWeight: '700', fontSize: 16 }, GlobalStyle.initialFont]}
                        >{announcement.title}</Text>
                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 8, fontSize: 12 }]}
                        >{announcement.created_at_format}</Text>

                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 15, fontSize: 13.5 }]}
                        >
                            {announcement.content}
                        </Text>
                    </View>

                </ContainerComponent>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AnnouncementDetailScreen