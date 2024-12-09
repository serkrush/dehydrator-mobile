/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider as ReduxProvider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {Icon, PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {AppState, Flag, SettingsOption} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import ForgotPassword from 'src/screens/login/ForgotPassword';
import Register from 'src/screens/login/Register';
import Welcome from 'src/screens/login/Welcome';
import Machines from 'src/screens/tabs/Machines';
import Main from 'src/screens/tabs/Main';
import ManualControl from 'src/screens/tabs/ManualControl/UpdatedManualControl';
import Notifications from 'src/screens/tabs/Notifications';
import Advanced from 'src/screens/tabs/settings/Advanced/Advanced';
import AddDehydrator from 'src/screens/tabs/settings/Dehydrators/AddDehydrator';
import Dehydrators from 'src/screens/tabs/settings/Dehydrators/Dehydrators';
import EditDehydrator from 'src/screens/tabs/settings/Dehydrators/EditDehydrator';
import GroupScreen from 'src/screens/tabs/settings/Dehydrators/GroupScreen';
import ShareGroupPermission from 'src/screens/tabs/settings/Dehydrators/ShareGroupPermission';
import LanguageAndRegion from 'src/screens/tabs/settings/LanguageAndRegion/LanguageAndRegion';
import ChangePassword from 'src/screens/tabs/settings/MyProfile/ChangePassword';
import Settings from 'src/screens/tabs/settings/Settings';
import UpdateUserPermissions from 'src/screens/tabs/settings/UserAndPermissions/UpdateUserPermissions';
import UpdateUserPermissionsList from 'src/screens/tabs/settings/UserAndPermissions/UpdateUserPermissionsList';
import {colors, fonts, icons} from 'src/theme';
import container from './src/container';
import './src/i18n';

///!!! TODO  REMOVE THIS LINE !!!!!!
import {LogBox} from 'react-native';
import Onboarding from 'src/screens/login/Onboarding';
import AddCategoriesScreen from 'src/screens/tabs/AddCategoriesScreen';
import AddRecipeScreen from 'src/screens/tabs/AddRecipe';
import BenchFoodsScreen from 'src/screens/tabs/BenchFoods';
import BenchFoodsDetailsScreen from 'src/screens/tabs/BenchFoodsDetails';
import CategoriesScreen from 'src/screens/tabs/CategoriesScreen';
import DescriptionScreen from 'src/screens/tabs/DescriptionScreen';
import IngredientScreen from 'src/screens/tabs/IngredientScreen';
import MethodScreen from 'src/screens/tabs/MethodScreen';
import MyRecipesScreen from 'src/screens/tabs/MyRecipes';
import MyRecipesDetailsScreen from 'src/screens/tabs/MyRecipesDetails';
import PresetDetailsScreen from 'src/screens/tabs/PresetDetailsScreen';
import PresetsScreen from 'src/screens/tabs/Presets';
import AddDehydratorListScreen from 'src/screens/tabs/settings/Dehydrators/AddDehydratorListScreen';
import GroupsListScreen from 'src/screens/tabs/settings/Dehydrators/GroupsListScreen';
import MyProfile from 'src/screens/tabs/settings/MyProfile/MyProfile';
import SelectNewRightsOwner from 'src/screens/tabs/settings/MyProfile/SelectNewRightsOwner';
import NotAccessedScreen from 'src/screens/tabs/NotAccessedScreen';
import NetInfo from '@react-native-community/netinfo';
import {setBox} from 'src/store/actions';
import palette from 'src/theme/colors/palette';
import PushNotification from 'react-native-push-notification';
import { RFValue } from 'react-native-responsive-fontsize';

LogBox.ignoreAllLogs();

const navigator = container.resolve('navigator');
const redux = container.resolve('redux');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
    const {t} = useTranslation();

    const notifications = useSelector((state: AppState) => {
        return state.notifications ?? {};
    });
    const notificationsCount = useMemo(() => {
        return Object.values(notifications).length;
    }, [notifications]);

    return (
        <Tab.Navigator
            initialRouteName="Main"
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    switch (route.name) {
                        case 'Main':
                            iconName = icons.tabs.main;
                            break;
                        case 'DataAndCharts':
                            iconName = icons.tabs.charts;
                            break;
                        case 'Notifications':
                            iconName = icons.tabs.notifications;
                            break;
                        case 'Settings':
                            iconName = icons.tabs.settings;
                            break;
                        case 'Machines':
                            iconName = icons.tabs.machines;
                            break;
                    }

                    return <Icon source={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tabBar.active,
                tabBarInactiveTintColor: colors.tabBar.inactive,
            })}>
            <Tab.Screen
                name="Main"
                component={Main}
                options={{headerShown: false, title: t('tab-main')}}
            />
            <Tab.Screen
                name="Machines"
                component={Machines}
                options={{headerShown: false, title: t('tab-machines')}}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    headerShown: false,
                    title: t('tab-notifications'),
                    tabBarBadge:
                        notificationsCount > 0
                            ? notificationsCount > 99
                                ? '99+'
                                : notificationsCount
                            : undefined,
                    tabBarBadgeStyle: {
                        ...fonts.decorativeB,
                        color: 'white',
                        lineHeight: RFValue(18, 812),
                        backgroundColor:
                            navigator.currentRouteName() === 'Notifications'
                                ? palette.orange
                                : palette.blue,
                    },
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerShown: false,
                    title: t('tab-settings'),
                }}
            />
        </Tab.Navigator>
    );
}

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    useEffect(() => {
        SplashScreen.hide();
    }, []);
    const pusher = container.resolve('pusher');
    useEffect(() => {
        const unsubscribe = pusher.start();
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('NET STATUS, ', !!state.isConnected);
            redux.dispatch(setBox(Flag.NET_CONNECTED, !!state.isConnected));
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const createLocalNotificationListeners = async () => {
        try {
            PushNotification.configure({
                // this will listen to your local push notifications on clicked
                onNotification: notification => {
                    console.log('onNotification', notification);
                },
                popInitialNotification: true,
                requestPermissions: true,
            });

            PushNotification.popInitialNotification(notification => {
                console.log('popInitialNotification', notification);
                // this will listen to your local push notifications on opening app from background state
            });
        } catch (e) {
            console.log('createLocalNotificationListeners error', e);
            // alert(e)
            //Toast.show(e)
        }
    };

    useEffect(() => {
        const unsubscribe = async () =>
            createLocalNotificationListeners().then(r =>
                console.log('local push notification listeners created'),
            );

        return () => {
            unsubscribe();
        };
    }, []);

    //console.log('redux.state', redux.state);

    return (
        <ReduxProvider store={redux.store}>
            <PersistGate
                loading={null}
                persistor={redux.persistor}
                onBeforeLift={() => {}}>
                <PaperProvider>
                    <NavigationContainer ref={navigator.ref}>
                        <ContainerContext.Provider value={container}>
                            <Stack.Navigator
                                initialRouteName="Welcome"
                                screenOptions={{
                                    gestureEnabled: false,
                                    fullScreenGestureEnabled: false,
                                }}>
                                <Stack.Screen
                                    name="Tabs"
                                    component={Tabs}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="Welcome"
                                    component={Welcome}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="Onboarding"
                                    component={Onboarding}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="Register"
                                    component={Register}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="ForgotPassword"
                                    component={ForgotPassword}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.UserPermissions}
                                    component={UpdateUserPermissionsList}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.LanguageAndRegion}
                                    component={LanguageAndRegion}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.MyMachines}
                                    component={Dehydrators}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.Advanced}
                                    component={Advanced}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.MyProfile}
                                    component={MyProfile}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.Notifications}
                                    component={Advanced}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={SettingsOption.SoftwareUpdates}
                                    component={Advanced}
                                    options={{headerShown: false}}
                                />
                                {/* <Stack.Screen
                                    name={SettingsOption.DiagnosticData}
                                    component={Advanced}
                                    options={{headerShown: false}}
                                /> */}
                                <Stack.Screen
                                    name={'AddDehydrator'}
                                    component={AddDehydrator}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={'EditDehydrator'}
                                    component={EditDehydrator}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name={'SelectNewRightsOwner'}
                                    component={SelectNewRightsOwner}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="ChangePassword"
                                    component={ChangePassword}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="UpdateUserPermissionsList"
                                    component={UpdateUserPermissionsList}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="UpdateUserPermissions"
                                    component={UpdateUserPermissions}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="GroupScreen"
                                    component={GroupScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="GroupsListScreen"
                                    component={GroupsListScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="AddDehydratorListScreen"
                                    component={AddDehydratorListScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="ShareGroupPermission"
                                    component={ShareGroupPermission}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="ManualControl"
                                    component={ManualControl}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="PresetsScreen"
                                    component={PresetsScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="BenchFoodsScreen"
                                    component={BenchFoodsScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="BenchFoodsDetailsScreen"
                                    component={BenchFoodsDetailsScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="MyRecipesScreen"
                                    component={MyRecipesScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="MyRecipesDetailsScreen"
                                    component={MyRecipesDetailsScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="AddRecipeScreen"
                                    component={AddRecipeScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="MethodScreen"
                                    component={MethodScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="IngredientScreen"
                                    component={IngredientScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="DescriptionScreen"
                                    component={DescriptionScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="PresetDetailsScreen"
                                    component={PresetDetailsScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="CategoriesScreen"
                                    component={CategoriesScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="AddCategoriesScreen"
                                    component={AddCategoriesScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="NotAccessedScreen"
                                    component={NotAccessedScreen}
                                    options={{headerShown: false}}
                                />
                            </Stack.Navigator>
                        </ContainerContext.Provider>
                    </NavigationContainer>
                </PaperProvider>
            </PersistGate>
        </ReduxProvider>
    );
}

export default App;
