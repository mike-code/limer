import React from 'react'
import {
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import ControlPanelScreen from '../screens/ControlPanelScreen'
import QRCodeScreen from '../screens/QRCodeScreen'

const HomeStack = createStackNavigator(
{
    HomeScreen,
    QRCodeScreen,
})

HomeStack.navigationOptions = ({ navigation }) =>
({
    header: null,
    tabBarVisible: navigation.state.index === 0,
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={ `ios-information-circle${focused ? '' : '-outline'}` }
        />
    ),
})


const MapStack = createStackNavigator(
{
    MapScreen,
})

MapStack.navigationOptions =
{
    tabBarLabel: 'Map',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'ios-map-outline'}
        />
    ),
}


const ControlPanel = createStackNavigator(
{
    ControlPanelScreen,
})

ControlPanel.navigationOptions = ({ navigation }) =>
({
    header: null,
    tabBarLabel: 'Control Panel',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name="ios-barcode-outline"
        />
    ),
})

const BottomTabNavigator = createBottomTabNavigator(
{
    HomeStack,
    MapStack,
    ControlPanel,
})

export default createSwitchNavigator({ BottomTabNavigator })
