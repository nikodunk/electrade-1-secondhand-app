import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { parseString } from 'react-native-xml2js';


export default class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Guides',
    tabBarIcon: <Icon name="ios-book" size={24} color="#4F8EF7" />
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      images: null
       };

    this._getData = this._getData.bind(this)

  }


  componentDidMount() {
      this._getData()
  }

  _getData(){
    fetch('http://sunboxlabs.com/index.xml')
      .then((res) => {
        parseString(res._bodyText, (err, result) => {
            // console.log(result)
            this.setState({data: result.rss.channel["0"].item})
            // console.log(result.rss.channel["0"].item)
            })
        }
      )
      .then(() => this._makeImage())

  }

  _makeImage(){
    var data = this.state.data
    for (var key in this.state.data){
      data[key]["image"] = "http://www.sunboxlabs.com"+this.state.data[key].description[0].image[0]["link"][0]      
    }
    console.log(data.shift())
    this.setState({data: data})
  }

  render() {
    return (
       <FlatList
                 data={this.state.data}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({item}) => 
                      <View style={styles.newsItem}>
                        <TouchableOpacity onPress={() => Linking.openURL(item.link.toString())}>
                          <Text style={styles.newsTitle}>{item.title} (Source: Sunboxlabs)</Text>
                          <Image
                                    style={styles.image}
                                    source={{uri: item.image}}
                                  />
                        </TouchableOpacity>
                      </View>
               }
               />
    );

  }
}