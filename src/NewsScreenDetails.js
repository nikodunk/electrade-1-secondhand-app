// twitter electrek
// twitter cleantechnica
// https://twitter.com/InsideEVs

import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";




export default class NewsScreenDetails extends React.Component {


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
  }

  hideSpinner() {
      this.setState({ visible: false });
    }
 

  render() {
    return (
       <View style={{flex: 1}}>

        <TouchableOpacity 
              onPress={() => this.props.navigation.goBack()} 
              style={{left: 10, marginTop: 30}}>
          <View style={{padding: 5}}>
            <Text style={{fontSize: 18, color: 'dodgerblue'}}>
                Back
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
                <WebView
                  onLoad={() => this.hideSpinner()}
                  style={{ flex: 1 }}
                  source={{ uri: this.props.navigation.state.params.item.link }}
                />
                {this.state.visible && (
                  <ActivityIndicator
                    style={{ position: "absolute", top: '50%', left: '48%' }}
                  />
                )}
              </View>


        </View>
    );

  }
}

