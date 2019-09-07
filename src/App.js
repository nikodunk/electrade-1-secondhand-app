import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import NewsScreen from './NewsScreen/NewsScreen';
import NewsScreenDetails from './NewsScreen/NewsScreenDetails';

import ServiceScreen from './ServiceScreen/ServiceScreen';
import ServiceScreenSignup from './ServiceScreen/ServiceScreenSignup';
import ServiceScreenSubmitter from './ServiceScreen/ServiceScreenSubmitter';

import SettingsScreen from './SettingsScreen/SettingsScreen';



const NewsStack = createStackNavigator({ News: NewsScreen, Details: NewsScreenDetails }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV News', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-paper" size={20} color="#2191fb" type="ionicon" /> : <Icon name="ios-paper" size={20} color="grey" type="ionicon" /> } }) })
const ServiceStack = createStackNavigator({ ServiceScreen: ServiceScreen, ServiceScreenSignup: ServiceScreenSignup, ServiceScreenSubmitter: ServiceScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Club', tabBarIcon: ({focused}) => { return focused ? <Icon name="flash-on" size={23} color="#2191fb" type="material" /> : <Icon name="flash-on" size={23} color="grey" type="material" /> } }) })
const SettingsStack = createStackNavigator({ SettingsScreen: SettingsScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Account', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-contact" size={23} color="#2191fb" type="ionicon"/> : <Icon name="ios-contact" size={23} color="grey" type="ionicon" /> } }) })


const AppTabs = createBottomTabNavigator(
  { NewsStack, ServiceStack, SettingsStack },
  {
    initialRouteName: 'NewsStack',
    optimizationsEnabled: true,
  }
)



const App = createAppContainer(createSwitchNavigator(
  {
    App: AppTabs,
  },
  {
    initialRouteName: 'App',
  }
));

export default App;