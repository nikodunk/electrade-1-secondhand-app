import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import YouTube from 'react-native-youtube'
import Mixpanel from 'react-native-mixpanel'

import styles from './styles'

export default class DetailScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      type: null,
      item: null
       };

  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
      this.setState({type: this.props.navigation.getParam('type') })
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track(this.state.type+"Details Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })
  }
 

  render() {
    return (
       <View>

        <TouchableOpacity 
              onPress={() => this.props.navigation.goBack()} 
              style={{left: 10, marginTop: 30}}>
          <View style={{padding: 5}}>
            <Text style={{fontSize: 18, color: 'dodgerblue'}}>
                Back
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.item ?
          <ScrollView style={{height: '100%'}}>
                {this.state.item.image ? 
                  <Image
                    style={styles.imageDetail}
                    source={{uri: this.state.item.image}}
                    /> : null }
                {this.state.item.id && this.state.item.id.videoId ? <YouTube
                        videoId={this.state.item.id.videoId}   // The YouTube video ID
                        play={false}             // control playback of video with true/false
                        fullscreen={true}       // control whether the video should play in fullscreen or inline
                        loop={true}             // control whether the video should loop when ended
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={e => this.setState({ status: e.state })}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        style={{ alignSelf: 'stretch', height: 300 }}
                      /> : null }


                <View style={{padding: 20}}>

                {/* NEWS options */}
                  {this.state.item.text ? <Text>{ this.state.item.text.substring(0, this.state.item.text.indexOf('http')) }</Text> : null }
                  {this.state.type === 'News' ? <Button title={`Continue at ${this.state.item.source}`} onPress={() => {Linking.openURL(this.state.item.link.toString()); if(this.state.email !== 'niko'){Mixpanel.track(this.state.item.link.toString()+"touched") }}}/>  : null }

                {/* video options */}
                { this.state.item.snippet && this.state.item.snippet.title ? <Text>{ this.state.item.snippet.title }</Text> : null }

                {/* marketplace & gallery options */}
                  {this.state.type === 'Gallery' || this.state.type === 'Marketplace' ?
                   <View>
                      {this.state.item.offers && this.state.item.offers.price ? <Text style={{fontWeight: '500', fontSize: 20}}>${ this.state.item.offers.price }</Text> : null }
                      {this.state.item.name ? <Text>{ this.state.item.name }</Text> : null }
                      {this.state.item.mileageFromOdometer && this.state.item.mileageFromOdometer.value ? <Text style={styles.newsSource}>{this.state.item.mileageFromOdometer.value} miles</Text> : null}
                      {this.state.item.description ? <Text style={styles.newsSource}>{this.state.item.description}</Text> : null}
                      {this.state.type === 'Marketplace' ? <Button title={`Contact Seller`} onPress={() => Linking.openURL(this.state.item.url) }/>  : null }
                    </View> : null }
                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}

