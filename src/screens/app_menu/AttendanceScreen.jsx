import { Button, Text } from "@ui-kitten/components"
import ContainerComponent from "../../components/ContainerComponent";
import { Colors, Image, View } from "react-native-ui-lib";
import WebView from "react-native-webview";
import AppUtil from "../../utils/AppUtil";
import GlobalStyle from "../../utils/GlobalStyle";
import { SafeAreaView, ScrollView } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons'
import Leaflet, { Markers, TileOptions } from 'react-native-leaflet-ts';

function AttendanceScreen() {
    const markerList = [
        {
            latLng: [-7.349203514278471, 109.35073559642174],
            icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg',
            iconSize: {
                width: 23.5,
                height: 32,
            },
            title: 'Title 1',
            disabled: true,
            radius: 10
        },
    ];


    const mapLayers = [
        {
            name: 'Floor 1',
            src: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            tileOptions: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            },

        },
    ];

    return (
        <SafeAreaView
            style={{ height: '100%', backgroundColor: 'white' }}
        >
            <View
                style={{ flex: 1 }}
            >
                <View
                    style={{ width: '100%', height: '55%', borderBottomWidth: 3, borderBottomColor: AppUtil.primary }}
                >
                    <Leaflet
                        mapLayers={mapLayers}
                        minZoom={1}
                        zoom={2}
                        maxZoom={20}
                        flyTo={{
                            latLng: [-7.349203514278471, 109.35073559642174],
                            zoom: 19,
                        }}
                        markers={markerList}
                    />
                    {/* <WebView source={{ uri: 'https://maps.google.com/?q=-7.395087247069214,109.22329518746' }} /> */}
                </View>
                <ContainerComponent>
                    <View
                        style={{ height: '100%' }}
                    >
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 }}
                        >
                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 13 }]}
                                >Tanggal Sekarang</Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 21, marginTop: 5, fontWeight: 700 }]}
                                >21 Juni 2023</Text>
                            </View>
                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 13 }]}
                                >Waktu Sekarang</Text>
                                <Text
                                    style={[GlobalStyle.initialFont, { fontSize: 21, marginTop: 5, fontWeight: 700 }]}
                                >08:23:51</Text>
                            </View>
                        </View>

                        <View
                            style={{ borderRadius: 5, gap: 4, backgroundColor: AppUtil.warning, paddingVertical: 12, marginTop: 25, flexDirection: 'row', justifyContent: 'center' }}
                        >
                            <Ionicon name={'information-circle'} color={'white'} size={20} />
                            <Text
                                style={[GlobalStyle.initialFont, { color: 'white', fontWeight: '700' }]}
                            >Anda Belum Melakukan Absen</Text>
                        </View>

                    </View>
                </ContainerComponent>
            </View>

            <View
                style={{ borderTopColor: AppUtil.primarySoft, borderTopWidth: 1, paddingTop: 15 }}
            >
                <Button
                    style={{ marginBottom: 15, marginHorizontal: 25, backgroundColor: AppUtil.primary }}
                >Absensi</Button>
            </View>

        </SafeAreaView>
    )
}

export default AttendanceScreen