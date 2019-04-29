import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, AsyncStorage } from "react-native";
import { WebView } from "react-native-webview";
import Mixpanel from 'react-native-mixpanel'
import firebase from 'react-native-firebase';



export default class InsuranceScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      type: null,
      item: null,
      visible: true
       };
  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
      this.setState({type: this.props.navigation.getParam('type') })

      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("InsuranceScreen Loaded"); firebase.analytics().logEvent('InsuranceScreen_Loaded') }
      })
  }

  hideSpinner() {
      this.setState({ visible: false });
    }
 

  render() {
    return (

        <SafeAreaView style={{ flex: 1 }}>
                <WebView
                  onLoad={() => this.hideSpinner()}
                  style={{ flex: 1 }}
                  source={{ uri: 'http://metromileinsuranceservices.pxf.io/c/1419031/428414/7531' }}
                />
                {this.state.visible && (
                  <ActivityIndicator
                    style={{ position: "absolute", top: '50%', left: '48%' }}
                  />
                )}
        </SafeAreaView>

    );

  }
}

