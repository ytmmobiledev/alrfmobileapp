/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//@ts-nocheck
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {ColorSchemeName, Keyboard} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Startup from "../screens/Startup";
import { hp, wp } from "../functions/responsiveScreen";
import { CView } from "../components/CView";
import { useEffect, useState } from "react";
import Slide from "../screens/Slide";
import {FontText} from "../components/FontText";
import {CImage} from "../components/CImage";
import Measure from "../screens/Home/Measure";
import Settings from "../screens/Home/Settings";
import LaserMeter from "../screens/Home/LaserMeter";
import MoreInfo from "../screens/Home/MoreInfo";
import {BottomFabBar} from "rn-wave-bottom-bar";
import {string} from "../locales";
import Device from "../screens/Home/Device";
import ConnectDevice from "../screens/ConnectDevice";
import Compass from "../screens/Home/Compass";

export default function Navigation({
                                       colorScheme,
                                   }: {
    colorScheme: ColorSchemeName;
}) {
    return (
        <NavigationContainer
            //linking={LinkingConfiguration}
            //theme={/*colorScheme === "dark" ? DarkTheme : DefaultTheme*/ DefaultTheme}
        >
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<any>();

function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: Colors.primary,
                headerTitleStyle: { fontSize: hp(2.2) },
                headerStyle:{backgroundColor:Colors.darkGray,elevation:0,shadowColor:Colors.darkGray},

            }}
        >
            <Stack.Screen
                name="Startup"
                component={Startup}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Slide"
                component={Slide}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MoreInfo"
                component={MoreInfo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ConnectDevice"
                component={ConnectDevice}
                options={{ title:string.cihazabaglan }}
            />
            <Stack.Screen
                name="Compass"
                component={Compass}
                options={{ title:string.olcum2 }}
            />
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />


        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<any>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    return (

        <BottomTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.primary,
                tabBarActiveBackgroundColor:  Colors.primary,
                tabBarInactiveBackgroundColor: Colors.primary,
                title:"",
                headerStyle:{backgroundColor:Colors.darkGray,elevation:0,shadowColor:Colors.darkGray},

            }}
            initialRouteName="1"
            tabBar={(props) => (
                <BottomFabBar
                    color={Colors.primary}
                    mode={'default'}
                    focusedButtonStyle={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,
                        elevation: 14,
                        backgroundColor:Colors.primary,

                    }}
                    bottomBarContainerStyle={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,

                    }}
                    {...props}
                />
            )}

        >

            <BottomTab.Screen
                name="Measure"
                component={Measure}
                options={({ navigation, route }) => ({
                    tabBarLabel:<FontText title={string.olcum2} size={1.1} bold position="center" />,
                    tabBarIcon: ({ focused, color }) => (
                        <CImage source={require("../assets/images/goz.png")} width={4} height={4} />
                    ),
                    headerLeft: () => headerLeft(navigation),
                    headerRight: () => headerRight(navigation),
                })}
            />
            <BottomTab.Screen
                name="Device"
                component={Device}
                options={({ navigation, route }) => ({
                    tabBarLabel:<FontText title={string.cihaz2} size={1.1} bold position="center" />,
                    tabBarIcon: ({ focused, color }) => (
                        <CImage source={require("../assets/images/cihaz2.png")} width={4} height={4} />
                    ),
                    headerLeft: () => headerLeft(navigation),
                    headerRight: () => headerRight(navigation),
                })}
            />
            <BottomTab.Screen
                name="Settings"
                component={Settings}
                options={({ navigation, route }) => ({
                    tabBarLabel:<FontText title={string.yapilandirici} size={1.1} bold position="center" />,
                    tabBarIcon: ({ focused, color }) => (
                        <CImage source={require("../assets/images/yapilandirici.png")} width={4} height={4} />
                    ),
                    headerRight: () => headerRight(navigation),
                })}
            />
            <BottomTab.Screen
                name="LaserMeter"
                component={LaserMeter}
                options={({ navigation, route }) => ({
                    tabBarLabel:<FontText title={string.lazermesafeolcer} size={1.1} bold position="center" />,
                    tabBarIcon: ({ focused, color }) => (
                        <CImage source={require("../assets/images/lazer.png")} width={4} height={4} />
                    ),
                    headerShown: false

                })}
            />


        </BottomTab.Navigator>

    );
}

function headerLeft(navigation: any) {
    return (
        <CView center>
            <FontText onPress={()=>{alert("Yardım")}} underline position="center" padding="2" title={"yardimaihtiyacinvarmi"} size={1.6}  bold/>
        </CView>
    );
}
function headerRight(navigation: any) {
    return (
        <CView  padding="2 0 1 2" onPress={()=>navigation.navigate("MoreInfo")}>
            <CImage width={9.67} height={8}  resizeMode={"stretch"} source={require("../assets/images/dahafazla.png")} />
        </CView>
    );
}

