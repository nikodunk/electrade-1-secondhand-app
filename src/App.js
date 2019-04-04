import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import SignInScreen from './SignInScreen';
import NewsScreen from './NewsScreen';
import NewsScreenDetails from './NewsScreenDetails';

import LeaseScreen from './LeaseScreen';
import DetailScreen from './LeaseScreenDetails';
import LeaseScreenSubmitter from './LeaseScreenSubmitter';

import SettingsScreen from './SettingsScreen';

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

const AuthStack = createStackNavigator({ SignIn: SignInScreen}, { headerMode: 'none' } );


const LeaseStack = createStackNavigator({ Lease: LeaseScreen, Details: DetailScreen, Submit: LeaseScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Lease Deals', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-notifications" size={23} color="#4F8EF7" /> : <Icon name="ios-notifications" size={23} color="grey" /> } }) })
const NewsStack = createStackNavigator({ News: NewsScreen, Details: NewsScreenDetails }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV News', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-paper" size={20} color="#4F8EF7" /> : <Icon name="ios-paper" size={20} color="grey" /> } }) })
const SettingsStack = createStackNavigator({ SettingsScreen: SettingsScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Account', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-contact" size={23} color="#4F8EF7" /> : <Icon name="ios-contact" size={23} color="grey" /> } }) })

// const VideoStack = createStackNavigator({ Video: VideoScreen, Details: DetailScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Daily Videos', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-videocam" size={25} color="#4F8EF7" /> : <Icon name="ios-videocam" size={25} color="grey" /> } })  })
// const ShareStack = createStackNavigator({ Gallery: EVGallery, Details: DetailScreen, Submit: SubmitScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Gallery', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-photos" size={25} color="#4F8EF7" /> : <Icon name="ios-photos" size={25} color="grey" /> } })  })
// const MarketStack = createStackNavigator({ Used: MarketplaceScreen, Details: DetailScreen, Submit: MarketplaceScreenSubmitter }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'Buy & Sell', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-swap" size={23} color="#4F8EF7" /> : <Icon name="ios-swap" size={23} color="grey" /> } }) })


function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}


const AppTabs = createMaterialTopTabNavigator(
  { NewsStack, LeaseStack, SettingsStack },
  {
    initialRouteName: 'NewsStack',
    animationEnabled: false,
    swipeEnabled: false,
    lazyLoad: true,
    optimizationsEnabled: true,
    tabBarComponent: SafeAreaMaterialTopTabBar,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'dodgerblue',
      inactiveTintColor: 'grey',
      pressOpacity: 1,
      showIcon: true,
      showLabel: true,
      lazyLoad: true,
      upperCaseLabel: false,
      tabStyle: {padding: 0, margin: 0, borderTopColor: 'lightgrey', borderTopWidth: 1 },
      style:{ backgroundColor: 'white'},
      iconStyle: {padding: 0, margin: 0, marginBottom: 2},
      labelStyle: {padding: 0, margin: 0, marginBottom: 2, fontSize: 11},
      indicatorStyle: {backgroundColor: 'rgba(0, 0, 0, 0.0)'},
    }
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