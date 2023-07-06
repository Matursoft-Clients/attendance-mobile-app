import { Layout, Select, SelectItem, Text } from "@ui-kitten/components"
import { Colors, Image, View } from "react-native-ui-lib"
import ContainerComponent from "../../components/ContainerComponent"
import Carousel from 'react-native-snap-carousel';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useKeenSliderNative } from 'keen-slider/react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import GlobalStyle from "../../utils/GlobalStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppUtil from "../../utils/AppUtil";

function HomeScreen({ navigation }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    const slides = 4
    const slider = useKeenSliderNative({
        slides,
    })
    const [selected, setSelected] = useState('');

    const { width } = Dimensions.get('window');

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: 'white' },
        child: { width, justifyContent: 'center' },
        text: { fontSize: width * 0.5, textAlign: 'center' },
    });

    const entries = [
        'https://img.pikbest.com/origin/06/30/56/43BpIkbEsTkaY.jpg!w700wp',
        'https://img.freepik.com/premium-vector/digital-marketing-banner-web-cover-banner-design-free-vector_906484-18.jpg',
        'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/creative-marketing-web-banner-template-design-7c9725e11b55e91763a38d6da3897068_screen.jpg?ts=1642476308',
    ]


    const [activeIndex, setActiveIndex] = useState(0)

    const carouselItems = [
        {
            title: "Item 1",
            text: "Text 1",
        },
        {
            title: "Item 2",
            text: "Text 2",
        },
        {
            title: "Item 3",
            text: "Text 3",
        },
        {
            title: "Item 4",
            text: "Text 4",
        },
        {
            title: "Item 5",
            text: "Text 5",
        },
    ]

    const _renderItem = ({ item, index }) => {
        return (
            <Image
                source={{ uri: item }}
                width={width - 120}
                height={70}
                borderRadius={5}
            />
        )
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <ContainerComponent>
                    <View
                        style={{ height: '100%', paddingBottom: 10 }}
                    >

                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        >
                            <Image
                                source={require('./../../assets/images/logo.jpg')}
                                width={30}
                                height={30}
                                borderRadius={15}
                            />
                            <Text
                                style={[GlobalStyle.initialFont, GlobalStyle.textPrimary, { fontSize: 17, fontWeight: "800" }]}
                            >BMT</Text>
                        </View>

                        <Text
                            style={[{ textAlign: 'center', marginTop: 5, color: Colors.grey20, fontSize: 14 }, GlobalStyle.initialFont]}
                        >Assalamu'alaikum,</Text>
                        <Text
                            style={[GlobalStyle.initialFont, { textAlign: 'center', marginTop: 1, fontWeight: '700', fontSize: 16, color: AppUtil.primary }]}
                        >Ahmad Yusuf</Text>

                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}
                        >
                            <Icon name="mosque" size={20} color={AppUtil.primary} />
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 15 }]}
                                >Kabupaten Cilacap, Subuh</Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 15, fontWeight: 700, color: AppUtil.primary }]}> 04.00</Text>
                            </View>

                        </View>


                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 13 }}>
                                <Carousel
                                    inactiveSlideScale={0.9}
                                    layout={"default"}
                                    data={entries}
                                    sliderWidth={width - 50}
                                    itemWidth={width - 120}
                                    loop={true}
                                    autoplay={true}
                                    renderItem={_renderItem} />
                            </View>
                        </View>

                        <View
                            style={{ backgroundColor: AppUtil.primary, borderRadius: 9, marginTop: 20, padding: 14 }}
                        >
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                                >Absensi masuk : 07:00 - 07:30</Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { color: 'white', fontSize: 12 }]}
                                >13 Juni 2023</Text>
                            </View>
                            <TouchableHighlight
                                underlayColor="#FAFAFA"
                                style={{ marginTop: 15, marginBottom: 3, backgroundColor: 'white', paddingVertical: 10, borderRadius: 6 }}
                                onPress={() => {
                                    navigation.navigate('AppMenu', { screen: 'AttendanceScreen' })
                                }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { textAlign: 'center', fontWeight: '700', color: AppUtil.primary }]}
                                >Absensi Masuk</Text>
                            </TouchableHighlight>
                        </View>

                        <Text
                            style={[GlobalStyle.initialFont, { marginTop: 15, fontSize: 15, fontWeight: '700' }]}
                        >Rekapitulasi Absensi</Text>

                        <Layout
                            style={{ marginTop: 8 }}
                            level='1'
                        >
                            <Select
                                placeholder={'Bulan Ini'}
                                selectedIndex={selectedIndex}
                                onSelect={index => setSelectedIndex(index)}
                            >
                                <SelectItem title='' />
                                <SelectItem title='Option 2' />
                                <SelectItem title='Option 3' />
                            </Select>
                        </Layout>

                        <Calendar
                            style={{
                                marginTop: 15,
                                borderRadius: 8
                            }}
                            theme={{
                                calendarBackground: AppUtil.primarySoft,
                            }}
                            onDayPress={day => {
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                    </View>
                </ContainerComponent>
            </ScrollView>
        </SafeAreaView >
    )
}

export default HomeScreen