// https://www.youtube.com/results?search_query=electric+vehicle+reviews&sp=CAI%253D
// https://www.youtube.com/results?search_query=ev+electric+vehicle+review&sp=CAI%253D
// https://m.youtube.com/results?search_query=ev+electric+vehicle+review&persist_app=1&app=m&uploaded=d



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
                      style={{marginTop: index === 0 ? 30 : 0, marginBottom: index === this.state.data.length -1 ? 80 : 0}} 
                      delayPressIn={50}
                      onPress={() => this.props.navigation.navigate('Details', {item: item} ) } >
                          <Text style={{marginLeft: 10, marginTop: 10, fontWeight: '500'}}>{item.name}</Text>
                          <Image  style={styles.imageVideo}
                                  source={{uri: 'https://i.ytimg.com/vi/'+item.videoLink+'/hqdefault.jpg'}} 
                                  />
                   </TouchableOpacity>
                    }
                    /> :  null }

      </View>
    );

  }
}


