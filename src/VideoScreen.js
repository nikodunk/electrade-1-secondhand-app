// https://www.youtube.com/results?search_query=electric+vehicles&sp=CAI%253D
// https://m.youtube.com/results?q=electric+vehicles&search_type=&uploaded=d

// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=date&q=tesla%7Ckona%7Cecq%7Ce-tron%2Creview&key=AIzaSyDwmCtuWULOagWQg3vrFRbeB59Jb7qmYts


import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')


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
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/sm29WCYQJLMk9Am6u/lastExec/results?token=SFBwYdXoN6eWzbhJ64FTLsrn9')
      .then(res => { return res.json()})
      // set results as state
      .then((json) => { console.log(json[0].pageFunctionResult); this.setState({data: json[0].pageFunctionResult}) })
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
                                    source={{uri: 'https://i.ytimg.com/vi/'+item.videoLink+'/hqdefault.jpg'}} />
                            <Text style={styles.videoTitle}>{item.name}</Text>
                          </View>

                   </TouchableOpacity>
                    }
                    /> :  null }

      </View>
    );

  }
}



