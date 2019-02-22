import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';
import { SafeAreaView } from 'react-navigation';



export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome!',
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text></Text>
        <Text></Text>
        <View style={{padding: 20}}>
          <Text style={{fontWeight: '500'}}>Watch the oncoming electric revolution from here.</Text>
          <Text></Text>
          <Text>This is a one-stop shop for electric vehicles: News, EV price leaderboards used, new and for leases – all in a clean, clutter-free design.</Text>
          <Text></Text>
          <Text>New developments are happening daily in EV land. See up-to-the-minute EV news, track EV prices every day, and find a great used EV deal near you.</Text>
        </View>
        <Button title="Let's Go!" onPress={this._signInAsync} />
      </SafeAreaView>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}