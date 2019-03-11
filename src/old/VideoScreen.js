// https://www.youtube.com/results?search_query=electric+vehicles&sp=CAI%253D
// https://m.youtube.com/results?q=electric+vehicles&search_type=&uploaded=d

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';



export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){ Mixpanel.track("VideoScreen Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      this._getData()
  }

  _getData(){
    this.setState({loading: true})
    fetch('https://electrade-server.herokuapp.com/api/videos/get/')
      .then(res => { return res.json()})
      // set results as state
      .then((json) => { console.log(json); this.setState({data: json}) })
  }

  

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.data ? 
            <FlatList
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => 
                   <TouchableOpacity 
                      style={{marginTop: index === 0 ? 40 : 0, marginBottom: index === this.state.data.length -1 ? 80 : 0, height: 210}} 
                      delayPressIn={50}
                      onPress={() => this.props.navigation.navigate('Details', {item: item, type: 'Video'} ) } >
                          <View style={[styles.imageVideo, styles.videoContainer]}>
                            <Image  style={styles.imageVideo}
                                    source={{uri: item.snippet.thumbnails.high.url}} />
                            <Text style={styles.videoTitle}>{item.snippet.title}</Text>
                          </View>

                   </TouchableOpacity>
                    }
                    /> :  null }

      </View>
    );

  }
}



