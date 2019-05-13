import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import SignInScreen from './SignInScreen';
import SignInScreen2 from './SignInScreen2';

import NewsScreen from './NewsScreen';
import NewsScreenDetails from './NewsScreenDetails';

import LeaseScreen from './LeaseScreen';
import DetailScreen from './LeaseScreenDetails';
import LeaseScreenSubmitter from './LeaseScreenSubmitter';

import ServiceScreen from './ServiceScreen';
import ServiceScreenSignup from './ServiceScreenSignup';
import ServiceScreenSubmitter from './ServiceScreenSubmitter';

import SettingsScreen from './SettingsScreen';

// import InsuranceScreen from './InsuranceScreen';
// import VideoScreen from './VideoScreen';
// import EVGallery from './EVGallery';
// import MarketplaceScreen from './MarketplaceScreen';
// import MarketplaceScreenSubmitter from './MarketplaceScreenSubmitter';

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

// const LeaseStack = createStackNavigator({ Lease: LeaseScreen, Details: DetailScreen, Submit: LeaseScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Leases', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-notifications" size={23} color="#2191fb" /> : <Icon name="ios-notifications" size={23} color="grey" /> } }) })
// const InsuranceStack = createStackNavigator({ InsuranceScreen: InsuranceScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Insurance', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-wallet" size={23} color="#2191fb" /> : <Icon name="ios-wallet" size={23} color="grey" /> } }) })
// const VideoStack = createStackNavigator({ Video: VideoScreen, Details: DetailScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Daily Videos', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-videocam" size={25} color="#2191fb" /> : <Icon name="ios-videocam" size={25} color="grey" /> } })  })
// const ShareStack = createStackNavigator({ Gallery: EVGallery, Details: DetailScreen, Submit: SubmitScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Gallery', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-photos" size={25} color="#2191fb" /> : <Icon name="ios-photos" size={25} color="grey" /> } })  })
// const MarketStack = createStackNavigator({ Used: MarketplaceScreen, Details: DetailScreen, Submit: MarketplaceScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Buy & Sell', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-swap" size={23} color="#2191fb" /> : <Icon name="ios-swap" size={23} color="grey" /> } }) })




const AppTabs = createBottomTabNavigator(
  { NewsStack, ServiceStack, SettingsStack },
  {
    initialRouteName: 'ServiceStack',
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