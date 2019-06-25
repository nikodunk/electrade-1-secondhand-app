import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import SignInScreen from './Auth/SignInScreen';
import SignInScreen2 from './Auth/SignInScreen2';

import NewsScreen from './NewsScreen/NewsScreen';
import NewsScreenDetails from './NewsScreen/NewsScreenDetails';

import ServiceScreen from './ServiceScreen/ServiceScreen';
import ServiceScreenSignup from './ServiceScreen/ServiceScreenSignup';
import ServiceScreenSubmitter from './ServiceScreen/ServiceScreenSubmitter';

import SettingsScreen from './SettingsScreen/SettingsScreen';

import InsuranceScreen from './InsuranceScreen/InsuranceScreen';

import MarketplaceScreen from './MarketplaceScreen/MarketplaceScreen';
import MarketplaceScreenDetails from './MarketplaceScreen/MarketplaceScreenDetails';
import MarketplaceScreenSubmitter from './MarketplaceScreen/MarketplaceScreenSubmitter';

import LeaseScreen from './LeaseScreen/LeaseScreen';
import DetailScreen from './LeaseScreen/LeaseScreenDetails';
import LeaseScreenSubmitter from './LeaseScreen/LeaseScreenSubmitter';


import styles from './styles'

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const email = await AsyncStorage.getItem('email');
    // AsyncStorage.removeItem('email');
    // AsyncStorage.removeItem('listingType')

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
        
      </View>
    );
  }
}

const AuthStack = createStackNavigator({ SignIn: SignInScreen, SignInScreen2: SignInScreen2}, { headerMode: 'none' } );

const NewsStack = createStackNavigator({ News: NewsScreen, Details: NewsScreenDetails }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV News', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-paper" size={20} color="#2191fb" type="ionicon" /> : <Icon name="ios-paper" size={20} color="grey" type="ionicon" /> } }) })
const ServiceStack = createStackNavigator({ ServiceScreen: ServiceScreen, ServiceScreenSignup: ServiceScreenSignup, ServiceScreenSubmitter: ServiceScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Club', tabBarIcon: ({focused}) => { return focused ? <Icon name="flash-on" size={23} color="#2191fb" type="material" /> : <Icon name="flash-on" size={23} color="grey" type="material" /> } }) })
const SettingsStack = createStackNavigator({ SettingsScreen: SettingsScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Account', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-contact" size={23} color="#2191fb" type="ionicon"/> : <Icon name="ios-contact" size={23} color="grey" type="ionicon" /> } }) })

const LeaseStack = createStackNavigator({ Lease: LeaseScreen, Details: DetailScreen, Submit: LeaseScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Leases', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-notifications" size={23} color="#2191fb" type="ionicon" /> : <Icon name="ios-notifications" size={23} color="grey" type="ionicon"/> } }) })
const InsuranceStack = createStackNavigator({ InsuranceScreen: InsuranceScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Insurance', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-wallet" size={23} color="#2191fb" type="ionicon" /> : <Icon name="ios-wallet" size={23} color="grey" type="ionicon" /> } }) })
const MarketplaceStack = createStackNavigator({ Used: MarketplaceScreen, Details: MarketplaceScreenDetails, Submit: MarketplaceScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Buy & Sell', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-swap" size={23} color="#2191fb" type="ionicon" /> : <Icon name="ios-swap" size={23} color="grey" type="ionicon" /> } }) })
// const ShareStack = createStackNavigator({ Gallery: EVGallery, Details: DetailScreen, Submit: SubmitScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Gallery', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-photos" size={25} color="#2191fb" type="ionicon" /> : <Icon name="ios-photos" size={25} color="grey" type="ionicon" /> } })  })

// const VideoStack = createStackNavigator({ Video: VideoScreen, Details: DetailScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Daily Videos', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-videocam" size={25} color="#2191fb" type="ionicon" /> : <Icon name="ios-videocam" size={25} color="grey" type="ionicon" /> } })  })



const AppTabs = createBottomTabNavigator(
  { NewsStack, ServiceStack, LeaseStack, InsuranceStack, MarketplaceStack, SettingsStack },
  {
    initialRouteName: 'NewsStack',
    optimizationsEnabled: true,
  }
)



const App = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppTabs,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default App;