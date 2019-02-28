import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import SignInScreen from './SignInScreen';
import NewsScreen from './NewsScreen';
import DetailScreen from './DetailScreen';

import MarketplaceScreen from './MarketplaceScreen';
import SubmitScreen from './SubmitScreen';
import VideoScreen from './VideoScreen';

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

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const NewsStack = createStackNavigator({ News: NewsScreen, Details: DetailScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Newsfeed', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-paper" size={20} color="#4F8EF7" /> : <Icon name="ios-paper" size={20} color="grey" /> } }) })
const MarketStack = createStackNavigator({ Used: MarketplaceScreen, Details: DetailScreen, Submit: SubmitScreen }, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Marketplace', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-heart" size={20} color="#4F8EF7" /> : <Icon name="ios-heart" size={20} color="grey" /> } }) })
const VideoStack = createStackNavigator({ Video: VideoScreen, Details: DetailScreen}, { headerMode: 'none', navigationOptions: ({navigation}) => ({ title: 'EV Videofeed', tabBarIcon: ({focused}) => { return focused ? <Icon name="ios-videocam" size={25} color="#4F8EF7" /> : <Icon name="ios-videocam" size={25} color="grey" /> } })  })

const AppTabs = createBottomTabNavigator(
  { NewsStack, MarketStack, VideoStack },
  {
    initialRouteName: 'NewsStack',
    animationEnabled: false,
    swipeEnabled: false,
    lazyLoad: true,
    tabBarOptions: {
      activeTintColor: 'dodgerblue',
      inactiveTintColor: 'grey',
      showIcon: true,
      showLabel: true,
      lazyLoad: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
      }
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