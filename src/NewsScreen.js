import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DetailScreen from './Details';
import Mixpanel from 'react-native-mixpanel'
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {
      this._getData()
      Mixpanel.track("NewsScreen Loaded")
  }

  _getData(){
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/Z79rSy82LB9BxDyaa/lastExec/results?token=u8HqK39BcB8PKAFsjMtb9Bnnh')
      .then(res => { return res.json()})

      // merge arrays from different sites
      .then(json =>  {   let finalArray = []
                         for (i = 0; i < json.length; i++){
                                if (i === 0) { finalArray = json[0].pageFunctionResult; }
                                else { finalArray = finalArray.concat( json[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // sort by date
      .then(merged => {  return merged.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))  })

      // convert date to string
      .then(sorted => { 
                        for (i = 0; i < sorted.length; i++){
                                sorted[i].date = new Date(sorted[i].date * 1000).toLocaleTimeString("en-US")
                                sorted[i].date = sorted[i].date.substring(0, sorted[i].date.length - 6) + ' ' + sorted[i].date.substring(8)
                                // console.log(sorted[i].date)
                              } 
                        return sorted  
                      })

      // set results as state
      .then((sorted) => { 
                      this.setState({data: sorted}); 
                      // console.log(sorted)

                      })
  }

  

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.data ?
           <View>
             <FlatList
                       data={this.state.data}
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({item, index}) => 
                            <View style={[{marginTop: index === 0 ? 40 : 0}]}>
                              <TouchableOpacity 
                                  onPress={() => this.props.navigation.navigate('Details', {item: item} ) } 
                                  style={{flexDirection: 'row', display: 'flex'}} > 
                                <View style={{flex: 0.3}}>
                                  <Image
                                          style={styles.image}
                                          source={{uri: item.image}}
                                        />
                                </View>
                                <View style={{flex: 0.7}}>
                                  <Text style={styles.newsTitle}>{item.text.substring(0, item.text.indexOf('http'))}</Text>
                                  <Text style={styles.newsSource}>{item.date} | {item.source}</Text>
                                </View>
                              </TouchableOpacity>
                              <View style={styles.separator} />
                            </View>
                     }
                     />
              <TouchableOpacity 
                      style={[styles.newsItem, {right: 10, bottom: '10%', position: 'absolute', padding: 10}]}
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