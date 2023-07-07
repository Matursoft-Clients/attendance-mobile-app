import { Button, Card, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent"
import { View } from "react-native-ui-lib"
import GlobalStyle from "../../utils/GlobalStyle"
import AppUtil from "../../utils/AppUtil"
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useEffect, useRef, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { API_URL } from "@env"
import { useToast } from "react-native-toast-notifications"
import { SafeAreaView, ScrollView } from "react-native"
import LoadingSpinnerComponent from "../../components/LoadingSpinnerComponent"

function AnnouncementScreen({ navigation }) {

    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [prevPageUrl, setPrevPageUrl] = useState(null)
    const [announcements, setAnnouncements] = useState([])
    const [ref, setRef] = useState(null)
    const [spinnerShow, setSpinnerShow] = useState(false)

    const toast = useToast()

    useEffect(() => {
        loadAnnouncements()
    }, [])

    const loadAnnouncements = async (url = null, cb) => {
        setSpinnerShow(true);
        const token = await AsyncStorage.getItem('api_token')

        axios.get(url ? url : `${API_URL}/announcements`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(async (res) => {
            setSpinnerShow(false);
            setAnnouncements(res.data.data.announcements.data)
            setNextPageUrl(res.data.data.announcements.next_page_url)
            setPrevPageUrl(res.data.data.announcements.prev_page_url)
            cb()
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

    const _renderAnnouncements = () => {
        return announcements.map((e) => {
            return (
                <Card
                    style={{ marginBottom: 10, backgroundColor: 'white' }}
                    onPress={() => {
                        navigation.navigate('AppMenu', {
                            screen: 'AnnouncementScreenWrapper', params: {
                                screen: 'AnnouncementDetailScreen',
                                params: {
                                    slug: e.slug
                                }
                            }
                        })
                    }}
                >
                    {/* <Text
                        style={[GlobalStyle.initialFont, { marginBottom: 4, backgroundColor: AppUtil.primary, color: 'white', alignSelf: 'flex-start', fontSize: 12, paddingHorizontal: 7, borderRadius: 3.5, paddingVertical: 2.5 }]}
                    >Belum dibaca</Text> */}
                    <Text
                        style={[{ fontWeight: '700', fontSize: 15 }, GlobalStyle.initialFont]}
                    >{e.title}</Text>
                    <Text
                        style={[GlobalStyle.initialFont, { marginTop: 8, fontSize: 12 }]}
                    >{e.created_at_format}</Text>
                </Card>
            )
        })
    }

    return (
        <SafeAreaView
            style={{ backgroundColor: 'white', height: '100%' }}
        >
            <ScrollView
                ref={(ref) => {
                    setRef(ref)
                }}
            >
                <ContainerComponent>
                    {
                        spinnerShow ? <LoadingSpinnerComponent /> : <></>
                    }

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

                        {
                            _renderAnnouncements()
                        }

                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                        >
                            {
                                prevPageUrl ?
                                    <Button
                                        onPress={() => {
                                            loadAnnouncements(prevPageUrl, () => {
                                                ref.scrollTo({ y: 0, animated: true })
                                            })
                                        }}
                                        size="small"
                                        textStyle={{ color: 'red' }}
                                        appearance="outline"
                                        style={{ marginTop: 20, paddingHorizontal: 20, alignSelf: 'center', color: 'red' }}
                                    >
                                        {evaProps => <Text {...evaProps} style={[GlobalStyle.initialFont, { color: AppUtil.primary, fontWeight: '700', fontSize: 13 }]}>Prev</Text>}
                                    </Button> : <></>
                            }

                            {
                                nextPageUrl ?
                                    <Button
                                        onPress={() => {
                                            loadAnnouncements(nextPageUrl, () => {
                                                ref.scrollTo({ y: 0, animated: true })
                                            })
                                        }}
                                        size="small"
                                        style={{ marginTop: 20, paddingHorizontal: 20, alignSelf: 'center', backgroundColor: AppUtil.primary }}
                                    >
                                        {evaProps => <Text {...evaProps} style={[GlobalStyle.initialFont, { color: 'white', fontWeight: '700', fontSize: 13 }]}>Next</Text>}
                                    </Button> : <></>
                            }
                        </View>

                    </View>

                </ContainerComponent>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AnnouncementScreen