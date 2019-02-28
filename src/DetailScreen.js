import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import YouTube from 'react-native-youtube'


import styles from './styles'

export default class DetailScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
       };

  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
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

                {this.state.item.videoLink ? <YouTube
                        videoId={this.state.item.videoLink}   // The YouTube video ID
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
                  {this.state.item.price ? <Text style={{fontWeight: '500', fontSize: 20}}>${ this.state.item.price }</Text> : null }
                  {this.state.item.name ? <Text>{ this.state.item.name }</Text> : null }
                  {this.state.item.text ? <Text>{ this.state.item.text.substring(0, this.state.item.text.indexOf('http')) }</Text> : null }
                  {this.state.item.source ? 
                      <View>
                        <Button title={`Continue at ${this.state.item.source}`} onPress={() => Linking.openURL(this.state.item.link.toString())}/>
                      </View>  : null }
                  {this.state.item.email ?
                      <Button title={`Contact Owner`} onPress={() => Linking.openURL('https://www.edmunds.com'+this.state.item.email.toString()) }/>
                      : null }
                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}

