/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import LoginScreen from './src/screens/auth/LoginScreen';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ForgotPasswordCodeVerificationScreen from './src/screens/auth/ForgotPasswordCodeVerificationScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/app_menu/HomeScreen';
import ProfileScreen from './src/screens/app_menu/ProfileScreen';
import EditProfileScreen from './src/screens/app_menu/EditProfileScreen';
import AnnouncementScreen from './src/screens/app_menu/AnnouncementScreen';
import AttendanceScreen from './src/screens/app_menu/AttendanceScreen';
import AnnouncementDetailScreen from './src/screens/app_menu/AnnouncementDetailScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppUtil from './src/utils/AppUtil';
import { ToastProvider } from 'react-native-toast-notifications';
import { Text, View } from 'react-native';
import GlobalStyle from './src/utils/GlobalStyle';
import { AnnouncementContext } from './src/context/AnnouncementContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AnnouncementScreenWrapper() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AnnouncementScreen" component={AnnouncementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AnnouncementDetailScreen" component={AnnouncementDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function ProfileScreenWrapper() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function AppMenu() {
    const { amountNotifAnnouncements } = useContext(AnnouncementContext)

    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color, tintColor, focused }) => (
                    <Icon name="home" size={20} color={focused ? AppUtil.primary : AppUtil.gray} />
                ),
                tabBarInactiveTintColor: AppUtil.gray,
                tabBarLabel: 'Beranda',
                tabBarStyle: { height: 60, paddingTop: 10, paddingBottom: 10 },
            }} />
            <Tab.Screen name="AttendanceScreen" component={AttendanceScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color, tintColor, focused }) => (
                    <MaterialCommunityIcon name="gesture-tap-button" size={20} color={focused ? AppUtil.primary : AppUtil.gray} />
                ),
                tabBarInactiveTintColor: AppUtil.gray,
                tabBarLabel: 'Absensi',
                tabBarStyle: { height: 60, paddingTop: 10, paddingBottom: 10 },
            }} />
            <Tab.Screen name="AnnouncementScreenWrapper" component={AnnouncementScreenWrapper} options={{
                headerShown: false,
                tabBarIcon: ({ color, tintColor, focused }) => (
                    <View>
                        <FontAwesome5 name="bullhorn" size={18} color={focused ? AppUtil.primary : AppUtil.gray} />
                        {
                            amountNotifAnnouncements > 0 ?
                                <View style={{ width: 18, height: 18, backgroundColor: AppUtil.dangerDark, position: 'absolute', borderRadius: 9, justifyContent: 'center', alignItems: 'center', right: -5, top: -5 }}>
                                    <Text style={[GlobalStyle.initialFont, { color: 'white', fontSize: 10, fontWeight: '700' }]}>{amountNotifAnnouncements}</Text>
                                </View> : <></>
                        }
                    </View>
                ),
                tabBarInactiveTintColor: AppUtil.gray,
                tabBarLabel: 'Pengumuman',
                tabBarStyle: { height: 60, paddingTop: 10, paddingBottom: 10 },
            }} />
            <Tab.Screen name="ProfileScreenWrapper" component={ProfileScreenWrapper} options={{
                headerShown: false,
                tabBarIcon: ({ color, tintColor, focused }) => (
                    <MaterialCommunityIcon name="account" size={18} color={focused ? AppUtil.primary : AppUtil.gray} />
                ),
                tabBarInactiveTintColor: AppUtil.gray,
                tabBarLabel: 'Profil',
                tabBarStyle: { height: 60, paddingTop: 10, paddingBottom: 10 },
            }} />
        </Tab.Navigator>
    );
}


function App() {
    const [amountNotifAnnouncements, setAmountNotifAnnouncements] = useState(0)

    return (
        <ToastProvider
            duration={4000}
            dangerColor={AppUtil.danger}
            dangerIcon={<AntDesign name={'exclamationcircle'} color={'white'} />}
        >
            <ApplicationProvider {...eva} theme={eva.light}>
                <AnnouncementContext.Provider value={{ amountNotifAnnouncements, setAmountNotifAnnouncements }}>
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ForgotPasswordCodeVerificationScreen" component={ForgotPasswordCodeVerificationScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="AppMenu" component={AppMenu} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </AnnouncementContext.Provider>

            </ApplicationProvider>
        </ToastProvider>
    );
}

export default App;
