// twitter electrek
// twitter cleantechnica
// https://twitter.com/InsideEVs

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";


export default class NewsScreenDetails extends Component {
  render() {
    return (
      <WebView
        source={{ uri: "https://facebook.github.io/react-native/" }}
      />
    );
  }
}