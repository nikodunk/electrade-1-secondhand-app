import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DetailScreen from './DetailScreen';

import { parseString } from 'react-native-xml2js';


export default class HomeScreen extends React.Component {

  static navigationOptions = {
    headerMode: 'none',
    title: 'Latest EV News Updates'
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      electrek: null,
      cleantechnica: null
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {
      this._getData()
  }

  _getData(){
    fetch('http://feeds.feedburner.com/Electrek')
      .then((res) => {
        parseString(res._bodyText, (err, result) => {
            this.setState({electrek: result.rss.channel["0"].item})
            console.log(result.rss.channel["0"].item)
            })
        }
      )
      .then(() => this._makeImage())
      //.then(() => this._getCleantechnica())
  }

  _makeImage(){
    let electrek = this.state.electrek
    for (let key in this.state.electrek){
      parseString(this.state.electrek[key].description, (err, desc) => {
          electrek[key]["image"] = desc.div.img[0]["$"].src
        })
    }
    this.setState({electrek: electrek})
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.electrek ?
           <View>
           <FlatList
                     data={this.state.electrek}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item}) => 
                          <View style={styles.newsItem}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item })} > 
                              <Text style={styles.newsTitle}>{item.title} (Source: Electrek)</Text>
                              <Image
                                        style={styles.image}
                                        source={{uri: item.image}}
                                      />
                              
                            </TouchableOpacity>
                          </View>
                   }
                   />
            <TouchableOpacity 
                    style={[styles.newsItem, {marginLeft: '90%', bottom: 0, position: 'absolute', width: 50}]}
                    onPress={() => this._getData()} >
              <Icon name="ios-refresh" size={24}  color="#4F8EF7" />
            </TouchableOpacity>
            </View>
            :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Getting EV news... </Text>
              <ActivityIndicator />
            </View>
          }
      </View>
        
      
    );

  }
}